/**
 * Quote Engine — 3-Tier Waterfall
 *
 * Implements the quote generation and confidence scoring spec (task1.md).
 *
 * Tier 1: Standard Job (STJ) — authoritative, always 100% HIGH
 * Tier 2: Exact Work Order match — recency-weighted, parts repriced, confidence formula
 * Tier 3: Similarity-driven estimate — when no exact match exists
 *
 * Tier Override: Tier 2 can auto-promote to Tier 3 when WO data is unreliable.
 */

import {
  removeOutliers,
  findSimilarCombos,
  aggregateParts,
  type SimilarityInput,
  type SimilarityResult,
  type PartsIndex,
  type PartEntry,
} from './similarity';

// ============================================
// TYPES
// ============================================

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type QuoteTier = 1 | 2 | 3;

export interface WoEntry {
  s: string;
  p: number;
  l: number;
  m: number;
  d: number;
  sf: string;
  md?: string;
  sp?: string;
  dt?: string; // "YYYY-MM"
}

export interface ConfidenceBreakdown {
  baseScore: number;
  cvAdjustment: number;
  similarityAdjustment: number;
  finalBeforeClamp: number;
}

export interface QuoteResult {
  tier: QuoteTier;
  source: 'stj' | 'wo' | 'similarity';

  avgParts: number;
  avgLabor: number;
  avgMisc: number;
  avgTotal: number;
  lowTotal: number;
  highTotal: number;

  avgDuration: number;
  lowDuration: number;
  highDuration: number;

  confidence: ConfidenceLevel;
  confidenceScore: number;
  confidenceBreakdown: ConfidenceBreakdown;

  count: number;
  stdDev: number;
  entries: WoEntry[];

  similarCombos: SimilarityResult[];
  similarCombosUsedForPricing?: SimilarityResult[];
  partsListSource?: string;

  deviationWarning: boolean;
  tierOverride: boolean;
  tierOverrideNote?: string;
  partsRepriced: boolean;
  partsFallbackToHistorical: boolean;
}

// ============================================
// HELPERS
// ============================================

function computeMonthsAgo(dt: string, now: Date): number {
  const [year, month] = dt.split('-').map(Number);
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  return Math.max(0, (nowYear - year) * 12 + (nowMonth - month));
}

function computeRecencyWeight(monthsAgo: number, divisor: number): number {
  return 1 / (1 + monthsAgo / divisor);
}

function weightedAverage(values: number[], weights: number[]): number {
  const sumW = weights.reduce((a, b) => a + b, 0);
  if (sumW === 0) return 0;
  let total = 0;
  for (let i = 0; i < values.length; i++) {
    total += values[i] * weights[i];
  }
  return total / sumW;
}

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr: number[]): number {
  if (arr.length === 0) return 0;
  const mean = avg(arr);
  return Math.sqrt(arr.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / arr.length);
}

function computeCV(values: number[]): number {
  const mean = avg(values);
  if (mean === 0) return 0;
  return stdDev(values) / mean;
}

function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 85) return 'HIGH';
  if (score >= 60) return 'MEDIUM';
  return 'LOW';
}

function clampScore(score: number): number {
  return Math.max(15, Math.min(100, score));
}

function computeBaseConfidence(count: number): number {
  if (count === 1) return 30;
  if (count === 2) return 40;
  if (count <= 5) return 55;
  if (count <= 10) return 65;
  if (count <= 20) return 72;
  return 80;
}

function computeCVAdjustment(cv: number, count: number): number {
  if (count < 4) return 0;
  if (cv > 0.5) return -20;
  if (cv >= 0.3) return -10;
  return 0;
}

/**
 * Compute parts cost from partsData.json: sum(price * qty) for all parts.
 */
function computePartsFromCatalog(parts: PartEntry[]): number {
  const aggregated = aggregateParts(parts);
  return aggregated.reduce((sum, p) => sum + p.price * Math.max(0, p.qty), 0);
}

// ============================================
// TIER 1: STANDARD JOB
// ============================================

