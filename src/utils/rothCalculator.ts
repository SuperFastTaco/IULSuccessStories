export type NoConversionMode = "rmd" | "income";

export type CalculatorInputs = {
  clientName: string;
  advisorName: string;
  currentAge: number;
  initialIraBalance: number;
  bonusRate: number;
  conversionYears: number;
  conversionTaxRate: number;
  rothReturn: number;
  rothAnnualFee: number;
  noConversionReturn: number;
  noConversionAnnualFee: number;
  retirementAge: number;
  taxRateAtRetirement: number;
  inflationRate: number;
  deathAge: number;
  noConversionMode: NoConversionMode;
};

export type LedgerRow = {
  year: number;
  age: number;
  iraStart: number;
  distribution: number;
  taxPaid: number;
  iraEnd: number;
  rothValue: number;
  cumulativeTax: number;
};

export type CalculationResult = {
  noConversionLedger: LedgerRow[];
  rothLedger: LedgerRow[];
  noConversionTaxes: number;
  rothConversionTaxes: number;
  taxDifference: number;
  solvedGrossIncome: number;
  finalNoConversionIra: number;
  finalRothValue: number;
  annualConversion: number;
};

const rmdFactors: Record<number, number> = {
  72: 27.4,
  73: 26.5,
  74: 25.5,
  75: 24.6,
  76: 23.7,
  77: 22.9,
  78: 22.0,
  79: 21.1,
  80: 20.2,
  81: 19.4,
  82: 18.5,
  83: 17.7,
  84: 16.8,
  85: 16.0,
  86: 15.2,
  87: 14.4,
  88: 13.7,
  89: 12.9,
  90: 12.2,
  91: 11.5,
  92: 10.8,
  93: 10.1,
  94: 9.5,
  95: 8.9,
  96: 8.4,
  97: 7.8,
  98: 7.3,
  99: 6.8,
  100: 6.4,
  101: 6.0,
  102: 5.6,
  103: 5.2,
  104: 4.9,
  105: 4.6,
  106: 4.3,
  107: 4.1,
  108: 3.9,
  109: 3.7,
  110: 3.5,
  111: 3.4,
  112: 3.3,
  113: 3.1,
  114: 3.0,
  115: 2.9,
  116: 2.8,
  117: 2.7,
  118: 2.5,
  119: 2.3,
  120: 2.0,
};

export const defaultInputs: CalculatorInputs = {
  clientName: "Valued Client",
  advisorName: "Financial Advisor",
  currentAge: 55,
  initialIraBalance: 500000,
  bonusRate: 0,
  conversionYears: 5,
  conversionTaxRate: 0.24,
  rothReturn: 0.06,
  rothAnnualFee: 0,
  noConversionReturn: 0.06,
  noConversionAnnualFee: 0,
  retirementAge: 65,
  taxRateAtRetirement: 0.24,
  inflationRate: 0,
  deathAge: 90,
  noConversionMode: "income",
};

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function netGrowth(returnRate: number, feeRate: number) {
  return Math.max(-0.99, returnRate - feeRate);
}

function rmdStartAge(currentAge: number) {
  const birthYear = new Date().getFullYear() - currentAge;
  return birthYear >= 1960 ? 75 : 73;
}

function rmdFactor(age: number) {
  if (age < 72) return Number.POSITIVE_INFINITY;
  return rmdFactors[Math.min(age, 120)] ?? 2;
}

function noConversionTaxRate(inputs: CalculatorInputs, age: number) {
  return age >= inputs.retirementAge ? inputs.taxRateAtRetirement : inputs.conversionTaxRate;
}

function deathTaxRate(inputs: CalculatorInputs) {
  return inputs.taxRateAtRetirement;
}

function projectNoConversion(inputs: CalculatorInputs, solvedIncome: number): LedgerRow[] {
  const ledger: LedgerRow[] = [];
  const growth = netGrowth(inputs.noConversionReturn, inputs.noConversionAnnualFee);
  const rmdAge = rmdStartAge(inputs.currentAge);
  let iraBalance = inputs.initialIraBalance;
  let cumulativeTax = 0;

  for (let age = inputs.currentAge + 1, year = 1; age <= inputs.deathAge; age += 1, year += 1) {
    const iraStart = iraBalance;
    let balanceAfterGrowth = iraBalance * (1 + growth);
    const rmd = age >= rmdAge ? iraStart / rmdFactor(age) : 0;
    const income =
      inputs.noConversionMode === "income" && age >= inputs.retirementAge
        ? solvedIncome * (1 + inputs.inflationRate) ** Math.max(0, age - inputs.retirementAge)
        : 0;
    const distribution = Math.min(balanceAfterGrowth, Math.max(rmd, income));
    const taxPaid = distribution * noConversionTaxRate(inputs, age);

    balanceAfterGrowth -= distribution;
    const deathTax = age === inputs.deathAge && balanceAfterGrowth > 0 ? balanceAfterGrowth * deathTaxRate(inputs) : 0;
    cumulativeTax += deathTax;
    cumulativeTax += taxPaid;
    iraBalance = balanceAfterGrowth;

    ledger.push({
      year,
      age,
      iraStart,
      distribution,
      taxPaid: taxPaid + deathTax,
      iraEnd: iraBalance,
      rothValue: 0,
      cumulativeTax,
    });
  }

  return ledger;
}

