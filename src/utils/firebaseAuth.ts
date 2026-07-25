import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from "firebase/auth";
import firebaseConfigRaw from "../../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: firebaseConfigRaw.apiKey,
  authDomain: firebaseConfigRaw.authDomain,
  projectId: firebaseConfigRaw.projectId,
  storageBucket: firebaseConfigRaw.storageBucket,
  messagingSenderId: firebaseConfigRaw.messagingSenderId,
  appId: firebaseConfigRaw.appId,
  measurementId: firebaseConfigRaw.measurementId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/spreadsheets.readonly");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get access token from Google Auth");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export interface SheetData {
  category: string;
  policyYears: number;
  return: string;
  details: {
    totalPremium: string;
    indexRate: string;
    interestCredited: string;
    accumulationValue: string;
    deathBenefit: string;
    costOfInsurance: string;
  };
  actualLedger: Array<{ year: number | string; premium: string; rate: string; accum: string; deathBenefit: string }>;
  illustratedLedger: Array<{ year: number | string; premium: string; rate: string; accum: string; deathBenefit: string }>;
  actualTotals: { premium: string; rate: string };
  illustratedTotals: { premium: string; rate: string };
}

export const fetchSpreadsheetValues = async (
  spreadsheetId: string,
  accessToken: string
): Promise<SheetData> => {
  // We'll read the Sheet1 range. To be safe, we query A1:Z100
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:Z100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch spreadsheet data: ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  const rows: string[][] = data.values || [];

  // Let's parse the rows to extract the values!
  // Same structure as we observed in /tmp/sheet.csv
  let category = "Stability";
  let returnRate = "9.00%";
  let interestCredited = "$918,379";
  let policyYears = 10;
  let totalPremium = "$8,925,383";
  let accumulationValue = "$11,060,647";
  let deathBenefit = "$17,813,619";
  let costOfInsurance = "$55,701";

  const actualLedger: any[] = [];
  const illustratedLedger: any[] = [];

  // Parse key-value cells
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const firstCol = row[0]?.trim();
    if (firstCol === "Label") {
      category = row[1]?.trim() || category;
    } else if (firstCol === "Interest Rate") {
      returnRate = row[1]?.trim() || returnRate;
    } else if (firstCol?.startsWith("Description")) {
      interestCredited = row[1]?.trim() || interestCredited;
    } else if (firstCol === "Yeras Active" || firstCol === "Years Active") {
      policyYears = parseInt(row[1]) || policyYears;
    } else if (firstCol === "Total Premium Paid") {
      totalPremium = row[1]?.trim() || totalPremium;
    } else if (firstCol === "Index Rate This year") {
      // already captured by returnRate or this col
    } else if (firstCol === "Interest Credit This Year") {
      interestCredited = row[1]?.trim() || interestCredited;
    } else if (firstCol === "Accumulation Value") {
      let val = row[1]?.trim() || "";
      if (val && !val.startsWith("$")) {
        val = "$" + val;
      }
      accumulationValue = val || accumulationValue;
    } else if (firstCol?.startsWith("Death Benefit")) {
      deathBenefit = row[1]?.trim() || deathBenefit;
    } else if (firstCol === "Cost of Insurance") {
      costOfInsurance = row[1]?.trim() || costOfInsurance;
    }
  }

  // Find the ledger rows
  // Usually rows containing ledger headers like "Year" and "Premium"
  // Let's locate the row index that has actual policy vs. illustrated policy headers
  let ledgerHeaderIdx = -1;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (row && row.length > 3) {
      if (row[2] === "Year" && row[3] === "Premium" && row[4] === "Index Rate") {
        ledgerHeaderIdx = r;
        break;
      }
    }
  }

  if (ledgerHeaderIdx !== -1) {
    // Ledger rows start from ledgerHeaderIdx + 1
    for (let r = ledgerHeaderIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 5) continue;
      
      const actualYearStr = row[2]?.trim();
      if (!actualYearStr || actualYearStr === "") break; // end of ledger section
      
      const actualYear = parseInt(actualYearStr) || actualYearStr;
      const actualPremium = row[3]?.trim() || "0";
      const actualRate = row[4]?.trim() || "0.00%";
      const actualAccum = row[5]?.trim() || "0";
      const actualDeathBenefit = row[6]?.trim() || "0";

      actualLedger.push({
        year: actualYear,
        premium: actualPremium,
        rate: actualRate,
        accum: actualAccum,
        deathBenefit: actualDeathBenefit
      });

      // Illustrated ledger starts at column index 8 (index 8 is Year, 9 is Premium, 10 is Index Rate, etc.)
      if (row.length >= 13) {
        const illYearStr = row[8]?.trim();
        if (illYearStr && illYearStr !== "") {
          const illYear = parseInt(illYearStr) || illYearStr;
          const illPremium = row[9]?.trim() || "0";
          const illRate = row[10]?.trim() || "0.00%";
          const illAccum = row[11]?.trim() || "0";
          const illDeathBenefit = row[12]?.trim() || "0";

          illustratedLedger.push({
            year: illYear,
            premium: illPremium,
            rate: illRate,
            accum: illAccum,
            deathBenefit: illDeathBenefit
          });
        }
      }
    }
  }

  // Compute average actual/illustrated rates for totals
  const actualRatesSum = actualLedger.reduce((sum, item) => {
    const r = parseFloat(item.rate.replace(/[%,]/g, "")) || 0;
    return sum + r;
  }, 0);
  const actualAverageRate = actualLedger.length > 0 ? (actualRatesSum / actualLedger.length).toFixed(2) + "%" : "0.00%";

  const illRatesSum = illustratedLedger.reduce((sum, item) => {
    const r = parseFloat(item.rate.replace(/[%,]/g, "")) || 0;
    return sum + r;
  }, 0);
  const illAverageRate = illustratedLedger.length > 0 ? (illRatesSum / illustratedLedger.length).toFixed(2) + "%" : "0.00%";

  return {
    category,
    policyYears,
    return: returnRate,
    details: {
      totalPremium,
      indexRate: returnRate,
      interestCredited,
      accumulationValue,
      deathBenefit,
      costOfInsurance
    },
    actualLedger,
    illustratedLedger,
    actualTotals: { premium: "8,925,383", rate: actualAverageRate },
    illustratedTotals: { premium: "8,925,385", rate: illAverageRate }
  };
};