function computeTier1Quote(entries: WoEntry[]): QuoteResult {
  const count = entries.length;
  const partsArr = entries.map(e => e.p);
  const laborArr = entries.map(e => e.l);
  const miscArr = entries.map(e => e.m);
  const totals = entries.map(e => e.p + e.l + e.m);
  const durations = entries.map(e => e.d);

  const avgParts = Math.round(avg(partsArr));
  const avgLabor = Math.round(avg(laborArr));
  const avgMisc = Math.round(avg(miscArr));
  const avgTotal = Math.round(avg(totals));

  return {
    tier: 1,
    source: 'stj',
    avgParts,
    avgLabor,
    avgMisc,
    avgTotal,
    lowTotal: Math.round(Math.min(...totals)),
    highTotal: Math.round(Math.max(...totals)),
    avgDuration: Math.round(avg(durations) * 10) / 10,
    lowDuration: Math.round(Math.min(...durations) * 10) / 10,
    highDuration: Math.round(Math.max(...durations) * 10) / 10,
    confidence: 'HIGH',
    confidenceScore: 100,
    confidenceBreakdown: { baseScore: 100, cvAdjustment: 0, similarityAdjustment: 0, finalBeforeClamp: 100 },
    count,
    stdDev: Math.round(stdDev(totals)),
    entries,
    similarCombos: [],
    deviationWarning: false,
    tierOverride: false,
    partsRepriced: false,
    partsFallbackToHistorical: false,
  };
}

// ============================================
// TIER 2: EXACT WORK ORDER MATCH
// ============================================

