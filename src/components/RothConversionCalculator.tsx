import React, { useMemo, useState } from "react";
import {
  calculateRothConversion,
  CalculatorInputs,
  defaultInputs,
  LedgerRow,
} from "../utils/rothCalculator";
import {
  Printer,
  Info,
  DollarSign,
  TrendingUp,
  LineChart as LineChartIcon,
  HelpCircle,
  PiggyBank,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRightLeft
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend as RechartsLegend
} from "recharts";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function money(value: number) {
  return currency.format(Math.round(value));
}

function percent(value: number) {
  return `${Number((value * 100).toFixed(2)).toString()}%`;
}

function iraTaxRate(inputs: CalculatorInputs, age: number) {
  return age >= inputs.retirementAge ? inputs.taxRateAtRetirement : inputs.conversionTaxRate;
}

export default function RothConversionCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const result = useMemo(() => calculateRothConversion(inputs), [inputs]);

  function update<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  // Prepares data for Recharts rather than drawing a raw SVGs for premium look & feel!
  const chartData = useMemo(() => {
    return result.noConversionLedger.map((row, index) => {
      const rothRow = result.rothLedger[index] || { cumulativeTax: 0, rothValue: 0 };
      return {
        age: row.age,
        "No-Conversion Taxes": Math.round(row.cumulativeTax),
        "Roth Conversion Taxes": Math.round(rothRow.cumulativeTax),
        "Projected Roth Value": Math.round(rothRow.rothValue),
        "No-Conversion IRA Balance": Math.round(row.iraEnd),
      };
    });
  }, [result]);

  return (
    <div id="roth-calc-root" className="space-y-12">
      {/* Header Info */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-sage-soft dark:bg-emerald-950/40 text-sage-dark dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
            <Sparkles size={13} className="animate-pulse" /> Advanced Strategy Tool
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Roth Conversion <span className="text-primary font-bold">Tax Sandbox</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Compare a traditional, tax-deferred no-conversion IRA path against an aggressive Roth conversion strategy. Model multi-year distribution schedules, future tax rate shocks, and retirement income solving.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all text-sm cursor-pointer"
          >
            <Printer size={16} />
            <span>Generate PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 shadow-sm rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-900 pb-4">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Inputs</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Assumptions & Variables</h3>
            </div>

            {/* Section 1: Client Details */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                <Briefcase size={12} className="text-primary" /> 1. Client Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Client Name</label>
                  <input
                    type="text"
                    value={inputs.clientName}
                    onChange={(e) => update("clientName", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Advisor Name</label>
                  <input
                    type="text"
                    value={inputs.advisorName}
                    onChange={(e) => update("advisorName", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Starting Account */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                <PiggyBank size={12} className="text-primary" /> 2. Account Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Current Age</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={inputs.currentAge}
                    onChange={(e) => update("currentAge", Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Initial IRA Balance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      step={1000}
                      min={0}
                      value={inputs.initialIraBalance}
                      onChange={(e) => update("initialIraBalance", Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl pl-6 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Annuity Premium Bonus (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={50}
                      value={Number((inputs.bonusRate * 100).toFixed(2))}
                      onChange={(e) => update("bonusRate", Number(e.target.value) / 100)}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Roth Conversion */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                <ArrowRightLeft size={12} className="text-primary" /> 3. Conversion Setup
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Conversion Years (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={inputs.conversionYears}
                    onChange={(e) => update("conversionYears", Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Tax Rate During Conversion</label>
                  <div className="relative">
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      value={Number((inputs.conversionTaxRate * 100).toFixed(2))}
                      onChange={(e) => update("conversionTaxRate", Number(e.target.value) / 100)}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Roth Expected Return</label>
                  <div className="relative">
                    <input
                      type="number"
                      step={0.1}
                      value={Number((inputs.rothReturn * 100).toFixed(2))}
                      onChange={(e) => update("rothReturn", Number(e.target.value) / 100)}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Roth Annual Fee</label>
                  <div className="relative">
                    <input
                      type="number"
                      step={0.05}
                      value={Number((inputs.rothAnnualFee * 100).toFixed(2))}
                      onChange={(e) => update("rothAnnualFee", Number(e.target.value) / 100)}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Traditional / No Conversion Scenario */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                <Layers size={12} className="text-primary" /> 4. Traditional Choice Scenario
              </h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Distribution Mode</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => update("noConversionMode", "income")}
                      className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        inputs.noConversionMode === "income"
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      Income Solve
                    </button>
                    <button
                      type="button"
                      onClick={() => update("noConversionMode", "rmd")}
                      className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        inputs.noConversionMode === "rmd"
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      RMD Only
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Traditional Expected Return</label>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.1}
                        value={Number((inputs.noConversionReturn * 100).toFixed(2))}
                        onChange={(e) => update("noConversionReturn", Number(e.target.value) / 100)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                      />
                      <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Traditional Fee</label>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.05}
                        value={Number((inputs.noConversionAnnualFee * 100).toFixed(2))}
                        onChange={(e) => update("noConversionAnnualFee", Number(e.target.value) / 100)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                      />
                      <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Retirement Age</label>
                    <input
                      type="number"
                      min={60}
                      max={inputs.deathAge}
                      value={inputs.retirementAge}
                      onChange={(e) => update("retirementAge", Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Tax Rate in Retirement</label>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.5}
                        value={Number((inputs.taxRateAtRetirement * 100).toFixed(2))}
                        onChange={(e) => update("taxRateAtRetirement", Number(e.target.value) / 100)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                      />
                      <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Income Inflation (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step={0.1}
                        value={Number((inputs.inflationRate * 100).toFixed(2))}
                        onChange={(e) => update("inflationRate", Number(e.target.value) / 100)}
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                      />
                      <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-xs">%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">Life Expectancy Age</label>
                    <input
                      type="number"
                      min={inputs.currentAge + 1}
                      max={120}
                      value={inputs.deathAge}
                      onChange={(e) => update("deathAge", Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Columns */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none -mr-16 -mt-16" />
              <div className="text-xs font-bold border-b border-white/10 pb-2 uppercase tracking-wider text-slate-400">Total Traditional Taxes</div>
              <div className="mt-4">
                <div className="text-2xl md:text-3xl font-black font-mono tracking-tight">{money(result.noConversionTaxes)}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">Paid through Age {inputs.deathAge}</div>
              </div>
            </div>

            <div className="bg-emerald-600 text-white rounded-3xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none -mr-16 -mt-16" />
              <div className="text-xs font-bold border-b border-white/10 pb-2 uppercase tracking-wider text-emerald-100">Roth Strategy Taxes</div>
              <div className="mt-4">
                <div className="text-2xl md:text-3xl font-black font-mono tracking-tight">{money(result.rothConversionTaxes)}</div>
                <div className="text-[10px] text-emerald-100 uppercase tracking-wider font-bold mt-1">Staged in first {inputs.conversionYears} yrs</div>
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-3xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden md:col-span-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none -mr-16 -mt-16" />
              <div className="text-xs font-bold border-b border-white/10 pb-2 uppercase tracking-wider text-blue-100">Tax Advantage Savings</div>
              <div className="mt-4">
                <div className="text-2xl md:text-3xl font-black font-mono tracking-tight">{money(Math.abs(result.taxDifference))}</div>
                <div className="text-[10px] text-blue-100 uppercase tracking-wider font-bold mt-1">
                  {result.taxDifference >= 0 ? "Potential Net Savings" : "Traditional is cheaper"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Dashboard Section */}
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 shadow-sm rounded-3xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Annual Conversion Required</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{money(result.annualConversion)}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Solved Retirement Gross Income</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                {inputs.noConversionMode === "income" ? money(result.solvedGrossIncome) : "RMD Only"}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Projected Roth Balance @ {inputs.deathAge}</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{money(result.finalRothValue)}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">No-Conversion Account @ {inputs.deathAge}</span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{money(result.finalNoConversionIra)}</div>
            </div>
          </div>

          {/* Graphical Representation */}
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 shadow-sm rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LineChartIcon size={16} className="text-primary animate-pulse" /> Cumulative Taxes Paid Projection
              </h3>
              <span className="text-xs text-slate-400">Projection from age {inputs.currentAge + 1} to {inputs.deathAge}</span>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 20, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-900" />
                  <XAxis dataKey="age" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(v) => `$${v / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(val) => money(Number(val))}
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "16px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <RechartsLegend verticalAlign="bottom" height={36} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="No-Conversion Taxes"
                    stroke="#475569"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Roth Conversion Taxes"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Ledger Tables for Complete Integrity */}
      <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Comparative Account Journals</h3>
          <p className="text-sm text-slate-500 mt-1">Granular year-by-year projections tracing assets, required distributions, tax payloads, and accumulating totals.</p>
        </div>

        {/* Section 1: Roth Strategy Table */}
        <div className="bg-white dark:bg-slate-950 border border-slate-105 dark:border-slate-900 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Roth Conversion Strategy Ledger</h4>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-lg font-bold">Roth Active Path</span>
          </div>

          <div className="overflow-x-auto relative rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Age</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Traditional Start Balance</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Converted amount</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Conversion Tax Paid</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Traditional Leftover</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Roth Account Balance</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Cumulative Strategy Taxes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
                {result.rothLedger.map((row, i) => {
                  const isConvertedYear = row.distribution > 0;
                  return (
                    <tr
                      key={`ledger-roth-${row.age}`}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/10 ${
                        isConvertedYear ? "bg-emerald-50/20 dark:bg-emerald-950/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-left font-sans font-bold text-slate-900 dark:text-white">{row.age}</td>
                      <td className="px-4 py-3 text-right">{money(row.iraStart)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">{money(row.distribution)}</td>
                      <td className="px-4 py-3 text-right">{money(row.taxPaid)}</td>
                      <td className="px-4 py-3 text-right">{money(row.iraEnd)}</td>
                      <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 font-bold">{money(row.rothValue)}</td>
                      <td className="px-4 py-3 text-right text-slate-900 dark:text-white font-bold">{money(row.cumulativeTax)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: traditional Account Table */}
        <div className="bg-white dark:bg-slate-950 border border-slate-105 dark:border-slate-900 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Traditional No-Conversion Account Ledger</h4>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg font-bold">Standard Traditional Active Path</span>
          </div>

          <div className="overflow-x-auto relative rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Age</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Traditional Start Balance</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Required Distribution (RMD / Solve)</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Income/Distribution Tax Paid</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Ending Account Balance</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Cumulative Account Taxes</th>
                  <th className="px-4 py-3 text-right font-bold text-xs uppercase tracking-wider">Expected After-Tax Net Wealth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
                {result.noConversionLedger.map((row) => {
                  const afterTaxTraditionalEnd = row.iraEnd * (1 - iraTaxRate(inputs, row.age));
                  return (
                    <tr key={`ledger-trad-${row.age}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="px-4 py-3 text-left font-sans font-bold text-slate-900 dark:text-white">{row.age}</td>
                      <td className="px-4 py-3 text-right">{money(row.iraStart)}</td>
                      <td className="px-4 py-3 text-right text-orange-600 dark:text-orange-400 font-bold">{money(row.distribution)}</td>
                      <td className="px-4 py-3 text-right">{money(row.taxPaid)}</td>
                      <td className="px-4 py-3 text-right">{money(row.iraEnd)}</td>
                      <td className="px-4 py-3 text-right text-slate-900 dark:text-white font-bold">{money(row.cumulativeTax)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">{money(afterTaxTraditionalEnd)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hidden PDF/Print Printable Document Cover */}
      <div className="hidden print:block font-sans p-6 text-slate-900 space-y-8 bg-white text-xs max-w-5xl mx-auto">
        <div className="border-b-4 border-slate-900 pb-6 flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase tracking-tight">Roth Conversion Strategy Analysis</h1>
            <p className="text-slate-500 font-medium">Strategic Comparative Forecast Through Age {inputs.deathAge}</p>
          </div>
          <div className="text-right text-slate-500 space-y-1">
            <div>Advisor Client Copy</div>
            <div className="font-bold text-slate-900">{inputs.clientName || "Client"}</div>
            <div>Prepared by: {inputs.advisorName || "Advisor"}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 border border-slate-200 rounded-xl">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Traditional Cumulative Taxes</div>
            <div className="text-base font-bold font-mono text-slate-800">{money(result.noConversionTaxes)}</div>
          </div>
          <div className="p-4 border border-slate-200 rounded-xl">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Roth Strategy Total Taxes</div>
            <div className="text-base font-bold font-mono text-emerald-600">{money(result.rothConversionTaxes)}</div>
          </div>
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Incremental Benefit Opportunity</div>
            <div className="text-base font-bold font-mono text-blue-600">{money(result.taxDifference)}</div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/30">
          <h2 className="font-bold text-sm uppercase tracking-wide border-b border-slate-200 pb-2 mb-4">Core Model Inputs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 leading-normal font-sans">
            <div>
              <span className="text-slate-400 font-medium block">Starting Age:</span>
              <strong className="text-slate-800">{inputs.currentAge}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Projection Cutoff Age:</span>
              <strong className="text-slate-800">{inputs.deathAge}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Starting traditional Balance:</span>
              <strong className="text-slate-800">{money(inputs.initialIraBalance)}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Selected Conversion Term:</span>
              <strong className="text-slate-800">{inputs.conversionYears} Years</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Tax Rate During Conversion:</span>
              <strong className="text-slate-800">{percent(inputs.conversionTaxRate)}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Expected Roth CAGR:</span>
              <strong className="text-slate-800">{percent(inputs.rothReturn)}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Traditional Retirement Age:</span>
              <strong className="text-slate-800">{inputs.retirementAge}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Retirement Expected Tax Rate:</span>
              <strong className="text-slate-800">{percent(inputs.taxRateAtRetirement)}</strong>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 text-[9px] text-slate-500 leading-relaxed font-sans mt-8">
          <strong>Important Disclosures & General Information:</strong> This analysis offers simulated comparative trajectories based entirely on your designated entries. Tax legislation schedules are perpetually responsive to amendment, and individual personal tax positions may deviate significantly from basic rate assumption baselines. All returns, variables and compounding indices are purely hypothetical and represent no guarantee of specific product performance or secure asset growth. Always secure advisory consultations from your certified legal or taxation professional advisor prior to committing to strategy modifications.
        </div>
      </div>
    </div>
  );
}
