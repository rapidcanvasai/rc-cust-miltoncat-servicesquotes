# Insights do Arquivo: FW Service Call Job and Component Code

## 📊 Visão Geral dos Dados

**Fonte:** Service Call Job and Component Code.xlsx
**Período:** 2016-11-18 a 2026-01-09 (~9 anos)
**Total de Execuções:** 245,173 jobs realizados
**Combinações Únicas:** 69,879 (Modelo + Job Code + Component Code)

### Composição:
- **2,874** modelos diferentes de equipamentos
- **182** tipos de jobs (códigos de serviço)
- **1,091** componentes diferentes
- **Média:** 3.5 execuções por combinação única

---

## 🎯 Tipos de Informações/Insights Disponíveis

### 1. **ESTIMATIVAS DE CUSTO POR COMBINAÇÃO**

Para cada combinação Modelo + Job + Componente, o arquivo fornece:

```
Exemplo: Modelo 100DGDB_ON | Job "TRAVEL TO/FROM" | Component "GENERATOR SET"

  📌 Baseado em 6 ocorrências históricas:

  ├─ Parts Cost:      $0
  ├─ Labor Cost:      $741
  ├─ Material Cost:   $405
  ├─ Duration:        2.5 horas
  ├─ Total Médio:     $1,146
  │
  ├─ Range:           $951 - $1,662
  └─ Std Deviation:   $262 (variabilidade: 22.9%)
```

**Valor para o negócio:**
- ✅ Estimativa rápida de custos sem abrir o equipamento
- ✅ Range esperado (min-max) para gestão de expectativas
- ✅ Confiabilidade da estimativa (desvio padrão)

---

### 2. **ANÁLISE DE DISTRIBUIÇÃO DE CUSTOS**

**Geral:**
- Custo mínimo: $1
- Custo máximo: $550,587
- **Custo mediano: $809**
- **Custo médio: $2,467**

**Breakdown por Tipo:**

| Tipo | Média | Frequência de Uso |
|------|-------|-------------------|
| **Parts** (Peças) | $1,634 | 67.1% dos jobs |
| **Labor** (Mão de obra) | $1,148 | 92.0% dos jobs |
| **Material** | $419 | 76.1% dos jobs |

**Insights:**
- 🔧 **Labor está presente em 92% dos jobs** - componente mais consistente
- 💰 **Parts é o mais caro** em média ($1,634)
- 📦 **Material é usado em 76%** mas com menor custo médio

---

### 3. **IDENTIFICAÇÃO DE JOBS DE ALTO RISCO/CUSTO**

Permite identificar:

**Jobs mais caros** - Exemplo do dataset:
- Alguns jobs chegam a **$550,587** (overhauls completos, recondicionamentos)
- Média fica em $2,467

**Valor para negócio:**
- ⚠️ Alertar cliente quando seleção indica job de alto custo
- 💡 Oferecer alternativas (ex: "Recondition" vs "Replace")
- 📊 Priorizar manutenção preventiva para evitar jobs caros

---

### 4. **ANÁLISE DE VARIABILIDADE/PREVISIBILIDADE**

Exemplo de job com **alta variabilidade** (80.9%):
```
Modelo: 100REOZJF_KH
Job: TRAVEL TO/FROM
Component: MACHINE

Total médio: $404
Range: $4 - $1,041 (muito amplo!)
Std Deviation: $327

➡️ INSIGHT: Este job é IMPREVISÍVEL
   Cliente deve estar preparado para variação de 10x no custo
```

Exemplo de job com **baixa variabilidade** (19.4%):
```
Modelo: 100GS60_DD
Job: PERFORM
Component: POWER SYSTEMS INSPECTION

Total médio: $273
Range: $200 - $330 (estreito)
Std Deviation: $53

➡️ INSIGHT: Este job é PREVISÍVEL
   Ótimo para contratos de manutenção com preço fixo
```

**Valor para negócio:**
- 📈 **Jobs com baixa variabilidade** → Bons para precificação fixa
- 📉 **Jobs com alta variabilidade** → Cobrar com margem maior ou preço variável

---

### 5. **PADRÕES DE FREQUÊNCIA**

Identifica combinações mais comuns (aparecem >10x no histórico):

**Jobs frequentes indicam:**
- 🔄 Manutenções recorrentes
- 🎯 Componentes que falham com frequência
- 💼 Oportunidades para contratos de serviço

**Valor para negócio:**
- 📦 Estocar peças para jobs frequentes
- 👨‍🔧 Treinar técnicos em procedimentos comuns
- 💰 Criar pacotes de serviço (bundles)

---

### 6. **TEMPO DE EXECUÇÃO (DURATION)**

Cada combinação tem duração média em horas:

```
Exemplo: Oil Change & Inspection
  Duration: 2.9 horas

Exemplo: Simple Travel
  Duration: 0.5 horas

Exemplo: Major Overhaul
  Duration: 40+ horas
```

**Valor para negócio:**
- 📅 **Agendar técnicos** com precisão
- 🚚 **Planejar logística** (se job leva 2 dias, precisa hotel?)
- 💵 **Calcular custo de oportunidade** (técnico parado)

---

### 7. **ANÁLISE POR MODELO DE EQUIPAMENTO**

