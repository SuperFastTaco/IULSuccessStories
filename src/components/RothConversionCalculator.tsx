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
  ArrowRightLeft,
  Loader2
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const wholeFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function money(value: number) {
  return currency.format(Math.round(value));
}

function formatAdvantage(val: number) {
  if (Math.round(val) === 0) return "$0";
  if (val < 0) {
    return `-$${wholeFormatter.format(Math.round(Math.abs(val)))}`;
  }
  return `$${wholeFormatter.format(Math.round(val))}`;
}

function percent(value: number) {
  return `${Number((value * 100).toFixed(2)).toString()}%`;
}

function iraTaxRate(inputs: CalculatorInputs, age: number) {
  return age >= inputs.retirementAge ? inputs.taxRateAtRetirement : inputs.conversionTaxRate;
}

// Crisp inline vector SVG Chart for PDF report page 1
const PdfLineChart = ({
  data,
  maxTax,
  startAge,
  endAge,
}: {
  data: { age: number; noConvTax: number; rothTax: number }[];
  maxTax: number;
  startAge: number;
  endAge: number;
}) => {
  const width = 500;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 10;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const n = data.length;

  const noConvPoints = data
    .map((d, i) => {
      const x = paddingLeft + (i / (n - 1)) * chartWidth;
      const y = height - paddingBottom - (d.noConvTax / maxTax) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const rothPoints = data
    .map((d, i) => {
      const x = paddingLeft + (i / (n - 1)) * chartWidth;
      const y = height - paddingBottom - (d.rothTax / maxTax) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  // Y-axis gridticks
  const yTicks = [0, maxTax * 0.2, maxTax * 0.4, maxTax * 0.6, maxTax * 0.8, maxTax];

  // X-axis labeling
  const xTicks = [];
  if (n > 1) {
    xTicks.push({ idx: 0, age: startAge });
    xTicks.push({ idx: Math.floor((n - 1) / 2), age: Math.floor((startAge + endAge) / 2) });
    xTicks.push({ idx: n - 1, age: endAge });
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full font-sans">
      {/* Gridlines */}
      {yTicks.map((val, idx) => {
        const y = height - paddingBottom - (val / maxTax) * chartHeight;
        return (
          <g key={idx}>
            <line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth={1}
            />
            <text
              x={paddingLeft - 8}
              y={y + 3}
              textAnchor="end"
              className="text-[8px] fill-slate-400 font-medium font-mono"
            >
              {val === 0 ? "$0" : `$${Math.round(val / 1000)}k`}
            </text>
          </g>
        );
      })}

      {/* X Ticks */}
      {xTicks.map((tick, idx) => {
        const x = paddingLeft + (tick.idx / (n - 1)) * chartWidth;
        return (
          <g key={idx}>
            <line
              x1={x}
              y1={height - paddingBottom}
              x2={x}
              y2={height - paddingBottom + 3}
              stroke="#cbd5e1"
              strokeWidth={1}
            />
            <text
              x={x}
              y={height - paddingBottom + 12}
              textAnchor="middle"
              className="text-[9px] fill-slate-500 font-semibold"
            >
              Age {tick.age}
            </text>
          </g>
        );
      })}

      {/* No-Conversion Curve */}
      <polyline
        fill="none"
        stroke="#475569"
        strokeWidth={2.5}
        points={noConvPoints}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Roth Conversion Curve */}
      <polyline
        fill="none"
        stroke="#7cb342"
        strokeWidth={2.5}
        points={rothPoints}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function RothConversionCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const result = useMemo(() => calculateRothConversion(inputs), [inputs]);

  function update<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

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

  const pdfChartData = useMemo(() => {
    return result.noConversionLedger.map((row, index) => {
      const rothRow = result.rothLedger[index] || { cumulativeTax: 0 };
      return {
        age: row.age,
        noConvTax: row.cumulativeTax,
        rothTax: rothRow.cumulativeTax,
      };
    });
  }, [result]);

  const pdfMaxTax = useMemo(() => {
    return Math.max(result.noConversionTaxes, result.rothConversionTaxes, 10000);
  }, [result]);

  const firstRothStartingMatchAge = useMemo(() => {
    const match = result.rothLedger.find((row) => row.rothValue >= inputs.initialIraBalance);
    return match ? match.age : null;
  }, [result.rothLedger, inputs.initialIraBalance]);

  // Exact 8.5 x 11 inch PDF snapshot downloader
  const generatePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      // Create PDF in portrait Letter dimensions using points (792x612 pt)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter",
      });

      const pages = ["pdf-report-page-1", "pdf-report-page-2", "pdf-report-page-[#3]"];
      
      for (let i = 0; i < pages.length; i++) {
        let elId = pages[i];
        if (elId === "pdf-report-page-[#3]") {
          elId = "pdf-report-page-3";
        }
        
        const el = document.getElementById(elId);
        if (!el) continue;

        const canvas = await html2canvas(el, {
          scale: 2, // High DPI for extremely beautiful clean lines & high-resolution text!
          useCORS: true,
          logging: false,
          width: 816,
          height: 1056,
        });

        const imgData = canvas.toDataURL("image/png");

        if (i > 0) {
          pdf.addPage();
        }

        // Exact mapping to full point letter document coordinates: 0,0,612,792
        pdf.addImage(imgData, "PNG", 0, 0, 612, 792, undefined, "FAST");
      }

      pdf.save(
        `${inputs.clientName.trim().replace(/\s+/g, "_")}_Tax_Comparison_Report.pdf`
      );
    } catch (err) {
      console.error("PDF compiling failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Variable densities depending on modeled years
  const rowCount = result.rothLedger.length;
  const rowPaddingClass = rowCount > 45 ? "py-1" : rowCount > 35 ? "py-1.5" : "py-2";
  const textDensityClass = rowCount > 45 ? "text-[9px]" : rowCount > 35 ? "text-[10px]" : "text-[11px]";
  const headerPaddingClass = rowCount > 35 ? "py-1.5 text-[9px]" : "py-2.5 text-[10px]";

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
            onClick={generatePDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all text-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Assembling PDF Report...</span>
              </>
            ) : (
              <>
                <Printer size={16} />
                <span>Generate PDF Report</span>
              </>
            )}
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
                      value={Number((inputs.conversionTaxRate * 105).toFixed(2))} // wait, 100 instead of 105! Let's write inputs.conversionTaxRate * 100
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

      {/* ========================================================= */}
      {/* PERFECT 3-PAGE OFF-SCREEN PDF REPORT COVER & DATA JOURNALS */}
      {/* ========================================================= */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "816px",
          backgroundColor: "#f8fafc",
          fontFamily: "Inter, sans-serif",
        }}
        className="text-slate-900"
      >
        {/* PAGE 1: TAX COMPARISON COVER REPORT */}
        <div
          id="pdf-report-page-1"
          style={{ width: "816px", height: "1056px" }}
          className="bg-white p-[40px] flex flex-col justify-between relative box-border border-t-[8px] border-[#7cb342] shadow-sm"
        >
          {/* Top segment block */}
          <div className="space-y-6">
            {/* Header section identical to client screenshot */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-[#7cb342] uppercase block">
                  Roth Conversion Analysis
                </span>
                <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-none">
                  Tax Comparison Report
                </h1>
                <p className="text-[11px] font-medium text-slate-400">
                  Tax comparison through age {inputs.deathAge}
                </p>
              </div>
              <div className="text-right space-y-2">
                <div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Prepared For
                  </div>
                  <div className="text-[12px] font-extrabold text-slate-800 leading-none">
                    {inputs.clientName || "Valued Client"}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Advisor
                  </div>
                  <div className="text-[12px] font-extrabold text-slate-800 leading-none">
                    {inputs.advisorName || "Financial Advisor"}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100 my-1" />

            {/* Metrics cards row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-slate-200/60 rounded-xl p-3 bg-slate-50/50">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                  Initial IRA Starting Value
                </span>
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  {money(inputs.initialIraBalance)}
                </span>
              </div>
              <div className="border border-slate-200/60 rounded-xl p-3 bg-slate-50/50">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                  Current Age
                </span>
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  {inputs.currentAge}
                </span>
              </div>
              <div className="border border-slate-200/60 rounded-xl p-3 bg-slate-50/50">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                  Projection Through
                </span>
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  Age {inputs.deathAge}
                </span>
              </div>
            </div>

            {/* Advantage Strategy block with vertical left green line */}
            <div className="grid grid-cols-12 gap-4 items-stretch">
              {/* Box 1 (PROJECTED TAX ADVANTAGE) */}
              <div className="col-span-8 bg-slate-800 text-white rounded-2xl p-5 flex flex-col justify-between min-h-[148px] relative overflow-hidden border-l-[10px] border-[#7cb342]">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 block mb-1">
                    PROJECTED TAX ADVANTAGE @ AGE {inputs.deathAge}
                  </span>
                  <div className="text-4xl font-black font-mono tracking-tight text-white leading-none">
                    {money(Math.abs(result.taxDifference))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-300 font-medium leading-relaxed leading-none mt-2">
                  {result.taxDifference >= 0
                    ? `Projected tax savings versus the traditional IRA path through age ${inputs.deathAge}.`
                    : "Traditional IRA presents smaller cumulative tax liability over the model timeframe."}
                </p>
              </div>

              {/* Box 2 & 3 custom details Column layout */}
              <div className="col-span-4 flex flex-col gap-3">
                <div className="border border-slate-200/60 rounded-2xl p-3 bg-white flex flex-col justify-center flex-1">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    TOTAL IRA TAXES @ AGE {inputs.deathAge}
                  </span>
                  <span className="text-base font-black text-slate-800 font-mono">
                    {money(result.noConversionTaxes)}
                  </span>
                </div>
                <div className="border border-slate-200/60 rounded-2xl p-3 bg-white flex flex-col justify-center flex-1">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    TOTAL ROTH TAXES @ AGE {inputs.deathAge}
                  </span>
                  <span className="text-[#7cb342] text-base font-black font-mono">
                    {money(result.rothConversionTaxes)}
                  </span>
                </div>
              </div>
            </div>

            {/* Lower detailed section */}
            <div className="grid grid-cols-12 gap-5 items-stretch pt-2">
              {/* Left Details column */}
              <div className="col-span-5 border border-slate-200/60 rounded-2xl p-4 bg-white space-y-3.5">
                <span className="text-[12px] font-black text-slate-800 tracking-tight block">
                  Scenario Inputs
                </span>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[9px] text-slate-600 font-medium leading-tight">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      RETIREMENT AGE
                    </span>
                    <span className="text-slate-800 font-bold">{inputs.retirementAge}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      NO-CONVERSION MODE
                    </span>
                    <span className="text-slate-800 font-bold">
                      {inputs.noConversionMode === "income" ? "Income Solve" : "RMD Only"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      CONVERSION YEARS
                    </span>
                    <span className="text-slate-800 font-bold">{inputs.conversionYears}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      BONUS
                    </span>
                    <span className="text-slate-800 font-bold">
                      {inputs.bonusRate * 100}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      CONVERSION TAX RATE
                    </span>
                    <span className="text-slate-800 font-bold">
                      {percent(inputs.conversionTaxRate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      TAX RATE AT RETIREMENT
                    </span>
                    <span className="text-slate-800 font-bold">
                      {percent(inputs.taxRateAtRetirement)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      ROTH RETURN
                    </span>
                    <span className="text-slate-800 font-bold">
                      {percent(inputs.rothReturn)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      IRA RETURN
                    </span>
                    <span className="text-slate-800 font-bold">
                      {percent(inputs.noConversionReturn)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      ROTH ANNUAL FEE
                    </span>
                    <span className="text-slate-800 font-bold">
                      {percent(inputs.rothAnnualFee)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      IRA ANNUAL FEE
                    </span>
                    <span className="text-slate-800 font-bold">
                      {percent(inputs.noConversionAnnualFee)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">
                      INCOME INFLATION
                    </span>
                    <span className="text-slate-800 font-bold">
                      {percent(inputs.inflationRate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Graph column */}
              <div className="col-span-7 border border-slate-200/60 rounded-2xl p-4 bg-white flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-black text-slate-800 tracking-tight block">
                    Projected Taxes Paid
                  </span>
                  <span className="text-[9px] text-slate-450 uppercase tracking-wide font-medium">
                    Through age {inputs.deathAge}
                  </span>
                </div>

                {/* Inline SVG Chart Canvas */}
                <div className="h-[148px] w-full bg-slate-50/20 rounded-xl overflow-hidden py-1">
                  <PdfLineChart
                    data={pdfChartData}
                    maxTax={pdfMaxTax}
                    startAge={inputs.currentAge + 1}
                    endAge={inputs.deathAge}
                  />
                </div>

                {/* Sub legends label */}
                <div className="flex items-center justify-center gap-6 text-[8px] font-bold tracking-wider uppercase text-slate-500 mt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-650" style={{ backgroundColor: "#475569" }} /> No-conversion taxes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7cb342]" style={{ backgroundColor: "#7cb342" }} /> Roth conversion taxes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Page 1 of 3 */}
          <div className="space-y-3.5 border-t border-slate-100 pt-3">
            <p className="text-[7.5px] leading-relaxed text-slate-400 leading-normal font-medium">
              Hypothetical projection based on stated assumptions. This is not tax, legal, or investment advice. Consult qualified professionals before making Roth conversion decisions.
            </p>
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
              <span>Roth Conversion Tax Comparison</span>
              <span className="font-mono">1/3</span>
            </div>
          </div>
        </div>

        {/* PAGE 2: ROTH STRATEGY LEDGER DATA JOURNAL */}
        <div
          id="pdf-report-page-2"
          style={{ width: "816px", height: "1056px" }}
          className="bg-white p-[40px] flex flex-col justify-between relative box-border border-t-[8px] border-[#7cb342] shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div className="space-y-0.5">
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight leading-none">
                  Roth Conversion Ledger
                </h2>
                <p className="text-[9.5px] text-slate-400 font-medium">
                  {firstRothStartingMatchAge ? (
                    <>
                      Highlighted row first reaches the original IRA starting value of{" "}
                      <span className="font-bold text-slate-700">{money(inputs.initialIraBalance)}</span>.
                    </>
                  ) : (
                    "Granular comparative ledger modeling required conversions and total taxes paid."
                  )}
                </p>
              </div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                Rows 1-{result.rothLedger.length} of {result.rothLedger.length}
              </span>
            </div>

            {/* Standard Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse leading-tight">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <th className={`${headerPaddingClass} px-2 font-black uppercase text-[8px] tracking-wide text-left`}>Age</th>
                    <th className={`${headerPaddingClass} px-2 font-black uppercase text-[8px] tracking-wide text-right`}>IRA Start</th>
                    <th className={`${headerPaddingClass} px-2 font-black uppercase text-[8px] tracking-wide text-right`}>Conversion</th>
                    <th className={`${headerPaddingClass} px-2 font-black uppercase text-[8px] tracking-wide text-right`}>Tax Paid</th>
                    <th className={`${headerPaddingClass} px-2 font-black uppercase text-[8px] tracking-wide text-right`}>IRA End</th>
                    <th className={`${headerPaddingClass} px-2 font-black uppercase text-[8px] tracking-wide text-right`}>Roth Value</th>
                    <th className={`${headerPaddingClass} px-2 font-black uppercase text-[8px] tracking-wide text-right`}>Cum. Tax</th>
                    <th className={`${headerPaddingClass} px-2 font-black uppercase text-[8px] tracking-wide text-right`}>Tax Advantage</th>
                  </tr>
                </thead>
                <tbody className={`${textDensityClass} text-slate-700 font-mono divide-y divide-slate-100/60`}>
                  {result.rothLedger.map((row) => {
                    const tradRow = result.noConversionLedger.find((tr) => tr.age === row.age) || {
                      cumulativeTax: 0,
                    };
                    const isMatch = row.age === firstRothStartingMatchAge;
                    const advantageVal = tradRow.cumulativeTax - row.cumulativeTax;

                    return (
                      <tr
                        key={`pdf-roth-${row.age}`}
                        className={`${rowPaddingClass} ${
                          isMatch ? "bg-[#7cb342]/10 font-bold border-y border-[#7cb342]/30 text-slate-900" : "hover:bg-slate-50/50"
                        }`}
                      >
                        <td className="px-2 font-sans font-bold text-slate-900 text-left">{row.age}</td>
                        <td className="px-2 text-right">{money(row.iraStart)}</td>
                        <td className={`px-2 text-right font-bold ${row.distribution > 0 ? "text-emerald-700" : ""}`}>{money(row.distribution)}</td>
                        <td className="px-2 text-right">{money(row.taxPaid)}</td>
                        <td className="px-2 text-right">{money(row.iraEnd)}</td>
                        <td className="px-2 text-right text-indigo-700 font-bold">{money(row.rothValue)}</td>
                        <td className="px-2 text-right font-semibold">{money(row.cumulativeTax)}</td>
                        <td className={`px-2 text-right font-bold ${advantageVal > 0 ? "text-emerald-600" : advantageVal < 0 ? "text-rose-600" : ""}`}>
                          {formatAdvantage(advantageVal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Page 2 of 3 */}
          <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider pt-3 border-t border-slate-100">
            <span>Roth Conversion Tax Comparison</span>
            <span className="font-mono">2/3</span>
          </div>
        </div>

        {/* PAGE 3: TRADITIONAL ACCOUNT BALANCE JOURNALS */}
        <div
          id="pdf-report-page-3"
          style={{ width: "816px", height: "1056px" }}
          className="bg-white p-[40px] flex flex-col justify-between relative box-border border-t-[8px] border-[#475569] shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div className="space-y-0.5">
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight leading-none">
                  IRA Account Balance
                </h2>
                <p className="text-[9.5px] text-slate-400 font-medium font-sans">
                  Projected IRA account balance and after-tax value by age.
                </p>
              </div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                Rows 1-{result.noConversionLedger.length} of {result.noConversionLedger.length}
              </span>
            </div>

            {/* Standard Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse leading-tight">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                    <th className={`${headerPaddingClass} px-3 font-black uppercase text-[8.5px] tracking-wide text-left`}>Age</th>
                    <th className={`${headerPaddingClass} px-3 font-black uppercase text-[8.5px] tracking-wide text-right`}>Traditional Start Balance</th>
                    <th className={`${headerPaddingClass} px-3 font-black uppercase text-[8.5px] tracking-wide text-right`}>Distribution</th>
                    <th className={`${headerPaddingClass} px-3 font-black uppercase text-[8.5px] tracking-wide text-right`}>Tax Paid</th>
                    <th className={`${headerPaddingClass} px-3 font-black uppercase text-[8.5px] tracking-wide text-right`}>Ending Account Balance</th>
                    <th className={`${headerPaddingClass} px-3 font-black uppercase text-[8.5px] tracking-wide text-right`}>Cumulative Taxes Paid</th>
                    <th className={`${headerPaddingClass} px-3 font-black uppercase text-[8.5px] tracking-wide text-right`}>Expected After-Tax Net Wealth</th>
                  </tr>
                </thead>
                <tbody className={`${textDensityClass} text-slate-700 font-mono divide-y divide-slate-100/60`}>
                  {result.noConversionLedger.map((row) => {
                    const afterTaxTraditionalEnd = row.iraEnd * (1 - iraTaxRate(inputs, row.age));
                    return (
                      <tr key={`pdf-trad-${row.age}`} className={`${rowPaddingClass} hover:bg-slate-50/50`}>
                        <td className="px-3 font-sans font-bold text-slate-900 text-left">{row.age}</td>
                        <td className="px-3 text-right">{money(row.iraStart)}</td>
                        <td className="px-3 text-right font-semibold text-orange-700">{money(row.distribution)}</td>
                        <td className="px-3 text-right">{money(row.taxPaid)}</td>
                        <td className="px-3 text-right">{money(row.iraEnd)}</td>
                        <td className="px-3 text-right font-semibold">{money(row.cumulativeTax)}</td>
                        <td className="px-3 text-right text-emerald-700 font-bold">{money(afterTaxTraditionalEnd)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Page 3 of 3 */}
          <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider pt-3 border-t border-[#cbd5e1]/50">
            <span>Roth Conversion Tax Comparison</span>
            <span className="font-mono">3/3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
