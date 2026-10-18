import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, IChartApi, AreaSeries, CandlestickSeries, BarSeries, LineSeries, HistogramSeries } from 'lightweight-charts';
import { IndicatorEngine } from '../utils/IndicatorEngine';
import { ChartDrawingOverlay, DrawingShape } from './ChartDrawingOverlay';

interface MiniChartProps {
  themeMode: string;
  asset: string;
  timeframe: string;
  chartType: string;
  indicators: string[];
  drawings?: DrawingShape[];
  screenNumber?: number;
  chartLayout?: string;
  pendingDrawing?: string | null;
  onAddDrawing?: (drawing: DrawingShape) => void;
  onSelect?: () => void;
  zoomSpan?: number;
  onZoomChange?: (span: number) => void;
}

const generateInitialCandles = (endPrice: number, timeframe: number = 60000) => {
  const candles: any[] = [];
  const now = Math.floor(Date.now() / timeframe) * timeframe;
  let currentClose = endPrice;
  const volBase = (endPrice * 0.005) * Math.sqrt(timeframe / 60000);
  let trend = 0;

  for (let i = 0; i < 200; i++) {
    if (i % 20 === 0) trend = (Math.random() - 0.5) * (volBase * 1.5);
    const close = currentClose;
    const open = close - (Math.random() - 0.5) * volBase - trend;
    const high = Math.max(open, close) + Math.random() * (volBase);
    const low = Math.min(open, close) - Math.random() * (volBase);
    
    candles.unshift({ 
      time: (now - i * timeframe) / 1000, 
      open, high, low, close,
      volume: Math.random() * 100 + 50
    });
    currentClose = open;
  }
  return candles;
};

