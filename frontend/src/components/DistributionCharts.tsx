import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { WoEntry } from '../utils/quoteEngine';

interface DistributionChartsProps {
  entries: WoEntry[];
  avgDuration: number;
  avgParts: number;
}

interface HistogramBin {
  label: string;
  count: number;
  from: number;
  to: number;
}

// Pick a "nice" step size (1, 2, 5, 10, 20, 50, …) so bin edges are round numbers
function niceStep(rawStep: number): number {
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const fraction = rawStep / magnitude;
  if (fraction <= 1) return magnitude;
  if (fraction <= 2) return 2 * magnitude;
  if (fraction <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function computeHistogramBins(
  values: number[],
  isCurrency: boolean
): HistogramBin[] {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    const label = isCurrency ? fmtCurrency(min) : fmtHours(min);
    return [{ label, count: values.length, from: min, to: max }];
  }

  const targetBins = Math.max(5, Math.min(12, Math.ceil(Math.log2(values.length) + 1)));
  const rawStep = (max - min) / targetBins;
  const step = niceStep(rawStep);

  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const binCount = Math.round((niceMax - niceMin) / step);

  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const from = niceMin + i * step;
    const to = from + step;
    return { label: '', count: 0, from, to };
  });

  values.forEach((v) => {
    let idx = Math.floor((v - niceMin) / step);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx].count++;
  });

  // Use short labels: just the lower bound of each bin
  bins.forEach((bin) => {
    bin.label = isCurrency ? fmtCurrency(bin.from) : fmtHours(bin.from);
  });

  return bins;
}

function fmtCurrency(value: number): string {
  if (value >= 10000) return `$${(value / 1000).toFixed(0)}K`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`.replace('.0K', 'K');
  return `$${Math.round(value)}`;
}

function fmtHours(value: number): string {
  if (Number.isInteger(value) || value >= 10) return `${Math.round(value)}`;
  if (value === 0) return '0';
  return value.toFixed(1);
}

function fmtRange(bin: HistogramBin, isCurrency: boolean): string {
  if (isCurrency) return `${fmtCurrency(bin.from)} – ${fmtCurrency(bin.to)}`;
  return `${fmtHours(bin.from)} – ${fmtHours(bin.to)} hrs`;
}

function findAvgBinIndex(bins: HistogramBin[], avg: number): number {
  return bins.findIndex((b) => avg >= b.from && avg < b.to);
}

const CustomTooltip = ({
  active,
  payload,
  isCurrency,
}: {
  active?: boolean;
  payload?: Array<{ payload: HistogramBin; value: number }>;
  isCurrency: boolean;
}) => {
  if (!active || !payload?.length) return null;
  const bin = payload[0].payload;
  const count = payload[0].value;

  return (
    <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg">
      <div className="font-medium">{fmtRange(bin, isCurrency)}</div>
      <div>
        {count} work order{count !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default function DistributionCharts({
  entries,
  avgDuration,
  avgParts,
}: DistributionChartsProps) {
  const durationBins = useMemo(
    () => computeHistogramBins(entries.map((e) => e.d), false),
    [entries]
  );

  const partsBins = useMemo(
    () => computeHistogramBins(entries.map((e) => e.p), true),
    [entries]
  );

  if (entries.length === 0) return null;

  if (entries.length === 1) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        Single work order — distribution analysis requires multiple entries.
      </div>
    );
  }

  const limitedData = entries.length <= 3;
  const avgDurationBinIdx = findAvgBinIndex(durationBins, avgDuration);
  const avgPartsBinIdx = findAvgBinIndex(partsBins, avgParts);

  return (
    <div className="space-y-3">
      {limitedData && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
          Distribution based on only {entries.length} work orders — limited statistical significance.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Labor Hours Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">
            Labor Hours Distribution
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationBins} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  height={30}
                  interval={0}
                  label={{ value: 'hours', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#9ca3af' }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip isCurrency={false} />} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                {avgDurationBinIdx >= 0 && (
                  <ReferenceLine
                    x={durationBins[avgDurationBinIdx].label}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Avg: ${avgDuration} hrs`,
                      position: 'top',
                      fill: '#d97706',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parts Cost Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">
            Parts Cost Distribution
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={partsBins} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  height={30}
                  interval={0}
                  label={{ value: 'cost', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#9ca3af' }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip isCurrency={true} />} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                {avgPartsBinIdx >= 0 && (
                  <ReferenceLine
                    x={partsBins[avgPartsBinIdx].label}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Avg: ${fmtCurrency(avgParts)}`,
                      position: 'top',
                      fill: '#d97706',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
