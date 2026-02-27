import { motion } from 'framer-motion';
import type { StreamStat } from '../types';

interface StreamStatusProps {
  streamStats: Record<string, StreamStat>;
}

const streamMeta: Record<string, { icon: string; color: string; desc: string }> = {
  orders: { icon: '📦', color: 'cyan', desc: 'Order processing pipeline' },
  users: { icon: '👤', color: 'purple', desc: 'User activity stream' },
  system: { icon: '⚙️', color: 'blue', desc: 'System metrics collector' },
  errors: { icon: '⚠️', color: 'red', desc: 'Error monitoring stream' },
};

const colorMap: Record<string, string> = {
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  red: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export function StreamStatus({ streamStats }: StreamStatusProps) {
  const streams = Object.entries(streamStats);

  return (
    <div className="card p-4">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Stream Status</div>
      <div className="space-y-2">
        {streams.map(([name, stat], i) => {
          const meta = streamMeta[name] ?? { icon: '●', color: 'cyan', desc: name };
          const classes = colorMap[meta.color] ?? colorMap.cyan;

          return (
            <motion.div
              key={name}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${classes}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-base">{meta.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${stat.active ? `bg-green-400 pulse-dot` : 'bg-red-500'}`} />
                  <span className="text-xs font-bold uppercase">{name}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{meta.desc}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-bold tabular-nums">{stat.rate.toFixed(1)} <span className="text-slate-500 font-normal">ev/s</span></div>
                <div className="text-xs text-slate-500">{stat.total.toLocaleString()} total</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
