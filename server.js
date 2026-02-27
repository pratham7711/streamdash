import { WebSocketServer } from 'ws';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

const streams = ['orders', 'users', 'system', 'errors'];

const streamState = {
  orders: { total: 0, rate: 0, active: true },
  users: { total: 0, rate: 0, active: true },
  system: { total: 0, rate: 0, active: true },
  errors: { total: 0, rate: 0, active: true },
};

const metrics = {
  cpu: 30,
  memory: 45,
  requestsPerSec: 120,
  errorRate: 0.5,
  latency: 45,
};

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function drift(current, target, noise, min, max) {
  const next = current + (target - current) * 0.05 + (Math.random() - 0.5) * noise;
  return clamp(next, min, max);
}

const targets = {
  cpu: 50,
  memory: 60,
  requestsPerSec: 200,
  errorRate: 1.5,
  latency: 60,
};

function updateMetrics() {
  // Occasionally shift targets to simulate load spikes
  if (Math.random() < 0.02) targets.cpu = 20 + Math.random() * 75;
  if (Math.random() < 0.02) targets.memory = 30 + Math.random() * 60;
  if (Math.random() < 0.02) targets.requestsPerSec = 50 + Math.random() * 800;
  if (Math.random() < 0.02) targets.errorRate = Math.random() * 8;
  if (Math.random() < 0.02) targets.latency = 10 + Math.random() * 200;

  metrics.cpu = drift(metrics.cpu, targets.cpu, 3, 0, 100);
  metrics.memory = drift(metrics.memory, targets.memory, 2, 0, 100);
  metrics.requestsPerSec = drift(metrics.requestsPerSec, targets.requestsPerSec, 20, 0, 2000);
  metrics.errorRate = drift(metrics.errorRate, targets.errorRate, 0.3, 0, 15);
  metrics.latency = drift(metrics.latency, targets.latency, 5, 1, 500);
}

const orderTypes = ['PURCHASE', 'REFUND', 'SUBSCRIPTION', 'CANCEL'];
const userEvents = ['LOGIN', 'LOGOUT', 'SIGNUP', 'PROFILE_UPDATE', 'PASSWORD_RESET'];
const systemEvents = ['CACHE_FLUSH', 'GC_PAUSE', 'DB_QUERY', 'API_CALL', 'HEALTH_CHECK'];
const errorTypes = ['TIMEOUT', 'NULL_POINTER', 'RATE_LIMIT', 'AUTH_FAIL', 'DB_CONN_ERR'];

function generateEvent(stream) {
  const ts = Date.now();
  const base = { stream, timestamp: ts };

  switch (stream) {
    case 'orders': {
      const type = orderTypes[Math.floor(Math.random() * orderTypes.length)];
      const amount = parseFloat((Math.random() * 500 + 1).toFixed(2));
      streamState.orders.total++;
      return { ...base, type, amount, orderId: `ORD-${Math.floor(Math.random() * 99999)}`, value: amount };
    }
    case 'users': {
      const type = userEvents[Math.floor(Math.random() * userEvents.length)];
      streamState.users.total++;
      return { ...base, type, userId: `USR-${Math.floor(Math.random() * 9999)}`, value: 1 };
    }
    case 'system': {
      const type = systemEvents[Math.floor(Math.random() * systemEvents.length)];
      const duration = parseFloat((Math.random() * 100).toFixed(1));
      streamState.system.total++;
      return { ...base, type, duration, value: duration };
    }
    case 'errors': {
      const type = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      const severity = Math.random() < 0.2 ? 'CRITICAL' : Math.random() < 0.5 ? 'HIGH' : 'MEDIUM';
      streamState.errors.total++;
      return { ...base, type, severity, value: severity === 'CRITICAL' ? 3 : severity === 'HIGH' ? 2 : 1 };
    }
  }
}

function generatePayload() {
  updateMetrics();

  // Pick 1-3 random streams to emit events from
  const numEvents = Math.floor(Math.random() * 3) + 1;
  const selectedStreams = [...streams].sort(() => Math.random() - 0.5).slice(0, numEvents);
  const events = selectedStreams.map(s => generateEvent(s));

  // Update rates
  streams.forEach(s => {
    streamState[s].rate = parseFloat((Math.random() * 50 + 5).toFixed(1));
  });

  return {
    type: 'update',
    timestamp: Date.now(),
    metrics: { ...metrics },
    events,
    streamStats: { ...streamState },
  };
}

wss.on('connection', (ws, req) => {
  const addr = req.socket.remoteAddress;
  console.log(`[WS] Client connected from ${addr}`);

  // Send initial handshake
  ws.send(JSON.stringify({ type: 'connected', message: 'STREAMDASH WebSocket connected', streams }));

  // Send initial full state
  ws.send(JSON.stringify({ ...generatePayload(), type: 'init' }));

  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(generatePayload()));
    }
  }, 500);

  ws.on('close', () => {
    console.log(`[WS] Client disconnected`);
    clearInterval(interval);
  });

  ws.on('error', (err) => {
    console.error('[WS] Error:', err.message);
    clearInterval(interval);
  });
});

console.log(`STREAMDASH WebSocket server running on ws://localhost:${PORT}`);
