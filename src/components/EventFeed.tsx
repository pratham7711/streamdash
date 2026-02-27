import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StreamEvent } from '../types';

interface EventFeedProps {
  events: StreamEvent[];
}

const streamColors: Record<string, string> = {
  orders: 'text-cyan-400',
  users: 'text-purple-400',
  system: 'text-blue-400',
  errors: 'text-red-400',
};

const streamBg: Record<string, string> = {
  orders: 'bg-cyan-500/10 border-cyan-500/20',
  users: 'bg-purple-500/10 border-purple-500/20',
  system: 'bg-blue-500/10 border-blue-500/20',
  errors: 'bg-red-500/10 border-red-500/20',
};

const streamIcons: Record<string, string> = {
  orders: '📦',
  users: '👤',
  system: '⚙️',
  errors: '⚠️',
};

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;
}

function formatEventDetails(event: StreamEvent) {
  const parts: string[] = [];
  if (event.orderId) parts.push(event.orderId as string);
  if (event.userId) parts.push(event.userId as string);
  if (event.amount != null) parts.push(`$${(event.amount as number).toFixed(2)}`);
  if (event.duration != null) parts.push(`${(event.duration as number).toFixed(1)}ms`);
  if (event.severity) parts.push(event.severity as string);
  return parts.join(' · ');
}

export function EventFeed({ events }: EventFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll only if near bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  return (
    <div className="card flex flex-col h-64 md:h-[420px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">Live Event Feed</span>
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
        </div>
        <span className="text-xs text-slate-500">{events.length} events</span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <AnimatePresence initial={false}>
          {events.map((event, i) => (
            <motion.div
              key={`${event.timestamp}-${event.stream}-${i}`}
              className={`flex items-start gap-2 rounded px-2.5 py-1.5 border text-xs ${streamBg[event.stream] ?? 'bg-slate-800/50 border-slate-700'}`}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className="mt-0.5 flex-shrink-0">{streamIcons[event.stream] ?? '•'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold ${streamColors[event.stream] ?? 'text-slate-300'}`}>
                    {event.stream.toUpperCase()}
                  </span>
                  <span className="text-slate-300 font-semibold">{event.type}</span>
                  <span className="text-slate-500 flex-1">{formatEventDetails(event)}</span>
                </div>
              </div>
              <span className="text-slate-600 flex-shrink-0 font-mono hidden sm:block">{formatTime(event.timestamp)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