Com os 2,874 modelos, pode-se:

**Identificar modelos problemáticos:**
```
Modelo X tem:
  - 150 combinações job+component diferentes
  - Custo médio de $5,000 por job
  - Variabilidade alta

➡️ INSIGHT: Modelo caro de manter
   Considerar ao vender/comprar usado
```

**Comparar modelos similares:**
```
Modelo A: Custo médio $2,000, Duration 3h
Modelo B: Custo médio $3,500, Duration 5h

➡️ INSIGHT: Modelo A é mais eficiente
```

---

### 8. **ANÁLISE POR COMPONENTE**

Com 1,091 componentes, identifica:

**Componentes que falham frequentemente:**
- Se "HYDRAULIC PUMP" aparece em 500 combinações → componente frágil
- Se "FLYWHEEL" aparece em 10 combinações → componente durável

**Componentes caros de reparar:**
- "ENGINE OVERHAUL" → $50,000+
- "OIL CHANGE" → $300

---

### 9. **INTELIGÊNCIA DE NEGÓCIO - Combinando com Dados do Herbert**

#### **Arquivo do Herbert (33k registros detalhados):**
- Tem descrições textuais detalhadas
- Tem data específica de cada job
- Tem valores exatos pagos

#### **Este arquivo (FW Service Call):**
- Tem estatísticas agregadas
- Tem min/max/std
- Tem contagem de ocorrências

#### **🔥 COMBINAÇÃO PODEROSA:**

```
Cliente pede orçamento:
  Modelo: 336
  Problema: "Motor fazendo barulho"

PASSO 1 - Usar FW Service Call (lookup rápido):
  ├─ Buscar "336 + DIAGNOSE + ENGINE"
  ├─ Retornar: $800-1,200 (diagnóstico)
  └─ Possíveis cenários:
      • ENGINE OVERHAUL: $45,000 (pior caso)
      • VALVE ADJUSTMENT: $2,500 (melhor caso)

PASSO 2 - Usar dados do Herbert (detalhamento):
  ├─ Analisar descrições textuais similares
  ├─ Usar LLM para comparar: "motor fazendo barulho"
  │   com histórico de 33k jobs
  └─ Retornar top 5 casos mais similares com custos reais

PASSO 3 - Apresentar ao cliente:
  📊 Estimativa inicial: $800-1,200 (diagnóstico)

  Cenários possíveis baseados em 50 casos similares:
  ├─ 30% dos casos: Ajuste simples (~$2,500)
  ├─ 45% dos casos: Troca de componente (~$8,000)
  └─ 25% dos casos: Overhaul completo (~$45,000)

  Próximos passos:
  1. Agendar diagnóstico ($800-1,200, 2-3 horas)
  2. Após diagnóstico, orçamento preciso
```

---

## 💡 10 INSIGHTS ACIONÁVEIS

### Para o DataApp:

1. **Confiança da Estimativa**
   - Se `n` (ocorrências) > 10 → Alta confiança
   - Se `n` < 3 → Baixa confiança (avisar usuário)

2. **Alertas de Variabilidade**
   - Se `std/total` > 50% → "⚠️ Custo pode variar significativamente"

3. **Comparação de Opções**
   - Mostrar múltiplos job codes para mesmo componente
   - Ex: "REPAIR" vs "REPLACE" - qual é mais barato?

4. **Histórico Visual**
   - Gráfico mostrando range de custos (min-max)
   - Distribuição de custos em formato de violino

5. **Recomendações Inteligentes**
   - "Jobs similares costumam requerer também..."
   - "Considere fazer [outro job] ao mesmo tempo para economizar labor"

6. **Análise de Tendências**
   - Custos aumentando/diminuindo ao longo dos anos
   - (Precisa filtrar por data, disponível no Herbert)

7. **Pacotes/Bundles**
   - Identificar jobs que frequentemente ocorrem juntos
   - Oferecer "Pacote de Manutenção Preventiva"

8. **Margem de Segurança**
   - Sugerir adicionar buffer de 20% em jobs com alta variabilidade

9. **Comparativo de Modelos**
   - Ao vender equipamento: "Modelo A custa $X/ano em manutenção"

10. **ML/AI Enhancements**
    - Usar `n`, `std`, `min`, `max` como features para melhorar previsões
    - Combinar com descrições textuais do Herbert

---

## 🎯 Conclusão

Este arquivo **NÃO É PARA TREINAR ML**, mas sim uma **fonte de verdade estatística** que:

✅ Fornece estimativas instantâneas (lookup O(1))
✅ Indica confiabilidade da estimativa (`n`, `std`)
✅ Mostra range esperado de custos (`min`, `max`)
✅ Inclui breakdown detalhado (parts, labor, material, duration)
✅ Baseado em 245k execuções reais ao longo de 9 anos

**Quando combinado com os dados detalhados do Herbert**, cria um sistema híbrido:
- **Rápido** (estatísticas pré-calculadas)
- **Preciso** (casos históricos reais)
- **Inteligente** (LLM pode analisar descrições textuais)
- **Confiável** (mostra incerteza e variabilidade)

---

**Gerado em:** 2026-02-13
**Arquivo analisado:** historicalJobs.json (7.1 MB)
