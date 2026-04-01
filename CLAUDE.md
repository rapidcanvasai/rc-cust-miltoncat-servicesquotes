# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Service Quotes tool for MiltonCAT — generates equipment service pricing estimates using a 3-tier quote engine. React/TypeScript frontend deployed to RapidCanvas cloud platform.

## Commands

```bash
# Frontend development
cd frontend && npm run dev      # Vite dev server on port 8080
cd frontend && npm run build    # Production build
cd frontend && npm run lint     # ESLint
cd frontend && npm run preview  # Preview production build

# Deploy frontend to RapidCanvas (requires RAPIDCANVAS_API_KEY in .env)
bash infra/deploy-frontend.sh          # Deploy to dev (default)
bash infra/deploy-frontend.sh dev      # Deploy to dev (explicit)
bash infra/deploy-frontend.sh prod     # Deploy to production

# Data transformation (Python)
python scripts/transform_standardjobs.py
python scripts/transform_workorders.py
```

## Architecture

### Quote Engine (3-Tier Waterfall)

The core logic lives in `frontend/src/utils/quoteEngine.ts`:

- **Tier 1 (STJ):** Exact match from standard job pricing — always 100% confidence
- **Tier 2 (Work Order):** Historical work order match with recency weighting and CV-based confidence adjustments
- **Tier 3 (Similarity):** ML-style similarity scoring when no exact match exists, using parts overlap, labor proximity, and outlier filtering
- **Tier Override:** Tier 2 promotes to Tier 3 when confidence < 35%

Confidence formula: base score + CV adjustment + similarity corroboration (clamped 15-100). Recency weighting: `1/(1 + monthsAgo/divisor)`.

### Data Flow

1. Source Excel files in `/data/` are transformed by Python scripts in `/scripts/`
2. Output JSON files land in `frontend/src/data/` (standardJobs.json, workOrders.json, partsData.json)
3. App.tsx imports JSON at module level, applies filters (zero-priced, misc-only)
4. Quote engine processes filtered data with pipe-delimited keys: `model|serialPrefix|jobCode|compCode`

### Key Utilities

- `similarity.ts` — 5-dimension scoring: parts Jaccard overlap, quantity correlation, labor proximity (exponential decay), labor CV comparison, IQR outlier adjustment
- `modelGrouping.ts` — CAT model normalization (strips roman numerals, numeric suffixes; preserves alpha variants like GC/XE)
- `dataQuality.ts` — Per-field completeness, uniqueness, IQR outlier detection
- `forecast.ts` — Simple moving average projection

### Auth & Embedding

App runs inside RapidCanvas iframe. Auth flow: `Providers` → `RCAuthProvider` (token validation) → `SecuredApp` (DataApp config) → `App`. Tokens from localStorage, query params, or parent postMessage bridge (`parentBridge.ts`). Dev mode: set `VITE_DEV_TOKEN` for localhost.

### Infrastructure

Deploy scripts in `infra/` interact with RapidCanvas API (signed URL upload, app template rebuild, dataapp launch). Environment-specific config files in `infra/.rapidcanvas.{dev,prod}` map DataApp and FastAPI IDs per environment. Default environment is `dev`. Backend (FastAPI) is optional for frontend-only deploys.

## Tech Stack

React 18 + TypeScript, Vite, TailwindCSS, Recharts, Axios + TanStack React Query, Lodash. No Redux — local component state + React Query for server state.
