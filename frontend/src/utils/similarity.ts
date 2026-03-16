/**
 * Similarity Scoring Module
 *
 * Computes similarity between work order combos using parts data
 * joined from Milton Parts on Service Calls.
 *
 * Scoring dimensions (per Tim Dailey, Feb 2026):
 * 1. Parts overlap: Jaccard similarity of parts used
 * 2. Parts quantity correlation: How similar are the quantities?
 * 3. Labor cost proximity: How close are avg labor costs?
 * 4. Labor variability: Are the cost distributions similar?
 * 5. Outlier-adjusted: Remove statistical outliers before comparison
 */

// Compact parts format matching partsData.json
export interface PartEntry {
  pn: string;   // part number
  qty: number;  // quantity
  cost: number; // cost price
  price: number; // sales price
  cat: string;   // line category group
}

// Parts data indexed by job key (model|sp|jobCode|compCode)
export type PartsIndex = Record<string, PartEntry[]>;

export interface SimilarityInput {
  jobKey: string;
  avgLabor: number;
  laborStdDev: number;
  parts: PartEntry[];
}

export interface SimilarityResult {
  matchKey: string;
  overallScore: number;          // 0-100
  partsOverlap: number;          // Jaccard coefficient 0-1
  partsQuantityCorrelation: number; // 0-1, Pearson-like
  laborProximity: number;        // 0-1, 1 = identical
  laborVariability: number;      // 0-1, 1 = same distribution
  matchedPartsCount: number;
  totalPartsA: number;
  totalPartsB: number;
  explanation: string;
}

/**
 * Compute Jaccard similarity between two part sets by part number.
 */
export function computePartsOverlap(a: PartEntry[], b: PartEntry[]): number {
  const setA = new Set(a.map(p => p.pn));
  const setB = new Set(b.map(p => p.pn));
  const intersection = [...setA].filter(x => setB.has(x));
  const unionSize = new Set([...setA, ...setB]).size;
  return unionSize === 0 ? 0 : intersection.length / unionSize;
}

/**
 * Compute quantity correlation for shared parts.
 * Returns 0-1 where 1 means perfectly correlated quantities.
 */
export function computeQuantityCorrelation(a: PartEntry[], b: PartEntry[]): number {
  const mapA = new Map(a.map(p => [p.pn, p.qty]));
  const mapB = new Map(b.map(p => [p.pn, p.qty]));

  const sharedParts = [...mapA.keys()].filter(pn => mapB.has(pn));
  if (sharedParts.length === 0) return 0;

  // Use ratio-based similarity: min(qA, qB) / max(qA, qB) averaged
  let totalSim = 0;
  for (const pn of sharedParts) {
    const qA = Math.abs(mapA.get(pn)!);
    const qB = Math.abs(mapB.get(pn)!);
    if (qA === 0 && qB === 0) {
      totalSim += 1;
    } else {
      totalSim += Math.min(qA, qB) / Math.max(qA, qB);
    }
  }
  return totalSim / sharedParts.length;
}

/**
 * Compute labor cost proximity (0-1, 1 = identical).
 * Uses exponential decay based on relative difference.
 */
export function computeLaborProximity(avgA: number, avgB: number): number {
  if (avgA === 0 && avgB === 0) return 1;
  const maxVal = Math.max(Math.abs(avgA), Math.abs(avgB));
  if (maxVal === 0) return 1;
  const relDiff = Math.abs(avgA - avgB) / maxVal;
  return Math.exp(-2 * relDiff); // e^(-2x): smooth decay
}

/**
 * Compute labor variability similarity (0-1, 1 = same distribution).
 * Compares coefficient of variation (CV).
 */
export function computeLaborVariability(
  avgA: number, stdA: number,
  avgB: number, stdB: number
): number {
  const cvA = avgA > 0 ? stdA / avgA : 0;
  const cvB = avgB > 0 ? stdB / avgB : 0;
  const cvDiff = Math.abs(cvA - cvB);
  return Math.exp(-3 * cvDiff); // Sharper decay for variability
}

/**
 * Remove statistical outliers using IQR method.
 */
export function removeOutliers(values: number[]): number[] {
  if (values.length < 4) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return values.filter(v => v >= lower && v <= upper);
}

/**
 * Aggregate parts for a job key: deduplicate by part number,
 * summing quantities and averaging costs.
 */
export function aggregateParts(parts: PartEntry[]): PartEntry[] {
  const map = new Map<string, { qty: number; cost: number; price: number; cat: string; count: number }>();
  for (const p of parts) {
    const existing = map.get(p.pn);
    if (existing) {
      existing.qty += p.qty;
      existing.cost += p.cost;
      existing.price += p.price;
      existing.count++;
    } else {
      map.set(p.pn, { qty: p.qty, cost: p.cost, price: p.price, cat: p.cat, count: 1 });
    }
  }
  return [...map.entries()].map(([pn, v]) => ({
    pn,
    qty: v.qty,
    cost: v.cost / v.count,
    price: v.price / v.count,
    cat: v.cat,
  }));
}

