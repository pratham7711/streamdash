import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { ChartPoint } from '../types';

interface MetricsChartProps {
  label: string;
  data: ChartPoint[];
  color: string;
  unit?: string;
  domain?: [number, number];
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs">
      <div className="text-slate-400">{formatTime(label)}</div>
      <div className="font-bold" style={{ color: payload[0].color }}>
        {payload[0].value?.toFixed(1)}{unit}
      </div>
    </div>
  );
};

export function MetricsChart({ label, data, color, unit, domain }: MetricsChartProps) {
  const last = data[data.length - 1]?.value;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {last != null ? last.toFixed(1) : '—'}{unit}
        </span>
      </div>
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: -35, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              tick={{ fontSize: 8, fill: '#334155' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={domain ?? ['auto', 'auto']}
              tick={{ fontSize: 8, fill: '#334155' }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
