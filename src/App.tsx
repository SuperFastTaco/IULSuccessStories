/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, 
  Sun, 
  Search, 
  Menu, 
  Facebook, 
  Info, 
  Mail,
  ChevronRight,
  X,
  ArrowRight,
  TrendingUp,
  Shield,
  ShieldCheck,
  Zap,
  BookOpen,
  PlayCircle,
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const ArticleChart = ({ type }: { type: string; key?: React.Key }) => {
  if (type === 'term-cost') {
    const data = [
      { age: 30, cost: 200 },
      { age: 40, cost: 350 },
      { age: 50, cost: 800 },
      { age: 60, cost: 2500 },
      { age: 70, cost: 8000 },
      { age: 80, cost: 25000 },
    ];
    return (
      <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl my-12 border border-slate-100 dark:border-slate-800">
        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">The "Fatal Flaw" of Term Insurance: Rising Costs</h4>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Annual Premium ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Annual Cost']}
            />
            <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={3} dot={{ r: 6, fill: '#ef4444' }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-500 mt-4 italic text-center">By age 80, premiums become astronomically expensive, forcing most to drop coverage.</p>
      </div>
    );
  }

  if (type === 'iul-floor') {
    const data = [
      { year: '2000', sp500: -9.1, iul: 0 },
      { year: '2001', sp500: -11.9, iul: 0 },
      { year: '2002', sp500: -22.1, iul: 0 },
      { year: '2003', sp500: 28.7, iul: 12 },
      { year: '2004', sp500: 10.9, iul: 10.9 },
      { year: '2005', sp500: 4.9, iul: 4.9 },
      { year: '2006', sp500: 15.8, iul: 12 },
      { year: '2007', sp500: 5.5, iul: 5.5 },
      { year: '2008', sp500: -37.0, iul: 0 },
      { year: '2009', sp500: 26.5, iul: 12 },
    ];
    return (
      <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl my-12 border border-slate-100 dark:border-slate-800">
        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">IUL 0% Floor vs. S&P 500 (Historical Example)</h4>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Annual Return (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`${value}%`, '']}
            />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="sp500" name="S&P 500" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="iul" name="IUL (0% Floor / 12% Cap)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-500 mt-4 italic text-center">The IUL eliminates the "valleys" of market crashes while capturing steady growth.</p>
      </div>
    );
  }

  if (type === 'mortality-gap') {
    const data = [
      { year: 1, savings: 15000, iul: 1000000 },
      { year: 2, savings: 30000, iul: 1000000 },
      { year: 3, savings: 45000, iul: 1000000 },
      { year: 4, savings: 60000, iul: 1000000 },
      { year: 5, savings: 75000, iul: 1000000 },
    ];
    return (
      <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl my-12 border border-slate-100 dark:border-slate-800">
        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">The "Safety Net" Gap: Savings vs. IUL Death Benefit</h4>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="savings" name="Traditional Savings" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="iul" name="IUL Death Benefit" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-500 mt-4 italic text-center">IUL provides an immediate, massive safety net that traditional savings takes decades to build.</p>
      </div>
    );
  }

  if (type === 'tax-history') {
    const data = [
      { year: '1913', rate: 7 },
      { year: '1918', rate: 77 },
      { year: '1925', rate: 25 },
      { year: '1935', rate: 63 },
      { year: '1944', rate: 94 },
      { year: '1954', rate: 91 },
      { year: '1964', rate: 77 },
      { year: '1981', rate: 70 },
      { year: '1988', rate: 28 },
      { year: '2000', rate: 39.6 },
      { year: '2018', rate: 37 },
    ];
    return (
      <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl my-12 border border-slate-100 dark:border-slate-800">
        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">US Historical Top Marginal Tax Rates</h4>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Tax Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`${value}%`, 'Top Rate']}
            />
            <Line type="stepAfter" dataKey="rate" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-500 mt-4 italic text-center">We are currently in a historically low tax environment. The only direction is likely up.</p>
      </div>
    );
  }

  if (type === 'market-recovery') {
    const data = [
      { loss: 10, recovery: 11 },
      { loss: 20, recovery: 25 },
      { loss: 30, recovery: 43 },
      { loss: 40, recovery: 67 },
      { loss: 50, recovery: 100 },
    ];
    return (
      <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl my-12 border border-slate-100 dark:border-slate-800">
        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">The Brutal Math of Market Losses</h4>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" label={{ value: 'Percentage (%)', position: 'insideBottom', offset: -5 }} />
            <YAxis dataKey="loss" type="category" label={{ value: 'Market Loss (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`${value}%`, 'Gain Needed to Recover']}
            />
            <Bar dataKey="recovery" name="Gain Needed to Break Even" fill="#ef4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-500 mt-4 italic text-center">A 50% loss requires a 100% gain just to get back to zero. IUL's 0% floor prevents this math.</p>
      </div>
    );
  }

  if (type === 'iul-bucket') {
    return (
      <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl my-12 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
        <h4 className="text-lg font-bold mb-8 text-slate-900 dark:text-white">The IUL "Bucket Strategy"</h4>
        <div className="relative w-48 h-64 border-4 border-slate-300 dark:border-slate-600 border-t-0 rounded-b-3xl overflow-hidden bg-white/50 dark:bg-slate-900/50">
          {/* Water/Cash */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '80%' }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute bottom-0 w-full bg-primary/40 flex flex-col items-center justify-center"
          >
            <span className="text-primary font-bold text-sm">CASH VALUE</span>
          </motion.div>
          {/* Spigot */}
          <div className="absolute -right-4 bottom-8 w-8 h-4 bg-slate-400 rounded-full" />
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -right-6 bottom-4 w-1 h-8 bg-blue-400/50 rounded-full"
          />
          <div className="absolute -right-20 bottom-8 text-[10px] font-bold text-slate-400">INSURANCE COSTS<br/>(The Spigot)</div>
        </div>
        <div className="mt-8 text-center text-sm text-slate-500 italic max-w-md">
          We maximize the "water" (premium) and minimize the "spigot" (insurance costs) to create the most efficient wealth vehicle.
        </div>
      </div>
    );
  }

  if (type === 'max-funded-ledger') {
    const data = [
      { year: 1, premium: "227,223", rate: "6.86%", accum: "195,799", deathBenefit: "3,845,395" },
      { year: 2, premium: "227,223", rate: "6.86%", accum: "403,511", deathBenefit: "4,053,107" },
      { year: 3, premium: "227,223", rate: "6.86%", accum: "623,766", deathBenefit: "4,273,362" },
      { year: 4, premium: "227,223", rate: "6.86%", accum: "857,371", deathBenefit: "4,506,967" },
      { year: 5, premium: "227,223", rate: "6.86%", accum: "1,105,293", deathBenefit: "4,754,889" },
      { year: 6, premium: "227,223", rate: "6.86%", accum: "1,370,451", deathBenefit: "5,020,047" },
      { year: 7, premium: "227,223", rate: "6.86%", accum: "1,654,086", deathBenefit: "5,303,682" },
      { year: 8, premium: "0", rate: "6.86%", accum: "1,735,011", deathBenefit: "3,649,596" },
      { year: 9, premium: "0", rate: "6.86%", accum: "1,822,289", deathBenefit: "3,649,596" },
      { year: 10, premium: "0", rate: "6.86%", accum: "1,916,597", deathBenefit: "3,649,596" },
    ];
    return (
      <div className="my-12 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="bg-slate-800 text-white p-4 text-center font-bold">
          Illustrated Policy Performance
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Premium Paid</th>
                <th className="py-3 px-4">Index Rate</th>
                <th className="py-3 px-4">Accum Value</th>
                <th className="py-3 px-4">Death Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{row.year}</td>
                  <td className="py-3 px-4">${row.premium}</td>
                  <td className="py-3 px-4">{row.rate}</td>
                  <td className="py-3 px-4">${row.accum}</td>
                  <td className="py-3 px-4">${row.deathBenefit}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#FFFDE7] dark:bg-yellow-900/20 font-bold border-t-2 border-slate-200 dark:border-slate-800">
              <tr>
                <td className="py-4 px-4">Tot:</td>
                <td className="py-4 px-4">$1,590,561</td>
                <td className="py-4 px-4">6.86%</td>
                <td className="py-4 px-4"></td>
                <td className="py-4 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  if (type === 'design-fees') {
    const data = [
      { name: 'Year 5', commission: 61374, correct: 28761 },
      { name: 'Year 20', commission: 181060, correct: 74921 },
    ];
    return (
      <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl my-12 border border-slate-100 dark:border-slate-800">
        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Cumulative Internal Expenses: Commission vs. Correct Design</h4>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Total Expenses ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="commission" name="Commission-Driven Design" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="correct" name="Correct (Max-Efficient) Design" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-500 mt-4 italic text-center">Correct design reduces fee drag by over 50%, allowing more cash to compound.</p>
      </div>
    );
  }

  if (type === 'design-growth') {
    const data = [
      { year: 0, commission: 0, correct: 0 },
      { year: 5, commission: 161029, correct: 182390 },
      { year: 10, commission: 391738, correct: 438199 },
      { year: 15, commission: 494243, correct: 597286 },
      { year: 20, commission: 676557, correct: 834678 },
    ];
    return (
      <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl my-12 border border-slate-100 dark:border-slate-800">
        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Account Value Growth: The Cost of Improper Design</h4>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCorrect" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="year" label={{ value: 'Policy Year', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Account Value ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend verticalAlign="top" height={36}/>
            <Area type="monotone" dataKey="correct" name="Correct Design" stroke="#10b981" fillOpacity={1} fill="url(#colorCorrect)" strokeWidth={3} />
            <Area type="monotone" dataKey="commission" name="Commission Design" stroke="#ef4444" fillOpacity={1} fill="url(#colorCommission)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-500 mt-4 italic text-center">Correct design results in $158k+ more wealth over 20 years despite lower premiums.</p>
      </div>
    );
  }

  return null;
};

interface LedgerEntry {
  year: string | number;
  premium: string;
  rate: string;
  accum: string;
  deathBenefit: string;
}

interface SuccessStory {
  id: number;
  title: string;
  age: number;
  policyYears: number;
  return: string;
  category: string;
  details?: {
    totalPremium: string;
    indexRate: string;
    interestCredited: string;
    accumulationValue: string;
    deathBenefit: string;
    costOfInsurance: string;
  };
  actualLedger?: LedgerEntry[];
  illustratedLedger?: LedgerEntry[];
  actualTotals?: { premium: string; rate: string };
  illustratedTotals?: { premium: string; rate: string };
  finalAnalysis?: string;
}

interface EducationItem {
  id: number;
  title: string;
  description: string;
  type: 'article' | 'video';
  duration: string;
  category: string;
  image: string;
  content: string;
  videoUrl?: string;
}

const EDUCATION_CONTENT: EducationItem[] = [
  {
    id: 1,
    title: "The Evolution of Indexed Universal Life",
    description: "From Term Insurance to IUL: A journey through the history of life insurance and why IUL is the pinnacle of financial technology.",
    type: 'article',
    duration: '10 min read',
    category: 'Basics',
    image: 'https://picsum.photos/seed/evolution-tech/800/600',
    content: `
## The Evolution of Indexed Universal Life - From Term Insurance to IUL

Imagine, for a moment, the very first car you ever owned. For many of us, it was a rusty, clunky relic—perhaps an old Chevy Corsica or in my case, a beat-up Dodge Ram van. It wasn't pretty, and it certainly wasn't efficient, but it served a purpose: it got you from Point A to Point B. It was the bare minimum I could afford.

![image](/my-dodge-van.jpeg|My first car: A Dodge Ram van that started it all.)

However, if you were going on a cross-country road trip today, you wouldn't want to drive that old van. You’d want something modern, efficient, and packed with the latest safety features and technology.

Life insurance is exactly the same way. Over the decades, financial vehicles have evolved to meet the changing needs of consumers. To truly understand why Indexed Universal Life (IUL) is the pinnacle of financial technology—the "Tesla" of life insurance, we have to look at the vehicles that came before it. Let's take a journey through the evolution of life insurance.

### Stage 1: Term Insurance (The "Dodge Ram Van")

Term insurance is the most basic, bare-bones type of life insurance. It is the old Dodge Ram van of the financial world. It does exactly one thing: if you die during the specified "term," it pays a death benefit to your family. It meets the minimum insurance need and costs the least amount of money.

The math behind it is incredibly simple. If there is a 0.6% chance a 50-year-old male will pass away this year, the insurance company pools the risk and charges just enough to cover those statistical losses. But here is the fatal flaw of the term insurance van: as you get older, the statistical chance of death increases, meaning the cost of the insurance skyrockets.

[chart:term-cost]

By the time you reach your 80s, the premiums become so astronomically expensive that almost no one can afford to keep the policy. For a $100,000 policy, it could cost $25,000 per year and nobody can afford it. Consequently, people are forced to drop it before they actually need it, less than 2% of all term life insurance policies ever pay out a death claim.

### Stage 2: Whole Life (The "1996 Volvo" with the Hood Welded Shut)

To solve the problem of term insurance getting too expensive in old age, the industry created Whole Life insurance. Think of Whole Life as a sturdy 1996 Volvo. It was safe and dependable. The term insurance problem was solved by introducing a fixed, level premium that never increases, and it added a "cash value" component that grows over time and eventually equals the death benefit when the policy matures.

The insurance company structured the costs based on a “worst-case-scenario” so that policy owners overpaid their premium every year. Those overpayments would be refunded at the end of the year, with interest, based on the actual mortality rates experienced by the company in the form of a dividend. The policy owner now participated in the success (or lack thereof) of the insurance company.

But the Whole Life Volvo has two major mechanical issues. First, it is incredibly inflexible. You must pay your fixed premium every single year; if you miss a payment, your cash value and death benefit can suffer.

Second, it operates like a "black box". The primary way your cash value grows is through a dividend declared by the insurance company. But how do they calculate that dividend? They take the premiums, add mortality credits and interest, and then subtract their own corporate expenses (like employee bonuses or new buildings) and reserve holdbacks. They never disclose the exact math to you. It is exactly like going to a car dealership, asking to see the engine of the car you are buying, and having the salesman say, "Trust me, you aren't allowed to look under the hood". Furthermore, a landmark 1979 study by the Federal Trade Commission revealed that the actual rates of return inside these secretive policies were often 2% or less. Consumers weren’t buying it and demanded something different.

![image](/WL Article.jpg|A 1979 Federal Trade Commission report revealed that Whole Life insurance often yielded returns of 2% or less.|small)

### Stage 3: Universal Life (The Transparent "Checking Account")

In the late 1970s and 1980s, interest rates were going through the roof, hitting 14% to 16%. Consumers realized that earning a secretive 2% in a Whole Life policy made no sense when they could get double-digit returns elsewhere. Insurance companies needed to innovate.

Enter Universal Life (UL). This vehicle was a massive upgrade in transparency. Think of UL like your personal checking account: you can see exactly what your payroll deposit is, you see exactly what your expenses are, and you earn an interest rate on the excess money left over. Universal Life unbundled the costs so you could see every fee clearly. Furthermore, it introduced flexibility—you could finally choose to pay more or less premium depending on your financial situation.

Think of it like a checking account. You have your paycheck as a direct deposit going in (premium payments) and you have your expenses coming out every month (insurance costs). You have more deposits going in then deductions coming out, but with a UL account, you can earn a very high interest rate, tax deferred (potentially tax free).

Flexible premiums also means you can pay as much as your want, up to the IRS limits. Or you can pay an affordable amount and have the company issue the minimum amount of death benefit the IRS allows. Either way you are making your deposits high and your expense low.

During the 80s, when you could easily earn 13% or 14% interest inside a UL policy, it was the greatest vehicle on the road. But what goes up must come down. When interest rates plummeted over the next two decades down to around 4%, these policies began to crash and burn because they couldn't sustain their costs on such low returns. They were built to run on high interest rate fuel and the fuel ran dry.

### Stage 4: Variable Universal Life (The "Sports Car" with No Brakes)

As interest rates fell, the stock market was simultaneously booming in the 1990s. Wall Street and the insurance industry combined forces to create Variable Universal Life (VUL).

VUL was a high-speed sports car. Instead of being tied to a fixed, declining interest rate, VUL allowed you to invest your cash value directly into the stock market. In the roaring 90s, everyone felt like a genius as their cash values soared. Furthermore, the gains on selling positions inside the policy were not taxable because they were in a tax free wrapper.

But sports cars are dangerous if they don't have brakes. Between 2000 and 2012, the market suffered two devastating crashes (the dot-com bubble and the 2008 financial crisis) and was essentially flat for over a decade. Investors learned a painful lesson: suffering a 30% or 40% market loss inside a life insurance policy—while internal insurance costs are still being deducted—will destroy your wealth. The high risk of the VUL sports car proved too volatile for long-term retirement security.

### Stage 5: Indexed Universal Life (The "Tesla" of Insurance)

Consumers and advisors alike were left with a dilemma: How do we get the upside potential of the stock market without suffering the catastrophic losses of a market crash?

This brings us to the final stage of our evolutionary journey: Indexed Universal Life (IUL).

If term is a van and whole life is an old Volvo, IUL is the modern Tesla. It takes the best parts of its predecessors and engineers out the flaws.

Here is the magic of the IUL engine: your cash value is not invested directly in the stock market, so you are entirely insulated from market crashes. Instead, the insurance company credits your account based on the upward movement of a market index (like the S&P 500), up to a "cap" (often around 8% to 12%). In exchange for capping your upside, the insurance company provides a guaranteed “0% floor”.

[chart:iul-floor]

Let that sink in. If the stock market drops 30% or 40%, your IUL account simply credits 0%. Your money stays exactly where it is (minus insurance costs), safe and secure, while everyone else's VULs and 401(k)s are tumbling. When the market inevitably rebounds, you capture the gains without having to dig yourself out of a massive hole first.

### Why IUL is the Ultimate Wealth Accumulation Vehicle:

1. **Full Disclosure**: Just like the UL policy of the 80s, you see exactly what your costs and interest credits are. No black box.
2. **Total Flexibility**: You control your premium inputs. You can dial them up to maximize your tax-advantaged cash value, or scale them back if you have a tight month. Or you can reduce the death benefit to lower costs.
3. **The Best Risk/Return Profile**: You participate in the market's growth but completely eliminate downside market risk (minus insurance costs).
4. **Tax-Advantaged Retirement Income**: When structured correctly, an IUL allows you to access your cash value later in life through policy loans that are entirely income-tax-free.

We don't drive 1990s minivans on road trips anymore, and we shouldn't rely on outdated financial vehicles to get us to retirement. IUL is the beautiful result of decades of financial evolution, allowing you to build wealth securely, transparently, and tax-efficiently. You never see a Dodge Ram Van on the road anymore because nobody wants them, but every day, you see more and more people driving Teslas.
    `
  },
  {
    id: 8,
    title: "Why IUL?",
    description: "Discover why Indexed Universal Life is the only financial vehicle designed to conquer the three biggest threats to your wealth.",
    type: 'article',
    duration: '12 min read',
    category: 'Strategy',
    image: 'https://picsum.photos/seed/financial-fortress/800/600',
    content: `
## Why IUL? - The Ultimate Financial Fortress

In the world of personal finance, finding the perfect wealth-building tool can feel like searching for a mythical creature. If you look at the typical financial vehicles—401(k)s, IRAs, mutual funds, and bank accounts—each one does something well, but they all have glaring vulnerabilities. They are like a beautiful house with a leaky roof, a cracked foundation, or an unlocked front door. 

To build true, lasting wealth, your financial house must be fortified against the three biggest threats to your money: 

1. **Mortality Risk**
2. **Tax Risk**
3. **Market Risk**

Most traditional investments might solve one or maybe two of these problems, but they completely ignore the rest. Indexed Universal Life (IUL) is the only financial vehicle on the market designed to conquer all three of these major life risks at the exact same time. 

Here is exactly why IUL is the ultimate financial fortress.

### Risk #1: Mortality Risk (The "What if I don't make it home?" Risk)

Mortality risk is the fundamental threat that you might pass away before you have had the time to build a sufficient nest egg for your family, and IUL solves this by providing an immediate, tax-free financial safety net.

Imagine you are a 40-year-old who just started aggressively saving $15,000 a year into a 401(k) or a mutual fund. If tragedy strikes in year two and you do not make it home from work, your family gets exactly what you saved: a meager $30,000. A traditional investment account simply does not care if you have a spouse to support, children to put through college, or a mortgage to pay. It only pays out the exact balance you accumulated. 

An IUL, however, is built on a chassis of permanent life insurance. If you fund that same $15,000 into an IUL and pass away in year two, your family does not receive your account balance; they receive a massive, tax-free death benefit that could be worth millions of dollars.

[chart:mortality-gap]

Furthermore, modern IUL policies offer "living benefits." If you don't die but suffer a critical, chronic, or terminal illness, you can access a portion of that death benefit while you are still alive to pay for medical care or replace lost income. 

By providing a massive, tax-free payout from day one—whether you pass away prematurely or suffer a devastating illness—IUL effectively neutralizes mortality risk, ensuring your family's financial survival is never left to chance.

### Risk #2: Tax Risk (The "Silent Wealth Killer")

We are living in a historically low tax environment despite soaring national debt, meaning taxes are practically guaranteed to rise; IUL solves this by providing an uncapped environment to generate tax-free wealth. 

Ask anyone today if they think taxes are high, and they will almost certainly say yes. But history tells a different story. Historically, the top marginal tax rate in the U.S. has averaged around 57%, and during World War II, it skyrocketed to an astonishing 94%. Today, we are actually experiencing historically low tax rates, all while the federal government drowns in massive national debt. Eventually, the bill will come due, and taxes will have to go up.

[chart:tax-history]

You might think, "I don't make millions, so tax hikes won't hurt me." Think again. To be in the top 25% of wage earners in the United States, a married couple only needs to make about $85,853 a year. Shockingly, that top 25% pays 84% of all federal income taxes collected. If you make an uncommon income, you do not have a cash flow problem; you have a *tax problem*. When you put your money into a traditional 401(k) or IRA, you are simply postponing your taxes, entering into a loan agreement with Uncle Sam to pay him back at some unknown, likely higher, future tax rate. 

IUL completely solves this tax trap. When properly structured, the cash value inside an IUL grows tax-deferred, and you can access your money through policy loans that are 100% income-tax-free. Even better, unlike a Roth IRA or 401(k), an IUL has absolutely no IRS contribution limits based on your income, allowing high earners to shelter massive amounts of wealth. And if you need your money before age 59 ½? IUL allows you to access your cash via a loan without the 10% early withdrawal penalty that the IRS slaps on traditional retirement accounts. 

### Risk #3: Market Risk (The "Rollercoaster" Risk)

Traditional retirement accounts are fully exposed to stock market crashes that can permanently destroy your wealth, but IUL utilizes an indexing strategy that completely eliminates the risk of stock market losses while still capturing substantial growth.

Investing directly in the stock market is like riding a rollercoaster without a seatbelt. In the early 2000s and again in 2008, the S&P 500 suffered devastating crashes, with the market dropping nearly 40% at its worst. The math of losing money is brutal: if your traditional 401(k) drops by 30%, you don't just need a 30% gain to recover; you need a 42% gain just to get back to where you started.

[chart:market-recovery]

IUL solves this by taking your money out of the direct market entirely. Instead, the insurance company places your principal in their safe general portfolio and uses the interest to purchase options on an index, like the S&P 500. This strategy gives you an upside "cap" (often around 8% to 12%) and a guaranteed floor of 0%. If the market crashes 40%, you lose nothing from market losses—your account credits 0%, and your previous gains are locked in. When the market rebounds, you capture the growth up to the cap. 

By utilizing an indexing strategy that mathematically eliminates negative returns with a 0% floor, IUL successfully conquers market risk, ensuring you build compounding wealth without ever suffering a devastating loss.

### The Final Verdict

When you step back and look at the financial landscape, the reality becomes glaringly obvious. A 401(k) exposes you to market crashes and future tax hikes. A Roth IRA restricts how much you can contribute and penalizes you for touching your money early. A traditional savings account guarantees you will lose purchasing power to inflation while still taxing your minuscule growth. 

No single product available today can solve these three risks: **Mortality, Tax and Market**—except for Indexed Universal Life. By protecting your family from the tragedy of early death, shielding your hard-earned money from greedy future tax rates, and insulating your wealth from stock market disasters, IUL stands alone. It is the most complete, dynamic, and powerful wealth accumulation vehicle available to secure your financial future.
    `
  },
  {
    id: 9,
    title: "What is a Maximum Funded IUL?",
    description: "Learn the strategy of buying the least amount of insurance to maximize your tax-free cash accumulation.",
    type: 'article',
    duration: '15 min read',
    category: 'Advanced',
    image: 'https://picsum.photos/seed/max-funded/800/600',
    content: `
## What is a Maximum Funded IUL?

Imagine you are taking your family to an amusement park like Disneyland. To get inside and enjoy all the incredible rides, you have to pay the cost of admission at the front gate. However, once you are inside the park, all of the rides are completely free. 

Life insurance operates on a very similar principle. The IRS offers incredible "free rides"—specifically, tax-deferred growth and tax-free income distributions—but you must pay the "admission fee" to get access, which is the actual cost of the life insurance coverage. 

If you are a savvy consumer, your goal is to pay the absolute minimum admission fee required while bringing the maximum amount of spending money inside the park. In the financial world, this strategy is known as a “Maximum Funded Indexed Universal Life (IUL) policy”. You purchase the absolute least amount of death benefit the IRS allows and pump in the most amount of premium as quickly as legally possible. By purposefully squeezing down the life insurance costs, you supercharge your cash value growth and maximize your tax-free earning potential.

To fully appreciate how this strategy works today, we have to look back at the history of IRS regulations and the three major laws that changed how we fund life insurance forever.

### The Golden Era and the IRS Crackdown

Back in the early 1980s, financial heavyweights like E.F. Hutton realized that permanent life insurance was the ultimate tax shelter. Because there were virtually no funding limits at the time, people were dumping hundreds of thousands of dollars into policies with tiny, $10,000 death benefits. They used these policies purely to accumulate massive amounts of capital on a tax-free basis for retirement. 

Banks and credit unions began to panic as money flooded out of their institutions and into these tax-advantaged life insurance policies. In response, the government and the IRS stepped in to close the floodgates, passing three pieces of legislation to define exactly how much money could be put into a policy relative to its death benefit.

### Stage 1: TEFRA (1982) and DEFRA (1984)

The government first passed the Tax Equity and Fiscal Responsibility Act (TEFRA) in 1982, followed shortly by the Deficit Reduction Act (DEFRA) in 1984. 

These two laws created the “TEFRA/DEFRA corridor”, which dictated the mandatory minimum amount of death benefit you had to purchase to legally accommodate the premium you wanted to deposit. DEFRA specifically established maximum premium limits, known as the Guideline Single Premium (the absolute maximum lump sum you can pay) and the Guideline Level Premium (the maximum level annual premium you can pay over the life of the policy). In order to be a life insurance policy, it must comply with these corridor rules. If you tried to send in a check that would exceed the limits, the company wouldn’t cash it.

### Stage 2: TAMRA (1988) - The Speed Limit

Even with TEFRA and DEFRA in place, wealthy individuals were still dropping massive lump-sum single premiums into their policies on day one to grow their wealth tax-free. 

To slow down the velocity of money entering these contracts, the government passed the Technical and Miscellaneous Revenue Act (TAMRA) in 1988. You can think of TAMRA as a financial speed limit. TAMRA introduced the “7-Pay Test”, which mandated that you could no longer dump your maximum allowable premium into the policy in a single year; instead, the funds had to be spread out.

If you break the TAMRA speed limit and fund the policy too fast, your policy is slapped with a penalty classification known as a “Modified Endowment Contract (MEC)”. You never want your policy to become a MEC, because it permanently loses its best tax advantages. Withdrawals change from being tax-free to being taxed on the gains first (LIFO), and the IRS slaps a 10% early withdrawal penalty on any distributions taken before age 59 ½. Lastly, loans are no longer completely tax free. 

[chart:max-funded-ledger]

### How We Fund Up to the IRS Maximum Today

Knowing these rules, how do we design the perfect, maximum-funded IUL today? We use what is called the “Bucket Strategy”. 

Imagine your IUL policy is a bucket. The size of your bucket is determined by the amount of premium you want to contribute and the minimum IRS-required death benefit for your age and health. At the bottom of this bucket is a small spigot, which represents the pure cost of the life insurance and administrative fees. 

Our goal is to pour water (cash) into the bucket as fast as the IRS will allow without splashing over the TAMRA MEC limit, while keeping the spigot at the bottom as tightly closed as possible by using the least amount of death benefit.

[chart:iul-bucket]

Because the TAMRA 7-pay test prevents us from dumping all our money in at once, we solve for the absolute maximum limit and structure your contributions over a short-term window—typically 5 to 7 equal annual payments. By carefully bringing your funding right up to the MEC line—but never crossing over it—we construct a highly efficient, Maximum Funded IUL policy. 

### What is a Maximum Funded Policy?

By buying the least amount of death benefit legally required and paying the maximum allowable premium, your IUL becomes extremely max-efficient. The costs dragging on the policy are minimized, ensuring the vast majority of your dollars go directly toward compounding, tax-advantaged cash value growth that you can access completely tax-free in retirement.
    `
  },
  {
    id: 10,
    title: "The Math Behind Maximum Funded IULs",
    description: "Decoding the IRS speed limits: GSP, GLP, and the 7-Pay Test explained with real math.",
    type: 'article',
    duration: '12 min read',
    category: 'Advanced',
    image: 'https://picsum.photos/seed/math-finance/800/600',
    content: `
## Decoding the IRS Speed Limits: The Math Behind Maximum Funded IULs

Imagine you are trying to fill a high-performance sports car with the maximum amount of premium fuel possible. You want to go fast, but there are strict rules: the manufacturer dictates the absolute size of the gas tank, the gas station limits how much fuel you can pump per minute, and a regulatory agency has a cap on how much total fuel you can buy over your lifetime.

When you purchase an Indexed Universal Life (IUL) policy, you are entering into a highly regulated tax environment. The IRS grants life insurance incredible "free rides"—specifically tax-deferred growth and tax-free income—but to prevent people from using it as a pure, unregulated tax shelter, they installed a series of financial "speed limits" and "capacity limits".

If you want to build a max-funded IUL policy, you choose the Guideline Premium Test (GPT), which limits the amount of premium you can pay rather than limiting your cash value growth. To understand how we engineer the perfect policy, let’s meet our test subject: a 45-year-old male who wants to purchase a minimum life insurance death benefit of $273,063.

To safely guide him, we have to navigate three critical IRS premiums: the Guideline Single Premium (GSP), the Guideline Level Premium (GLP), and the 7-Pay Premium. Let's look under the hood.

### 1. The Guideline Single Premium (GSP): The "Gas Tank" Capacity
(The maximum one-time lump sum limit)

The Concept: The Guideline Single Premium (GSP) is the absolute maximum amount of money the IRS will allow you to put into a life insurance policy in a single, one-time lump sum on day one to fund all future benefits. If you exceed this limit, the IRS revokes the policy's status as life insurance entirely, and all your tax advantages vanish.

The Formula: Because this is a one-time lump sum calculation at the inception of the policy, it is the simplest formula: 
It is simply the Present Value of Future Benefits (PVFB).

GSP = PVFB

To calculate this present value, the IRS mandates the use of a statutory interest rate, which is currently 4%. By using a relatively low 4% discount rate, the formula increases the GSP "capacity," allowing you to move more cash into the policy without violating the rules.

Example: For our 45-year-old male with a $273,063 death benefit, the actuaries run the GSP = PVFB formula and determine his absolute maximum capacity is $100,000. If he tried to drop $100,001 into this policy on the first day, the insurance company would be legally required to refund the excess dollar with interest to maintain the contract's life insurance status.

![image](/guideline-single.png|The GSP represents the total capacity of your policy's "gas tank".)

### 2. The Guideline Level Premium (GLP): The "Marathon" Pace
(The maximum lifetime annual payment limit)

The Concept: While the GSP is for lump sums, the Guideline Level Premium (GLP) dictates the maximum average annual premium you can steadily pay into the policy over its entire lifetime (usually up to age 95, 100, or 121) to keep its life insurance status.

The Formula: Instead of calculating a single lump sum, the GLP determines a level annual payment. Mathematically, it takes the Present Value of Future Benefits and divides it by the present value of a life-contingent annuity that stretches all the way to the policy's maturity. 

![image](/guideline-level-formula.png|The GLP formula determines the sustainable annual funding limit.)

Here is the secret weapon of the GLP: The IRS dictates that this calculation must use an even lower statutory interest rate, currently 2%. Because a lower interest rate is used in the denominator of the fraction, it mathematically results in a higher allowable cumulative premium over the long term.

Example: For our 45-year-old male's $273,063 policy, the GLP formula generates a limit of $6,620 per year.

However, the Guideline Premium Test is cumulative. The rules state you cannot exceed the greater of the GSP or the sum of your GLPs. In year one, his limit is the $100,000 GSP. But if he pays $6,620 every year for 20 years, his cumulative GLP limit would eventually surpass the $100,000 GSP limit, giving him more room to build wealth over a marathon timeframe.

![image](/guideline-level.png|The GLP allows for consistent, long-term wealth accumulation.)

### 3. The 7-Pay Premium: The "Speed Limit"
(The maximum annual limit to avoid tax penalties)

The Concept: Back in the 1980s, people realized they could just drop the entire $100,000 GSP into a policy on day one and immediately take tax-free loans. The government didn't like this, so they created the Technical and Miscellaneous Revenue Act (TAMRA) of 1988, introducing the 7-Pay Test to act as a financial speed limit.

If you fund your policy too fast during the first seven years, your policy is slapped with a penalty label called a Modified Endowment Contract (MEC). If your policy becomes a MEC, you lose your best tax advantages: your withdrawals are taxed on the gains first (LIFO), and the IRS slaps a 10% penalty on withdrawals before age 59 ½.

The Formula: The 7-pay premium is the exact annual amount required to have the policy fully paid-up after exactly seven level annual payments. 

![image](/7pay-formula.png|The 7-Pay formula calculates the maximum speed at which you can fund your policy.)

PVFB = Present value of future benefits

Present Value of a 7-year Temporary Life Annuity-Due. This is just the present value of $1 paid at the beginning of each year for 7 years.

Unlike the GLP's lifetime annuity denominator, the 7-pay denominator only stretches for 7 years, making the annual allowable premium much higher.

Example: For our 45-year-old male, the 7-Pay formula dictates his MEC "speed limit" is $20,844 per year.

![image](/7pay-premium.png|The 7-Pay limit ensures your policy maintains its tax-free status.)

If he wants to get his entire $100,000 GSP capacity into the policy as fast as legally possible without triggering MEC taxes, he cannot just dump $100,000 in on day one. Instead, he must obey the $20,844 speed limit. By paying roughly $20,844 a year for four years, then the balance of the GSP in year five, he successfully fills his $100,000 bucket just under the radar.

### The Ultimate Wealth Strategy

By engineering a policy that perfectly balances these three formulas, we achieve the holy grail of IUL design. For this 45-year-old man, we purposefully purchased the absolute lowest death benefit the IRS allowed ($273,063) to legally accommodate his $100,000 cash goal. We then funded it right up to the $20,844 TAMRA 7-pay speed limit for five years.

The result? The life insurance costs dragging on the policy are completely minimized, ensuring the vast majority of his premium dollars go directly toward compounding, tax-advantaged cash value growth. He successfully leveraged the IRS guidelines to build a massive, tax-free financial fortress.
`
  },
  {
    id: 11,
    title: "Building an IUL the Correct Way",
    description: "Commission Way vs. Correct Way: Learn why your policy's architecture is the difference between wealth and wasted fees.",
    type: 'article',
    duration: '15 min read',
    category: 'Advanced',
    image: 'https://picsum.photos/seed/financial-architecture/800/600',
    content: `
## Building an IUL the Correct Way vs. the Commission Way

Imagine you are hiring a general contractor to build your dream home. You hand them a budget of $200,000. Now, suppose you found out that the contractor took $61,000 of your budget strictly for their own "management fees" and used the remaining money to actually build your house. You would fire them on the spot! You want a contractor who minimizes their overhead so the vast majority of your money goes into the equity and beauty of your actual home.

When you purchase an Indexed Universal Life (IUL) policy, you are hiring a financial architect to build your financial house. As we discussed in our previous articles on [IRS guidelines](article:10) and [maximum funding](article:9), the "admission fee" to get the tax-free benefits of life insurance is the cost of the death benefit.

If you structure the policy correctly, the vast majority of your money goes straight to your cash value. But if an agent builds it incorrectly—focusing on maximizing their own commission rather than your wealth—your cash value will be suffocated by massive fees.

Let’s look at a real-world case study of the exact same 46-year-old client putting money into an IUL. We will compare a policy built the "Wrong Way" (for commissions) versus a policy built the "Correct Way" (for the client).

### The "Commission" Way: Built for the Agent
(How to destroy your wealth with fees)

When a life insurance agent gets paid, their commission is almost entirely based on the size of the base death benefit they sell you. Therefore, an agent who is either poorly trained or simply greedy will sell you a massive death benefit, ensuring they get a massive paycheck.

Let's look at an actual policy illustration designed for maximum commissions.

Our 46-year-old client decides to contribute $38,168 per year. The agent sets the policy up with a massive, level death benefit of $1,463,273 right out of the gate.

Because the client is buying almost $1.5 million of pure life insurance, the internal costs dragging on the policy are astronomical. Let's look at the cumulative expenses over the first five years:

- Year 1 Expenses: $13,626
- Year 2 Expenses: $12,038
- Year 3 Expenses: $11,974
- Year 4 Expenses: $11,905
- Year 5 Expenses: $11,831

**Total Expenses in 5 Years: $61,374**

By year 5, the client has contributed $190,840 into the policy, but because over $61,000 was eaten up by insurance charges and fees, their actual account value is only $161,029. They are effectively losing money because the policy is starving under the weight of its own expenses.

![image](/commission-ledger.png|The Commission-Driven design ledger showing a $1.46M death benefit and high expenses.)

### The "Correct" Way: Built for the Client
(Squeezing the death benefit to maximize cash)

Now, let's look at how a true financial architect designs an IUL. As we discussed in our previous article on the [IRS Guideline Premium Tests](article:10), the goal is to buy the absolute minimum amount of death benefit the IRS legally requires to shelter your specific premium.

Let's look at the exact same 46-year-old client, putting in the same $38,168 for the first four years.

![image](/correct-ledger.png|The Correct Design ledger with a minimized death benefit to maximize cash accumulation.)

Instead of an arbitrarily huge death benefit, the agent squeezes the initial death benefit down to just $500,000. Because the death benefit is a third of the size of the "Commission" policy, the agent takes a substantial pay cut, but look at what happens to the client's internal fees:

- Year 1 Expenses: $7,129
- Year 2 Expenses: $5,613
- Year 3 Expenses: $5,613
- Year 4 Expenses: $5,613
- Year 5 Expenses: $4,793 (Note: In year 5, the client's premium drops to $21,765 to keep the policy perfectly max-funded against IRS limits).

**Total Expenses in 5 Years: $28,761**

[chart:design-fees]

By aggressively shrinking the death benefit, the cumulative expenses over the first five years drop from over $61,000 down to just $28,761.

Now, let's look at the ultimate scoreboard: The Account Value. By year 5, the client in this "Correct" policy has an account value of $182,390.

### The Long-Term Impact: Fast Forward to Year 20
(The Compounding Cost of Bad Design)

The differences between these two designs only get more staggering over time.

The "Commission" Design at Year 20: By year 20, the client in the commission-driven policy has paid a total of $381,680 in premium out of pocket. Because they were forced to carry a nearly $1.5 million death benefit from day one, the cumulative internal expenses dragging on the policy have ballooned to a staggering $181,060. As a result of this massive fee drag, their account value at year 20 sits at $676,557.

The "Correct" Design at Year 20: Now look at the client whose agent acted as a true financial architect. Over the exact same 20-year period, this client actually paid less in total premium—only $348,874—because the agent appropriately dialed back contributions in certain years to strictly obey IRS speed limits.

By aggressively squeezing the death benefit down and prioritizing cash value, the cumulative expenses over 20 years were slashed to just $74,921. Because those saved fees were allowed to stay in the account and compound with index interest, the client's account value at year 20 is a robust $834,678.

[chart:design-growth]

The Staggering Reality: Over a 20-year timeframe, the "Commission" policy swallowed over $106,000 MORE in junk fees and insurance costs than the "Correct" policy.

By having the policy engineered the correct way, the client paid nearly $33,000 LESS out of pocket, yet ended up with over $158,000 MORE in actual tax-free wealth sitting in their account.

### The Staggering Reality of Proper Design

Let the math of this sink in for a moment.

In the "Commission" design, the client put in $190,840 over five years and ended up with $161,029 in cash value. In the "Correct" design, the client actually put in less total money—only $174,437 over five years (because their premium dropped in year 5 to obey IRS speed limits)—but they ended up with $182,390 in cash value.

By building the policy the correct way, the client put in $16,400 less out of their own pocket, yet had $21,361 MORE in actual cash wealth sitting in their account by year five. Furthermore, they saved over $32,600 in junk fees and insurance costs. Over a 20 or 30-year timeframe, that fee savings will compound into hundreds of thousands of dollars of extra tax-free retirement income.

### Conclusion

An Indexed Universal Life policy is arguably the greatest wealth accumulation vehicle on the planet—but only if it is engineered for your benefit. If you are going to use an IUL to build your financial fortress, you must ensure your agent is acting as a true architect, minimizing your death benefit, slashing your fees, and keeping your money where it belongs: working for you.
`
  }
];

  const STORIES: SuccessStory[] = [
  { 
    id: 1, 
    title: "$600k Premium Paid with $65,437", 
    age: 48, 
    policyYears: 11, 
    return: "9.00%", 
    category: "Growth",
    details: {
      totalPremium: "$600,000",
      indexRate: "9.00%",
      interestCredited: "$65,437",
      accumulationValue: "$785,050",
      deathBenefit: "$6,454,036",
      costOfInsurance: "$16,374"
    },
    actualLedger: [
      { year: 2017, premium: "120,000", rate: "12.5%", accum: "110,118", deathBenefit: "6,454,036" },
      { year: 2018, premium: "120,000", rate: "12.25%", accum: "231,905", deathBenefit: "6,454,036" },
      { year: 2019, premium: "120,000", rate: "0%", accum: "328,687", deathBenefit: "6,454,036" },
      { year: 2020, premium: "120,000", rate: "11%", accum: "472,654", deathBenefit: "6,454,036" },
      { year: 2021, premium: "120,000", rate: "10.5%", accum: "629,178", deathBenefit: "6,454,036" },
      { year: 2022, premium: "0", rate: "9%", accum: "667,599", deathBenefit: "6,454,036" },
      { year: 2023, premium: "0", rate: "0%", accum: "650,446", deathBenefit: "6,454,036" },
      { year: 2024, premium: "0", rate: "9.25%", accum: "692,816", deathBenefit: "6,454,036" },
      { year: 2025, premium: "0", rate: "8.75%", accum: "735,987", deathBenefit: "6,454,036" },
      { year: 2026, premium: "0", rate: "9%", accum: "785,050", deathBenefit: "6,454,036" },
    ],
    illustratedLedger: [
      { year: 1, premium: "120,000", rate: "7.06%", accum: "110,118", deathBenefit: "6,454,036" },
      { year: 2, premium: "120,000", rate: "7.06%", accum: "231,905", deathBenefit: "6,454,036" },
      { year: 3, premium: "120,000", rate: "7.06%", accum: "328,687", deathBenefit: "6,454,036" },
      { year: 4, premium: "120,000", rate: "7.06%", accum: "472,654", deathBenefit: "6,454,036" },
      { year: 5, premium: "120,000", rate: "7.06%", accum: "629,178", deathBenefit: "6,454,036" },
      { year: 6, premium: "0", rate: "7.06%", accum: "667,599", deathBenefit: "6,454,036" },
      { year: 7, premium: "0", rate: "7.06%", accum: "650,446", deathBenefit: "6,454,036" },
      { year: 8, premium: "0", rate: "7.06%", accum: "678,586", deathBenefit: "6,454,036" },
      { year: 9, premium: "0", rate: "7.06%", accum: "709,193", deathBenefit: "6,454,036" },
      { year: 10, premium: "0", rate: "7.06%", accum: "742,250", deathBenefit: "6,454,036" },
    ],
    actualTotals: { premium: "600,000", rate: "8.23%" },
    illustratedTotals: { premium: "600,000", rate: "7.06%" },
    finalAnalysis: "This policy was issued in 2017 with Allianz Life Insurance Company and the LifePro + product. The policy was designed with a level death benefit and it was maximum funded up to the Modified Endowment Contract (MEC) limit of $120,000 for 5 years. Although it has experienced two 0% interest credits, after 11 full years, the policy has averaged 8.23% and has an accumulation value of $785,050. The original illustration projected the client should have $742,250. This is well within the margin of error. This policy has performed EXACTLY as originally illustrated."
  },
  { 
    id: 2, 
    title: "17-year-old policy with 6% cumulative interest return", 
    age: 57, 
    policyYears: 18, 
    return: "6.87%", 
    category: "Stability",
    details: {
      totalPremium: "$220,000",
      indexRate: "6.87%",
      interestCredited: "$28,626",
      accumulationValue: "$445,940",
      deathBenefit: "$715,000",
      costOfInsurance: "$2,785"
    },
    actualLedger: [
      { year: 2008, premium: "44,000", rate: "0.00%", accum: "36,009", deathBenefit: "715,000" },
      { year: 2009, premium: "44,000", rate: "0.00%", accum: "71,906", deathBenefit: "715,000" },
      { year: 2010, premium: "44,000", rate: "18.80%", accum: "127,078", deathBenefit: "715,000" },
      { year: 2011, premium: "44,000", rate: "9.52%", accum: "178,018", deathBenefit: "715,000" },
      { year: 2012, premium: "44,000", rate: "1.76%", accum: "217,696", deathBenefit: "715,000" },
      { year: 2013, premium: "0", rate: "7.10%", accum: "234,299", deathBenefit: "715,000" },
      { year: 2014, premium: "0", rate: "12.25%", accum: "259,167", deathBenefit: "715,000" },
      { year: 2015, premium: "0", rate: "10.15%", accum: "282,200", deathBenefit: "715,000" },
      { year: 2016, premium: "0", rate: "0.00%", accum: "279,632", deathBenefit: "715,000" },
      { year: 2017, premium: "0", rate: "8.59%", accum: "304,583", deathBenefit: "715,000" },
      { year: 2018, premium: "0", rate: "8.24%", accum: "330,608", deathBenefit: "715,000" },
      { year: 2019, premium: "0", rate: "5.18%", accum: "348,300", deathBenefit: "715,000" },
      { year: 2020, premium: "0", rate: "0%", accum: "347,679", deathBenefit: "715,000" },
      { year: 2021, premium: "0", rate: "12.39%", accum: "386,674", deathBenefit: "715,000" },
      { year: 2022, premium: "0", rate: "0%", accum: "385,900", deathBenefit: "715,000" },
      { year: 2023, premium: "0", rate: "0%", accum: "384,827", deathBenefit: "715,000" },
      { year: 2024, premium: "0", rate: "9.10%", accum: "418,476", deathBenefit: "715,000" },
      { year: 2025, premium: "0", rate: "6.87%", accum: "445,940", deathBenefit: "715,000" },
    ],
    illustratedLedger: [
      { year: 1, premium: "44,000", rate: "5.95%", accum: "38,308", deathBenefit: "715,000" },
      { year: 2, premium: "44,000", rate: "5.95%", accum: "78,870", deathBenefit: "715,000" },
      { year: 3, premium: "44,000", rate: "5.95%", accum: "121,871", deathBenefit: "715,000" },
      { year: 4, premium: "44,000", rate: "5.95%", accum: "167,479", deathBenefit: "715,000" },
      { year: 5, premium: "44,000", rate: "5.95%", accum: "215,869", deathBenefit: "715,000" },
      { year: 6, premium: "0", rate: "5.95%", accum: "223,172", deathBenefit: "715,000" },
      { year: 7, premium: "0", rate: "5.95%", accum: "232,582", deathBenefit: "715,000" },
      { year: 8, premium: "0", rate: "5.95%", accum: "242,216", deathBenefit: "715,000" },
      { year: 9, premium: "0", rate: "5.95%", accum: "254,557", deathBenefit: "715,000" },
      { year: 10, premium: "0", rate: "5.95%", accum: "270,216", deathBenefit: "715,000" },
      { year: 11, premium: "0", rate: "5.95%", accum: "286,696", deathBenefit: "659,987" },
      { year: 12, premium: "0", rate: "5.95%", accum: "302,563", deathBenefit: "629,752" },
      { year: 13, premium: "0", rate: "5.95%", accum: "319,181", deathBenefit: "597,540" },
      { year: 14, premium: "0", rate: "5.95%", accum: "335,116", deathBenefit: "563,220" },
      { year: 15, premium: "0", rate: "5.95%", accum: "353,831", deathBenefit: "526,655" },
      { year: 16, premium: "0", rate: "5.95%", accum: "372,372", deathBenefit: "487,698" },
      { year: 17, premium: "0", rate: "5.95%", accum: "391,805", deathBenefit: "446,192" },
      { year: 18, premium: "0", rate: "5.95%", accum: "433,299", deathBenefit: "401,971" },
    ],
    actualTotals: { premium: "220,000", rate: "6.11%" },
    illustratedTotals: { premium: "220,000", rate: "5.95%" },
    finalAnalysis: "This policy was issued in 2008 and has been active for 18 years. With a total premium of $220,000 paid over the first 5 years, the policy has grown to an accumulation value of $445,940. Despite several years of 0% interest credits, the policy has achieved a cumulative average return of approximately 6.11%, outperforming the original illustration's projection of $433,299. This demonstrates the stability and long-term growth potential of the IUL product even through volatile market cycles."
  },
  { 
    id: 3, 
    title: "11 Year Old Policy Averaging 6.68%", 
    age: 48, 
    policyYears: 11, 
    return: "4.85%", 
    category: "Stability",
    details: {
      totalPremium: "$1,226,985",
      indexRate: "4.85%",
      interestCredited: "$74,174",
      accumulationValue: "$1,594,081",
      deathBenefit: "$4,833,576",
      costOfInsurance: "$6,985"
    },
    actualLedger: [
      { year: 2015, premium: "245,397", rate: "0.00%", accum: "204,388", deathBenefit: "5,038,661" },
      { year: 2016, premium: "245,397", rate: "6.82%", accum: "432,626", deathBenefit: "5,496,281" },
      { year: 2017, premium: "245,397", rate: "16.91%", accum: "738,586", deathBenefit: "5,572,162" },
      { year: 2018, premium: "245,398", rate: "5.89%", accum: "987,512", deathBenefit: "5,821,088" },
      { year: 2019, premium: "245,398", rate: "2.70%", accum: "1,207,611", deathBenefit: "6,038,547" },
      { year: 2020, premium: "0", rate: "8.25%", accum: "1,274,249", deathBenefit: "6,107,825" },
      { year: 2021, premium: "0", rate: "8.69%", accum: "1,352,300", deathBenefit: "6,185,876" },
      { year: 2022, premium: "0", rate: "0.00%", accum: "1,321,808", deathBenefit: "6,155,384" },
      { year: 2023, premium: "0", rate: "3.52%", accum: "1,342,234", deathBenefit: "4,833,576" },
      { year: 2024, premium: "0", rate: "15.85%", accum: "1,527,636", deathBenefit: "4,833,576" },
      { year: 2025, premium: "0", rate: "4.85%", accum: "1,594,081", deathBenefit: "4,833,576" },
    ],
    illustratedLedger: [
      { year: 1, premium: "245,397", rate: "7.00%", accum: "220,705", deathBenefit: "5,054,283" },
      { year: 2, premium: "245,397", rate: "7.00%", accum: "457,405", deathBenefit: "5,290,983" },
      { year: 3, premium: "245,397", rate: "7.00%", accum: "711,151", deathBenefit: "5,544,729" },
      { year: 4, premium: "245,398", rate: "7.00%", accum: "982,999", deathBenefit: "5,816,577" },
      { year: 5, premium: "245,398", rate: "7.00%", accum: "1,274,044", deathBenefit: "6,107,622" },
      { year: 6, premium: "0", rate: "7.00%", accum: "1,340,207", deathBenefit: "4,833,578" },
      { year: 7, premium: "0", rate: "7.00%", accum: "1,411,903", deathBenefit: "4,833,578" },
      { year: 8, premium: "0", rate: "7.00%", accum: "1,489,672", deathBenefit: "4,833,578" },
      { year: 9, premium: "0", rate: "7.00%", accum: "1,574,288", deathBenefit: "4,833,578" },
      { year: 10, premium: "0", rate: "7.00%", accum: "1,666,599", deathBenefit: "4,833,578" },
      { year: 11, premium: "0", rate: "7.00%", accum: "1,758,280", deathBenefit: "4,833,578" },
    ],
    actualTotals: { premium: "1,226,985", rate: "6.68%" },
    illustratedTotals: { premium: "1,226,985", rate: "7.00%" },
    finalAnalysis: "This 11-year-old policy, with a total premium of $1,226,985 paid, has achieved an average annual return of 6.68%, resulting in an accumulation value of $1,594,081. While the actual performance is slightly below the original illustration's projection of $1,758,280, the policy has demonstrated resilience and growth, particularly in the later years with strong index rate performance."
  },
  { 
    id: 4, 
    title: "16 Year Old Policy Performance", 
    age: 44, 
    policyYears: 16, 
    return: "9.25%", 
    category: "Safety",
    details: {
      totalPremium: "$100,000",
      indexRate: "9.25%",
      interestCredited: "$12,364",
      accumulationValue: "$189,405",
      deathBenefit: "$512,549",
      costOfInsurance: "$1,981"
    },
    actualLedger: [
      { year: 2010, premium: "20,000", rate: "5.90%", accum: "16,399", deathBenefit: "512,549" },
      { year: 2011, premium: "20,027", rate: "3.70%", accum: "33,777", deathBenefit: "512,549" },
      { year: 2012, premium: "20,000", rate: "6.70%", accum: "52,693", deathBenefit: "512,549" },
      { year: 2013, premium: "20,000", rate: "3.80%", accum: "71,232", deathBenefit: "512,549" },
      { year: 2014, premium: "19,972", rate: "10.43%", accum: "96,235", deathBenefit: "512,549" },
      { year: 2015, premium: "0", rate: "13.40%", accum: "105,644", deathBenefit: "512,549" },
      { year: 2016, premium: "0", rate: "6.87%", accum: "109,534", deathBenefit: "512,549" },
      { year: 2017, premium: "0", rate: "12.00%", accum: "118,478", deathBenefit: "512,549" },
      { year: 2018, premium: "0", rate: "12.50%", accum: "129,467", deathBenefit: "512,549" },
      { year: 2019, premium: "0", rate: "4.80%", accum: "129,809", deathBenefit: "512,549" },
      { year: 2020, premium: "0", rate: "6.10%", accum: "135,804", deathBenefit: "512,549" },
      { year: 2021, premium: "0", rate: "5.60%", accum: "141,887", deathBenefit: "512,549" },
      { year: 2022, premium: "0", rate: "9.71%", accum: "154,030", deathBenefit: "512,549" },
      { year: 2023, premium: "0", rate: "8.75%", accum: "164,543", deathBenefit: "512,549" },
      { year: 2024, premium: "0", rate: "9.25%", accum: "175,253", deathBenefit: "512,549" },
      { year: 2025, premium: "0", rate: "9.25%", accum: "189,405", deathBenefit: "512,549" },
    ],
    illustratedLedger: [
      { year: 1, premium: "20,000", rate: "7.42%", accum: "17,539", deathBenefit: "512,549" },
      { year: 2, premium: "20,000", rate: "7.42%", accum: "36,269", deathBenefit: "512,549" },
      { year: 3, premium: "20,000", rate: "7.42%", accum: "56,279", deathBenefit: "512,549" },
      { year: 4, premium: "20,000", rate: "7.42%", accum: "77,614", deathBenefit: "512,549" },
      { year: 5, premium: "20,000", rate: "7.42%", accum: "100,430", deathBenefit: "512,549" },
      { year: 6, premium: "0", rate: "7.42%", accum: "104,736", deathBenefit: "512,549" },
      { year: 7, premium: "0", rate: "7.42%", accum: "109,249", deathBenefit: "512,549" },
      { year: 8, premium: "0", rate: "7.42%", accum: "114,037", deathBenefit: "512,549" },
      { year: 9, premium: "0", rate: "7.42%", accum: "119,021", deathBenefit: "512,549" },
      { year: 10, premium: "0", rate: "7.42%", accum: "124,268", deathBenefit: "512,549" },
      { year: 11, premium: "0", rate: "7.42%", accum: "132,100", deathBenefit: "512,549" },
      { year: 12, premium: "0", rate: "7.42%", accum: "140,357", deathBenefit: "512,549" },
      { year: 13, premium: "0", rate: "7.42%", accum: "149,081", deathBenefit: "512,549" },
      { year: 14, premium: "0", rate: "7.42%", accum: "158,319", deathBenefit: "512,549" },
      { year: 15, premium: "0", rate: "7.42%", accum: "168,120", deathBenefit: "512,549" },
      { year: 16, premium: "0", rate: "7.42%", accum: "178,541", deathBenefit: "512,549" },
    ],
    actualTotals: { premium: "100,000", rate: "7.42%" },
    illustratedTotals: { premium: "100,000", rate: "7.42%" },
    finalAnalysis: "This 16-year-old policy demonstrates consistent growth and the long-term reliability of the IUL strategy. After 16 years, the policy has an accumulation value of $189,405, having averaged a 7.42% annual return. This performance tracks perfectly with the original illustration's 7.42% projection, proving that even with market fluctuations, the strategy remains on target over the long term."
  },
  { 
    id: 5, 
    title: "14 Year Old LSW IUL On 28 Year Old", 
    age: 28, 
    policyYears: 14, 
    return: "9.25%", 
    category: "Stability",
    details: {
      totalPremium: "$58,964",
      indexRate: "9.25%",
      interestCredited: "$7,531",
      accumulationValue: "$90,036",
      deathBenefit: "$316,381",
      costOfInsurance: "$925"
    },
    actualLedger: [
      { year: 2012, premium: "5,850", rate: "0.00%", accum: "5,189", deathBenefit: "255,227" },
      { year: 2013, premium: "5,400", rate: "7.59%", accum: "10,296", deathBenefit: "260,296" },
      { year: 2014, premium: "5,400", rate: "6.92%", accum: "16,181", deathBenefit: "255,858" },
      { year: 2015, premium: "4,950", rate: "11.43%", accum: "22,264", deathBenefit: "251,255" },
      { year: 2016, premium: "5,400", rate: "5.41%", accum: "28,107", deathBenefit: "278,107" },
      { year: 2017, premium: "5,433", rate: "4.72%", accum: "34,077", deathBenefit: "268,444" },
      { year: 2018, premium: "5,366", rate: "10.67%", accum: "42,254", deathBenefit: "251,972" },
      { year: 2019, premium: "5,400", rate: "7.92%", accum: "50,109", deathBenefit: "278,538" },
      { year: 2020, premium: "5,400", rate: "6.85%", accum: "58,019", deathBenefit: "292,804" },
      { year: 2021, premium: "5,400", rate: "6.81%", accum: "66,381", deathBenefit: "288,674" },
      { year: 2022, premium: "1,284", rate: "9.69%", accum: "73,724", deathBenefit: "253,266" },
      { year: 2023, premium: "1,227", rate: "1.82%", accum: "75,990", deathBenefit: "253,266" },
      { year: 2024, premium: "1,227", rate: "6.15%", accum: "81,578", deathBenefit: "253,266" },
      { year: 2025, premium: "1,227", rate: "9.25%", accum: "90,036", deathBenefit: "253,266" },
    ],
    illustratedLedger: [
      { year: 1, premium: "5,400", rate: "7.00%", accum: "4,911", deathBenefit: "254,911" },
      { year: 2, premium: "5,400", rate: "7.00%", accum: "10,139", deathBenefit: "260,139" },
      { year: 3, premium: "5,400", rate: "7.00%", accum: "15,704", deathBenefit: "264,704" },
      { year: 4, premium: "5,400", rate: "7.00%", accum: "21,630", deathBenefit: "271,630" },
      { year: 5, premium: "5,400", rate: "7.00%", accum: "27,940", deathBenefit: "277,940" },
      { year: 6, premium: "5,400", rate: "7.00%", accum: "34,658", deathBenefit: "284,658" },
      { year: 7, premium: "5,400", rate: "7.00%", accum: "41,812", deathBenefit: "291,812" },
      { year: 8, premium: "5,400", rate: "7.00%", accum: "49,425", deathBenefit: "299,425" },
      { year: 9, premium: "5,400", rate: "7.00%", accum: "57,532", deathBenefit: "307,532" },
      { year: 10, premium: "5,400", rate: "7.00%", accum: "66,132", deathBenefit: "316,132" },
      { year: 11, premium: "5,400", rate: "7.00%", accum: "75,765", deathBenefit: "325,765" },
      { year: 12, premium: "5,400", rate: "7.00%", accum: "86,072", deathBenefit: "336,072" },
      { year: 13, premium: "5,400", rate: "7.00%", accum: "97,098", deathBenefit: "347,098" },
      { year: 14, premium: "5,400", rate: "7.00%", accum: "108,895", deathBenefit: "358,895" },
    ],
    actualTotals: { premium: "58,964", rate: "6.81%" },
    illustratedTotals: { premium: "75,600", rate: "7.00%" },
    finalAnalysis: "This 14-year-old policy, issued to a 28-year-old client, demonstrates the power of starting early and the stability of the IUL strategy. With a total premium of $58,964 paid, the policy has grown to an accumulation value of $90,036. Over the 14-year period, the policy has achieved an average annual return of 6.81%, tracking closely with the original illustration's 7.00% projection. This case study highlights how consistent funding and market-linked growth can build significant cash value over time, while maintaining a substantial death benefit for long-term security."
  },
  { 
    id: 6, 
    title: "10 Year Old Premium Finance Policy", 
    age: 54, 
    policyYears: 10, 
    return: "3.75%", 
    category: "Stability",
    details: {
      totalPremium: "$1,590,561",
      indexRate: "3.75%",
      interestCredited: "$7,531",
      accumulationValue: "$1,701,487",
      deathBenefit: "$3,649,596",
      costOfInsurance: "$30,229"
    },
    actualLedger: [
      { year: 2016, premium: "227,223", rate: "6.98%", accum: "196,026", deathBenefit: "3,842,698" },
      { year: 2017, premium: "227,223", rate: "15.00%", accum: "435,746", deathBenefit: "4,085,342" },
      { year: 2018, premium: "227,223", rate: "0.00%", accum: "614,877", deathBenefit: "4,264,473" },
      { year: 2019, premium: "227,223", rate: "13.45%", accum: "901,275", deathBenefit: "4,550,871" },
      { year: 2020, premium: "227,223", rate: "7.05%", accum: "1,154,330", deathBenefit: "4,800,605" },
      { year: 2021, premium: "227,223", rate: "7.75%", accum: "1,434,893", deathBenefit: "5,081,190" },
      { year: 2022, premium: "227,223", rate: "0.00%", accum: "1,606,671", deathBenefit: "5,253,638" },
      { year: 2023, premium: "0", rate: "2.28%", accum: "1,611,282", deathBenefit: "3,649,596" },
      { year: 2024, premium: "0", rate: "5.50%", accum: "1,669,033", deathBenefit: "3,649,596" },
      { year: 2025, premium: "0", rate: "3.75%", accum: "1,701,487", deathBenefit: "3,649,596" },
    ],
    illustratedLedger: [
      { year: 1, premium: "227,223", rate: "6.86%", accum: "195,799", deathBenefit: "3,845,395" },
      { year: 2, premium: "227,223", rate: "6.86%", accum: "403,511", deathBenefit: "4,053,107" },
      { year: 3, premium: "227,223", rate: "6.86%", accum: "623,766", deathBenefit: "4,273,362" },
      { year: 4, premium: "227,223", rate: "6.86%", accum: "857,371", deathBenefit: "4,506,967" },
      { year: 5, premium: "227,223", rate: "6.86%", accum: "1,105,293", deathBenefit: "4,754,889" },
      { year: 6, premium: "227,223", rate: "6.86%", accum: "1,370,451", deathBenefit: "5,020,047" },
      { year: 7, premium: "227,223", rate: "6.86%", accum: "1,654,086", deathBenefit: "5,303,682" },
      { year: 8, premium: "0", rate: "6.86%", accum: "1,735,011", deathBenefit: "3,649,596" },
      { year: 9, premium: "0", rate: "6.86%", accum: "1,822,289", deathBenefit: "3,649,596" },
      { year: 10, premium: "0", rate: "6.86%", accum: "1,916,597", deathBenefit: "3,649,596" },
    ],
    actualTotals: { premium: "1,590,561", rate: "5.66%" },
    illustratedTotals: { premium: "1,590,561", rate: "6.86%" },
    finalAnalysis: "The policy started off ahead of schedule and fell behind after 3 years of below average index credits and because the client took an unplanned loan sooner than expected. Despite these challenges, the policy maintains a significant accumulation value of $1,701,487 and continues to provide a substantial death benefit, demonstrating the long-term viability of the premium finance strategy even when adjustments are required."
  },
  { 
    id: 7, 
    title: "$8.9M Premium Policy Performance", 
    age: 53, 
    policyYears: 9, 
    return: "7.38%", 
    category: "Growth",
    details: {
      totalPremium: "$8,925,383",
      indexRate: "7.38%",
      interestCredited: "$710,684",
      accumulationValue: "$10,276,988",
      deathBenefit: "$17,813,619",
      costOfInsurance: "$136,490"
    },
    actualLedger: [
      { year: 2017, premium: "1,275,054", rate: "11.68%", accum: "1,135,087", deathBenefit: "17,813,619" },
      { year: 2018, premium: "1,275,055", rate: "7.02%", accum: "2,307,254", deathBenefit: "17,813,619" },
      { year: 2019, premium: "1,275,055", rate: "4.68%", accum: "3,489,793", deathBenefit: "17,813,619" },
      { year: 2020, premium: "1,275,055", rate: "1.59%", accum: "4,591,922", deathBenefit: "17,813,619" },
      { year: 2021, premium: "1,275,055", rate: "10.50%", accum: "6,226,500", deathBenefit: "17,813,619" },
      { year: 2022, premium: "1,275,054", rate: "0.00%", accum: "7,271,770", deathBenefit: "17,813,619" },
      { year: 2023, premium: "1,275,055", rate: "8.75%", accum: "9,058,615", deathBenefit: "17,813,619" },
      { year: 2024, premium: "0", rate: "8.75%", accum: "9,702,795", deathBenefit: "17,813,619" },
      { year: 2025, premium: "0", rate: "7.38%", accum: "10,276,988", deathBenefit: "17,813,619" },
    ],
    illustratedLedger: [
      { year: 1, premium: "1,275,055", rate: "6.90%", accum: "1,081,113", deathBenefit: "17,813,619" },
      { year: 2, premium: "1,275,055", rate: "6.90%", accum: "2,243,846", deathBenefit: "17,813,619" },
      { year: 3, premium: "1,275,055", rate: "6.90%", accum: "3,492,738", deathBenefit: "17,813,619" },
      { year: 4, premium: "1,275,055", rate: "6.90%", accum: "4,833,222", deathBenefit: "17,813,619" },
      { year: 5, premium: "1,275,055", rate: "6.90%", accum: "6,271,952", deathBenefit: "17,813,619" },
      { year: 6, premium: "1,275,055", rate: "6.90%", accum: "7,816,949", deathBenefit: "17,813,619" },
      { year: 7, premium: "1,275,055", rate: "6.90%", accum: "9,476,945", deathBenefit: "18,480,043" },
      { year: 8, premium: "0", rate: "6.90%", accum: "9,972,208", deathBenefit: "18,947,195" },
      { year: 9, premium: "0", rate: "6.90%", accum: "10,502,349", deathBenefit: "19,429,345" },
    ],
    actualTotals: { premium: "8,925,383", rate: "6.71%" },
    illustratedTotals: { premium: "8,925,385", rate: "6.90%" },
    finalAnalysis: "This 9-year-old policy demonstrates the power of high-premium funding in a growth-oriented IUL strategy. With nearly $9 million in total premiums paid over the first 7 years, the policy has reached an accumulation value of over $10.2 million. Despite a 0% credit in 2022, the policy's average performance remains strong, tracking closely with the original illustration and providing a substantial death benefit of over $17.8 million."
  },
  { 
    id: 8, 
    title: "First Anniversary, Ahead of Schedule", 
    age: 46, 
    policyYears: 1, 
    return: "14.15%", 
    category: "Growth",
    details: {
      totalPremium: "$78,000",
      indexRate: "14.15%",
      interestCredited: "$8,915",
      accumulationValue: "$72,496",
      deathBenefit: "$1,160,418",
      costOfInsurance: "$15,086"
    },
    actualLedger: [
      { year: 2026, premium: "78,000", rate: "14.15%", accum: "72,496", deathBenefit: "1,160,418" },
    ],
    illustratedLedger: [
      { year: 1, premium: "78,000", rate: "6.00%", accum: "67,597", deathBenefit: "1,155,519" },
    ],
    actualTotals: { premium: "78,000", rate: "14.15%" },
    illustratedTotals: { premium: "78,000", rate: "6.00%" },
    finalAnalysis: "This policy is just one year old, but it's already showing strong performance. Despite high initial costs, the policy has achieved a 14.15% index rate in its first year, resulting in an accumulation value of $72,496, which is ahead of the original illustration's projection of $67,597. This demonstrates the potential for IUL policies to outperform expectations even in their early stages, providing both growth and a significant death benefit."
  },
  { 
    id: 9, 
    title: "$37M Policy Far Ahead of Schedule", 
    age: 59, 
    policyYears: 11, 
    return: "2.85%", 
    category: "Growth",
    details: {
      totalPremium: "$14,214,552",
      indexRate: "2.85%",
      interestCredited: "$457,914",
      accumulationValue: "$16,468,963",
      deathBenefit: "$37,968,963",
      costOfInsurance: "$154,598"
    },
    actualLedger: [
      { year: 2015, premium: "1,579,395", rate: "0.00%", accum: "1,241,447", deathBenefit: "24,219,378" },
      { year: 2016, premium: "1,579,395", rate: "3.20%", accum: "2,555,007", deathBenefit: "24,055,007" },
      { year: 2017, premium: "1,579,394", rate: "21.04%", accum: "4,593,326", deathBenefit: "26,093,326" },
      { year: 2018, premium: "1,579,395", rate: "1.57%", accum: "5,887,715", deathBenefit: "27,387,715" },
      { year: 2019, premium: "1,579,395", rate: "9.52%", accum: "7,757,078", deathBenefit: "29,257,078" },
      { year: 2020, premium: "1,579,394", rate: "11.41%", accum: "9,974,215", deathBenefit: "31,447,772" },
      { year: 2021, premium: "1,579,395", rate: "7.64%", accum: "12,021,066", deathBenefit: "33,495,080" },
      { year: 2022, premium: "1,579,395", rate: "0.00%", accum: "13,209,656", deathBenefit: "34,709,656" },
      { year: 2023, premium: "1,579,394", rate: "2.88%", accum: "14,785,854", deathBenefit: "36,285,854" },
      { year: 2024, premium: "0", rate: "11.39%", accum: "16,165,736", deathBenefit: "37,665,736" },
      { year: 2025, premium: "0", rate: "2.85%", accum: "16,468,963", deathBenefit: "37,968,963" },
    ],
    illustratedLedger: [
      { year: 1, premium: "1,579,395", rate: "7.00%", accum: "1,336,657", deathBenefit: "22,836,657" },
      { year: 2, premium: "1,579,395", rate: "7.00%", accum: "2,755,519", deathBenefit: "24,255,519" },
      { year: 3, premium: "1,579,395", rate: "7.00%", accum: "4,259,907", deathBenefit: "25,759,907" },
      { year: 4, premium: "1,579,395", rate: "7.00%", accum: "5,852,756", deathBenefit: "27,352,756" },
      { year: 5, premium: "1,579,395", rate: "7.00%", accum: "7,537,506", deathBenefit: "29,037,506" },
      { year: 6, premium: "1,579,395", rate: "7.00%", accum: "9,338,994", deathBenefit: "30,838,994" },
      { year: 7, premium: "1,579,395", rate: "7.00%", accum: "11,268,839", deathBenefit: "32,768,839" },
      { year: 8, premium: "0", rate: "7.00%", accum: "11,823,364", deathBenefit: "21,500,000" },
      { year: 9, premium: "0", rate: "7.00%", accum: "12,426,207", deathBenefit: "21,500,000" },
      { year: 10, premium: "0", rate: "7.00%", accum: "13,082,060", deathBenefit: "21,500,000" },
      { year: 11, premium: "0", rate: "7.00%", accum: "13,728,794", deathBenefit: "21,500,000" },
    ],
    actualTotals: { premium: "14,214,552", rate: "6.54%" },
    illustratedTotals: { premium: "11,055,765", rate: "7.00%" },
    finalAnalysis: "This massive $37 million policy represents the pinnacle of high-performance IUL strategies. With over $14 million in premiums paid, the policy has achieved an accumulation value of $16.4 million in just 11 years, significantly outperforming the original illustration's projection of $13.7 million. Despite market volatility, including years with 0% credits, the policy's ability to capture high-performance years (like the 21.04% credit in 2017) has propelled it far ahead of schedule. This case study demonstrates how 'big numbers' and strategic funding can create a powerful financial engine that provides both substantial cash value growth and an extraordinary death benefit."
  },
  { 
    id: 10, 
    title: "Behind Plan, Underpaid Premiums", 
    age: 53, 
    policyYears: 6, 
    return: "8.53%", 
    category: "Underperform",
    details: {
      totalPremium: "$41,000",
      indexRate: "8.53%",
      interestCredited: "$2,341",
      accumulationValue: "$33,159",
      deathBenefit: "$191,504",
      costOfInsurance: "$2,577"
    },
    actualLedger: [
      { year: 2020, premium: "11,000", rate: "0.00%", accum: "8,652", deathBenefit: "188,198" },
      { year: 2021, premium: "6,000", rate: "9.75%", accum: "13,268", deathBenefit: "192,722" },
      { year: 2022, premium: "6,000", rate: "2.41%", accum: "17,274", deathBenefit: "196,728" },
      { year: 2023, premium: "6,000", rate: "5.76%", accum: "21,866", deathBenefit: "201,320" },
      { year: 2024, premium: "6,000", rate: "9.25%", accum: "27,397", deathBenefit: "196,523" },
      { year: 2025, premium: "6,000", rate: "8.53%", accum: "33,159", deathBenefit: "191,504" },
    ],
    illustratedLedger: [
      { year: 1, premium: "11,000", rate: "6.00%", accum: "9,082", deathBenefit: "188,536" },
      { year: 2, premium: "8,586", rate: "6.00%", accum: "16,176", deathBenefit: "195,630" },
      { year: 3, premium: "8,355", rate: "6.00%", accum: "23,355", deathBenefit: "202,809" },
      { year: 4, premium: "8,145", rate: "6.00%", accum: "30,661", deathBenefit: "199,615" },
      { year: 5, premium: "7,953", rate: "6.00%", accum: "38,123", deathBenefit: "196,052" },
      { year: 6, premium: "14,894", rate: "6.00%", accum: "52,836", deathBenefit: "199,189" },
    ],
    actualTotals: { premium: "41,000", rate: "5.95%" },
    illustratedTotals: { premium: "58,933", rate: "6.00%" },
    finalAnalysis: "The reason the policy is behind is mostly from the client not paying the planned premium. Past missed premiums can be caught up but it wll still be behind."
  },
  { 
    id: 11, 
    title: "Poor Index Performance", 
    age: 46, 
    policyYears: 5, 
    return: "4.42%", 
    category: "Underperform",
    details: {
      totalPremium: "$86,971",
      indexRate: "4.42%",
      interestCredited: "$3,400",
      accumulationValue: "$74,992",
      deathBenefit: "$385,690",
      costOfInsurance: "$3,033"
    },
    actualLedger: [
      { year: 2022, premium: "14,694", rate: "3.07%", accum: "11,372", deathBenefit: "322,070" },
      { year: 2023, premium: "17,694", rate: "0.00%", accum: "25,298", deathBenefit: "335,996" },
      { year: 2024, premium: "18,194", rate: "4.93%", accum: "41,308", deathBenefit: "352,006" },
      { year: 2025, premium: "18,194", rate: "4.20%", accum: "57,628", deathBenefit: "368,326" },
      { year: 2026, premium: "18,194", rate: "4.42%", accum: "74,992", deathBenefit: "385,690" },
    ],
    illustratedLedger: [
      { year: 1, premium: "12,194", rate: "6.00%", accum: "9,521", deathBenefit: "320,219" },
      { year: 2, premium: "12,194", rate: "6.00%", accum: "19,610", deathBenefit: "330,308" },
      { year: 3, premium: "12,194", rate: "6.00%", accum: "30,293", deathBenefit: "340,991" },
      { year: 4, premium: "12,194", rate: "6.00%", accum: "41,595", deathBenefit: "352,293" },
      { year: 5, premium: "12,194", rate: "6.00%", accum: "53,584", deathBenefit: "364,282" },
    ],
    actualTotals: { premium: "86,971", rate: "3.32%" },
    illustratedTotals: { premium: "60,970", rate: "6.00%" },
    finalAnalysis: "This policy is currently underperforming relative to the original illustration due to market returns trailing the 6% projection. Even though the client has significantly overfunded the contract by paying over $26,000 more in premium than originally planned, the average index credit of 3.32% is much less than it needs to be. The client is in one indexing strategy and has not diversified the allocations in order to acheive more consistent index credits."
  },
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const categories = ["All", "Growth", "Stability", "Safety", "Underperform"];

  const filteredStories = STORIES.filter(story => 
    (activeCategory === "All" || story.category === activeCategory) &&
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [activeNav, setActiveNav] = useState("Home");
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [selectedEducationId, setSelectedEducationId] = useState<number | null>(null);

  const trackMetaEvent = async (eventName: string, params: any = {}) => {
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          url: window.location.href,
          clientUserAgent: navigator.userAgent,
          ...params
        }),
      });
    } catch (error) {
      console.error('Meta tracking error:', error);
    }
  };

  useEffect(() => {
    if (selectedStoryId !== null) {
      const story = STORIES.find(s => s.id === selectedStoryId);
      if (story) {
        trackMetaEvent('ViewContent', {
          contentName: story.title,
          contentCategory: 'Case Study'
        });
      }
    }
  }, [selectedStoryId]);

  useEffect(() => {
    if (selectedEducationId !== null) {
      const article = EDUCATION_CONTENT.find(a => a.id === selectedEducationId);
      if (article) {
        trackMetaEvent('ViewContent', {
          contentName: article.title,
          contentCategory: article.category
        });
      }
    }
  }, [selectedEducationId]);

  const navItems = [
    { label: "Home" },
    { label: "Stories" },
    { label: "Education" },
    { label: "Contact" }
  ];

  const HowItWorksPage = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return (
      <div className="bg-[#F9F9F9] dark:bg-slate-900 min-h-screen pt-24 pb-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white"
            >
              How it <span className="text-primary">Works</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
            >
              A transparent, four-step process to ensure your Indexed Universal Life policy is designed for maximum performance and tracked for long-term success.
            </motion.p>
          </div>

          <div className="space-y-24">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-12 items-center"
            >
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-xl mb-6">1</div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Precision Case Design</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  We begin with a meticulous case design process. For an IUL to perform optimally, it must be structured with precision. We adhere to strict IRS tax guidelines to ensure the policy is issued with the absolute lowest allowable cost. Our specialized designers structure the policy to minimize the death benefit while maximizing the cash value potential. While there are countless ways to structure a policy, we focus on the single most efficient design to meet our rigorous specifications.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-8 aspect-square md:aspect-auto md:h-80">
                  <div className="flex items-center gap-8 w-full max-w-xs">
                    <div className="flex-1 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">Minimum</span>
                      <span className="text-sm text-slate-500">Death Benefit</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">Maximum</span>
                      <span className="text-sm text-slate-500">Cash Value</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse gap-12 items-center"
            >
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-xl mb-6">2</div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Product Selection & Illustration</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Next, we research and select the optimal products. While dozens of IUL products exist, only a select few meet our stringent qualifications. We run detailed carrier illustrations, finalize the policy design, and put it in force. The "Final Issued Illustration" is saved as our definitive baseline plan. Moving forward, this illustration serves as the benchmark against which we measure all actual policy performance.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="relative rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 aspect-[3/4] bg-slate-50">
                      <img src="/Illustration 2.jpg" alt="Illustration Cover" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="grid grid-rows-2 gap-4">
                      <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50">
                        <img src="/illustration 3.jpg" alt="Illustration Guide" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50">
                        <img src="/Illustration 1.jpg" alt="Illustration Ledger" className="w-full h-full object-cover object-top" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-12 items-center"
            >
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-xl mb-6">3</div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Annual Performance Tracking</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every year, we rigorously track the policy's performance. We monitor premium payments, index credits, and insurance cost deductions. We securely download and archive the official end-of-year statements. By extracting the exact values from these statements and comparing them directly to the Final Illustration, we can definitively determine whether the policy is behind, on track, or ahead of the original plan.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 aspect-[3/4]">
                      <img src="/Statement 1.jpg" alt="Annual Statement" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 aspect-[3/4]">
                      <img src="/Statement 2.jpg" alt="Statement Details" className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse gap-12 items-center"
            >
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-xl mb-6">4</div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Policy Performance Summary</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Finally, we synthesize this data into a comprehensive Policy Performance Summary. Using the baseline Final Illustration and the actual year-by-year statement values, we create a clear, side-by-side comparison. This transparent report allows you to see exactly how your in-force IUL policy has performed each year relative to the original expectations, providing complete clarity and peace of mind.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50">
                      <img src="/Report 1.jpg" alt="Performance Summary" className="w-full h-auto object-cover" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50">
                        <img src="/Report 2.jpg" alt="Comparison Table" className="w-full h-full object-cover" />
                      </div>
                      <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50">
                        <img src="/Report 3.jpg" alt="Performance Graph" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 text-center bg-white dark:bg-slate-800 rounded-[3rem] p-12 md:p-20 shadow-xl border border-slate-100 dark:border-slate-700"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Ready to see the results?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
              Now that you understand our process, explore our library of real-life success stories to see these principles in action.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setActiveNav("Stories")}
                className="stitch-button bg-primary text-white"
              >
                Explore Success Stories
              </button>
              <button 
                onClick={() => setActiveNav("Education")}
                className="stitch-button bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Learn More in Education
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const EducationPage = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    const selectedItem = EDUCATION_CONTENT.find(item => item.id === selectedEducationId);

    if (selectedItem) {
      const renderContentWithLinks = (text: string) => {
        const combinedRegex = /\[(.*?)\]\((.*?)\)|\*\*(.*?)\*\*/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = combinedRegex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
          }

          if (match[3] !== undefined) {
            // Bold match
            parts.push(
              <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
                {match[3]}
              </strong>
            );
          } else {
            // Link match
            const linkText = match[1];
            const linkUrl = match[2];

            if (linkUrl.startsWith('article:')) {
              const articleId = parseInt(linkUrl.replace('article:', ''), 10);
              parts.push(
                <button
                  key={match.index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEducationId(articleId);
                    window.scrollTo(0, 0);
                  }}
                  className="text-primary hover:underline font-bold transition-all cursor-pointer inline"
                >
                  {linkText}
                </button>
              );
            } else {
              parts.push(
                <a
                  key={match.index}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold transition-all"
                >
                  {linkText}
                </a>
              );
            }
          }

          lastIndex = combinedRegex.lastIndex;
        }

        if (lastIndex < text.length) {
          parts.push(text.substring(lastIndex));
        }

        return parts.length > 0 ? parts : text;
      };

      return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-20">
          {/* Article Hero */}
          <section className="relative py-16 md:py-24 overflow-hidden border-b border-slate-800 bg-[#373737]">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#373737] via-[#2a2a2a] to-[#1a1a1a]" />
              
              {/* Subtle Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              
              {/* Animated Glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1] 
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]" 
                />
                <motion.div 
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.05, 0.15, 0.05] 
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px]" 
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedEducationId(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-10 group font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full w-fit border border-white/10"
              >
                <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back to Education
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 backdrop-blur-sm">
                    {selectedItem.category}
                  </span>
                  <span className="text-slate-600">•</span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                    <Clock size={16} className="text-primary/60" />
                    <span>{selectedItem.duration}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-[1.15] tracking-tight">
                  {selectedItem.title === "The Evolution of Indexed Universal Life" ? (
                    <>
                      The Evolution of <br />
                      <span className="text-primary">Indexed Universal Life</span>
                    </>
                  ) : selectedItem.title === "Why IUL?" ? (
                    <>
                      Why <span className="text-primary">IUL?</span>
                    </>
                  ) : selectedItem.title === "What is a Maximum Funded IUL?" ? (
                    <>
                      What is a <br />
                      <span className="text-primary">Maximum Funded IUL?</span>
                    </>
                  ) : selectedItem.title === "The Math Behind Maximum Funded IULs" ? (
                    <>
                      The Math Behind <br />
                      <span className="text-primary">Maximum Funded IULs</span>
                    </>
                  ) : selectedItem.title === "Building an IUL the Correct Way" ? (
                    <>
                      Building an IUL the <br />
                      <span className="text-primary">Correct Way</span>
                    </>
                  ) : (
                    selectedItem.title
                  )}
                </h1>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
                      <div className="w-full h-full rounded-full bg-[#373737] flex items-center justify-center text-white">
                        <Info size={24} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white">Kevin Nuber</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>Professional Advisor</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        <span>April 8, 2026</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-3">
                    <div className="text-right mr-4">
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Share Article</div>
                      <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                            <div className="w-1 h-1 rounded-full bg-current" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden"
            >
              {selectedItem.type === 'video' && (
                <div className="aspect-video w-full relative bg-slate-200 dark:bg-slate-700 rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 border-8 border-white dark:border-slate-800">
                  <iframe 
                    className="w-full h-full"
                    src={selectedItem.videoUrl}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg md:prose-xl prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400">
                {selectedItem.content.split('\n').map((paragraph, i) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={i} className="text-3xl font-bold mt-16 mb-8 text-slate-900 dark:text-white">{renderContentWithLinks(paragraph.replace('## ', ''))}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={i} className="text-2xl font-bold mt-12 mb-6 text-slate-900 dark:text-white">{renderContentWithLinks(paragraph.replace('### ', ''))}</h3>;
                  }
                  if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
                    return <li key={i} className="text-lg text-slate-600 dark:text-slate-400 ml-4 mb-4 list-decimal">{renderContentWithLinks(paragraph.substring(3))}</li>;
                  }
                  if (paragraph.startsWith('- ')) {
                    return <li key={i} className="text-lg text-slate-600 dark:text-slate-400 ml-4 mb-4">{renderContentWithLinks(paragraph.replace('- ', ''))}</li>;
                  }
                  if (paragraph.startsWith('[chart:')) {
                    const type = paragraph.match(/\[chart:(.*)\]/)?.[1];
                    return type ? <ArticleChart key={i} type={type} /> : null;
                  }
                  if (paragraph.startsWith('![image]')) {
                    // Custom image syntax: ![image](url|caption|size)
                    const match = paragraph.match(/\!\[image\]\((.*?)\|(.*?)(?:\|(.*?))?\)/);
                    if (match) {
                      const [, url, caption, size] = match;
                      const isSmall = size === 'small';
                      return (
                        <figure key={i} className={`my-16 ${isSmall ? 'max-w-md mx-auto' : ''}`}>
                          <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
                            <img src={url} alt={caption} className="w-full h-auto" referrerPolicy="no-referrer" />
                          </div>
                          <figcaption className="text-center mt-6 text-sm text-slate-500 italic font-medium">
                            {caption}
                          </figcaption>
                        </figure>
                      );
                    }
                  }
                  if (paragraph.trim() === '') return null;
                  return <p key={i} className="mb-8">{renderContentWithLinks(paragraph)}</p>;
                })}
              </div>

              <div className="mt-24 pt-16 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] p-10 md:p-16 text-center border border-slate-100 dark:border-slate-800">
                  <h4 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to take the next step?</h4>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                    Schedule a personalized consultation to see how these strategies can be tailored to your unique financial goals.
                  </p>
                  <button 
                    onClick={() => setActiveNav("Contact")}
                    className="stitch-button bg-primary text-white px-10 py-4 text-lg"
                  >
                    Get Started Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {/* Education Hero */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
              alt="Office Background" 
              className="w-full h-full object-cover opacity-20 dark:opacity-10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
            >
              <BookOpen size={16} />
              <span>Knowledge Base</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-8 text-slate-900 dark:text-white"
            >
              Master How <span className="text-primary">Indexed Universal Life</span> Works
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
            >
              Indexed Universal Life is a simple concept made complex from over 20 years of refinement and improvement. You don't need to understand every detail to start your IUL journey, but you deserve total clarity on how it builds your financial future.
            </motion.p>
          </div>
        </section>

        {/* Content Grid */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {EDUCATION_CONTENT.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedEducationId(item.id)}
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <PlayCircle size={32} fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        {item.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
                        <span>{item.type}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center text-primary font-bold text-sm gap-2">
                      <span>{item.type === 'video' ? 'Watch Video' : 'Read Article'}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  const CaseStudyPage = ({ story }: { story: SuccessStory }) => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    const navItems = [
      { id: 'summary', label: 'Performance Summary' },
      { id: 'comparison', label: 'Illustration Comparison' },
      { id: 'graph', label: 'Performance Graph' },
      { id: 'conclusion', label: 'Conclusion' }
    ];

    const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    return (
      <div className="bg-[#F0F0F0] min-h-screen relative">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row">
          {/* Sticky Sidebar */}
          <div className="hidden lg:block w-80 shrink-0 bg-[#F0F0F0] border-r border-slate-200 min-h-screen">
            <div className="sticky top-0 p-12 pt-24 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Navigation</div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-slate-600 hover:text-primary font-bold transition-all border border-transparent hover:border-slate-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#F9F9F9] min-w-0 p-8 md:p-16 lg:p-24">
            <button 
              onClick={() => setSelectedStoryId(null)}
              className="mb-12 flex items-center gap-2 text-slate-600 hover:text-primary font-bold transition-colors"
            >
              <X size={20} />
              Back to Showcase
            </button>

            <div className="mb-16">
              <div className="flex gap-4">
                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                  {story.category}
                </span>
                <span className="px-4 py-1 rounded-full bg-slate-200 text-slate-600 text-sm font-bold uppercase tracking-wider">
                  Year {story.policyYears}
                </span>
              </div>
            </div>

            {story.details && (
              <div id="summary" className="mb-12 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-2 text-slate-900">Policy Performance Summary</h2>
                <div className="w-24 h-1 bg-[#363636] mb-8"></div>
              </div>
            )}

            {story.details ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: "Total Premium Paid", value: story.details.totalPremium },
                  { label: "Index Rate This Year", value: story.details.indexRate },
                  { label: "Interest Credited This Year", value: story.details.interestCredited },
                  { label: "Accumulation Value", value: story.details.accumulationValue },
                  { label: "Death Benefit", value: story.details.deathBenefit },
                  { label: "Cost of Insurance", value: story.details.costOfInsurance },
                ].map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      scale: 1.03, 
                      translateY: -8,
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                    }}
                    transition={{ 
                      delay: idx * 0.15,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    key={idx} 
                    className="bg-white border border-slate-200 p-10 text-left shadow-sm rounded-[2.5rem] transition-all hover:shadow-md flex items-center gap-8 group"
                  >
                    <div className="w-2 h-16 bg-[#4A6F3C] rounded-full flex-shrink-0 group-hover:scale-y-110 transition-transform" />
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-[#4A6F3C] mb-1">
                        {item.value}
                      </div>
                      <div className="text-lg md:text-xl text-slate-600 font-medium">
                        {item.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
                <h2 className="text-2xl font-bold mb-4">Detailed Case Study Coming Soon</h2>
                <p className="text-slate-500">We are currently compiling the full data for this specific policy.</p>
              </div>
            )}

            {story.details && (
              <div id="comparison" className="mt-32 pt-24 border-t-2 border-slate-400 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-2 text-slate-900">Actual Policy vs. Original Illustration Comparison</h2>
                <p className="text-slate-500 text-sm mb-4 italic">Comparison of actual historical data from an in-force policy to the original illustration.</p>
                <div className="w-24 h-1 bg-[#363636] mb-12"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Actual Table */}
                  {story.actualLedger && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="bg-[#83AE62] text-white text-center py-4 font-bold text-xl rounded-t-2xl">
                        Actual Policy Performance
                      </div>
                      <div className="bg-white border-x border-b border-slate-200 overflow-hidden rounded-b-2xl shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-center">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="py-4 px-2 font-bold text-slate-700">Year</th>
                                <th className="py-4 px-2 font-bold text-slate-700">Premium Paid</th>
                                <th className="py-4 px-2 font-bold text-slate-700">Index Rate</th>
                                <th className="py-4 px-2 font-bold text-slate-700">Accum Value</th>
                                <th className="py-4 px-2 font-bold text-slate-700">Death Benefit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {story.actualLedger.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-3 px-2 text-slate-600">{row.year}</td>
                                  <td className="py-3 px-2 text-slate-900 font-medium">{row.premium}</td>
                                  <td className="py-3 px-2 text-slate-900 font-medium">{row.rate}</td>
                                  <td className="py-3 px-2 text-slate-900 font-medium">{row.accum}</td>
                                  <td className="py-3 px-2 text-slate-900 font-medium">{row.deathBenefit}</td>
                                </tr>
                              ))}
                            </tbody>
                            {story.actualTotals && (
                              <tfoot className="bg-[#FFFDE7] font-bold border-t-2 border-slate-200">
                                <tr>
                                  <td className="py-4 px-2"></td>
                                  <td className="py-4 px-2">{story.actualTotals.premium}</td>
                                  <td className="py-4 px-2">{story.actualTotals.rate}</td>
                                  <td className="py-4 px-2"></td>
                                  <td className="py-4 px-2"></td>
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Illustrated Table */}
                  {story.illustratedLedger && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="bg-[#666666] text-white text-center py-4 font-bold text-xl rounded-t-2xl">
                        Illustrated Policy Performance
                      </div>
                      <div className="bg-white border-x border-b border-slate-200 overflow-hidden rounded-b-2xl shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-center">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="py-4 px-2 font-bold text-slate-700">Year</th>
                                <th className="py-4 px-2 font-bold text-slate-700">Premium Paid</th>
                                <th className="py-4 px-2 font-bold text-slate-700">Index Rate</th>
                                <th className="py-4 px-2 font-bold text-slate-700">Accum Value</th>
                                <th className="py-4 px-2 font-bold text-slate-700">Death Benefit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {story.illustratedLedger.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-3 px-2 text-slate-600">{row.year}</td>
                                  <td className="py-3 px-2 text-slate-900 font-medium">{row.premium}</td>
                                  <td className="py-3 px-2 text-slate-900 font-medium">{row.rate}</td>
                                  <td className="py-3 px-2 text-slate-900 font-medium">{row.accum}</td>
                                  <td className="py-3 px-2 text-slate-900 font-medium">{row.deathBenefit}</td>
                                </tr>
                              ))}
                            </tbody>
                            {story.illustratedTotals && (
                              <tfoot className="bg-[#FFFDE7] font-bold border-t-2 border-slate-200">
                                <tr>
                                  <td className="py-4 px-2">Tot:</td>
                                  <td className="py-4 px-2">{story.illustratedTotals.premium}</td>
                                  <td className="py-4 px-2">{story.illustratedTotals.rate}</td>
                                  <td className="py-4 px-2"></td>
                                  <td className="py-4 px-2"></td>
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Chart Section */}
                <div id="graph" className="mt-32 pt-24 border-t-2 border-slate-400 scroll-mt-32">
                  <h2 className="text-3xl font-bold mb-2 text-slate-900">Overall Policy Performance Review</h2>
                  <p className="text-slate-500 text-sm mb-4 italic">Visual comparison of actual vs. illustrated accumulation value growth over time.</p>
                  <div className="w-24 h-1 bg-[#363636] mb-12"></div>
                  
                  <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold text-slate-800">Actual vs. Illustrated Accumulation Value</h3>
                    </div>
                    
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={story.actualLedger?.map((row, i) => {
                            const parseVal = (v: string) => {
                              if (!v) return 0;
                              return parseFloat(v.replace(/[$,]/g, '')) || 0;
                            };
                            return {
                              year: row.year,
                              actual: parseVal(row.accum),
                              illustrated: story.illustratedLedger ? parseVal(story.illustratedLedger[i].accum) : 0
                            };
                          }) || []}
                          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="year" 
                            axisLine={true}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            label={{ value: 'Policy Year', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 12, fontWeight: 'bold' }}
                          />
                          <YAxis 
                            axisLine={true}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="top" height={36} />
                          <Line 
                            type="monotone" 
                            dataKey="actual" 
                            name="Actual" 
                            stroke="#83AE62" 
                            strokeWidth={4} 
                            dot={{ r: 6, fill: '#83AE62', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="illustrated" 
                            name="Illustrated" 
                            stroke="#666666" 
                            strokeWidth={4} 
                            strokeDasharray="5 5"
                            dot={{ r: 6, fill: '#666666', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Final Analysis Section */}
                {story.finalAnalysis && (
                  <div id="conclusion" className="mt-32 pt-24 border-t-2 border-slate-400 scroll-mt-32">
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold mb-2 text-slate-900">Conclusion</h2>
                      <div className="w-24 h-1 bg-[#363636] mb-8"></div>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-sm">
                      <h2 className="text-3xl font-bold mb-8 text-[#4A6F3C]">Final Policy Analysis</h2>
                      <p className="text-xl text-slate-700 leading-relaxed">
                        {story.finalAnalysis}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PerformanceShowcase = () => {
    const isHome = activeNav === "Home";
    const displayStories = isHome ? filteredStories.slice(0, 9) : filteredStories;

    return (
      <section className="py-24 bg-[#F0F0F0] dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Performance Showcase</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                Filter through our library of real-life policy performance data to see how IUL handles different market conditions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all w-full sm:w-64 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {displayStories.map((story, index) => (
                <motion.div
                  layout
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white dark:bg-slate-900/70 backdrop-blur-md border border-white dark:border-slate-800/20 shadow-xl rounded-3xl p-8 hover:border-primary/30 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      {story.category}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {story.return}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors leading-snug">
                    {story.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Issue Age</div>
                      <div className="text-lg font-bold">{story.age}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Years Active</div>
                      <div className="text-lg font-bold">{story.policyYears}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedStoryId(story.id)}
                    className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white font-bold transition-all flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700 cursor-pointer"
                  >
                    View Full Case Study
                    <ChevronRight size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {isHome && filteredStories.length > 9 && (
            <div className="mt-16 text-center">
              <button 
                onClick={() => {
                  setActiveNav("Stories");
                  window.scrollTo(0, 0);
                }}
                className="stitch-button bg-primary text-white inline-flex items-center gap-2 group shadow-xl shadow-primary/20"
              >
                See More Stories
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {displayStories.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">No stories found</h3>
              <p className="text-slate-500">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  const ArticleHighlight = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    useEffect(() => {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
      if (containerRef.current) {
        const cardWidth = containerRef.current.querySelector('.article-card')?.clientWidth || 0;
        const gap = 32; // gap-8
        const scrollAmount = cardWidth + gap;
        containerRef.current.scrollBy({
          left: direction === 'right' ? scrollAmount : -scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Learn the <span className="text-primary">Mathematics</span> of IUL
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Explore our library of educational deep-dives. We strip away the marketing jargon and show you the actual engineering behind a successful policy.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                  !canScrollLeft 
                    ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'border-slate-300 text-slate-900 dark:text-white hover:border-primary hover:text-primary cursor-pointer shadow-lg'
                }`}
              >
                <ArrowRight size={24} className="rotate-180" />
              </button>
              <button 
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                  !canScrollRight 
                    ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'border-slate-300 text-slate-900 dark:text-white hover:border-primary hover:text-primary cursor-pointer shadow-lg'
                }`}
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>

          <div 
            ref={containerRef}
            onScroll={checkScroll}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4"
          >
            {EDUCATION_CONTENT.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  setSelectedEducationId(item.id);
                  setActiveNav("Education");
                  window.scrollTo(0, 0);
                }}
                className="article-card flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] snap-start group cursor-pointer"
              >
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 mb-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        {item.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
                        <span>{item.type}</span>
                      </div>
                      <span className="text-slate-200 dark:text-slate-700">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                      <span>Read Full Article</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => {
                setActiveNav("Education");
                setSelectedEducationId(null);
                window.scrollTo(0, 0);
              }}
              className="stitch-button bg-[#363636] text-white inline-flex items-center gap-3 shadow-xl"
            >
              Explore Education Library
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    );
  };

  const StoryHighlight = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    useEffect(() => {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
      if (containerRef.current) {
        const cardWidth = containerRef.current.querySelector('.story-highlight-card')?.clientWidth || 0;
        const gap = 32; // gap-8
        const scrollAmount = cardWidth + gap;
        containerRef.current.scrollBy({
          left: direction === 'right' ? scrollAmount : -scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <section className="py-24 bg-[#F0F0F0] dark:bg-slate-900/50 overflow-hidden border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                See it in <span className="text-primary">Action</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Education is one thing, but seeing the actual policy math over 10+ years is where the value truly shows. Explore these real-world performance results.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                  !canScrollLeft 
                    ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'border-slate-300 text-slate-900 dark:text-white hover:border-primary hover:text-primary cursor-pointer shadow-lg'
                }`}
              >
                <ArrowRight size={24} className="rotate-180" />
              </button>
              <button 
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                  !canScrollRight 
                    ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'border-slate-300 text-slate-900 dark:text-white hover:border-primary hover:text-primary cursor-pointer shadow-lg'
                }`}
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>

          <div 
            ref={containerRef}
            onScroll={checkScroll}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4"
          >
            {STORIES.map((story) => (
              <div 
                key={story.id}
                onClick={() => {
                  setSelectedStoryId(story.id);
                  setActiveNav("Stories");
                  window.scrollTo(0, 0);
                }}
                className="story-highlight-card flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] snap-start group cursor-pointer"
              >
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      {story.category}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {story.return}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {story.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Issue Age</div>
                      <div className="text-lg font-bold">{story.age}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Years Active</div>
                      <div className="text-lg font-bold">{story.policyYears}</div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white font-bold transition-all border border-slate-100 dark:border-slate-700">
                    View Case Study
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => {
                setActiveNav("Stories");
                setSelectedStoryId(null);
                window.scrollTo(0, 0);
              }}
              className="stitch-button bg-[#363636] text-white inline-flex items-center gap-3 shadow-xl"
            >
              See All Case Studies
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    );
  };

  const ContactPage = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      zip: '',
      message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('submitting');

      try {
        const response = await fetch('/api/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            url: window.location.href,
            clientUserAgent: navigator.userAgent,
          }),
        });

        if (response.ok) {
          setStatus('success');
          setFormData({ firstName: '', lastName: '', email: '', phone: '', zip: '', message: '' });
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Submission error:', error);
        setStatus('error');
      }
    };

    return (
      <div className="py-12 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Connect with an <span className="text-primary">IUL Expert</span></h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Have questions about the case studies or want to see how an IUL could work for you? Send us a message and we'll be in touch.
            </p>
          </div>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/10 border border-primary/20 p-12 rounded-[3rem] text-center"
            >
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Message Sent!</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Thank you for reaching out. An expert will review your information and contact you shortly.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="stitch-button bg-primary text-white"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">First Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Last Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Zip Code</label>
                <input 
                  required
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">How can we help?</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                ></textarea>
              </div>

              {status === 'error' && (
                <p className="text-red-500 font-bold text-center">There was an error sending your message. Please try again.</p>
              )}

              <button 
                disabled={status === 'submitting'}
                type="submit"
                className="w-full py-5 rounded-[2rem] bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <Shield className="absolute inset-0 text-primary" size={40} strokeWidth={1.5} />
                <TrendingUp className="relative text-primary mb-1" size={18} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                IUL<span className="text-primary">Success</span><span className="text-black dark:text-white">Stories</span>
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button 
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    setSelectedStoryId(null);
                    setSelectedEducationId(null);
                  }}
                  className={`text-sm font-semibold transition-all cursor-pointer ${
                    activeNav === item.label 
                      ? 'text-primary' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button 
              className="md:hidden p-2 text-slate-900 dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button 
                    key={item.label}
                    className={`text-lg font-semibold text-left cursor-pointer ${
                      activeNav === item.label ? 'text-primary' : 'text-slate-600 dark:text-slate-400'
                    }`}
                    onClick={() => {
                      setActiveNav(item.label);
                      setSelectedStoryId(null);
                      setSelectedEducationId(null);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {selectedStoryId ? (
          <CaseStudyPage story={STORIES.find(s => s.id === selectedStoryId)!} />
        ) : activeNav === "Home" ? (
          <>
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-[#363636]">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
              </div>

              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="flex-1 text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-bold mb-6"
                    >
                      <Zap size={14} />
                      <span>New Success Stories Added</span>
                    </motion.div>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] text-white"
                    >
                      Real Results from <br />
                      <span className="text-primary">Actual IUL Policies</span>
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                    >
                      Indexed Universal Life (IUL) isn't just theory. See how real people are using these policies to build wealth, protect their families, and secure their future.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap justify-center lg:justify-start gap-4"
                    >
                      <button 
                        onClick={() => setActiveNav("Stories")}
                        className="stitch-button bg-primary text-white flex items-center gap-2 group shadow-xl shadow-primary/20 cursor-pointer"
                      >
                        Explore Stories
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => setActiveNav("How it Works")}
                        className="stitch-button bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                      >
                        How it Works
                      </button>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 text-slate-400"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={20} />
                        <span className="text-sm font-medium">Verified Data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} />
                        <span className="text-sm font-medium">Real Performance</span>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 w-full max-w-2xl"
                  >
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-accent opacity-10 blur-2xl rounded-[3rem]" />
                      <div className="relative rounded-[2.5rem] overflow-hidden aspect-video bg-slate-900 shadow-2xl border-8 border-white/10">
                        <iframe 
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/CcK2ZD8a-KY?autoplay=0&rel=0" 
                          title="IUL Success Stories Overview"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <PerformanceShowcase />
          </>
        ) : activeNav === "How it Works" ? (
          <HowItWorksPage />
        ) : activeNav === "Education" ? (
          <EducationPage />
        ) : activeNav === "Stories" ? (
          <>
            {/* Stories Hero Section */}
            <section className="pt-24 pb-20 bg-[#363636] text-white overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
              </div>
              
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="flex-1 text-center lg:text-left">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
                    >
                      IUL <span className="text-primary">Performance Showcase</span>
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10"
                    >
                      The following are real examples of in-force IUL policies that have been tracked year by year, then compared to the original illustration, to show how they have performed over time.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap justify-center lg:justify-start gap-4"
                    >
                      <button 
                        onClick={() => setActiveNav("How it Works")}
                        className="stitch-button bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                      >
                        How it Works
                      </button>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="flex-1 flex justify-center lg:justify-end"
                  >
                    <div className="relative w-full max-w-md">
                      {/* Main Performance Card */}
                      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">Indexing Strategy</div>
                            <div className="text-2xl font-bold text-white">Account Value</div>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                            +7.8%
                          </div>
                        </div>

                        {/* Stylized Chart */}
                        <div className="h-32 w-full relative mb-6">
                          <svg viewBox="0 0 200 80" className="w-full h-full text-primary">
                            <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path 
                              d="M0 60 Q 20 55, 40 65 T 80 40 T 120 45 T 160 20 T 200 10" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="3" 
                              strokeLinecap="round"
                            />
                            <path 
                              d="M0 60 Q 20 55, 40 65 T 80 40 T 120 45 T 160 20 T 200 10 L 200 80 L 0 80 Z" 
                              fill="url(#chartGradient)" 
                            />
                            <circle cx="160" cy="20" r="4" fill="currentColor" />
                            <circle cx="160" cy="20" r="8" fill="currentColor" fillOpacity="0.2" />
                          </svg>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Floor</div>
                            <div className="text-lg font-bold text-white">0%</div>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Cap</div>
                            <div className="text-lg font-bold text-white">12.5%</div>
                          </div>
                        </div>
                      </div>

                      {/* Floating Decorative Elements */}
                      <motion.div 
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 z-20 bg-primary p-4 rounded-2xl shadow-xl"
                      >
                        <TrendingUp className="text-white" size={24} />
                      </motion.div>
                      
                      <motion.div 
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-4 -left-4 z-20 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl"
                      >
                        <ShieldCheck className="text-primary" size={24} />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <PerformanceShowcase />
          </>
        ) : activeNav === "Contact" ? (
          <ContactPage />
        ) : (
          <div className="py-32 text-center">
            <h2 className="text-3xl font-bold mb-4">{activeNav} Page</h2>
            <p className="text-slate-500">This section is coming soon.</p>
            <button 
              onClick={() => setActiveNav("Home")}
              className="mt-8 text-primary font-bold hover:underline"
            >
              Back to Home
            </button>
          </div>
        )}

        {activeNav === "Education" || selectedEducationId ? <StoryHighlight /> : <ArticleHighlight />}
      </main>

      {/* Footer */}
      <footer className="bg-[#363636] pt-20 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <Shield className="absolute inset-0 text-primary" size={32} strokeWidth={1.5} />
                  <TrendingUp className="relative text-primary mb-0.5" size={14} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  IUL<span className="text-primary">Success</span>Stories
                </span>
              </div>
              <p className="text-white max-w-md leading-relaxed">
                Providing transparency and real-world data for Indexed Universal Life insurance policies. Our mission is to educate and empower individuals with actual performance results.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white hover:text-primary transition-colors">Success Stories</a></li>
                <li><a href="#" className="text-white hover:text-primary transition-colors">IUL Education</a></li>
                <li><a href="#" className="text-white hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="text-white hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Mail size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Info size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-white">
              © 2026 IUL Success Stories. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-xs text-white hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-xs text-white hover:text-primary">Terms of Service</a>
              <a href="#" className="text-xs text-white hover:text-primary">Disclosures</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