function solveGrossIncome(inputs: CalculatorInputs) {
  if (inputs.noConversionMode !== "income" || inputs.retirementAge > inputs.deathAge) return 0;
  let low = 0;
  let high = inputs.initialIraBalance * 2;

  for (let i = 0; i < 80; i += 1) {
    const end = projectNoConversion({ ...inputs, noConversionMode: "income" }, high).at(-1)?.iraEnd ?? 0;
    if (end <= 1) break;
    high *= 2;
  }

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const ledger = projectNoConversion({ ...inputs, noConversionMode: "income" }, mid);
    const endingBalance = ledger.at(-1)?.iraEnd ?? 0;
    if (endingBalance > 1) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return high;
}

function annualConversionAmount(startingValue: number, years: number, annualGrowth: number) {
  if (years <= 0) return 0;
  if (Math.abs(annualGrowth) < 1e-10) return startingValue / years;
  return (startingValue * annualGrowth) / (1 - (1 + annualGrowth) ** -years);
}

function projectRothConversion(inputs: CalculatorInputs) {
  const ledger: LedgerRow[] = [];
  const grossStart = inputs.initialIraBalance * (1 + inputs.bonusRate);
  const growth = netGrowth(inputs.rothReturn, inputs.rothAnnualFee);
  const years = clampNumber(Math.round(inputs.conversionYears), 1, 10);
  const annualConversion = annualConversionAmount(grossStart, years, growth);
  let qualifiedBalance = grossStart;
  let rothValue = 0;
  let cumulativeTax = 0;

  for (let age = inputs.currentAge + 1, year = 1; age <= inputs.deathAge; age += 1, year += 1) {
    const iraStart = qualifiedBalance;
    qualifiedBalance *= 1 + growth;
    rothValue *= 1 + growth;

    const conversion = year <= years ? Math.min(qualifiedBalance, annualConversion) : 0;
    const taxPaid = conversion * inputs.conversionTaxRate;
    qualifiedBalance = Math.max(0, qualifiedBalance - conversion);
    rothValue += conversion - taxPaid;
    cumulativeTax += taxPaid;

    ledger.push({
      year,
      age,
      iraStart,
      distribution: conversion,
      taxPaid,
      iraEnd: qualifiedBalance,
      rothValue,
      cumulativeTax,
    });
  }

  return { ledger, annualConversion };
}

export function calculateRothConversion(rawInputs: CalculatorInputs): CalculationResult {
  const inputs = sanitizeInputs(rawInputs);
  const solvedGrossIncome = solveGrossIncome(inputs);
  const noConversionLedger = projectNoConversion(inputs, solvedGrossIncome);
  const { ledger: rothLedger, annualConversion } = projectRothConversion(inputs);
  const noConversionTaxes = noConversionLedger.at(-1)?.cumulativeTax ?? 0;
  const rothConversionTaxes = rothLedger.at(-1)?.cumulativeTax ?? 0;

  return {
    noConversionLedger,
    rothLedger,
    noConversionTaxes,
    rothConversionTaxes,
    taxDifference: noConversionTaxes - rothConversionTaxes,
    solvedGrossIncome,
    finalNoConversionIra: noConversionLedger.at(-1)?.iraEnd ?? 0,
    finalRothValue: rothLedger.at(-1)?.rothValue ?? 0,
    annualConversion,
  };
}

export function sanitizeInputs(inputs: CalculatorInputs): CalculatorInputs {
  const currentAge = clampNumber(Math.round(inputs.currentAge), 1, 120);
  const deathAge = clampNumber(Math.round(inputs.deathAge), currentAge + 1, 120);
  return {
    ...inputs,
    currentAge,
    deathAge,
    initialIraBalance: Math.max(0, inputs.initialIraBalance || 0),
    bonusRate: clampNumber(inputs.bonusRate, 0, 1),
    conversionYears: clampNumber(Math.round(inputs.conversionYears), 1, 10),
    conversionTaxRate: clampNumber(inputs.conversionTaxRate, 0, 1),
    rothReturn: clampNumber(inputs.rothReturn, -0.5, 0.5),
    rothAnnualFee: clampNumber(inputs.rothAnnualFee, 0, 0.2),
    noConversionReturn: clampNumber(inputs.noConversionReturn, -0.5, 0.5),
    noConversionAnnualFee: clampNumber(inputs.noConversionAnnualFee, 0, 0.2),
    retirementAge: clampNumber(Math.round(inputs.retirementAge), 60, deathAge),
    taxRateAtRetirement: clampNumber(inputs.taxRateAtRetirement, 0, 1),
    inflationRate: clampNumber(inputs.inflationRate, 0, 0.15),
    noConversionMode: inputs.noConversionMode,
  };
}