function computeTier2Quote(
  entries: WoEntry[],
  partsData: PartsIndex,
  similarityIndex: Map<string, SimilarityInput>,
  comboKeys: string[],
  woJobs: Record<string, WoEntry[]>,
  now: Date
): QuoteResult {
  const count = entries.length;

  // --- Parts repricing ---
  let avgParts: number;
  let partsRepriced = false;
  let partsFallbackToHistorical = false;

  // Try to find partsData for any of the combo keys
  let catalogParts: PartEntry[] | null = null;
  for (const key of comboKeys) {
    if (partsData[key]) {
      catalogParts = partsData[key];
      break;
    }
  }

  if (catalogParts) {
    avgParts = Math.round(computePartsFromCatalog(catalogParts));
    partsRepriced = true;
  } else {
    // Fallback: recency-weighted average of historical WO parts costs
    const partsValues = entries.map(e => e.p);
    const weights = entries.map(e => {
      const monthsAgo = e.dt ? computeMonthsAgo(e.dt, now) : 36;
      return computeRecencyWeight(monthsAgo, 6);
    });
    avgParts = Math.round(weightedAverage(partsValues, weights));
    partsFallbackToHistorical = true;
  }

  // --- Labor and Misc: IQR outlier removal then recency-weighted average ---
  const laborValues = entries.map(e => e.l);
  const miscValues = entries.map(e => e.m);

  // IQR filtering (requires count >= 4)
  // Apply IQR bounds directly to indices to avoid Set-based deduplication issues
  let filteredLaborIndices: number[];
  let filteredMiscIndices: number[];

  if (count >= 4) {
    // Compute IQR bounds for labor
    const sortedLabor = [...laborValues].sort((a, b) => a - b);
    const lq1 = sortedLabor[Math.floor(sortedLabor.length * 0.25)];
    const lq3 = sortedLabor[Math.floor(sortedLabor.length * 0.75)];
    const liqr = lq3 - lq1;
    const lLower = lq1 - 1.5 * liqr;
    const lUpper = lq3 + 1.5 * liqr;
    filteredLaborIndices = entries.map((_, i) => i).filter(i => laborValues[i] >= lLower && laborValues[i] <= lUpper);

    // Compute IQR bounds for misc
    const sortedMisc = [...miscValues].sort((a, b) => a - b);
    const mq1 = sortedMisc[Math.floor(sortedMisc.length * 0.25)];
    const mq3 = sortedMisc[Math.floor(sortedMisc.length * 0.75)];
    const miqr = mq3 - mq1;
    const mLower = mq1 - 1.5 * miqr;
    const mUpper = mq3 + 1.5 * miqr;
    filteredMiscIndices = entries.map((_, i) => i).filter(i => miscValues[i] >= mLower && miscValues[i] <= mUpper);

    // Safety: if IQR removed everything, fall back to all entries
    if (filteredLaborIndices.length === 0) filteredLaborIndices = entries.map((_, i) => i);
    if (filteredMiscIndices.length === 0) filteredMiscIndices = entries.map((_, i) => i);
  } else {
    filteredLaborIndices = entries.map((_, i) => i);
    filteredMiscIndices = entries.map((_, i) => i);
  }

  // Recency-weighted average for labor
  const laborVals = filteredLaborIndices.map(i => laborValues[i]);
  const laborWeights = filteredLaborIndices.map(i => {
    const monthsAgo = entries[i].dt ? computeMonthsAgo(entries[i].dt!, now) : 36;
    return computeRecencyWeight(monthsAgo, 6);
  });
  const avgLabor = Math.round(weightedAverage(laborVals, laborWeights));

  // Recency-weighted average for misc
  const miscVals = filteredMiscIndices.map(i => miscValues[i]);
  const miscWeights = filteredMiscIndices.map(i => {
    const monthsAgo = entries[i].dt ? computeMonthsAgo(entries[i].dt!, now) : 36;
    return computeRecencyWeight(monthsAgo, 6);
  });
  const avgMisc = Math.round(weightedAverage(miscVals, miscWeights));

  const avgTotal = avgParts + avgLabor + avgMisc;

  // Duration (simple average — no recency weighting needed)
  const durations = entries.map(e => e.d);
  const avgDuration = Math.round(avg(durations) * 10) / 10;

  // Totals for range/stddev (use raw entries)
  const totals = entries.map(e => e.p + e.l + e.m);
  const totalStdDev = Math.round(stdDev(totals));

  // --- Deviation sanity check ---
  let deviationWarning = false;
  if (count >= 5) {
    const medianTotal = computeMedian(totals);
    if (medianTotal > 0) {
      const deviation = Math.abs(avgTotal - medianTotal) / medianTotal;
      if (deviation > 0.3) {
        deviationWarning = true;
      }
    }
  }

  // --- Confidence scoring ---

  // Step 1: Base score from count
  const baseScore = computeBaseConfidence(count);

  // Step 2: CV adjustment (only count >= 4)
  const cv = computeCV(totals);
  const cvAdj = computeCVAdjustment(cv, count);

  // Step 3: Similarity corroboration
  const simAdj = computeSimilarityCorroboration(avgTotal, similarityIndex, comboKeys, entries);

  const finalBeforeClamp = baseScore + cvAdj + simAdj;
  const confidenceScore = clampScore(finalBeforeClamp);
  const confidence = getConfidenceLevel(confidenceScore);

  // --- Get similar combos for display ---
  const similarCombos = getSimilarCombosForDisplay(similarityIndex, comboKeys, entries);

  // Build result
  const result: QuoteResult = {
    tier: 2,
    source: 'wo',
    avgParts,
    avgLabor,
    avgMisc,
    avgTotal,
    lowTotal: Math.round(Math.min(...totals)),
    highTotal: Math.round(Math.max(...totals)),
    avgDuration,
    lowDuration: Math.round(Math.min(...durations) * 10) / 10,
    highDuration: Math.round(Math.max(...durations) * 10) / 10,
    confidence,
    confidenceScore,
    confidenceBreakdown: { baseScore, cvAdjustment: cvAdj, similarityAdjustment: simAdj, finalBeforeClamp },
    count,
    stdDev: totalStdDev,
    entries,
    similarCombos,
    deviationWarning,
    tierOverride: false,
    partsRepriced,
    partsFallbackToHistorical,
  };

  return result;
}

// ============================================
// TIER 3: SIMILARITY-DRIVEN ESTIMATE
// ============================================

