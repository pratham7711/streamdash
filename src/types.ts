export type StreamName = 'orders' | 'users' | 'system' | 'errors';

export interface Metrics {
  cpu: number;
  memory: number;
  requestsPerSec: number;
  errorRate: number;
  latency: number;
}

export interface StreamEvent {
  stream: StreamName;
  timestamp: number;
  type: string;
  value: number;
  [key: string]: unknown;
}

export interface StreamStat {
  total: number;
  rate: number;
  active: boolean;
}

export interface ServerPayload {
  type: 'init' | 'update' | 'connected';
  timestamp: number;
  metrics: Metrics;
  events: StreamEvent[];
  streamStats: Record<StreamName, StreamStat>;
}

export interface ChartPoint {
  time: number;
  value: number;
}

export type ChartHistory = Record<StreamName, ChartPoint[]>;
export type MetricsHistory = {
  cpu: ChartPoint[];
  memory: ChartPoint[];
  requestsPerSec: ChartPoint[];
  errorRate: ChartPoint[];
  latency: ChartPoint[];
};