export default function MiniChart({ 
  themeMode, 
  asset, 
  timeframe, 
  chartType, 
  indicators, 
  drawings = [], 
  screenNumber,
  chartLayout,
  pendingDrawing,
  onAddDrawing,
  onSelect,
  zoomSpan,
  onZoomChange
}: MiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const indicatorsRef = useRef<Map<string, any[]>>(new Map());
  
  const latestPriceRef = useRef(0);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const dataRef = useRef<any[]>([]);

  // Candle hover & OHLC state (Requirement 1 & 2)
  const [hoveredCandle, setHoveredCandle] = useState<{ open: number; high: number; low: number; close: number; time?: any } | null>(null);

  // Drawing state on sub-chart without pre-selection (Requirement 2)
  const [miniActiveDrawingId, setMiniActiveDrawingId] = useState<string | null>(null);
  const [miniDrawingPoints, setMiniDrawingPoints] = useState<any[]>([]);
  const [miniCrosshairPoint, setMiniCrosshairPoint] = useState<any | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const isLight = themeMode === 'Light Mode';
    const isTwilight = themeMode === 'Twilight';

    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: isLight ? '#ffffff' : '#12161f' },
        textColor: isLight ? '#6b7280' : '#8390a0',
      },
      grid: {
        vertLines: { color: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: { mode: 1 },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: isLight ? '#f0f0f0' : '#2a303d',
        rightOffset: 12,
        barSpacing: 28,
        minBarSpacing: 3,
        maxBarSpacing: 80,
      },
      rightPriceScale: {
        borderColor: isLight ? '#f0f0f0' : '#2a303d',
        autoScale: true,
        scaleMargins: {
          top: 0.18,
          bottom: 0.18,
        },
      },
    });

    chartRef.current = chart;

    let series: ISeriesApi<any>;
    if (chartType === 'Area') {
      series = chart.addSeries(AreaSeries, {
        topColor: 'rgba(30, 136, 229, 0.56)',
        bottomColor: 'rgba(30, 136, 229, 0.04)',
        lineColor: 'rgba(30, 136, 229, 1)',
        lineWidth: 2,
      });
    } else if (chartType === 'Bars') {
      series = chart.addSeries(BarSeries, {
        upColor: '#0ba259',
        downColor: '#e33f4a',
      });
    } else if (chartType === 'Line') {
      series = chart.addSeries(LineSeries, {
        color: '#1e88e5',
        lineWidth: 2,
      });
    } else {
      series = chart.addSeries(CandlestickSeries, {
        upColor: '#0ba259',
        downColor: '#e33f4a',
        borderVisible: false,
        wickUpColor: '#0ba259',
        wickDownColor: '#e33f4a',
      });
    }
    
    seriesRef.current = series;

    // Crosshair candle hover listener for displaying OHLC under blue line (Req 1 & 2)
    const crosshairHandler = (param: any) => {
      if (!param || !param.point || !seriesRef.current) {
        setHoveredCandle(null);
        return;
      }
      let candle: any = null;
      if (param.seriesData && seriesRef.current) {
        candle = param.seriesData.get(seriesRef.current);
      }
      if (!candle && dataRef.current && dataRef.current.length > 0) {
        try {
          const logical = chart.timeScale().coordinateToLogical(param.point.x);
          if (logical !== null && logical !== undefined) {
            const idx = Math.round(Number(logical));
            if (idx >= 0 && idx < dataRef.current.length) {
              candle = dataRef.current[idx];
            }
          }
        } catch (_) {}
      }
      if (candle && typeof candle.open === 'number') {
        setHoveredCandle({
          open: Number(candle.open),
          high: Number(candle.high),
          low: Number(candle.low),
          close: Number(candle.close),
          time: candle.time
        });
      } else {
        setHoveredCandle(null);
      }
    };
    chart.subscribeCrosshairMove(crosshairHandler);

    let isMounted = true;
    const loadData = async () => {
      const tfMs = timeframe === '1m' ? 60000 : timeframe === '5m' ? 300000 : timeframe === '15m' ? 900000 : 60000;
      let basePrice = 1.1;
      if (asset.includes('BTC')) basePrice = 60000;
      if (asset.includes('JPY')) basePrice = 150;
      if (asset.includes('Nikkei')) basePrice = 38000;
      if (asset.includes('Crude')) basePrice = 85;
      
      const mockCandles = generateInitialCandles(basePrice, tfMs);
      let formatted = mockCandles.map(c => ({
          time: c.time as any,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close
      }));
      
      if (isMounted) {
         series.setData(formatted);
         const last = formatted[formatted.length - 1];
         latestPriceRef.current = last.close;
         dataRef.current = formatted;
         setIsChartLoading(false);

         setTimeout(() => {
           try {
             chart.timeScale().applyOptions({ rightOffset: 12, barSpacing: 28 });
             chart.timeScale().scrollToRealTime();
           } catch (_) {}
         }, 50);
      }
      
      // ONLY if it's a real pair, try to fetch in background and replace quietly
      if (!asset.includes('OTC') && !asset.includes('Nikkei')) {
          try {
            let symbol = asset.replace('/', '');
            if (asset === 'GOLD') symbol = 'XAUUSD';
            
            const binanceMap: Record<string, string> = {
              '1m': '1m', '5m': '5m', '15m': '15m', '1h': '1h', '4h': '4h', '1d': '1d'
            };
            const interval = binanceMap[timeframe] || '1m';
            
            let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=200`;
            if (asset === 'AAPL' || asset === 'TSLA' || asset === 'AMZN') {
               url = `https://query1.finance.yahoo.com/v8/finance/chart/${asset}?interval=${interval}&range=5d`;
            }
            
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 2000);
            
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl, { signal: controller.signal });
            clearTimeout(id);
            
            if (res.ok) {
                const json = await res.json();
                const contents = json.contents || json;
                const data = typeof contents === 'string' ? JSON.parse(contents) : contents;
                
                let newFormatted: any[] = [];
                let fetchSuccess = false;
                
                if (Array.isArray(data)) {
                   newFormatted = data.map((d: any) => ({
                     time: (d[0] / 1000) as any,
                     open: parseFloat(d[1]),
                     high: parseFloat(d[2]),
                     low: parseFloat(d[3]),
                     close: parseFloat(d[4]),
                   })).sort((a:any,b:any) => (a.time as number) - (b.time as number));
                   fetchSuccess = true;
               } else if (data.chart && data.chart.result) {
                   const resData = data.chart.result[0];
                   const times = resData.timestamp;
                   const quotes = resData.indicators.quote[0];
                   
                   for (let i = 0; i < times.length; i++) {
                       if (quotes.close[i] !== null) {
                           newFormatted.push({
                               time: times[i] as any,
                               open: quotes.open[i],
                               high: quotes.high[i],
                               low: quotes.low[i],
                               close: quotes.close[i]
                           });
                       }
                   }
                   fetchSuccess = true;
               }
               
               if (fetchSuccess && isMounted && newFormatted.length > 0) {
                   series.setData(newFormatted);
                   const last = newFormatted[newFormatted.length - 1];
                   latestPriceRef.current = last.close;
                   dataRef.current = newFormatted;
               }
            }
          } catch (e) {
              // Keep instant mock data
          }
      }
    };
    
    loadData();

    const intervalId = setInterval(() => {
       if (!seriesRef.current || !latestPriceRef.current) return;
       const newPrice = latestPriceRef.current + (Math.random() - 0.5) * (latestPriceRef.current * 0.0005);
       latestPriceRef.current = newPrice;
       const now = Math.floor(Date.now() / 1000);
       
       if (chartType === 'Area' || chartType === 'Line') {
           seriesRef.current.update({ time: now as any, value: newPrice });
       } else {
           const time = now - (now % 60);
           seriesRef.current.update({ 
               time: time as any, 
               open: latestPriceRef.current, 
               high: latestPriceRef.current + (latestPriceRef.current * 0.0001), 
               low: latestPriceRef.current - (latestPriceRef.current * 0.0001), 
               close: newPrice 
           });
       }
       
       // Update indicators with new price
       if (dataRef.current.length > 0) {
           const lastCandle = dataRef.current[dataRef.current.length - 1];
           lastCandle.close = newPrice;
           
           indicators.forEach(indicator => {
               const result = IndicatorEngine.calculate(indicator, dataRef.current);
               if (!result) return;
               
               const seriesList = indicatorsRef.current.get(indicator);
               if (!seriesList) return;
               
               if (result.data && result.data.length > 0) {
                   const last = result.data[result.data.length - 1];
                   if (last.time >= lastCandle.time) {
                       const mainSeries = seriesList.find(s => s.id === 'main');
                       if (mainSeries) mainSeries.series.update(last);
                   }
               }
               
               if (result.lines && result.lines.length > 0) {
                   result.lines.forEach(l => {
                       if (l.data && l.data.length > 0) {
                           const last = l.data[l.data.length - 1];
                           if (last.time >= lastCandle.time) {
                               const lineSeries = seriesList.find(s => s.id === l.id);
                               if (lineSeries) lineSeries.series.update(last);
                           }
                       }
                   });
               }
           });
       }
       
    }, 1500);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      chart.remove();
      indicatorsRef.current.clear();
    };
  }, [themeMode, asset, timeframe, chartType]);


  // Indicator Effect
  useEffect(() => {
    if (!chartRef.current || dataRef.current.length === 0) return;
    const chart = chartRef.current;
    
    // Clear old indicators
    Array.from(indicatorsRef.current.entries()).forEach(([name, seriesList]) => {
        if (!indicators.includes(name)) {
            seriesList.forEach(s => {
                try { chart.removeSeries(s.series); } catch(e) {}
            });
            indicatorsRef.current.delete(name);
        }
    });

    // Add new indicators
    indicators.forEach(indicator => {
       if (indicatorsRef.current.has(indicator)) return;
       const result = IndicatorEngine.calculate(indicator, dataRef.current);
       if (!result) return;
       
       const seriesList: any[] = [];
       const isOscillator = result.type === 'oscillator';
       
       if (result.data && result.data.length > 0) {
           const series = chart.addSeries(LineSeries, { 
               color: '#2962FF', lineWidth: 2, 
               priceScaleId: isOscillator ? indicator : 'right' 
           });
           series.setData(result.data as any);
           seriesList.push({ type: 'line', series, id: 'main' });
       }
       
       if (result.lines) {
           result.lines.forEach(l => {
               const series = chart.addSeries(LineSeries, { 
                   color: l.color, lineWidth: 2, 
                   priceScaleId: isOscillator ? indicator : 'right' 
               });
               if (l.data) series.setData(l.data as any);
               seriesList.push({ type: 'line', series, id: l.id });
           });
       }
       
       if (result.histograms) {
           result.histograms.forEach(h => {
               const series = chart.addSeries(HistogramSeries, {
                   color: h.color || '#26a69a',
                   priceScaleId: isOscillator ? indicator : 'right'
               });
               if (h.data) series.setData(h.data as any);
               seriesList.push({ type: 'histogram', series, id: h.id });
           });
       }
       
       if (isOscillator) {
           chart.priceScale(indicator).applyOptions({
               scaleMargins: { top: 0.8, bottom: 0 },
           });
       }
       
       indicatorsRef.current.set(indicator, seriesList);
    });
  }, [indicators, asset, timeframe, chartType, isChartLoading]);

  return (
    <div className="relative w-full h-full overflow-hidden">
       {/* Candle OHLC inside this sub-chart tile, strictly bounded to never overflow into other charts (Req 2 & 3) */}
       {hoveredCandle && (() => {
         const diff = hoveredCandle.close - hoveredCandle.open;
         const diffPct = hoveredCandle.open > 0 ? (diff / hoveredCandle.open) * 100 : 0;
         const isUp = diff >= 0;
         const decimals = asset.toLowerCase().includes('crypto') || asset.toLowerCase().includes('btc') || asset.toLowerCase().includes('nikkei') || asset.toLowerCase().includes('jpy') || asset.toLowerCase().includes('crude') || (hoveredCandle.close >= 100) ? 2 : 5;

         return (
           <div className={`absolute top-3 ${screenNumber === 1 ? 'left-16' : 'left-3'} z-20 pointer-events-none select-none max-w-[calc(100%-85px)] overflow-hidden`}>
             <div className={`px-2 py-0.5 rounded-md border backdrop-blur-md shadow-md flex items-center gap-1.5 font-mono text-[9.5px] leading-tight max-w-full overflow-hidden truncate ${
               themeMode === 'Light Mode'
                 ? 'bg-white/95 border-gray-200 text-gray-800 shadow-sm'
                 : 'bg-[#18202d]/95 border-[#283244] text-gray-200 shadow-black/40'
             }`}>
               <div className="flex items-center gap-0.5 shrink-0">
                 <span className="text-gray-400 font-sans text-[8.5px]">O:</span>
                 <span className="font-semibold">{hoveredCandle.open.toFixed(decimals)}</span>
               </div>
               <div className="flex items-center gap-0.5 shrink-0">
                 <span className="text-gray-400 font-sans text-[8.5px]">H:</span>
                 <span className="font-semibold">{hoveredCandle.high.toFixed(decimals)}</span>
               </div>
               <div className="flex items-center gap-0.5 shrink-0">
                 <span className="text-gray-400 font-sans text-[8.5px]">L:</span>
                 <span className="font-semibold">{hoveredCandle.low.toFixed(decimals)}</span>
               </div>
               <div className="flex items-center gap-0.5 shrink-0">
                 <span className="text-gray-400 font-sans text-[8.5px]">C:</span>
                 <span className={`font-bold ${isUp ? 'text-[#00c26f]' : 'text-[#ff4b55]'}`}>
                   {hoveredCandle.close.toFixed(decimals)}
                 </span>
               </div>
               <div className={`text-[9px] font-bold px-1 py-0.2 rounded text-center shrink-0 ${
                 isUp ? 'bg-[#00c26f]/15 text-[#00c26f]' : 'bg-[#ff4b55]/15 text-[#ff4b55]'
               }`}>
                 {isUp ? '+' : ''}{diff.toFixed(decimals)} ({isUp ? '+' : ''}{diffPct.toFixed(2)}%)
               </div>
             </div>
           </div>
         );
       })()}

       {/* Sub-chart corner tag at bottom-left shifted right to avoid overlap with toolbar (User Request 1: Restored to original position) */}
       <div className="absolute bottom-3 left-16 z-10 flex gap-2 pointer-events-none select-none">
          <div className="bg-[var(--bg-panel)]/90 backdrop-blur-md border border-[var(--border-color)] px-2.5 py-1 rounded flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] shadow-md">
             {screenNumber && (
               <span className="w-4 h-4 rounded-full bg-[#1e88e5]/20 text-[#1e88e5] flex items-center justify-center text-[10px] font-mono font-bold">
                 {screenNumber}
               </span>
             )}
             <span>{asset}</span>
             <span className="text-[10px] text-[var(--text-muted)] font-mono">· {timeframe}</span>
          </div>
       </div>

       {/* Interactive Chart Container */}
       <div 
         ref={chartContainerRef} 
         className="absolute inset-0 w-full h-full"
         onMouseLeave={() => setHoveredCandle(null)}
       />

       {/* Drawing Layer on MiniChart (Requirement 2: Plot drawing on any chart without selecting first) */}
       {pendingDrawing && (
         <div 
           className="absolute inset-0 z-30 cursor-crosshair" 
           style={{ touchAction: "none" }}
           onPointerDown={(e) => {
             if (!chartRef.current || !seriesRef.current) return;
             const rect = e.currentTarget.getBoundingClientRect();
             const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
             const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

             const timeScale = chartRef.current.timeScale();
             let logical = timeScale.coordinateToLogical(x);
             const vr = timeScale.getVisibleLogicalRange();
             if ((logical === null || logical === undefined) && vr && rect.width > 0) {
               const bars = vr.to - vr.from;
               logical = (vr.from + (x / rect.width) * bars) as any;
             }

             let price = seriesRef.current.coordinateToPrice(y);
             if (price === null) {
               price = seriesRef.current.coordinateToPrice(Math.max(5, Math.min(rect.height - 5, y)));
             }
             if (price === null && dataRef.current.length > 0) {
               price = dataRef.current[dataRef.current.length - 1].close;
             }

             const rawTime = timeScale.coordinateToTime(x);
             const time = rawTime ?? Math.floor(Date.now() / 1000);
             const point = {
               time: time as number,
               price: price ?? 0,
               logical: (logical !== null && logical !== undefined) ? Number(logical) : undefined
             };

             const type = pendingDrawing;
             const normType = (type || '').toLowerCase();
             const isSinglePoint = normType === 'horizontal line' || normType === 'vertical line' || normType === 'cross line';

             if (isSinglePoint) {
               const newId = Math.random().toString(36).substr(2, 9);
               onAddDrawing?.({
                 id: newId,
                 type,
                 points: [point],
                 color: '#1e88e5',
                 isComplete: true
               });
               setMiniActiveDrawingId(null);
               setMiniDrawingPoints([]);
               setMiniCrosshairPoint(null);
               onSelect?.();
             } else if (!miniActiveDrawingId) {
               const newId = Math.random().toString(36).substr(2, 9);
               setMiniActiveDrawingId(newId);
               setMiniDrawingPoints([point]);
               setMiniCrosshairPoint(point);
             } else {
               onAddDrawing?.({
                 id: miniActiveDrawingId,
                 type,
                 points: [...miniDrawingPoints, point],
                 color: '#1e88e5',
                 isComplete: true
               });
               setMiniActiveDrawingId(null);
               setMiniDrawingPoints([]);
               setMiniCrosshairPoint(null);
               onSelect?.();
             }
           }}
           onPointerMove={(e) => {
             if (!chartRef.current || !seriesRef.current || !miniActiveDrawingId) return;
             const rect = e.currentTarget.getBoundingClientRect();
             const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
             const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

             const timeScale = chartRef.current.timeScale();
             let logical = timeScale.coordinateToLogical(x);
             let price = seriesRef.current.coordinateToPrice(y);
             if (price === null && dataRef.current.length > 0) {
               price = dataRef.current[dataRef.current.length - 1].close;
             }
             const rawTime = timeScale.coordinateToTime(x);
             const time = rawTime ?? Math.floor(Date.now() / 1000);

             setMiniCrosshairPoint({
               time: time as number,
               price: price ?? 0,
               logical: (logical !== null && logical !== undefined) ? Number(logical) : undefined
             });
           }}
         />
       )}

       <ChartDrawingOverlay 
         chart={chartRef.current} 
         series={seriesRef.current} 
         drawings={drawings} 
         crosshairPoint={miniCrosshairPoint} 
         activeDrawingId={miniActiveDrawingId} 
       />
    </div>
  );
}
