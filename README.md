# ⚡ StreamDash

> **Real-time event dashboard — live metrics, streaming events, and system health at a glance.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-6366f1?style=for-the-badge&logo=vercel)](https://streamdash-virid.vercel.app)

---

## ✨ Features

- 📡 **Live WebSocket feed** — events stream continuously from the Node.js server via the `ws` library; the UI updates without any polling
- 📊 **Real-time charts** — CPU, memory, request rate, error rate, and latency rendered with Recharts, updating every second
- 🌊 **Multi-stream support** — independent event streams for `orders`, `users`, `system`, and `errors`, each with live rate indicators
- 🎛️ **Simulated load spikes** — server randomly shifts metric targets to simulate real traffic bursts, making the dashboard look alive
- 🎨 **Tailwind CSS UI** — clean dark-mode dashboard with color-coded severity indicators
- 🎬 **Smooth animations** — panel transitions and chart updates via Framer Motion
- ☁️ **Railway-ready** — `railway.toml` included for one-click WebSocket server deployment

---

## 🖼️ Screenshot

> _Add a screenshot here — e.g. `public/screenshot.png`_

![StreamDash Screenshot](public/screenshot.png)

---

## 🛠️ Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=fff)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%203-06B6D4?style=flat-square&logo=tailwindcss&logoColor=fff)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite%207-646CFF?style=flat-square&logo=vite&logoColor=fff)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=fff)
![WebSockets](https://img.shields.io/badge/WebSockets%20(ws)-010101?style=flat-square)

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+

### 1. Clone the repo

```bash
git clone https://github.com/pratham7711/streamdash.git
cd streamdash
npm install
```

### 2. Start the WebSocket server

```bash
npm run server      # starts on ws://localhost:8080
```

### 3. Start the frontend

```bash
npm run dev         # Vite dev server at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) — metrics and events will start flowing immediately.

---

## 🌐 Environment Variables

```env
# Optional — override the WebSocket server URL
VITE_WS_URL=wss://your-server.up.railway.app
```

Without `VITE_WS_URL`, the frontend connects to `ws://localhost:8080` in development.

---

## ☁️ Deployment

**Frontend → Vercel**

```bash
vercel deploy --prod
```

Set `VITE_WS_URL` in Vercel environment variables to point at your deployed server.

**WebSocket Server → Railway**

The `railway.toml` configures the server automatically:

1. Create a new Railway project from this repo
2. Railway runs `node server.js` on the assigned `PORT`
3. Copy the Railway public URL → set as `VITE_WS_URL` in Vercel

---

## 📁 Project Structure

```
streamdash/
├── server.js         # Node.js WebSocket server (event + metrics simulation)
├── src/
│   ├── components/   # MetricsPanel, EventFeed, Charts
│   ├── hooks/        # useWebSocket, useMetrics
│   └── types/        # Event and metric TypeScript interfaces
├── railway.toml      # Railway deployment config
└── tailwind.config.js
```

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<p align="center">Built by <a href="https://github.com/pratham7711">Pratham</a> · Powered by Node.js + WebSockets + Recharts</p>
