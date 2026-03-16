# Quote Generation & Confidence Scoring Specification

**Date:** March 13, 2026

---

## 1. Executive Summary

The quoting system generates cost estimates for service job combinations (model + serial prefix + job code + comp code) using a three-tier waterfall. Each tier uses a different data source, pricing method, and confidence level. Similarity scoring — which measures how alike two job combinations are based on parts, quantities, and labor history — plays an increasing role as the system moves down the tiers from authoritative data to estimated data.

### Tier Overview

| Tier | Condition | Data Source | Confidence Range |
|------|-----------|-------------|------------------|
| **1** | Standard Job (STJ) exists | STJ reference pricing | Always 100% (HIGH) |
| **2** | Exact WO match(es) | Work orders + current parts pricing | 15 - 100 (unified formula based on count, variance, similarity corroboration) |
| **3** | No exact match available | Similar combos + current parts pricing | Capped at MEDIUM (based on similarity quality) |

The system always evaluates from Tier 1 downward and stops at the first tier that produces a result. An automatic **tier override** can promote a Tier 2 quote to Tier 3 when exact WO data is too unreliable and similarity data is stronger (see Section 4.4).

---

## 2. Similarity Scoring Algorithm

Similarity scoring compares two job combinations across four weighted dimensions. The output is a score from 0 to 100.

### 2.1 Scoring Dimensions

| Dimension | Weight | What It Measures | Method |
|-----------|--------|------------------|--------|
| **Parts Overlap** | 35% | Do these jobs use the same parts? | Jaccard similarity: (shared part numbers) / (total unique part numbers across both) |
| **Quantity Correlation** | 20% | When parts are shared, are quantities similar? | For each shared part: min(qtyA, qtyB) / max(qtyA, qtyB), averaged across all shared parts |
| **Labor Proximity** | 25% | Are average labor costs close? | Exponential decay on relative difference: e^(-2 * \|avgA - avgB\| / max(avgA, avgB)) |
| **Labor Variability** | 20% | Are labor cost distributions similar? | Compares coefficient of variation (stdDev/mean) with decay: e^(-3 * \|cvA - cvB\|) |

### 2.2 Overall Score Formula

```
overallScore = round(
  (0.35 * partsOverlap +
   0.20 * quantityCorrelation +
   0.25 * laborProximity +
   0.20 * laborVariability) * 100
)
```

All sub-scores range from 0 to 1. The final overall score ranges from 0 to 100.

### 2.3 Data Preprocessing

- **Part aggregation:** Parts are deduplicated by part number per combo; quantities are summed and costs are averaged across duplicates.
- **Outlier removal:** Labor values are filtered using the IQR method (values outside Q1 - 1.5*IQR to Q3 + 1.5*IQR are removed) before computing averages and standard deviations. Requires at least 4 records to apply.

### 2.4 Score Interpretation

| Score Range | Label | Meaning |
|-------------|-------|---------|
| 70 - 100 | High | Strong structural match — similar parts, quantities, and labor profile |
| 40 - 69 | Moderate | Partial overlap — some shared characteristics but meaningful differences |
| 0 - 39 | Low | Weak match — limited commonality |

---

## 3. Tier 1: Standard Job (STJ)

### When It Applies
An STJ record exists for the requested combination (model + serial prefix + job code + comp code).

### Pricing Method
- **Parts, Labor, Misc:** Use STJ reference values directly (simple average if multiple STJ records exist).
- STJ values are considered authoritative — they are pre-approved flat-rate prices.

### Confidence
- **Always 100% (HIGH).**
- STJs are curated reference data. The confidence score does not vary regardless of how many STJ records exist.

### Similarity Role
- **None.** Similarity is not computed or displayed for STJ-sourced quotes. The data is authoritative and does not require corroboration.

---

## 4. Tier 2: Exact Work Order Match

### When It Applies
- No STJ exists for the combination.
- One or more work orders exist for this exact combination.

This is a unified tier — whether there is 1 WO or 50, the same pricing and confidence formulas apply. The formulas naturally produce appropriate results for any count.