function computeTier3Quote(
  similarityIndex: Map<string, SimilarityInput>,
  comboKeys: string[],
  partsData: PartsIndex,
  woJobs: Record<string, WoEntry[]>,
  now: Date
): QuoteResult | null {
  // Find the input for this combo in the similarity index
  let input: SimilarityInput | undefined;
  let inputKey = '';
  for (const key of comboKeys) {
    const found = similarityIndex.get(key);
    if (found) {
      input = found;
      inputKey = key;
      break;
    }
  }

  // If no similarity input exists, we can't build a Tier 3 quote.
  // But we can still try: build a minimal input from WO data alone
  if (!input) {
    for (const key of comboKeys) {
      const woEntries = woJobs[key];
      if (woEntries && woEntries.length > 0) {
        const laborValues = removeOutliers(woEntries.map(e => e.l));
        const avgLabor = laborValues.length > 0 ? avg(laborValues) : 0;
        const laborStdDev = laborValues.length > 0 ? Math.sqrt(laborValues.map(x => (x - avgLabor) ** 2).reduce((a, b) => a + b, 0) / laborValues.length) : 0;
        input = { jobKey: key, avgLabor, laborStdDev, parts: [] };
        inputKey = key;
        break;
      }
    }
  }

  if (!input) return null;

  // Find similar combos (min score 50)
  const candidates = [...similarityIndex.values()];
  const allSimilar = findSimilarCombos(input, candidates, 20, 50);

  // Eligibility check: 3+ matches at score >= 50 OR 1+ at score > 75
  const qualifying = allSimilar.filter(s => s.overallScore >= 50);
  const hasHighMatch = allSimilar.some(s => s.overallScore > 75);
  if (qualifying.length < 3 && !hasHighMatch) return null;

  // --- Parts pricing ---
  let avgParts = 0;
  let partsRepriced = false;
  let partsFallbackToHistorical = false;
  let partsListSource: string | undefined;

  // Try partsData from the most-similar combo, walking down the list
  for (const sim of allSimilar) {
    if (partsData[sim.matchKey]) {
      avgParts = Math.round(computePartsFromCatalog(partsData[sim.matchKey]));
      partsRepriced = true;
      partsListSource = sim.matchKey;
      break;
    }
  }
  if (!partsRepriced) {
    // Fallback: use average parts from similar combos' SimilarityInput
    const simWithParts = allSimilar
      .map(s => similarityIndex.get(s.matchKey))
      .filter((si): si is SimilarityInput => !!si && (si.avgParts ?? 0) > 0);
    if (simWithParts.length > 0) {
      avgParts = Math.round(avg(simWithParts.map(si => si.avgParts!)));
    }
    partsFallbackToHistorical = true;
  }

  // --- Labor and Misc: similarity-and-recency weighted average ---
  const usedForPricing: SimilarityResult[] = [];
  const laborVals: number[] = [];
  const miscVals: number[] = [];
  const combinedWeights: number[] = [];

  for (const sim of qualifying) {
    const simInput = similarityIndex.get(sim.matchKey);
    if (!simInput) continue;

    const simLabor = simInput.avgLabor ?? 0;
    const simMisc = simInput.avgMisc ?? 0;
    const simDate = simInput.mostRecentDate;

    const monthsAgo = simDate ? computeMonthsAgo(simDate, now) : 36;
    const recencyWeight = 1 / (1 + monthsAgo); // Tier 3 uses divisor=1
    const similarityScore = sim.overallScore / 100;
    const combined = similarityScore * recencyWeight;

    laborVals.push(simLabor);
    miscVals.push(simMisc);
    combinedWeights.push(combined);
    usedForPricing.push(sim);
  }

  const avgLabor = Math.round(weightedAverage(laborVals, combinedWeights));
  const avgMisc = Math.round(weightedAverage(miscVals, combinedWeights));
  const avgTotal = avgParts + avgLabor + avgMisc;

  // --- Confidence scoring (capped at MEDIUM = 65) ---
  const topMatch = allSimilar[0]?.overallScore ?? 0;
  const top3 = allSimilar.slice(0, 3);
  const top3Avg = top3.length > 0 ? avg(top3.map(s => s.overallScore)) : 0;

  // Cost agreement: stddev of totals across qualifying combos < 20% of their mean
  const simTotals = qualifying.map(s => {
    const si = similarityIndex.get(s.matchKey);
    return si ? (si.avgParts ?? 0) + (si.avgLabor ?? 0) + (si.avgMisc ?? 0) : 0;
  }).filter(t => t > 0);
  const simTotalMean = avg(simTotals);
  const simTotalStd = stdDev(simTotals);
  const costAgreement = simTotalMean > 0 ? simTotalStd / simTotalMean < 0.2 : false;

  let confidenceScore: number;
  if (topMatch > 80 && top3Avg > 70 && costAgreement) {
    confidenceScore = 65;
  } else if (topMatch > 70 && top3Avg > 60) {
    confidenceScore = 55;
  } else if (topMatch > 60 && qualifying.length >= 3) {
    confidenceScore = 45;
  } else {
    confidenceScore = 30;
  }

  const confidence = getConfidenceLevel(confidenceScore);

  // Duration: from similar combos' WO data
  const simDurations: number[] = [];
  for (const sim of qualifying.slice(0, 5)) {
    const woEntries = woJobs[sim.matchKey];
    if (woEntries) {
      simDurations.push(...woEntries.map(e => e.d));
    }
  }
  const avgDuration = simDurations.length > 0 ? Math.round(avg(simDurations) * 10) / 10 : 0;
  const lowDuration = simDurations.length > 0 ? Math.round(Math.min(...simDurations) * 10) / 10 : 0;
  const highDuration = simDurations.length > 0 ? Math.round(Math.max(...simDurations) * 10) / 10 : 0;

  // Low/High total from similar combos
  const allSimTotals = simTotals.length > 0 ? simTotals : [avgTotal];

  return {
    tier: 3,
    source: 'similarity',
    avgParts,
    avgLabor,
    avgMisc,
    avgTotal,
    lowTotal: Math.round(Math.min(...allSimTotals)),
    highTotal: Math.round(Math.max(...allSimTotals)),
    avgDuration,
    lowDuration,
    highDuration,
    confidence,
    confidenceScore,
    confidenceBreakdown: { baseScore: confidenceScore, cvAdjustment: 0, similarityAdjustment: 0, finalBeforeClamp: confidenceScore },
    count: qualifying.length,
    stdDev: Math.round(simTotalStd),
    entries: [],
    similarCombos: allSimilar.slice(0, 5),
    similarCombosUsedForPricing: usedForPricing,
    partsListSource,
    deviationWarning: false,
    tierOverride: false,
    partsRepriced,
    partsFallbackToHistorical,
  };
}

