import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

dotenv.config();

let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (e) {
  console.warn('Failed to load firebase-applet-config.json:', e);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// CENTRAL MARKET ENGINE
// ---------------------------------------------------------
interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isClosed: boolean;
}

const activeInstruments: Record<string, any> = {};
const currentCandles: Record<string, Candle> = {};
const history: Record<string, Candle[]> = {};

const defaultInstruments = [
  { id: 'EURUSD', name: 'EUR/USD', symbol: 'EURUSDT', category: 'Currencies', status: 'OPEN' },
  { id: 'GBPUSD', name: 'GBP/USD', symbol: 'GBPUSDT', category: 'Currencies', status: 'OPEN' },
  { id: 'XAUUSD', name: 'Gold', symbol: 'XAUUSDT', category: 'Metals', status: 'OPEN' },
  { id: 'BTCUSD', name: 'Bitcoin', symbol: 'BTCUSDT', category: 'Crypto', status: 'OPEN' },
  { id: 'ETHUSD', name: 'Ethereum', symbol: 'ETHUSDT', category: 'Crypto', status: 'OPEN' },
  { id: 'USDJPY', name: 'USD/JPY', symbol: 'USDJPY', category: 'Currencies', status: 'OPEN' },
];

// Pre-initialize instruments in memory immediately
defaultInstruments.forEach(inst => {
  activeInstruments[inst.id] = inst;
  history[inst.id] = [];
  fetchInitialHistory(inst.id, inst);
});

// Sync instruments from Firestore without blocking server boot
async function syncInstruments() {
  try {
    const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${dbId}/documents/instruments?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log('No instruments found in Firestore REST, keeping in-memory defaults.');
      return;
    }
    const json: any = await res.json();
    const documents = json.documents || [];
    if (documents.length === 0) {
      console.log('No instruments found in Firestore, keeping in-memory defaults.');
      return;
    }
    
    documents.forEach((docItem: any) => {
      const nameParts = (docItem.name || '').split('/');
      const docId = nameParts[nameParts.length - 1];
      const fields = docItem.fields || {};
      const data: any = {};
      for (const [k, v] of Object.entries(fields)) {
        data[k] = (v as any).stringValue ?? (v as any).integerValue ?? (v as any).doubleValue ?? (v as any).booleanValue ?? v;
      }
      activeInstruments[docId] = data;
      if (!history[docId]) {
        history[docId] = [];
        fetchInitialHistory(docId, data);
      }
    });
    console.log(`Synced ${documents.length} instruments from Firestore`);
  } catch(e: any) {
    console.warn("Notice: Using memory-backed instruments (Firestore sync fallback):", e?.message || e);
  }
}