### 4.1 Pricing Method

#### Parts
Use the most recent per-unit price from parts reference data, multiplied by the historically observed quantities (averaged across WOs if multiple exist). This decouples the quote from stale historical part pricing while using WO history to determine what parts and how many are typically needed.

For a single WO, the quantities from that WO are used directly.

#### Labor and Misc
Use a **recency-weighted average** of all exact-match work orders, after outlier removal.

**Recency weight formula:**
```
weight(wo) = 1 / (1 + monthsAgo / 6)
```

Where `monthsAgo` is the number of months between the work order date and today.

**Effect:** A work order from 1 month ago receives ~4x the influence of a work order from 24 months ago. A 12-month-old WO retains ~1/3 of the weight of a brand-new WO. This provides a gentler decay that keeps older data relevant while still favoring recent conditions. For a single WO, the weighted average is simply that WO's value — no special case needed.

| Age of WO | Weight | Relative to 1-month-old |
|-----------|--------|------------------------|
| 1 month | 0.86 | 1.0x |
| 6 months | 0.50 | 0.58x |
| 12 months | 0.33 | 0.39x |
| 18 months | 0.25 | 0.29x |
| 24 months | 0.20 | 0.23x |

**Outlier removal** (IQR method) is applied before weighting to exclude anomalous records (rush jobs, warranty concessions, training scenarios, etc.). Requires at least 4 records to apply.

**Recency-weighted average formula:**
```
weightedAvg = sum(value_i * weight_i) / sum(weight_i)
```

### 4.2 Deviation Sanity Check (UI Flag)

When count >= 5, compare the recency-weighted average against the **median** of all values in the window. If the weighted average deviates from the median by more than 30%, surface a **UI warning** on the quote:

> *"Recent pricing trend diverges from historical median."*

This is a **visual flag only** — it does not adjust the confidence score. Its purpose is to alert the user that recent WOs are trending differently from the historical center, so they can exercise judgment. The quoted value remains the recency-weighted average (which reflects the most current conditions).

**Why a flag and not a score penalty:** The CV adjustment (Step 2 below) already captures data inconsistency in the confidence score. The deviation check detects a different signal — directional pricing trends — which is informational rather than a reliability concern. Stacking both as score penalties would double-penalize the same underlying data condition.

### 4.3 Confidence Scoring

Confidence is determined by three factors applied in sequence: **record count**, **data consistency**, and **similarity corroboration**.

#### Step 1: Base Score from Record Count

| WO Count | Base Score |
|----------|------------|
| 1 | 30 |
| 2 | 40 |
| 3 - 5 | 55 |
| 6 - 10 | 65 |
| 11 - 20 | 72 |
| 21+ | 80 |

This reflects the fundamental statistical principle that more data points produce more reliable estimates.

#### Step 2: Data Consistency Adjustment (CV)

**Only applies when count >= 4.** Below 4 records, variance metrics are not statistically meaningful and would add noise rather than signal.

CV = standard deviation / mean of total costs (parts + labor + misc).

| CV | Adjustment |
|----|------------|
| > 0.5 | -20 points (high variance — pricing is inconsistent) |
| 0.3 - 0.5 | -10 points (moderate variance) |
| < 0.3 | No adjustment |

**Note:** There is intentionally no bonus for low CV. The base score from Step 1 already reflects having sufficient data — an additional bonus for low variance would double-reward the same underlying condition (lots of consistent data).

#### Step 3: Similarity Corroboration Adjustment

**Applies at all counts, including count = 1.** This is especially valuable for single-WO scenarios where there is no internal data to validate against — external corroboration from similar combos is the only available signal.

1. Retrieve the top 5 similar combos (minimum similarity score of 50).
2. Compare the quoted total (from exact WO data) against the average total of the similar combos.
3. Apply adjustment:

| Condition | Adjustment | Rationale |
|-----------|------------|-----------|
| 3+ similar combos score > 70 AND avg total within 20% of quote | +10 points | Strong corroboration — similar jobs agree on pricing |
| 3+ similar combos score > 70 AND avg total within 30% of quote | +5 points | Moderate corroboration — similar jobs roughly agree |
| 3+ similar combos score > 70 AND avg total deviates > 40% from quote | -10 points | Warning — similar jobs suggest different pricing |
| Fewer than 3 similar combos above 50 | No adjustment | Insufficient similar data to corroborate |

**Examples of how this plays out:**
- 1 WO + strong corroboration: 30 + 10 = 40 (LOW, but meaningfully better than 30)
- 1 WO + contradiction from similar combos: 30 - 10 = 20 (LOW, flags unreliability)
- 2 WOs + strong corroboration: 40 + 10 = 50 (LOW, approaching MEDIUM)
- 8 WOs, low CV, strong corroboration: 65 + 10 = 75 (MEDIUM)
- 5 WOs, high CV, contradiction: 55 - 20 - 10 = 25 (LOW — tier override candidate)

#### Step 4: Final Confidence Level

| Final Score | Level |
|-------------|-------|
| >= 85 | HIGH |
| 60 - 84 | MEDIUM |
| < 60 | LOW |

Score is clamped to the range [15, 100].

### 4.4 Tier Override Rule

In rare cases, exact WO data may be so unreliable that a similarity-driven estimate would be more trustworthy. Rather than showing two competing estimates (which creates decision paralysis), the system automatically promotes the quote to Tier 3 when this occurs.

**Rule:** If Tier 2 final confidence score is **< 35** AND a Tier 3 similarity-driven estimate would produce confidence **>= 45**, the system uses the Tier 3 estimate instead.

The quote card includes an explanatory note:

> *"Estimate based on similar jobs. Exact work order history for this combination was available but inconsistent — similar job data provided a more reliable basis."*

**When this triggers:** The < 35 threshold means the override requires a genuinely bad-data scenario — for example:
- 1 WO contradicted by similar combos (30 - 10 = 20)
- 2 WOs contradicted by similar combos (40 - 10 = 30)
- 4-5 WOs with high CV and similarity contradiction (55 - 20 - 10 = 25)
- 1 WO with no similar data available for corroboration (30, just under threshold — Tier 3 only takes over if it can produce a quote meeting the >= 45 confidence requirement; otherwise the single-WO quote stands)

This is not a borderline case — it's a clear signal that the exact data cannot be trusted.

---

## 5. Tier 3: No Exact Match — Similarity-Driven Estimate

### When It Applies
- No STJ exists for the combination.
- No exact work order match exists.
- OR: Tier 2 triggered the tier override rule (Section 4.4).

### 5.1 Eligibility Check

Before generating a Tier 3 quote, validate that sufficient similar data exists:
- Retrieve similar combos with a **minimum similarity score of 50** (moderate or better).
- Require at least **3 qualifying matches**, OR at least **1 match with similarity score > 75**.
- If the eligibility check fails, do not generate a quote. Display: *"Insufficient data to generate an estimate for this combination."*

### 5.2 Pricing Method

#### Parts
Use the most recent per-unit price from parts reference data. Determine which parts and quantities to include based on the most similar combo's parts list (highest similarity score), or a consensus across the top matches if parts lists are consistent.

#### Labor and Misc
Use a **similarity-and-recency-weighted average** from qualifying similar combos.

**Combined weight formula:**
```
combinedWeight(combo) = similarityScore * recencyWeight
```

Where:
- `similarityScore` is the 0-1 overall similarity score for that combo
- `recencyWeight = 1 / (1 + monthsAgo)` using the most recent WO date for that combo

**Weighted estimate formula:**
```
estimatedLabor = sum(labor_i * combinedWeight_i) / sum(combinedWeight_i)
estimatedMisc  = sum(misc_i * combinedWeight_i) / sum(combinedWeight_i)
```

This ensures that a highly-similar recent combo has far more influence than a moderately-similar old combo.

### 5.3 Confidence Scoring

Tier 3 confidence is **capped at MEDIUM** and driven by the quality of the similar matches.