// ============================================
// SIMILARITY CORROBORATION (for Tier 2)
// ============================================

function computeSimilarityCorroboration(
  quotedTotal: number,
  similarityIndex: Map<string, SimilarityInput>,
  comboKeys: string[],
  woEntries?: WoEntry[]
): number {
  const similarCombos = getSimilarCombosForCorroboration(similarityIndex, comboKeys, woEntries);

  // Need 3+ combos with score > 70
  const highScoreCombos = similarCombos.filter(s => s.overallScore > 70);
  if (highScoreCombos.length < 3) return 0;

  // Compute average total of those similar combos
  const simTotals: number[] = [];
  for (const sim of highScoreCombos) {
    const simInput = similarityIndex.get(sim.matchKey);
    if (simInput) {
      const simTotal = (simInput.avgParts ?? 0) + (simInput.avgLabor ?? 0) + (simInput.avgMisc ?? 0);
      if (simTotal > 0) simTotals.push(simTotal);
    }
  }

  if (simTotals.length < 3) return 0;

  const simAvgTotal = avg(simTotals);
  if (simAvgTotal === 0 || quotedTotal === 0) return 0;

  const deviation = Math.abs(quotedTotal - simAvgTotal) / quotedTotal;

  if (deviation <= 0.2) return 10;   // Within 20% — strong corroboration
  if (deviation <= 0.3) return 5;    // Within 30% — moderate corroboration
  if (deviation > 0.4) return -10;   // Deviates > 40% — contradiction

  return 0; // Between 30-40% — no adjustment
}

