import { useEffect, useRef, useState, useCallback } from 'react';
import type { ServerPayload, StreamEvent, ChartHistory, MetricsHistory, StreamStat } from '../types';

const WS_URL = 'ws://localhost:8080';
const MAX_HISTORY = 60;
const MAX_EVENTS = 80;

const STREAMS = ['orders', 'users', 'system', 'errors'] as const;

function initChartHistory(): ChartHistory {
  return {
    orders: [],
    users: [],
    system: [],
    errors: [],
  };
}

function initMetricsHistory(): MetricsHistory {
  return {
    cpu: [],
    memory: [],
    requestsPerSec: [],
    errorRate: [],
    latency: [],
  };
}

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [latestPayload, setLatestPayload] = useState<ServerPayload | null>(null);
  const [eventLog, setEventLog] = useState<StreamEvent[]>([]);
  const [chartHistory, setChartHistory] = useState<ChartHistory>(initChartHistory);
  const [metricsHistory, setMetricsHistory] = useState<MetricsHistory>(initMetricsHistory);
  const [streamStats, setStreamStats] = useState<Record<string, StreamStat>>({});
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (ws.current) {
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.close();
    }

    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      if (!mountedRef.current) return;
      setConnected(true);
      setReconnecting(false);
    };

    socket.onmessage = (event) => {
      if (!mountedRef.current) return;
      try {
        const data: ServerPayload = JSON.parse(event.data);
        if (data.type === 'connected') return;

        setLatestPayload(data);
        setStreamStats(data.streamStats);

        if (data.events && data.events.length > 0) {
          setEventLog(prev => {
            const combined = [...data.events, ...prev];
            return combined.slice(0, MAX_EVENTS);
          });

          setChartHistory(prev => {
            const next = { ...prev };
            for (const ev of data.events) {
              const s = ev.stream;
              const point = { time: ev.timestamp, value: ev.value };
              next[s] = [...(next[s] || []), point].slice(-MAX_HISTORY);
            }
            return next;
          });
        }

        if (data.metrics) {
          const ts = data.timestamp;
          setMetricsHistory(prev => ({
            cpu: [...prev.cpu, { time: ts, value: data.metrics.cpu }].slice(-MAX_HISTORY),
            memory: [...prev.memory, { time: ts, value: data.metrics.memory }].slice(-MAX_HISTORY),
            requestsPerSec: [...prev.requestsPerSec, { time: ts, value: data.metrics.requestsPerSec }].slice(-MAX_HISTORY),
            errorRate: [...prev.errorRate, { time: ts, value: data.metrics.errorRate }].slice(-MAX_HISTORY),
            latency: [...prev.latency, { time: ts, value: data.metrics.latency }].slice(-MAX_HISTORY),
          }));
        }
      } catch {
        // ignore parse errors
      }
    };

    socket.onclose = () => {
      if (!mountedRef.current) return;
      setConnected(false);
      setReconnecting(true);
      reconnectTimer.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, 2000);
    };

    socket.onerror = () => {
      if (!mountedRef.current) return;
      socket.close();
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [connect]);

  const totalEvents = STREAMS.reduce((sum, s) => sum + (streamStats[s]?.total ?? 0), 0);
  const activeStreams = STREAMS.filter(s => streamStats[s]?.active).length;
  const throughput = STREAMS.reduce((sum, s) => sum + (streamStats[s]?.rate ?? 0), 0);

  return {
    connected,
    reconnecting,
    latestPayload,
    eventLog,
    chartHistory,
    metricsHistory,
    streamStats,
    totalEvents,
    activeStreams,
    throughput: parseFloat(throughput.toFixed(1)),
  };
}