| Condition | Score | Level |
|-----------|-------|-------|
| Top match > 80 AND top 3 avg > 70 AND cost agreement within 20% | 65 | MEDIUM |
| Top match > 70 AND top 3 avg > 60 | 55 | LOW |
| Top match > 60 AND at least 3 matches > 50 | 45 | LOW |
| Minimum eligibility met but weak matches | 30 | LOW |

"Cost agreement" means the standard deviation of total costs across the qualifying similar combos is less than 20% of their mean — i.e., the similar jobs broadly agree on what this type of work costs.

### 5.4 UI Labeling

Tier 3 quotes must be visually distinct from Tier 1 and Tier 2 quotes:
- Label: **"Estimate Based on Similar Jobs"** (not "Quote")
- Display the top similar combos used, with their similarity scores
- Show which tier produced the result (e.g., a subtle badge or footnote)
- If triggered by the tier override rule, include the explanatory note from Section 4.4

---

## 6. Data Requirements

### Parts Pricing
- **Current per-unit part prices** must be available in the parts reference data for Tiers 2 and 3.
- The parts reference data (`partsData.json`) should reflect the most recent known pricing. If this data is itself stale, part cost estimates will be stale regardless of tier.

---

## 7. Decision Flowchart

```
User selects: Model + Serial Prefix + Job Code + Comp Code
                              |
                       STJ data exists?
                        /          \
                      YES           NO
                       |             |
                  TIER 1: STJ    Exact WO(s)?
                  100% HIGH       /              \
                                YES               NO
                                 |                 |
                            TIER 2: WO        Similar combos
                            Run confidence     meet eligibility?
                            formula             /          \
                                 |            YES           NO
                                 |             |             |
                          Score < 35 AND   TIER 3:      "Insufficient
                          Tier 3 >= 45?    Similarity     data"
                           /        \      Estimate
                         YES         NO    Capped MEDIUM
                          |           |
                     TIER 3:     Use Tier 2
                     Override    result as-is
```

---

## 8. Summary of Changes from Current System

| Aspect | Current Behavior | Proposed Behavior |
|--------|-----------------|-------------------|
| Tier structure | 4 tiers (STJ, single WO, multi WO, no match) | 3 tiers (STJ, exact WO, similarity estimate) |
| STJ confidence | Tiered (88-100) based on count | Always 100% |
| WO pricing (parts) | Historical WO part costs (avg of non-zero) | Current per-unit price from parts reference data |
| WO pricing (labor/misc) | Simple average of non-zero values | Recency-weighted average (IQR-filtered) |
| WO confidence formula | 4 steps (count + CV + similarity ±5 + deviation check) | 3 steps (count + CV±20 when count>=4 + similarity ±10) |
| CV low-variance bonus | +5 for CV < 0.2 AND count >= 10 | Removed (was double-counting) |
| Deviation sanity check | Score penalty | UI flag only (avoids overlap with CV adjustment) |
| Similarity corroboration | ±5 points, only for multi-WO | ±10 points with gradient, applies at all WO counts |
| Similarity influence on price | None | Tier 3: drives the entire estimate |
| No-match scenario | No quote generated | Tier 3: estimated quote from similar combos (if sufficient matches) |
| Unreliable exact data | Locked into bad estimate | Tier override: auto-promotes to Tier 3 when WO confidence < 35 and Tier 3 >= 45 |

---

## 9. Open Questions

1. **Tier 3 minimum thresholds:** The proposed minimums (similarity > 50, at least 3 matches or 1 match > 75) need validation against real data. The data science team should analyze the distribution of similarity scores across the dataset to calibrate these thresholds.
2. **Parts list for Tier 3:** When multiple similar combos have different parts lists, should we use the highest-similarity combo's parts, or attempt a consensus/union? This affects what gets quoted to the customer.
3. **Tier override threshold calibration:** The proposed thresholds (Tier 2 < 35 AND Tier 3 >= 45) need validation. The data science team should analyze how often this override would trigger across the current dataset and verify it catches the right cases.
