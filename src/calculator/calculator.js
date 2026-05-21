const payload = window.IUL_INDEX_DATA;

const state = {
  indexName: payload.indexes[0].name,
  capMode: "Capped",
  capRate: 12.25,
  participationRate: 100,
  floorRate: 0,
  rollingYears: 20,
};

const els = {
  form: document.querySelector("#calculator-form"),
  index: document.querySelector("#index-select"),
  capMode: document.querySelector("#cap-mode"),
  rollingYears: document.querySelector("#rolling-years"),
  capRate: document.querySelector("#cap-rate"),
  participationRate: document.querySelector("#participation-rate"),
  floorRate: document.querySelector("#floor-rate"),
  dataRange: document.querySelector("#data-range"),
  historyNote: document.querySelector("#history-note"),
  periodCount: document.querySelector("#period-count"),
  return80: document.querySelector("#return-80"),
  return90: document.querySelector("#return-90"),
  return100: document.querySelector("#return-100"),
  maxReturn: document.querySelector("#max-return"),
  averageReturn: document.querySelector("#average-return"),
  compoundReturn: document.querySelector("#compound-return"),
  indexCagr: document.querySelector("#index-cagr"),
  outperformed: document.querySelector("#outperformed"),
};

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholeFormatter = new Intl.NumberFormat("en-US");

const indexByName = new Map(payload.indexes.map((item) => [item.name, item]));
const seriesByName = new Map(
  Object.entries(payload.series).map(([name, rows]) => {
    const levelByDate = new Map(rows.map(([day, level]) => [day, level]));
    return [name, { rows, levelByDate }];
  })
);

function populateIndexes() {
  els.index.innerHTML = payload.indexes
    .map((index) => `<option value="${escapeHtml(index.name)}">${escapeHtml(index.name)}</option>`)
    .join("");
}

function populateRollingYears() {
  const metadata = indexByName.get(state.indexName);
  const maxYears = Math.max(1, Math.min(metadata.maxRollingYears, 20));
  if (state.rollingYears > maxYears) {
    state.rollingYears = maxYears;
  }

  els.rollingYears.innerHTML = Array.from({ length: maxYears }, (_, idx) => idx + 1)
    .map((year) => `<option value="${year}">${year} year${year === 1 ? "" : "s"}</option>`)
    .join("");
  els.rollingYears.value = String(state.rollingYears);
}

function updateForm() {
  els.index.value = state.indexName;
  els.capMode.value = state.capMode;
  els.capRate.value = numberForInput(state.capRate);
  els.participationRate.value = numberForInput(state.participationRate);
  els.floorRate.value = numberForInput(state.floorRate);
  els.capRate.disabled = state.capMode === "No Cap";
  populateRollingYears();
}

function numberForInput(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}

function readForm() {
  state.indexName = els.index.value;
  state.capMode = els.capMode.value;
  state.capRate = numericInput(els.capRate.value, 0);
  state.participationRate = numericInput(els.participationRate.value, 0);
  state.floorRate = numericInput(els.floorRate.value, 0);
  state.rollingYears = Number(els.rollingYears.value || state.rollingYears);
}

function numericInput(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

function addYears(isoDate, years) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const targetYear = year + years;
  const daysInTargetMonth = new Date(Date.UTC(targetYear, month, 0)).getUTCDate();
  const targetDay = Math.min(day, daysInTargetMonth);
  return [
    targetYear,
    String(month).padStart(2, "0"),
    String(targetDay).padStart(2, "0"),
  ].join("-");
}

