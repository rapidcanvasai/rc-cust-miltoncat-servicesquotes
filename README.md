# MiltonCAT Service Quotes

Pricing estimation tool for CAT equipment services. Uses a 3-tier quote engine that combines Standard Jobs data, historical Work Orders, and equipment similarity scoring to generate estimates with a confidence score.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

The development server runs at `http://localhost:8080`.

## How It Works

### Quote Engine (3 Tiers)

| Tier | Source | Confidence | When used |
|------|--------|------------|-----------|
| **1 - Standard Job** | Standard price catalog | 100% | Exact match on model + job + component |
| **2 - Work Order** | Historical service orders | Variable (based on CV and recency) | Exact match when no STJ is available |
| **3 - Similarity** | Multi-dimensional scoring | Variable (based on parts overlap and labor proximity) | No exact match — searches for similar combinations |

If Tier 2 results in confidence < 35%, it is automatically promoted to Tier 3.

### Data Pipeline

```
Excel (data/)  →  Python scripts (scripts/)  →  JSON (frontend/src/data/)  →  React App
```

- `standardJobs.json` — Standard pricing by model/job/component
- `workOrders.json` — Service order history with dates for recency weighting
- `partsData.json` — Parts catalog for repricing

## Deploy

The frontend is deployed on the RapidCanvas platform with support for **dev** and **prod** environments:

```bash
# Requires RAPIDCANVAS_API_KEY in the root .env

bash infra/deploy-frontend.sh          # Deploy to dev (default)
bash infra/deploy-frontend.sh dev      # Deploy to dev (explicit)
bash infra/deploy-frontend.sh prod     # Deploy to production
```

The script uploads the zip, updates the app template, and relaunches the DataApp automatically.

### Per-Environment Configuration

Each environment has its own configuration file under `infra/`:

| File | Environment | DataApp ID |
|------|-------------|------------|
| `.rapidcanvas.dev` | Development | `cc3403a8-0cec-4638-bd16-3a2730cf16fb` |
| `.rapidcanvas.prod` | Production | `6e736bdf-68fd-43ab-ac00-e078fb205a76` |

The script automatically selects the correct file based on the argument passed. `vite.config.ts` is updated with the corresponding DataApp slug during deploy.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Visualization:** Recharts
- **State:** React Query + local state (no Redux)
- **Deploy:** RapidCanvas (DataApp iframe)
- **Transformation:** Python scripts for Excel → JSON conversion
