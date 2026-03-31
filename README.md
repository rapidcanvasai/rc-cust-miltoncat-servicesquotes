# MiltonCAT Service Quotes

Ferramenta de estimativa de preços para serviços de equipamentos CAT. Utiliza um motor de cotação em 3 camadas que combina dados de Standard Jobs, Work Orders históricos e similaridade entre equipamentos para gerar estimativas com score de confiança.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

O servidor de desenvolvimento roda em `http://localhost:8080`.

## Como Funciona

### Motor de Cotação (3 Tiers)

| Tier | Fonte | Confiança | Quando usa |
|------|-------|-----------|------------|
| **1 - Standard Job** | Tabela de preços padrão | 100% | Match exato de modelo + job + componente |
| **2 - Work Order** | Histórico de ordens de serviço | Variável (baseada em CV e recência) | Match exato sem STJ disponível |
| **3 - Similaridade** | Scoring multi-dimensional | Variável (baseada em overlap de peças e proximidade de labor) | Sem match exato — busca combinações similares |

Se o Tier 2 resulta em confiança < 35%, promove automaticamente para Tier 3.

### Pipeline de Dados

```
Excel (data/)  →  Python scripts (scripts/)  →  JSON (frontend/src/data/)  →  React App
```

- `standardJobs.json` — Preços padrão por modelo/job/componente
- `workOrders.json` — Histórico de ordens de serviço com datas para peso por recência
- `partsData.json` — Catálogo de peças para repricing

## Deploy

O frontend é deployado na plataforma RapidCanvas:

```bash
# Requer RAPIDCANVAS_API_KEY no .env da raiz
bash infra/deploy-frontend.sh
```

O script faz upload do zip, atualiza o app template e relança o DataApp automaticamente.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Visualização:** Recharts
- **Estado:** React Query + state local (sem Redux)
- **Deploy:** RapidCanvas (DataApp iframe)
- **Transformação:** Python scripts para conversão Excel → JSON