// Weights for each scoring dimension
const WEIGHTS = {
  partsOverlap: 0.35,
  partsQuantity: 0.20,
  laborProximity: 0.25,
  laborVariability: 0.20,
};

/**
 * Compute similarity between two combos.
 */
export function computeSimilarity(
  a: SimilarityInput,
  b: SimilarityInput
): SimilarityResult {
  const partsA = aggregateParts(a.parts);
  const partsB = aggregateParts(b.parts);

  const partsOverlap = computePartsOverlap(partsA, partsB);
  const partsQuantityCorrelation = computeQuantityCorrelation(partsA, partsB);
  const laborProximity = computeLaborProximity(a.avgLabor, b.avgLabor);
  const laborVariability = computeLaborVariability(
    a.avgLabor, a.laborStdDev,
    b.avgLabor, b.laborStdDev
  );

  const overallScore = Math.round(
    (WEIGHTS.partsOverlap * partsOverlap +
     WEIGHTS.partsQuantity * partsQuantityCorrelation +
     WEIGHTS.laborProximity * laborProximity +
     WEIGHTS.laborVariability * laborVariability) * 100
  );

  const matchedCount = (() => {
    const setA = new Set(partsA.map(p => p.pn));
    return partsB.filter(p => setA.has(p.pn)).length;
  })();

  const explanation = buildExplanation(overallScore, partsOverlap, partsQuantityCorrelation, laborProximity, laborVariability, matchedCount);

  return {
    matchKey: b.jobKey,
    overallScore,
    partsOverlap,
    partsQuantityCorrelation,
    laborProximity,
    laborVariability,
    matchedPartsCount: matchedCount,
    totalPartsA: partsA.length,
    totalPartsB: partsB.length,
    explanation,
  };
}

function buildExplanation(
  overall: number,
  overlap: number,
  qtyCorr: number,
  laborProx: number,
  laborVar: number,
  matchedParts: number
): string {
  const parts: string[] = [];

  if (overlap >= 0.7) parts.push(`Strong parts overlap (${matchedParts} shared parts)`);
  else if (overlap >= 0.3) parts.push(`Moderate parts overlap (${matchedParts} shared parts)`);
  else if (overlap > 0) parts.push(`Low parts overlap (${matchedParts} shared parts)`);
  else parts.push('No shared parts');

  if (qtyCorr >= 0.8) parts.push('similar quantities');
  else if (qtyCorr >= 0.4) parts.push('somewhat similar quantities');

  if (laborProx >= 0.8) parts.push('close labor costs');
  else if (laborProx >= 0.5) parts.push('moderate labor cost difference');
  else parts.push('different labor costs');

  if (laborVar >= 0.8) parts.push('consistent variability');

  const level = overall >= 70 ? 'High' : overall >= 40 ? 'Moderate' : 'Low';
  return `${level} similarity: ${parts.join(', ')}`;
}

/**
 * Find similar combos for a given input from a list of candidates.
 * Returns top matches sorted by overall score (descending).
 */
export function findSimilarCombos(
  input: SimilarityInput,
  candidates: SimilarityInput[],
  maxResults: number = 10,
  minScore: number = 10
): SimilarityResult[] {
  const results: SimilarityResult[] = [];

  for (const candidate of candidates) {
    if (candidate.jobKey === input.jobKey) continue;
    const result = computeSimilarity(input, candidate);
    if (result.overallScore >= minScore) {
      results.push(result);
    }
  }

  return results
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, maxResults);
}

/**
 * Build a similarity index for all job keys that have parts data.
 * Returns a map of jobKey -> SimilarityInput for use with findSimilarCombos.
 */
export function buildSimilarityIndex(
  partsIndex: PartsIndex,
  woJobs: Record<string, Array<{ l: number }>>
): Map<string, SimilarityInput> {
  const index = new Map<string, SimilarityInput>();

  for (const [jobKey, parts] of Object.entries(partsIndex)) {
    const woEntries = woJobs[jobKey];
    let avgLabor = 0;
    let laborStdDev = 0;

    if (woEntries && woEntries.length > 0) {
      const laborValues = removeOutliers(woEntries.map(e => e.l));
      if (laborValues.length > 0) {
        avgLabor = laborValues.reduce((a, b) => a + b, 0) / laborValues.length;
        laborStdDev = Math.sqrt(
          laborValues.map(x => (x - avgLabor) ** 2).reduce((a, b) => a + b, 0) / laborValues.length
        );
      }
    }

    index.set(jobKey, {
      jobKey,
      avgLabor,
      laborStdDev,
      parts,
    });
  }

  return index;
}