// Initial fetch from Binance for standard crypto/forex
async function fetchInitialHistory(id: string, data: any) {
  let symbol = data.symbol || id;
  if (id === 'EURUSD') symbol = 'EURUSDT';
  if (id === 'GBPUSD') symbol = 'GBPUSDT';
  if (id === 'XAUUSD') symbol = 'XAUUSDT';
  if (id === 'USDJPY') symbol = 'USDJPY';
  
  try {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=1000`);
    if (res.ok) {
      const json: any = await res.json();
      const candles = json.map((d: any) => ({
        time: Math.floor(d[0] / 1000),
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5]),
        isClosed: true
      }));
      history[id] = candles;
      const last = candles[candles.length - 1];
      if (last) {
        currentCandles[id] = { ...last, isClosed: false };
      }
      console.log(`Loaded ${candles.length} history candles for ${id}`);
    } else {
      history[id] = [];
      currentCandles[id] = { time: Math.floor(Date.now()/60000)*60, open: 100, high: 100, low: 100, close: 100, volume: 0, isClosed: false };
    }
  } catch (e: any) {
    history[id] = [];
    currentCandles[id] = { time: Math.floor(Date.now()/60000)*60, open: 100, high: 100, low: 100, close: 100, volume: 0, isClosed: false };
  }
}

// Connect to Binance WS for real-time ticks
function startBinanceWS() {
  try {
    const binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    
    binanceWs.on('open', () => console.log('Connected to Binance WS'));
    
    binanceWs.on('message', (data) => {
      try {
        const ticks = JSON.parse(data.toString());
        const now = Math.floor(Date.now() / 1000);
        
        ticks.forEach((tick: any) => {
          const binanceSymbol = tick.s;
          let price = parseFloat(tick.c);
          
          Object.keys(activeInstruments).forEach(id => {
            let s = activeInstruments[id].symbol || id;
            if (id === 'EURUSD') s = 'EURUSDT';
            if (id === 'GBPUSD') s = 'GBPUSDT';
            if (id === 'XAUUSD') s = 'XAUUSDT';
            if (s === binanceSymbol) {
               processTick(id, price, now);
            }
          });
        });
      } catch (e) {}
    });

    binanceWs.on('close', () => {
      console.log('Binance WS closed, reconnecting in 5s...');
      setTimeout(startBinanceWS, 5000);
    });
    
    binanceWs.on('error', (err) => {
      console.error('Binance WS error:', err.message);
    });
  } catch (err: any) {
    console.error('Could not start Binance WS:', err.message);
  }
}

function getSymbolBasePrice(sym: string): number {
  const s = (sym || '').toLowerCase();
  if (s.includes('nikkei')) return 38540;
  if (s.includes('btc') || s.includes('bitcoin')) return 67450;
  if (s.includes('eth') || s.includes('ethereum')) return 2645;
  if (s.includes('sol') || s.includes('solana')) return 152;
  if (s.includes('gold') || s.includes('xau')) return 2685;
  if (s.includes('crude') || s.includes('oil')) return 71.8;
  if (s.includes('jpy')) return 152.4;
  if (s.includes('inr')) return 84.15;
  if (s.includes('pkr')) return 278.4;
  if (s.includes('brl')) return 5.62;
  if (s.includes('mxn')) return 19.35;
  if (s.includes('zar')) return 17.8;
  if (s.includes('egp')) return 48.6;
  if (s.includes('gbp')) return 1.298;
  if (s.includes('aud')) return 0.665;
  if (s.includes('cad')) return 1.385;
  if (s.includes('chf')) return 0.865;
  if (s.includes('eur')) return 1.086;
  if (s.includes('aapl')) return 232;
  if (s.includes('tsla')) return 224;
  return 100;
}

function generateHistoryForSymbol(id: string, basePrice?: number): Candle[] {
  const price = basePrice || getSymbolBasePrice(id);
  const candles: Candle[] = [];
  const nowMin = Math.floor(Date.now() / 60000) * 60;
  let currentClose = price;
  const volBase = (price * 0.0015);
  let trend = 0;

  for (let i = 0; i < 200; i++) {
    if (i % 12 === 0) trend = (Math.random() - 0.5) * (volBase * 1.5);
    const close = currentClose;
    const open = close - (Math.random() - 0.5) * volBase - trend;
    const high = Math.max(open, close) + Math.random() * (volBase * 0.8);
    const low = Math.min(open, close) - Math.random() * (volBase * 0.8);
    candles.unshift({
      time: nowMin - (i * 60),
      open: Number(open.toFixed(price < 10 ? 5 : (price < 1000 ? 3 : 2))),
      high: Number(high.toFixed(price < 10 ? 5 : (price < 1000 ? 3 : 2))),
      low: Number(low.toFixed(price < 10 ? 5 : (price < 1000 ? 3 : 2))),
      close: Number(close.toFixed(price < 10 ? 5 : (price < 1000 ? 3 : 2))),
      volume: Math.round(Math.random() * 500 + 100),
      isClosed: true
    });
    currentClose = open;
  }
  return candles;
}

function normalizeId(id: string): string {
  return (id || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function getHistoryForId(rawId: string): Candle[] {
  if (history[rawId] && history[rawId].length > 0) return history[rawId];
  const norm = normalizeId(rawId);
  if (history[norm] && history[norm].length > 0) return history[norm];

  // Check known aliases
  for (const k of Object.keys(history)) {
    if (normalizeId(k) === norm && history[k].length > 0) {
      history[rawId] = history[k];
      return history[k];
    }
  }

  // Not found: generate realistic candles immediately
  const candles = generateHistoryForSymbol(rawId);
  history[rawId] = candles;
  history[norm] = candles;
  const last = candles[candles.length - 1];
  currentCandles[rawId] = { ...last, isClosed: false };
  currentCandles[norm] = { ...last, isClosed: false };
  activeInstruments[rawId] = { id: rawId, name: rawId, status: 'OPEN' };
  activeInstruments[norm] = { id: norm, name: rawId, status: 'OPEN' };
  return candles;
}

function processTick(id: string, price: number, now: number) {
  const minuteCurrent = Math.floor(now / 60) * 60;
  const norm = normalizeId(id);
  let candle = currentCandles[id] || currentCandles[norm];
  
  if (!candle || candle.time !== minuteCurrent) {
     if (candle) {
        candle.isClosed = true;
        if (!history[id]) history[id] = [];
        history[id].push({ ...candle });
        if (history[id].length > 1000) history[id].shift();

        if (norm !== id) {
          if (!history[norm]) history[norm] = [];
          history[norm].push({ ...candle });
          if (history[norm].length > 1000) history[norm].shift();
        }
     }
     
     candle = {
        time: minuteCurrent,
        open: price,
        high: price,
        low: price,
        close: price,
        volume: 0,
        isClosed: false
     };
     currentCandles[id] = candle;
     currentCandles[norm] = candle;
  } else {
     candle.close = price;
     if (price > candle.high) candle.high = price;
     if (price < candle.low) candle.low = price;
     currentCandles[id] = candle;
     currentCandles[norm] = candle;
  }
  
  // Broadcast to subscribed clients and general market feed
  const payload = {
    instrumentId: id,
    normalizedId: norm,
    price,
    timestamp: now,
    candle
  };
  io.to(id).emit('market:tick', payload);
  if (norm !== id) io.to(norm).emit('market:tick', payload);
  io.emit('market:price', {
     instrumentId: id,
     normalizedId: norm,
     price,
     timestamp: now
  });
}

// Fallback/Simulated ticking for OTC or missing pairs
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  Object.keys(activeInstruments).forEach(id => {
     if (id.includes('OTC') || id.includes('otc') || id.includes('nikkei') || id === 'APPLE' || id === 'TSLA' || !currentCandles[id]) {
        const base = getSymbolBasePrice(id);
        let price = currentCandles[id]?.close || base;
        let drift = 0;
        const maxDev = base * 0.005;
        if (price > base + maxDev) {
           drift = -0.00015 * price;
        } else if (price < base - maxDev) {
           drift = 0.00015 * price;
        }
        let change = (Math.random() - 0.5) * (price * 0.0003) + drift;
        price = Number((price + change).toFixed(price < 10 ? 5 : (price < 1000 ? 3 : 2)));
        const upperBound = base * 1.0035;
        const lowerBound = base * 0.9965;
        price = Math.max(lowerBound, Math.min(upperBound, price));
        price = Number(price.toFixed(price < 10 ? 5 : (price < 1000 ? 3 : 2)));
        processTick(id, price, now);
     }
  });
}, 1000);

// API endpoint for historical data
app.get('/api/market/history/:id', (req, res) => {
  const id = req.params.id;
  const data = getHistoryForId(id);
  res.json(data);
});

// API endpoint for current prices and market status
app.get('/api/market/prices', (req, res) => {
  const result: Record<string, any> = {};
  Object.keys(activeInstruments).forEach(id => {
    result[id] = {
      currentPrice: currentCandles[id]?.close || getSymbolBasePrice(id),
      lastUpdate: Math.floor(Date.now() / 1000),
      marketStatus: activeInstruments[id]?.status || 'OPEN'
    };
  });
  res.json(result);
});

// Periodic sync
setInterval(syncInstruments, 60000);
syncInstruments().then(() => startBinanceWS());

io.on('connection', (socket) => {
  socket.on('subscribe', (instrumentId) => {
     Array.from(socket.rooms).forEach(room => {
        if (room !== socket.id) socket.leave(room);
     });
     socket.join(instrumentId);
     const norm = normalizeId(instrumentId);
     if (norm !== instrumentId) socket.join(norm);

     const candles = getHistoryForId(instrumentId);
     const candle = currentCandles[instrumentId] || currentCandles[norm] || (candles && candles[candles.length - 1]);
     
     if (candle) {
        socket.emit('market:tick', {
           instrumentId,
           normalizedId: norm,
           price: candle.close,
           timestamp: Math.floor(Date.now() / 1000),
           candle
        });
     }
  });
});

// ---------------------------------------------------------

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
} else {
  import('vite').then(async (vite) => {
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(viteServer.middlewares);
  });
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
