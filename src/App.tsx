import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from './hooks/useWebSocket';
import { StatCard } from './components/StatCard';
import { StreamChart } from './components/StreamChart';
import { MetricsChart } from './components/MetricsChart';
import { EventFeed } from './components/EventFeed';
import { StreamStatus } from './components/StreamStatus';
import { InfoBar } from './components/InfoBar';

const STREAM_CHART_CONFIG = [
  { key: 'orders' as const, title: 'Orders Stream', color: '#22d3ee', gradientId: 'ordersGrad', unit: '$' },
  { key: 'users' as const, title: 'Users Stream', color: '#c084fc', gradientId: 'usersGrad', unit: 'ev' },
  { key: 'system' as const, title: 'System Stream', color: '#60a5fa', gradientId: 'systemGrad', unit: 'ms' },
  { key: 'errors' as const, title: 'Errors Stream', color: '#f87171', gradientId: 'errorsGrad', unit: '' },
];

function ConnectionBadge({ connected, reconnecting }: { connected: boolean; reconnecting: boolean }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={connected ? 'connected' : reconnecting ? 'reconnecting' : 'disconnected'}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          connected
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : reconnecting
            ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            connected ? 'bg-green-400 pulse-dot' : reconnecting ? 'bg-yellow-400 pulse-dot' : 'bg-red-500'
          }`}
        />
        {connected ? 'LIVE' : reconnecting ? 'RECONNECTING...' : 'DISCONNECTED'}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const {
    connected,
    reconnecting,
    latestPayload,
    eventLog,
    chartHistory,
    metricsHistory,
    streamStats,
    totalEvents,
    activeStreams,
    throughput,
  } = useWebSocket();

  const metrics = latestPayload?.metrics;

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                <span className="text-cyan-400 text-sm font-bold">S</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full pulse-dot" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-widest uppercase">StreamDash</h1>
              <p className="text-xs text-slate-500 leading-none">Real-Time Event Stream Monitor</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 font-mono hidden sm:block">
              {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
            </div>
            <ConnectionBadge connected={connected} reconnecting={reconnecting} />
          </div>
        </div>
      </header>

      {/* Info Bar */}
      <InfoBar connected={connected} activeStreams={activeStreams} />

      <main className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Events"
            value={totalEvents.toLocaleString()}
            icon="📊"
            accent="cyan"
            subtitle="across all streams"
          />
          <StatCard
            label="Active Streams"
            value={activeStreams}
            unit={`/ 4`}
            icon="📡"
            accent="purple"
            subtitle="kafka-like topics"
          />
          <StatCard
            label="Throughput"
            value={throughput.toFixed(1)}
            unit="ev/s"
            icon="⚡"
            accent="green"
            subtitle="combined stream rate"
          />
          <StatCard
            label="Error Rate"
            value={metrics ? metrics.errorRate.toFixed(2) : '0.00'}
            unit="%"
            icon="🔴"
            accent="orange"
            subtitle="current error ratio"
          />
        </div>

        {/* Main grid: Charts + Status */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Stream charts */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {STREAM_CHART_CONFIG.map(cfg => (
              <StreamChart
                key={cfg.key}
                title={cfg.title}
                data={chartHistory[cfg.key]}
                color={cfg.color}
                gradientId={cfg.gradientId}
                unit={cfg.unit}
                active={streamStats[cfg.key]?.active ?? true}
                rate={streamStats[cfg.key]?.rate}
                total={streamStats[cfg.key]?.total}
              />
            ))}
          </div>

          {/* Stream status sidebar */}
          <div className="xl:col-span-1">
            <StreamStatus streamStats={streamStats} />
          </div>
        </div>

        {/* System metrics row */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">System Metrics</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricsChart
              label="CPU Usage"
              data={metricsHistory.cpu}
              color="#22d3ee"
              unit="%"
              domain={[0, 100]}
            />
            <MetricsChart
              label="Memory"
              data={metricsHistory.memory}
              color="#c084fc"
              unit="%"
              domain={[0, 100]}
            />
            <MetricsChart
              label="Requests/s"
              data={metricsHistory.requestsPerSec}
              color="#34d399"
              unit=""
            />
            <MetricsChart
              label="Error Rate"
              data={metricsHistory.errorRate}
              color="#f87171"
              unit="%"
            />
            <MetricsChart
              label="Latency"
              data={metricsHistory.latency}
              color="#fb923c"
              unit="ms"
            />
          </div>
        </div>

        {/* Event Feed */}
        <EventFeed events={eventLog} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-6 py-4">
        <div className="max-w-[1800px] mx-auto px-6 text-xs text-slate-600 flex items-center justify-between">
          <span>STREAMDASH v1.0.0 — Real-time Kafka-like data streaming</span>
          <span className="font-mono">ws://localhost:8080</span>
        </div>
      </footer>
    </div>
  );
}
