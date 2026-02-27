import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  accent: 'cyan' | 'purple' | 'green' | 'orange';
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

const accentMap = {
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/5',
    glow: 'glow-cyan',
    ring: 'ring-cyan-500/30',
  },
  purple: {
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
    glow: 'glow-purple',
    ring: 'ring-purple-500/30',
  },
  green: {
    text: 'text-green-400',
    border: 'border-green-500/20',
    bg: 'bg-green-500/5',
    glow: 'glow-green',
    ring: 'ring-green-500/30',
  },
  orange: {
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/5',
    glow: '',
    ring: 'ring-orange-500/30',
  },
};

export function StatCard({ label, value, unit, icon, accent, subtitle }: StatCardProps) {
  const a = accentMap[accent];

  return (
    <motion.div
      className={`card p-5 ${a.glow} relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="scan-line h-full w-1/3 absolute top-0" />
      </div>

      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className={`w-2 h-2 rounded-full ${a.text.replace('text', 'bg')} pulse-dot`} />
      </div>

      <div className={`text-3xl font-bold ${a.text} mb-1 tabular-nums`}>
        <motion.span
          key={String(value)}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {value}
        </motion.span>
        {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
      </div>

      <div className="text-xs text-slate-400 font-medium tracking-wider uppercase">{label}</div>
      {subtitle && <div className="text-xs text-slate-600 mt-1">{subtitle}</div>}
    </motion.div>
  );
}
