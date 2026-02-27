import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { ChartPoint } from '../types';

interface StreamChartProps {
  title: string;
  data: ChartPoint[];
  color: string;
  gradientId: string;
  unit?: string;
  active?: boolean;
  rate?: number;
  total?: number;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs">
      <div className="text-slate-400">{formatTime(label)}</div>
      <div className="text-white font-bold">{payload[0].value?.toFixed(2)} {unit}</div>
    </div>
  );
};

export function StreamChart({ title, data, color, gradientId, unit, active = true, rate, total }: StreamChartProps) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-400 pulse-dot' : 'bg-red-500'}`} />
          <span className="text-sm font-bold text-slate-200 tracking-wide uppercase">{title}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {rate !== undefined && <span>{rate.toFixed(1)} <span className="text-slate-600">ev/s</span></span>}
          {total !== undefined && <span className="text-slate-400">{total.toLocaleString()} total</span>}
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              tick={{ fontSize: 9, fill: '#475569' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#475569' }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