/**
 * Resolve a SimilarityInput for the given comboKeys.
 * First tries the index; if not found, builds one on-the-fly from WO entries.
 */
function resolveInput(
  similarityIndex: Map<string, SimilarityInput>,
  comboKeys: string[],
  woEntries?: WoEntry[]
): SimilarityInput | null {
  // Try index first
  for (const key of comboKeys) {
    const input = similarityIndex.get(key);
    if (input) return input;
  }

  // Build on-the-fly from WO entries (for model group aggregation cases)
  if (woEntries && woEntries.length > 0) {
    const laborValues = woEntries.map(e => e.l);
    const avgLabor = laborValues.reduce((a, b) => a + b, 0) / laborValues.length;
    const laborStdDev = Math.sqrt(
      laborValues.map(x => (x - avgLabor) ** 2).reduce((a, b) => a + b, 0) / laborValues.length
    );
    return {
      jobKey: comboKeys[0],
      avgLabor,
      laborStdDev,
      parts: [],
      avgMisc: woEntries.reduce((s, e) => s + e.m, 0) / woEntries.length,
      avgParts: woEntries.reduce((s, e) => s + e.p, 0) / woEntries.length,
      woCount: woEntries.length,
    };
  }

  return null;
}

/**
 * Get top 5 similar combos with min score 50 for similarity corroboration.
 */
function getSimilarCombosForCorroboration(
  similarityIndex: Map<string, SimilarityInput>,
  comboKeys: string[],
  woEntries?: WoEntry[]
): SimilarityResult[] {
  const input = resolveInput(similarityIndex, comboKeys, woEntries);
  if (!input) return [];

  const candidates = [...similarityIndex.values()];
  return findSimilarCombos(input, candidates, 5, 50);
}

/**
 * Get similar combos for display (broader search for UI).
 */
function getSimilarCombosForDisplay(
  similarityIndex: Map<string, SimilarityInput>,
  comboKeys: string[],
  woEntries?: WoEntry[]
): SimilarityResult[] {
  const input = resolveInput(similarityIndex, comboKeys, woEntries);
  if (!input) return [];

  const candidates = [...similarityIndex.values()];
  return findSimilarCombos(input, candidates, 5, 15);
}

// ============================================
// MAIN ENTRY POINT
// ============================================

export function generateQuoteResult(
  stjEntries: WoEntry[],
  woEntries: WoEntry[],
  partsData: PartsIndex,
  similarityIndex: Map<string, SimilarityInput>,
  comboKeys: string[],
  woJobs: Record<string, WoEntry[]>,
  currentDate?: Date
): QuoteResult | null {
  const now = currentDate ?? new Date();

  // Tier 1: STJ exists
  if (stjEntries.length > 0) {
    return computeTier1Quote(stjEntries);
  }

  // Tier 2: Exact WO match
  if (woEntries.length > 0) {
    const tier2Result = computeTier2Quote(woEntries, partsData, similarityIndex, comboKeys, woJobs, now);

    // Tier Override: if Tier 2 confidence < 35, try Tier 3
    if (tier2Result.confidenceScore < 35) {
      const tier3Result = computeTier3Quote(similarityIndex, comboKeys, partsData, woJobs, now);
      if (tier3Result && tier3Result.confidenceScore >= 45) {
        return {
          ...tier3Result,
          tierOverride: true,
          tierOverrideNote: 'Estimate based on similar jobs. Exact work order history for this combination was available but inconsistent — similar job data provided a more reliable basis.',
          // Keep the original WO entries for reference
          entries: woEntries,
        };
      }
    }

    return tier2Result;
  }

  // Tier 3: No exact match — similarity-driven estimate
  const tier3Result = computeTier3Quote(similarityIndex, comboKeys, partsData, woJobs, now);
  return tier3Result;
}