function calculate() {
  const metadata = indexByName.get(state.indexName);
  const series = seriesByName.get(state.indexName);
  const years = state.rollingYears;
  const cap = state.capRate / 100;
  const participation = state.participationRate / 100;
  const floor = state.floorRate / 100;
  const lastDate = metadata.lastDate;

  const averages = [];
  const compounds = [];
  const indexCagrs = [];
  let outperformed = 0;

  for (const [startDate, startLevel] of series.rows) {
    const endDate = addYears(startDate, years);
    if (endDate > lastDate) {
      break;
    }

    const annualCredits = [];
    const annualReturns = [];
    let hasCompletePeriod = true;

    for (let year = 1; year <= years; year += 1) {
      const periodStart = addYears(startDate, year - 1);
      const periodEnd = addYears(startDate, year);
      const periodStartLevel = series.levelByDate.get(periodStart);
      const periodEndLevel = series.levelByDate.get(periodEnd);

      if (!periodStartLevel || !periodEndLevel) {
        hasCompletePeriod = false;
        break;
      }

      const rawReturn = periodEndLevel / periodStartLevel - 1;
      const participatedReturn = rawReturn * participation;
      const credit =
        state.capMode === "No Cap"
          ? Math.max(floor, participatedReturn)
          : Math.min(cap, Math.max(floor, participatedReturn));

      annualReturns.push(rawReturn);
      annualCredits.push(credit);
    }

    if (!hasCompletePeriod || annualCredits.length !== years) {
      continue;
    }

    const averageCredit = average(annualCredits);
    const indexedGrowth = annualCredits.reduce((growth, credit) => growth * (1 + credit), 1);
    const indexGrowth = annualReturns.reduce((growth, rawReturn) => growth * (1 + rawReturn), 1);

    averages.push(averageCredit);
    compounds.push(indexedGrowth ** (1 / years) - 1);
    indexCagrs.push(indexGrowth ** (1 / years) - 1);
    if (indexedGrowth > indexGrowth) {
      outperformed += 1;
    }
  }

  if (!averages.length) {
    return {
      metadata,
      count: 0,
      threshold80: null,
      threshold90: null,
      threshold100: null,
      averageReturn: null,
      maxReturn: null,
      compoundReturn: null,
      indexCagr: null,
      outperformed: null,
    };
  }

  const ordered = [...averages].sort((a, b) => a - b);
  return {
    metadata,
    count: averages.length,
    threshold80: thresholdAtLeast(ordered, 0.8),
    threshold90: thresholdAtLeast(ordered, 0.9),
    threshold100: Math.min(...averages),
    averageReturn: average(averages),
    maxReturn: Math.max(...averages),
    compoundReturn: average(compounds),
    indexCagr: average(indexCagrs),
    outperformed: outperformed / averages.length,
  };
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function thresholdAtLeast(orderedValues, successRate) {
  const index = Math.trunc((1 - successRate) * (orderedValues.length - 1));
  return orderedValues[index];
}

function render() {
  const result = calculate();
  const { metadata } = result;
  const note =
    metadata.maxRollingYears < 20
      ? `${metadata.name} supports up to ${metadata.maxRollingYears} years with current history.`
      : `${metadata.name} supports the full 20-year analysis.`;

  els.dataRange.textContent = `${formatDate(metadata.firstDate)} through ${formatDate(metadata.lastDate)}`;
  els.historyNote.textContent = note;
  els.periodCount.textContent = result.count
    ? `${wholeFormatter.format(result.count)} complete ${state.rollingYears}-year periods`
    : `No complete ${state.rollingYears}-year periods`;

  setPercent(els.return80, result.threshold80);
  setPercent(els.return90, result.threshold90);
  setPercent(els.return100, result.threshold100);
  setPercent(els.maxReturn, result.maxReturn);
  setPercent(els.averageReturn, result.averageReturn);
  setPercent(els.compoundReturn, result.compoundReturn);
  setPercent(els.indexCagr, result.indexCagr);
  setPercent(els.outperformed, result.outperformed);
}

function setPercent(element, value) {
  element.textContent = value === null ? "--" : percentFormatter.format(value);
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${month}/${day}/${year}`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[char];
  });
}

function handleChange() {
  readForm();
  updateForm();
  render();
}

populateIndexes();
updateForm();
render();

els.form.addEventListener("input", handleChange);
els.form.addEventListener("change", handleChange);
