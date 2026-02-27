import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TECH_BADGES = [
  { label: 'Apache Kafka', sublabel: 'concept', color: 'text-orange-400 border-orange-500/30 bg-orange-500/5' },
  { label: 'WebSockets', sublabel: 'transport', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5' },
  { label: 'React 19', sublabel: 'UI', color: 'text-blue-400 border-blue-500/30 bg-blue-500/5' },
  { label: 'TypeScript', sublabel: 'types', color: 'text-sky-400 border-sky-500/30 bg-sky-500/5' },
  { label: 'Recharts', sublabel: 'charts', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' },
];

const STEPS = [
  {
    num: '1',
    title: 'Data Producers',
    icon: '🏭',
    desc: 'Mock services generate events (orders, user signups, errors, system metrics) every 500ms — simulating real microservices.',
    color: 'border-cyan-500/30 bg-cyan-500/5',
    numColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    arrow: '→',
  },
  {
    num: '2',
    title: 'WebSocket Stream',
    icon: '📡',
    desc: 'Events flow through a Node.js WebSocket server (simulating Kafka topics) in real-time — no polling, pure push.',
    color: 'border-purple-500/30 bg-purple-500/5',
    numColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    arrow: '→',
  },
  {
    num: '3',
    title: 'Live Dashboard',
    icon: '📊',
    desc: 'Charts and metrics update instantly as data arrives — no page refresh, React state drives smooth real-time rendering.',
    color: 'border-green-500/30 bg-green-500/5',
    numColor: 'text-green-400 bg-green-500/10 border-green-500/30',
    arrow: null,
  },
];

const ARCHITECTURE = `
  ┌─────────────────────┐        ┌──────────────────────┐        ┌─────────────────────┐
  │   DATA PRODUCERS    │        │   WEBSOCKET SERVER   │        │   REACT DASHBOARD   │
  │                     │        │                      │        │                     │
  │  orders-service     │──ws──▶│  topic: orders       │──ws──▶│  StreamChart        │
  │  users-service      │        │  topic: users        │        │  MetricsChart       │
  │  system-monitor     │        │  topic: system       │        │  EventFeed          │
  │  error-tracker      │        │  topic: errors       │        │  StatCards          │
  │                     │        │                      │        │                     │
  │  every 500ms        │        │  port :8080          │        │  port :5187         │
  └─────────────────────┘        └──────────────────────┘        └─────────────────────┘
        (server.js)                   (server.js)                     (Vite + React)
`;

interface InfoBarProps {
  connected: boolean;
  activeStreams: number;
}

export function InfoBar({ connected, activeStreams }: InfoBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [showArch, setShowArch] = useState(false);

  return (
    <div className="border-b border-cyan-500/10 bg-slate-950/60 backdrop-blur-sm">
      {/* Compact bar */}
      <div className="max-w-[1800px] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        {/* Left: status */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 font-mono flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${connected ? 'bg-cyan-400 pulse-dot' : 'bg-slate-600'}`} />
            <span className={connected ? 'text-cyan-300' : 'text-slate-500'}>
              {connected ? 'Live' : 'Connecting...'}
            </span>
          </span>
          <span className="text-slate-700 hidden sm:inline">·</span>
          <span className="hidden sm:inline"><span className="text-slate-300">{activeStreams}</span> / 4 channels</span>
          <span className="text-slate-700 hidden sm:inline">·</span>
          <span className="hidden sm:inline">WS <span className={connected ? 'text-green-400' : 'text-yellow-400'}>{connected ? 'ok' : 'reconnecting'}</span></span>
          <span className="sm:hidden text-slate-600 text-[10px]">{activeStreams}/4 active</span>
        </div>

        {/* Right: badges + toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {TECH_BADGES.map((b, idx) => (
            <span
              key={b.label}
              className={`border rounded px-2 py-0.5 text-[10px] font-mono ${b.color} ${idx >= 3 ? 'hidden sm:inline-flex' : ''}`}
            >
              {b.label}
              <span className="text-slate-600 ml-1 hidden sm:inline">{b.sublabel}</span>
            </span>
          ))}
          <button
            onClick={() => setExpanded(v => !v)}
            className={`ml-1 w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center transition-colors ${
              expanded
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-slate-600 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400'
            }`}
            title="How it works"
          >
            ?
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="max-w-[1800px] mx-auto px-3 sm:px-6 pb-4 sm:pb-5 pt-2 border-t border-slate-800/50">
              {/* Header */}
              <div className="mb-4">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">About</div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  <span className="text-cyan-400 font-bold">STREAMDASH</span> is a real-time data stream monitoring dashboard.
                  It simulates how companies like <span className="text-white">Uber</span>, <span className="text-white">Netflix</span>,
                  and <span className="text-white">Airbnb</span> monitor millions of events per second using{' '}
                  <span className="text-orange-400">Apache Kafka</span> and <span className="text-cyan-400">WebSockets</span>.
                </p>
              </div>

              {/* 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {STEPS.map((step, i) => (
                  <div key={i} className={`relative border rounded-lg p-4 ${step.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-5 h-5 rounded border text-[10px] font-bold flex items-center justify-center ${step.numColor}`}>
                        {step.num}
                      </span>
                      <span className="text-base">{step.icon}</span>
                      <span className="text-xs font-bold text-white">{step.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                    {step.arrow && (
                      <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-600 text-lg font-mono">
                        {step.arrow}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Architecture link */}
              <button
                onClick={() => setShowArch(v => !v)}
                className="text-[11px] text-cyan-500 hover:text-cyan-300 font-mono underline underline-offset-2 transition-colors"
              >
                {showArch ? '▲ Hide architecture diagram' : '▼ Show architecture diagram'}
              </button>

              <AnimatePresence>
                {showArch && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <pre className="mt-3 text-[10px] text-slate-500 font-mono leading-relaxed overflow-x-auto bg-slate-900/60 border border-slate-800 rounded-lg p-4 whitespace-pre">
{ARCHITECTURE}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
