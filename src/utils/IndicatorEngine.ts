// IndicatorEngine.ts - Complete 29 Indicators for ZORVEX

export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export type IndicatorResult = {
    name: string;
    type: 'overlay' | 'oscillator';
    data: any[]; // Line data
    color?: string;
    lineWidth?: number;
    lines?: { id: string; color: string; lineWidth?: number; data: any[] }[]; // Multiple lines
    histograms?: { id: string; color: string; data: any[] }[]; // Histograms
    bands?: { id: string; top: any[]; bottom: any[]; color: string }[];
    markers?: { time: number; position: 'aboveBar' | 'belowBar'; color: string; shape: string; text?: string }[];
};

export interface IndicatorParamDef {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
}

export interface IndicatorPlotDef {
    id: string;
    label: string;
    defaultColor: string;
    defaultLineWidth: number;
}

export interface IndicatorMeta {
    name: string;
    type: 'overlay' | 'oscillator';
    params: IndicatorParamDef[];
    plots: IndicatorPlotDef[];
}

export interface IndicatorSettings {
    name: string;
    visible?: boolean;
    params: Record<string, number>;
    plots: Record<string, { color: string; lineWidth: number }>;
}

export const INDICATOR_REGISTRY: Record<string, IndicatorMeta> = {
    // Trend (Overlays)
    'Moving Average': {
        name: 'Moving Average',
        type: 'overlay',
        params: [
            { id: 'period', label: 'Period', min: 1, max: 200, step: 1, defaultValue: 14 }
        ],
        plots: [
            { id: 'ma', label: 'MA', defaultColor: '#ffd600', defaultLineWidth: 2 }
        ]
    },
    'Bollinger Bands': {
        name: 'Bollinger Bands',
        type: 'overlay',
        params: [
            { id: 'period', label: 'Period', min: 5, max: 100, step: 1, defaultValue: 20 },
            { id: 'deviation', label: 'Deviation', min: 1, max: 10, step: 0.5, defaultValue: 2 }
        ],
        plots: [
            { id: 'middle', label: 'Basis', defaultColor: '#ff9800', defaultLineWidth: 1 },
            { id: 'Upper', label: 'Upper', defaultColor: '#2979ff', defaultLineWidth: 1 },
            { id: 'Lower', label: 'Lower', defaultColor: '#2979ff', defaultLineWidth: 1 }
        ]
    },
    'Alligator': {
        name: 'Alligator',
        type: 'overlay',
        params: [
            { id: 'jaws', label: 'Jaws Period', min: 1, max: 100, step: 1, defaultValue: 13 },
            { id: 'teeth', label: 'Teeth Period', min: 1, max: 100, step: 1, defaultValue: 8 },
            { id: 'lips', label: 'Lips Period', min: 1, max: 100, step: 1, defaultValue: 5 }
        ],
        plots: [
            { id: 'Jaw', label: 'Jaw', defaultColor: '#2979ff', defaultLineWidth: 2 },
            { id: 'Teeth', label: 'Teeth', defaultColor: '#ff1744', defaultLineWidth: 2 },
            { id: 'Lips', label: 'Lips', defaultColor: '#00e676', defaultLineWidth: 2 }
        ]
    },
    'Envelopes': {
        name: 'Envelopes',
        type: 'overlay',
        params: [
            { id: 'period', label: 'Period', min: 5, max: 100, step: 1, defaultValue: 20 },
            { id: 'deviation', label: 'Deviation %', min: 0.01, max: 0.1, step: 0.01, defaultValue: 0.02 }
        ],
        plots: [
            { id: 'middle', label: 'Basis', defaultColor: '#ffd600', defaultLineWidth: 1 },
            { id: 'Upper', label: 'Upper', defaultColor: '#ff9800', defaultLineWidth: 1 },
            { id: 'Lower', label: 'Lower', defaultColor: '#ff9800', defaultLineWidth: 1 }
        ]
    },
    'Fractal': {
        name: 'Fractal',
        type: 'overlay',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 10, step: 1, defaultValue: 2 }
        ],
        plots: [
            { id: 'fractal', label: 'Fractal Markers', defaultColor: '#00e676', defaultLineWidth: 2 }
        ]
    },
    'Ichimoku Cloud': {
        name: 'Ichimoku Cloud',
        type: 'overlay',
        params: [
            { id: 'conversion', label: 'Conversion Line', min: 1, max: 50, step: 1, defaultValue: 9 },
            { id: 'base', label: 'Base Line', min: 1, max: 100, step: 1, defaultValue: 26 },
            { id: 'spanB', label: 'Leading Span B', min: 1, max: 200, step: 1, defaultValue: 52 }
        ],
        plots: [
            { id: 'Tenkan', label: 'Tenkan-sen', defaultColor: '#2196F3', defaultLineWidth: 2 },
            { id: 'Kijun', label: 'Kijun-sen', defaultColor: '#F44336', defaultLineWidth: 2 },
            { id: 'SpanA', label: 'Senkou Span A', defaultColor: '#4CAF50', defaultLineWidth: 1 },
            { id: 'SpanB', label: 'Senkou Span B', defaultColor: '#FF9800', defaultLineWidth: 1 }
        ]
    },
    'Keltner Channel': {
        name: 'Keltner Channel',
        type: 'overlay',
        params: [
            { id: 'period', label: 'Period', min: 5, max: 100, step: 1, defaultValue: 20 },
            { id: 'multiplier', label: 'Multiplier', min: 1, max: 5, step: 0.5, defaultValue: 2 }
        ],
        plots: [
            { id: 'middle', label: 'Basis', defaultColor: '#ffd600', defaultLineWidth: 1 },
            { id: 'Upper', label: 'Upper', defaultColor: '#ffc107', defaultLineWidth: 1 },
            { id: 'Lower', label: 'Lower', defaultColor: '#ffc107', defaultLineWidth: 1 }
        ]
    },
    'Donchian Channel': {
        name: 'Donchian Channel',
        type: 'overlay',
        params: [
            { id: 'period', label: 'Period', min: 5, max: 100, step: 1, defaultValue: 20 }
        ],
        plots: [
            { id: 'middle', label: 'Basis', defaultColor: '#9c27b0', defaultLineWidth: 1 },
            { id: 'Upper', label: 'Upper', defaultColor: '#ba68c8', defaultLineWidth: 1 },
            { id: 'Lower', label: 'Lower', defaultColor: '#ba68c8', defaultLineWidth: 1 }
        ]
    },
    'Supertrend': {
        name: 'Supertrend',
        type: 'overlay',
        params: [
            { id: 'period', label: 'ATR Period', min: 2, max: 50, step: 1, defaultValue: 10 },
            { id: 'multiplier', label: 'Multiplier', min: 1, max: 10, step: 0.5, defaultValue: 3 }
        ],
        plots: [
            { id: 'supertrend', label: 'Supertrend Line', defaultColor: '#00e676', defaultLineWidth: 2 }
        ]
    },
    'Parabolic SAR': {
        name: 'Parabolic SAR',
        type: 'overlay',
        params: [
            { id: 'step', label: 'Start / Step', min: 0.01, max: 0.1, step: 0.01, defaultValue: 0.02 },
            { id: 'max', label: 'Maximum', min: 0.1, max: 1.0, step: 0.05, defaultValue: 0.2 }
        ],
        plots: [
            { id: 'PSAR', label: 'SAR Dots', defaultColor: '#e91e63', defaultLineWidth: 2 }
        ]
    },
    'Zig Zag': {
        name: 'Zig Zag',
        type: 'overlay',
        params: [
            { id: 'deviation', label: 'Deviation %', min: 1, max: 20, step: 1, defaultValue: 5 }
        ],
        plots: [
            { id: 'zigzag', label: 'Zig Zag Line', defaultColor: '#00e5ff', defaultLineWidth: 2 }
        ]
    },

    // Oscillators (Bottom sub-pane)
    'ADX': {
        name: 'ADX',
        type: 'oscillator',
        params: [
            { id: 'adxSmoothing', label: 'ADX Smoothing', min: 1, max: 100, step: 1, defaultValue: 14 },
            { id: 'diLength', label: 'DI Length', min: 1, max: 100, step: 1, defaultValue: 14 }
        ],
        plots: [
            { id: 'adx', label: 'ADX', defaultColor: '#00e676', defaultLineWidth: 2 },
            { id: 'plusDI', label: '+DI', defaultColor: '#2979ff', defaultLineWidth: 2 },
            { id: 'minusDI', label: '-DI', defaultColor: '#ff1744', defaultLineWidth: 2 }
        ]
    },
    'Aroon': {
        name: 'Aroon',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 5, max: 100, step: 1, defaultValue: 25 }
        ],
        plots: [
            { id: 'AroonUp', label: 'Aroon Up', defaultColor: '#00e676', defaultLineWidth: 2 },
            { id: 'AroonDown', label: 'Aroon Down', defaultColor: '#ff1744', defaultLineWidth: 2 }
        ]
    },
    'Awesome Oscillator': {
        name: 'Awesome Oscillator',
        type: 'oscillator',
        params: [
            { id: 'fast', label: 'Fast Period', min: 1, max: 100, step: 1, defaultValue: 5 },
            { id: 'slow', label: 'Slow Period', min: 1, max: 200, step: 1, defaultValue: 34 }
        ],
        plots: [
            { id: 'ao', label: 'AO', defaultColor: '#00e676', defaultLineWidth: 2 }
        ]
    },
    'Bears Power': {
        name: 'Bears Power',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 13 }
        ],
        plots: [
            { id: 'bears', label: 'Bears Power', defaultColor: '#ff1744', defaultLineWidth: 2 }
        ]
    },
    'Bulls Power': {
        name: 'Bulls Power',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 13 }
        ],
        plots: [
            { id: 'bulls', label: 'Bulls Power', defaultColor: '#00e676', defaultLineWidth: 2 }
        ]
    },
    'CCI': {
        name: 'CCI',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 20 }
        ],
        plots: [
            { id: 'cci', label: 'CCI', defaultColor: '#00e5ff', defaultLineWidth: 2 }
        ]
    },
    'Commodity Channel Index': {
        name: 'Commodity Channel Index',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 20 }
        ],
        plots: [
            { id: 'cci', label: 'CCI', defaultColor: '#00e5ff', defaultLineWidth: 2 }
        ]
    },
    'DeMarker': {
        name: 'DeMarker',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 14 }
        ],
        plots: [
            { id: 'demarker', label: 'DeMarker', defaultColor: '#2979ff', defaultLineWidth: 2 }
        ]
    },
    'ATR': {
        name: 'ATR',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 14 }
        ],
        plots: [
            { id: 'atr', label: 'ATR', defaultColor: '#ffd600', defaultLineWidth: 2 }
        ]
    },
    'MACD': {
        name: 'MACD',
        type: 'oscillator',
        params: [
            { id: 'fastPeriod', label: 'Fast Period', min: 2, max: 100, step: 1, defaultValue: 12 },
            { id: 'slowPeriod', label: 'Slow Period', min: 2, max: 200, step: 1, defaultValue: 26 },
            { id: 'signalPeriod', label: 'Signal Period', min: 1, max: 50, step: 1, defaultValue: 9 }
        ],
        plots: [
            { id: 'macd', label: 'MACD', defaultColor: '#2196F3', defaultLineWidth: 2 },
            { id: 'signal', label: 'Signal', defaultColor: '#FF9800', defaultLineWidth: 2 }
        ]
    },
    'Momentum': {
        name: 'Momentum',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 10 }
        ],
        plots: [
            { id: 'momentum', label: 'Momentum', defaultColor: '#2979ff', defaultLineWidth: 2 }
        ]
    },
    'RSI': {
        name: 'RSI',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 14 }
        ],
        plots: [
            { id: 'rsi', label: 'RSI', defaultColor: '#2979ff', defaultLineWidth: 2 }
        ]
    },
    'Relative Strength Index': {
        name: 'Relative Strength Index',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 14 }
        ],
        plots: [
            { id: 'rsi', label: 'RSI', defaultColor: '#2979ff', defaultLineWidth: 2 }
        ]
    },
    'Rate Of Change': {
        name: 'Rate Of Change',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 12 }
        ],
        plots: [
            { id: 'roc', label: 'ROC', defaultColor: '#e040fb', defaultLineWidth: 2 }
        ]
    },
    'Stochastic Oscillator': {
        name: 'Stochastic Oscillator',
        type: 'oscillator',
        params: [
            { id: 'kPeriod', label: '%K Period', min: 1, max: 100, step: 1, defaultValue: 14 },
            { id: 'dPeriod', label: '%D Period', min: 1, max: 50, step: 1, defaultValue: 3 },
            { id: 'slowing', label: 'Slowing', min: 1, max: 50, step: 1, defaultValue: 3 }
        ],
        plots: [
            { id: 'k', label: '%K', defaultColor: '#2196f3', defaultLineWidth: 2 },
            { id: 'd', label: '%D', defaultColor: '#ff9800', defaultLineWidth: 2 }
        ]
    },
    'Schaff Trend Cycle': {
        name: 'Schaff Trend Cycle',
        type: 'oscillator',
        params: [
            { id: 'cycle', label: 'Cycle Period', min: 5, max: 100, step: 1, defaultValue: 10 },
            { id: 'fast', label: 'Fast Period', min: 2, max: 100, step: 1, defaultValue: 23 },
            { id: 'slow', label: 'Slow Period', min: 2, max: 200, step: 1, defaultValue: 50 }
        ],
        plots: [
            { id: 'stc', label: 'STC', defaultColor: '#00e5ff', defaultLineWidth: 2 }
        ]
    },
    'Vortex': {
        name: 'Vortex',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 14 }
        ],
        plots: [
            { id: 'viPlus', label: 'VI+', defaultColor: '#00e676', defaultLineWidth: 2 },
            { id: 'viMinus', label: 'VI-', defaultColor: '#ff1744', defaultLineWidth: 2 }
        ]
    },
    'Volume Oscillator': {
        name: 'Volume Oscillator',
        type: 'oscillator',
        params: [
            { id: 'fast', label: 'Fast Period', min: 1, max: 100, step: 1, defaultValue: 14 },
            { id: 'slow', label: 'Slow Period', min: 1, max: 200, step: 1, defaultValue: 28 }
        ],
        plots: [
            { id: 'vo', label: 'Volume Oscillator', defaultColor: '#2979ff', defaultLineWidth: 2 }
        ]
    },
    'Williams %R': {
        name: 'Williams %R',
        type: 'oscillator',
        params: [
            { id: 'period', label: 'Period', min: 2, max: 100, step: 1, defaultValue: 14 }
        ],
        plots: [
            { id: 'wr', label: '%R', defaultColor: '#ff9800', defaultLineWidth: 2 }
        ]
    },
    'Weis Waves Volume Oscillator': {
        name: 'Weis Waves Volume Oscillator',
        type: 'oscillator',
        params: [
            { id: 'deviation', label: 'Deviation %', min: 1, max: 10, step: 0.5, defaultValue: 2 }
        ],
        plots: [
            { id: 'weis', label: 'Weis Waves', defaultColor: '#00e676', defaultLineWidth: 2 }
        ]
    }
};

export function getDefaultIndicatorSettings(indicatorName: string): IndicatorSettings {
    const meta = INDICATOR_REGISTRY[indicatorName];
    if (meta) {
        const params: Record<string, number> = {};
        meta.params.forEach(p => { params[p.id] = p.defaultValue; });
        const plots: Record<string, { color: string; lineWidth: number }> = {};
        meta.plots.forEach(pl => { plots[pl.id] = { color: pl.defaultColor, lineWidth: pl.defaultLineWidth }; });
        return { name: indicatorName, visible: true, params, plots };
    }
    // Generic fallback for any other indicator
    return {
        name: indicatorName,
        visible: true,
        params: { period: 14 },
        plots: { main: { color: '#2979ff', lineWidth: 2 } }
    };
}

// Helper Math Functions
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const sma = (data: number[], period: number) => {
    const res = [];
    let s = 0;
    for (let i = 0; i < data.length; i++) {
        s += data[i];
        if (i >= period) s -= data[i - period];
        if (i >= period - 1) res.push({ index: i, value: s / period });
    }
    return res;
};

const ema = (data: number[], period: number) => {
    const res = [];
    let k = 2 / (period + 1);
    let current = data[0];
    for (let i = 0; i < data.length; i++) {
        current = (data[i] - current) * k + current;
        if (i >= period - 1) res.push({ index: i, value: current });
    }
    return res;
};

const smma = (data: number[], period: number) => {
    const res = [];
    let current = sum(data.slice(0, period)) / period;
    for (let i = period - 1; i < data.length; i++) {
        if (i === period - 1) {
            res.push({ index: i, value: current });
        } else {
            current = (current * (period - 1) + data[i]) / period;
            res.push({ index: i, value: current });
        }
    }
    return res;
};

const rma = smma;

const getTrueRange = (candles: Candle[]) => {
    const tr = [0];
    for (let i = 1; i < candles.length; i++) {
        const h = candles[i].high;
        const l = candles[i].low;
        const pc = candles[i - 1].close;
        tr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
    }
    return tr;
};

const calcATR = (candles: Candle[], period: number) => {
    const tr = getTrueRange(candles);
    return rma(tr, period);
};

const highest = (data: number[], period: number) => {
    const res = [];
    for (let i = period - 1; i < data.length; i++) {
        let max = data[i];
        for (let j = 1; j < period; j++) if (data[i - j] > max) max = data[i - j];
        res.push({ index: i, value: max });
    }
    return res;
};

const lowest = (data: number[], period: number) => {
    const res = [];
    for (let i = period - 1; i < data.length; i++) {
        let min = data[i];
        for (let j = 1; j < period; j++) if (data[i - j] < min) min = data[i - j];
        res.push({ index: i, value: min });
    }
    return res;
};

// Indicator Calculators
export class IndicatorEngine {
    static calculate(indicatorName: string, candles: Candle[], settings?: IndicatorSettings): IndicatorResult {
        if (!candles || candles.length === 0) return { name: indicatorName, type: 'overlay', data: [] };
        
        const closes = candles.map(c => c.close);
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);
        const volumes = candles.map(c => c.volume || 0);
        const hl2 = candles.map(c => (c.high + c.low) / 2);
        const tp = candles.map(c => (c.high + c.low + c.close) / 3);

        const formatLine = (arr: {index: number, value: number}[]) => arr.map(a => ({ time: candles[a.index].time, value: a.value }));

        switch (indicatorName) {
            case 'Alligator': {
                const jaws = settings?.params?.jaws ?? 13;
                const teeth = settings?.params?.teeth ?? 8;
                const lips = settings?.params?.lips ?? 5;
                const jawColor = settings?.plots?.Jaw?.color || '#2196F3';
                const jawWidth = settings?.plots?.Jaw?.lineWidth || 2;
                const teethColor = settings?.plots?.Teeth?.color || '#F44336';
                const teethWidth = settings?.plots?.Teeth?.lineWidth || 2;
                const lipsColor = settings?.plots?.Lips?.color || '#00e676';
                const lipsWidth = settings?.plots?.Lips?.lineWidth || 2;

                const jaw = smma(hl2, jaws).map(a => ({ time: candles[Math.min(a.index + 8, candles.length - 1)]?.time, value: a.value })).filter(a => a.time);
                const tth = smma(hl2, teeth).map(a => ({ time: candles[Math.min(a.index + 5, candles.length - 1)]?.time, value: a.value })).filter(a => a.time);
                const lps = smma(hl2, lips).map(a => ({ time: candles[Math.min(a.index + 3, candles.length - 1)]?.time, value: a.value })).filter(a => a.time);
                return {
                    name: indicatorName, type: 'overlay', data: [],
                    lines: [
                        { id: 'Jaw', color: jawColor, lineWidth: jawWidth, data: jaw as any[] },
                        { id: 'Teeth', color: teethColor, lineWidth: teethWidth, data: tth as any[] },
                        { id: 'Lips', color: lipsColor, lineWidth: lipsWidth, data: lps as any[] }
                    ]
                };
            }
            case 'Bollinger Bands': {
                const period = settings?.params?.period ?? 20;
                const mult = settings?.params?.deviation ?? 2;
                const midColor = settings?.plots?.middle?.color || '#ff9800';
                const midWidth = settings?.plots?.middle?.lineWidth || 1;
                const upColor = settings?.plots?.Upper?.color || '#2979ff';
                const upWidth = settings?.plots?.Upper?.lineWidth || 1;
                const lowColor = settings?.plots?.Lower?.color || '#2979ff';
                const lowWidth = settings?.plots?.Lower?.lineWidth || 1;

                const middle = sma(closes, period);
                const upper = [], lower = [];
                for (let i = period - 1; i < closes.length; i++) {
                    const avg = middle.find(m => m.index === i)!.value;
                    let sumSq = 0;
                    for (let j = 0; j < period; j++) sumSq += Math.pow(closes[i - j] - avg, 2);
                    const std = Math.sqrt(sumSq / period);
                    upper.push({ time: candles[i].time, value: avg + std * mult });
                    lower.push({ time: candles[i].time, value: avg - std * mult });
                }
                return {
                    name: indicatorName, type: 'overlay', data: [],
                    lines: [
                        { id: 'middle', color: midColor, lineWidth: midWidth, data: formatLine(middle) },
                        { id: 'Upper', color: upColor, lineWidth: upWidth, data: upper },
                        { id: 'Lower', color: lowColor, lineWidth: lowWidth, data: lower }
                    ]
                };
            }
            case 'Envelopes': {
                const period = settings?.params?.period ?? 20;
                const dev = settings?.params?.deviation ?? 0.02;
                const midColor = settings?.plots?.middle?.color || '#ffd600';
                const midWidth = settings?.plots?.middle?.lineWidth || 1;
                const upColor = settings?.plots?.Upper?.color || '#ff9800';
                const upWidth = settings?.plots?.Upper?.lineWidth || 1;
                const lowColor = settings?.plots?.Lower?.color || '#ff9800';
                const lowWidth = settings?.plots?.Lower?.lineWidth || 1;

                const middle = sma(closes, period);
                const upper = middle.map(m => ({ time: candles[m.index].time, value: m.value * (1 + dev) }));
                const lower = middle.map(m => ({ time: candles[m.index].time, value: m.value * (1 - dev) }));
                return {
                    name: indicatorName, type: 'overlay', data: [],
                    lines: [
                        { id: 'middle', color: midColor, lineWidth: midWidth, data: formatLine(middle) },
                        { id: 'Upper', color: upColor, lineWidth: upWidth, data: upper },
                        { id: 'Lower', color: lowColor, lineWidth: lowWidth, data: lower }
                    ]
                };
            }
            case 'Fractal': {
                const period = settings?.params?.period ?? 2;
                const color = settings?.plots?.fractal?.color || '#00e676';
                const markers: any[] = [];
                for (let i = period; i < candles.length - period; i++) {
                    let isHigh = true, isLow = true;
                    for (let j = 1; j <= period; j++) {
                        if (highs[i] <= highs[i-j] || highs[i] <= highs[i+j]) isHigh = false;
                        if (lows[i] >= lows[i-j] || lows[i] >= lows[i+j]) isLow = false;
                    }
                    if (isHigh) markers.push({ time: candles[i].time, position: 'aboveBar', color, shape: 'arrowDown', text: '▼' });
                    if (isLow) markers.push({ time: candles[i].time, position: 'belowBar', color: '#F44336', shape: 'arrowUp', text: '▲' });
                }
                return { name: indicatorName, type: 'overlay', data: [], markers };
            }
            case 'Ichimoku Cloud': {
                const convP = settings?.params?.conversion ?? 9;
                const baseP = settings?.params?.base ?? 26;
                const spanBP = settings?.params?.spanB ?? 52;
                const tenkanColor = settings?.plots?.Tenkan?.color || '#2196F3';
                const tenkanWidth = settings?.plots?.Tenkan?.lineWidth || 2;
                const kijunColor = settings?.plots?.Kijun?.color || '#F44336';
                const kijunWidth = settings?.plots?.Kijun?.lineWidth || 2;
                const spanAColor = settings?.plots?.SpanA?.color || '#4CAF50';
                const spanBColor = settings?.plots?.SpanB?.color || '#FF9800';

                const tenkan = [], kijun = [], spanA = [], spanB = [];
                const maxC = highest(highs, convP), minC = lowest(lows, convP);
                const maxB = highest(highs, baseP), minB = lowest(lows, baseP);
                const maxS = highest(highs, spanBP), minS = lowest(lows, spanBP);
                
                for(let i=convP-1; i<candles.length; i++) tenkan.push({ time: candles[i].time, value: (maxC.find(m=>m.index===i)!.value + minC.find(m=>m.index===i)!.value)/2 });
                for(let i=baseP-1; i<candles.length; i++) kijun.push({ time: candles[i].time, value: (maxB.find(m=>m.index===i)!.value + minB.find(m=>m.index===i)!.value)/2 });
                for(let i=baseP-1; i<candles.length; i++) {
                    const t = tenkan.find(m=>m.time===candles[i].time)?.value || 0;
                    const k = kijun.find(m=>m.time===candles[i].time)?.value || 0;
                    const shiftedIdx = i + 26;
                    if(shiftedIdx < candles.length) spanA.push({ time: candles[shiftedIdx].time, value: (t+k)/2 });
                }
                for(let i=spanBP-1; i<candles.length; i++) {
                    const shiftedIdx = i + 26;
                    if(shiftedIdx < candles.length) spanB.push({ time: candles[shiftedIdx].time, value: (maxS.find(m=>m.index===i)!.value + minS.find(m=>m.index===i)!.value)/2 });
                }
                return {
                    name: indicatorName, type: 'overlay', data: [],
                    lines: [
                        { id: 'Tenkan', color: tenkanColor, lineWidth: tenkanWidth, data: tenkan },
                        { id: 'Kijun', color: kijunColor, lineWidth: kijunWidth, data: kijun },
                        { id: 'SpanA', color: spanAColor, lineWidth: 1, data: spanA },
                        { id: 'SpanB', color: spanBColor, lineWidth: 1, data: spanB }
                    ]
                };
            }
            case 'Keltner Channel': {
                const period = settings?.params?.period ?? 20;
                const mult = settings?.params?.multiplier ?? 2;
                const midColor = settings?.plots?.middle?.color || '#ffd600';
                const midWidth = settings?.plots?.middle?.lineWidth || 1;
                const upColor = settings?.plots?.Upper?.color || '#ffc107';
                const upWidth = settings?.plots?.Upper?.lineWidth || 1;
                const lowColor = settings?.plots?.Lower?.color || '#ffc107';
                const lowWidth = settings?.plots?.Lower?.lineWidth || 1;

                const atr = calcATR(candles, 10);
                const emaPeriod = ema(closes, period);
                const upper = [], lower = [];
                for(let i=period-1; i<candles.length; i++) {
                    const mid = emaPeriod.find(m=>m.index===i)?.value || 0;
                    const a = atr.find(m=>m.index===i)?.value || 0;
                    upper.push({ time: candles[i].time, value: mid + mult*a });
                    lower.push({ time: candles[i].time, value: mid - mult*a });
                }
                return {
                    name: indicatorName, type: 'overlay', data: [],
                    lines: [
                        { id: 'middle', color: midColor, lineWidth: midWidth, data: formatLine(emaPeriod) },
                        { id: 'Upper', color: upColor, lineWidth: upWidth, data: upper },
                        { id: 'Lower', color: lowColor, lineWidth: lowWidth, data: lower }
                    ]
                };
            }
            case 'Donchian Channel': {
                const period = settings?.params?.period ?? 20;
                const midColor = settings?.plots?.middle?.color || '#9c27b0';
                const midWidth = settings?.plots?.middle?.lineWidth || 1;
                const upColor = settings?.plots?.Upper?.color || '#ba68c8';
                const upWidth = settings?.plots?.Upper?.lineWidth || 1;
                const lowColor = settings?.plots?.Lower?.color || '#ba68c8';
                const lowWidth = settings?.plots?.Lower?.lineWidth || 1;

                const hh = highest(highs, period);
                const ll = lowest(lows, period);
                const mid = hh.map(h => {
                    const l = ll.find(m => m.index === h.index)?.value ?? h.value;
                    return { time: candles[h.index].time, value: (h.value + l) / 2 };
                });
                return {
                    name: indicatorName, type: 'overlay', data: [],
                    lines: [
                        { id: 'middle', color: midColor, lineWidth: midWidth, data: mid },
                        { id: 'Upper', color: upColor, lineWidth: upWidth, data: formatLine(hh) },
                        { id: 'Lower', color: lowColor, lineWidth: lowWidth, data: formatLine(ll) }
                    ]
                };
            }
            case 'Supertrend': {
                const period = settings?.params?.period ?? 10;
                const mult = settings?.params?.multiplier ?? 3;
                const color = settings?.plots?.supertrend?.color || '#00e676';
                const lineWidth = settings?.plots?.supertrend?.lineWidth || 2;

                const atr = calcATR(candles, period);
                const upperBasic = [], lowerBasic = [];
                const finalUpper = [], finalLower = [];
                const supertrend = [];
                let dir = 1;
                
                for(let i=period; i<candles.length; i++) {
                    const a = atr.find(m=>m.index===i)?.value || 0;
                    const hl = hl2[i];
                    upperBasic[i] = hl + mult * a;
                    lowerBasic[i] = hl - mult * a;
                    
                    if(i === period) {
                        finalUpper[i] = upperBasic[i];
                        finalLower[i] = lowerBasic[i];
                    } else {
                        finalUpper[i] = (upperBasic[i] < finalUpper[i-1] || closes[i-1] > finalUpper[i-1]) ? upperBasic[i] : finalUpper[i-1];
                        finalLower[i] = (lowerBasic[i] > finalLower[i-1] || closes[i-1] < finalLower[i-1]) ? lowerBasic[i] : finalLower[i-1];
                    }
                    
                    if(dir === 1 && closes[i] <= finalLower[i]) dir = -1;
                    else if(dir === -1 && closes[i] >= finalUpper[i]) dir = 1;
                    
                    supertrend.push({ time: candles[i].time, value: dir === 1 ? finalLower[i] : finalUpper[i] });
                }
                return { name: indicatorName, type: 'overlay', data: supertrend, color, lineWidth };
            }
            case 'Moving Average': {
                const period = settings?.params?.period ?? 14;
                const color = settings?.plots?.ma?.color || '#ffd600';
                const lineWidth = settings?.plots?.ma?.lineWidth || 2;
                return { name: indicatorName, type: 'overlay', data: formatLine(sma(closes, period)), color, lineWidth };
            }
            case 'Parabolic SAR': {
                const afStep = settings?.params?.step ?? 0.02;
                const maxAf = settings?.params?.max ?? 0.2;
                const color = settings?.plots?.PSAR?.color || '#e91e63';
                const lineWidth = settings?.plots?.PSAR?.lineWidth || 2;

                let ep = highs[0], sar = lows[0], dir = 1, af = afStep;
                const result = [];
                for(let i=1; i<candles.length; i++) {
                    sar = sar + af * (ep - sar);
                    if(dir === 1) {
                        if(lows[i] < sar) { dir = -1; sar = ep; ep = lows[i]; af = afStep; }
                        else { if(highs[i] > ep) { ep = highs[i]; af = Math.min(maxAf, af + afStep); } }
                    } else {
                        if(highs[i] > sar) { dir = 1; sar = ep; ep = highs[i]; af = afStep; }
                        else { if(lows[i] < ep) { ep = lows[i]; af = Math.min(maxAf, af + afStep); } }
                    }
                    result.push({ time: candles[i].time, value: sar });
                }
                return { name: indicatorName, type: 'overlay', data: [], lines: [{ id: 'PSAR', color, lineWidth, data: result }] };
            }
            case 'Zig Zag': {
                const dev = (settings?.params?.deviation ?? 5) / 100;
                const color = settings?.plots?.zigzag?.color || '#00e5ff';
                const lineWidth = settings?.plots?.zigzag?.lineWidth || 2;

                const pivots = [];
                let lastPivot = { i: 0, val: closes[0], type: 0 };
                for(let i=1; i<candles.length; i++) {
                    const diff = Math.abs(closes[i] - lastPivot.val) / lastPivot.val;
                    if(diff >= dev) {
                        const type = closes[i] > lastPivot.val ? 1 : -1;
                        if(type !== lastPivot.type) {
                            pivots.push({ time: candles[i].time, value: closes[i] });
                            lastPivot = { i, val: closes[i], type };
                        }
                    }
                }
                return { name: indicatorName, type: 'overlay', data: pivots, color, lineWidth };
            }
            case 'ADX': {
                const smoothing = settings?.params?.adxSmoothing ?? 14;
                const diLength = settings?.params?.diLength ?? 14;
                const adxColor = settings?.plots?.adx?.color || '#00e676';
                const adxWidth = settings?.plots?.adx?.lineWidth || 2;
                const plusColor = settings?.plots?.plusDI?.color || '#2979ff';
                const plusWidth = settings?.plots?.plusDI?.lineWidth || 2;
                const minusColor = settings?.plots?.minusDI?.color || '#ff1744';
                const minusWidth = settings?.plots?.minusDI?.lineWidth || 2;

                const tr = getTrueRange(candles);
                const plusDM = [0], minusDM = [0];
                for(let i=1; i<candles.length; i++) {
                    const upMove = highs[i] - highs[i-1];
                    const downMove = lows[i-1] - lows[i];
                    plusDM.push((upMove > downMove && upMove > 0) ? upMove : 0);
                    minusDM.push((downMove > upMove && downMove > 0) ? downMove : 0);
                }
                const atr = rma(tr, diLength);
                const plusDI = [], minusDI = [], dx = [];
                const smoothPlusDM = rma(plusDM, diLength);
                const smoothMinusDM = rma(minusDM, diLength);
                for(let i=diLength; i<candles.length; i++) {
                    const a = atr.find(m=>m.index===i)?.value || 1;
                    const p = smoothPlusDM.find(m=>m.index===i)?.value || 0;
                    const m = smoothMinusDM.find(m=>m.index===i)?.value || 0;
                    const diPlus = (p / a) * 100;
                    const diMinus = (m / a) * 100;
                    plusDI.push({ index: i, value: diPlus });
                    minusDI.push({ index: i, value: diMinus });
                    dx.push(Math.abs(diPlus - diMinus) / (diPlus + diMinus + 0.0001) * 100);
                }
                const adx = rma(dx, smoothing).map(m => ({ time: candles[Math.min(m.index + smoothing, candles.length - 1)]?.time, value: m.value })).filter(m => m.time);
                return {
                    name: indicatorName, type: 'oscillator', data: [],
                    lines: [
                        { id: 'adx', color: adxColor, lineWidth: adxWidth, data: adx },
                        { id: 'plusDI', color: plusColor, lineWidth: plusWidth, data: plusDI.map(m=>({time: candles[m.index].time, value: m.value})) },
                        { id: 'minusDI', color: minusColor, lineWidth: minusWidth, data: minusDI.map(m=>({time: candles[m.index].time, value: m.value})) }
                    ]
                };
            }
            case 'Aroon': {
                const period = settings?.params?.period ?? 25;
                const upColor = settings?.plots?.AroonUp?.color || '#00e676';
                const upWidth = settings?.plots?.AroonUp?.lineWidth || 2;
                const downColor = settings?.plots?.AroonDown?.color || '#ff1744';
                const downWidth = settings?.plots?.AroonDown?.lineWidth || 2;

                const up = [], down = [];
                for(let i=period; i<candles.length; i++) {
                    let hMax = highs[i], hIdx = i, lMin = lows[i], lIdx = i;
                    for(let j=0; j<=period; j++) {
                        if(highs[i-j] > hMax) { hMax = highs[i-j]; hIdx = i-j; }
                        if(lows[i-j] < lMin) { lMin = lows[i-j]; lIdx = i-j; }
                    }
                    up.push({ time: candles[i].time, value: ((period - (i - hIdx)) / period) * 100 });
                    down.push({ time: candles[i].time, value: ((period - (i - lIdx)) / period) * 100 });
                }
                return {
                    name: indicatorName, type: 'oscillator', data: [],
                    lines: [
                        { id: 'AroonUp', color: upColor, lineWidth: upWidth, data: up },
                        { id: 'AroonDown', color: downColor, lineWidth: downWidth, data: down }
                    ]
                };
            }
            case 'Awesome Oscillator': {
                const fast = settings?.params?.fast ?? 5;
                const slow = settings?.params?.slow ?? 34;
                const color = settings?.plots?.ao?.color || '#00e676';

                const smaFast = sma(hl2, fast), smaSlow = sma(hl2, slow);
                const ao = [];
                for(let i=slow-1; i<candles.length; i++) {
                    const sF = smaFast.find(m=>m.index===i)?.value || 0;
                    const sS = smaSlow.find(m=>m.index===i)?.value || 0;
                    ao.push({ time: candles[i].time, value: sF - sS, color: (i > slow-1 && (sF-sS) > (ao[ao.length-1]?.value || 0)) ? '#4CAF50' : '#F44336' });
                }
                return { name: indicatorName, type: 'oscillator', data: [], histograms: [{ id: 'ao', color, data: ao }] };
            }
            case 'Bears Power': {
                const period = settings?.params?.period ?? 13;
                const color = settings?.plots?.bears?.color || '#ff1744';
                const e = ema(closes, period);
                const data = e.map(m => ({ time: candles[m.index].time, value: lows[m.index] - m.value, color }));
                return { name: indicatorName, type: 'oscillator', data: [], histograms: [{ id: 'bears', color, data }] };
            }
            case 'Bulls Power': {
                const period = settings?.params?.period ?? 13;
                const color = settings?.plots?.bulls?.color || '#00e676';
                const e = ema(closes, period);
                const data = e.map(m => ({ time: candles[m.index].time, value: highs[m.index] - m.value, color }));
                return { name: indicatorName, type: 'oscillator', data: [], histograms: [{ id: 'bulls', color, data }] };
            }
            case 'CCI':
            case 'Commodity Channel Index': {
                const period = settings?.params?.period ?? 20;
                const color = settings?.plots?.cci?.color || '#00e5ff';
                const lineWidth = settings?.plots?.cci?.lineWidth || 2;

                const smaTp = sma(tp, period);
                const cci = [];
                for(let i=period-1; i<candles.length; i++) {
                    const avg = smaTp.find(m=>m.index===i)!.value;
                    let meanDev = 0;
                    for(let j=0; j<period; j++) meanDev += Math.abs(tp[i-j] - avg);
                    meanDev /= period;
                    cci.push({ time: candles[i].time, value: (tp[i] - avg) / (0.015 * meanDev) });
                }
                return { name: indicatorName, type: 'oscillator', data: cci, color, lineWidth };
            }
            case 'DeMarker': {
                const period = settings?.params?.period ?? 14;
                const color = settings?.plots?.demarker?.color || '#2979ff';
                const lineWidth = settings?.plots?.demarker?.lineWidth || 2;

                const demMax = [0], demMin = [0];
                for(let i=1; i<candles.length; i++) {
                    demMax.push(Math.max(0, highs[i] - highs[i-1]));
                    demMin.push(Math.max(0, lows[i-1] - lows[i]));
                }
                const smaMax = sma(demMax, period);
                const smaMin = sma(demMin, period);
                const dem = [];
                for(let i=period; i<candles.length; i++) {
                    const mx = smaMax.find(m=>m.index===i)?.value || 0;
                    const mn = smaMin.find(m=>m.index===i)?.value || 0;
                    dem.push({ time: candles[i].time, value: (mx + mn === 0) ? 0.5 : mx / (mx + mn) });
                }
                return { name: indicatorName, type: 'oscillator', data: dem, color, lineWidth };
            }
            case 'ATR': {
                const period = settings?.params?.period ?? 14;
                const color = settings?.plots?.atr?.color || '#ffd600';
                const lineWidth = settings?.plots?.atr?.lineWidth || 2;
                return { name: indicatorName, type: 'oscillator', data: formatLine(calcATR(candles, period)), color, lineWidth };
            }
            case 'MACD': {
                const fastPeriod = settings?.params?.fastPeriod ?? 12;
                const slowPeriod = settings?.params?.slowPeriod ?? 26;
                const signalPeriod = settings?.params?.signalPeriod ?? 9;
                const macdColor = settings?.plots?.macd?.color || '#2196F3';
                const macdWidth = settings?.plots?.macd?.lineWidth || 2;
                const signalColor = settings?.plots?.signal?.color || '#FF9800';
                const signalWidth = settings?.plots?.signal?.lineWidth || 2;

                const fast = ema(closes, fastPeriod), slow = ema(closes, slowPeriod);
                const macdLine = [];
                for(let i=slowPeriod-1; i<candles.length; i++) {
                    const f = fast.find(m=>m.index===i)?.value || 0;
                    const s = slow.find(m=>m.index===i)?.value || 0;
                    macdLine.push({ index: i, value: f - s });
                }
                const signalLine = ema(macdLine.map(m=>m.value), signalPeriod);
                const hist = [];
                for(let i=signalPeriod-1; i<macdLine.length; i++) {
                    const m = macdLine[i].value;
                    const s = signalLine.find(x=>x.index===i)?.value || 0;
                    const val = m - s;
                    hist.push({ time: candles[macdLine[i].index].time, value: val, color: val >= 0 ? '#4CAF50' : '#F44336' });
                }
                return {
                    name: indicatorName, type: 'oscillator', data: [],
                    lines: [
                        { id: 'macd', color: macdColor, lineWidth: macdWidth, data: macdLine.map(m=>({ time: candles[m.index].time, value: m.value})) },
                        { id: 'signal', color: signalColor, lineWidth: signalWidth, data: signalLine.map(m=>({ time: candles[macdLine[m.index].index].time, value: m.value})) }
                    ],
                    histograms: [{ id: 'hist', color: '#999', data: hist }]
                };
            }
            case 'Momentum': {
                const period = settings?.params?.period ?? 10;
                const color = settings?.plots?.momentum?.color || '#2979ff';
                const lineWidth = settings?.plots?.momentum?.lineWidth || 2;
                const mom = [];
                for(let i=period; i<candles.length; i++) mom.push({ time: candles[i].time, value: closes[i] - closes[i-period] });
                return { name: indicatorName, type: 'oscillator', data: mom, color, lineWidth };
            }
            case 'RSI':
            case 'Relative Strength Index': {
                const period = settings?.params?.period ?? 14;
                const color = settings?.plots?.rsi?.color || '#2979ff';
                const lineWidth = settings?.plots?.rsi?.lineWidth || 2;

                const gains = [0], losses = [0];
                for(let i=1; i<candles.length; i++) {
                    const change = closes[i] - closes[i-1];
                    gains.push(Math.max(0, change));
                    losses.push(Math.max(0, -change));
                }
                const avgGains = rma(gains, period);
                const avgLosses = rma(losses, period);
                const rsi = [];
                for(let i=period; i<candles.length; i++) {
                    const g = avgGains.find(m=>m.index===i)?.value || 0;
                    const l = avgLosses.find(m=>m.index===i)?.value || 0;
                    const rs = l === 0 ? 100 : g / l;
                    rsi.push({ time: candles[i].time, value: l === 0 ? 100 : 100 - (100 / (1 + rs)) });
                }
                return { name: indicatorName, type: 'oscillator', data: rsi, color, lineWidth };
            }
            case 'Rate Of Change': {
                const period = settings?.params?.period ?? 12;
                const color = settings?.plots?.roc?.color || '#e040fb';
                const lineWidth = settings?.plots?.roc?.lineWidth || 2;
                const roc = [];
                for(let i=period; i<candles.length; i++) roc.push({ time: candles[i].time, value: ((closes[i] - closes[i-period]) / closes[i-period]) * 100 });
                return { name: indicatorName, type: 'oscillator', data: roc, color, lineWidth };
            }
            case 'Stochastic Oscillator': {
                const kPeriod = settings?.params?.kPeriod ?? 14;
                const dPeriod = settings?.params?.dPeriod ?? 3;
                const slowing = settings?.params?.slowing ?? 3;
                const kColor = settings?.plots?.k?.color || '#2196f3';
                const kWidth = settings?.plots?.k?.lineWidth || 2;
                const dColor = settings?.plots?.d?.color || '#ff9800';
                const dWidth = settings?.plots?.d?.lineWidth || 2;

                const rawK = [];
                for(let i=kPeriod-1; i<candles.length; i++) {
                    let hh = highs[i], ll = lows[i];
                    for(let j=1; j<kPeriod; j++) {
                        if(highs[i-j] > hh) hh = highs[i-j];
                        if(lows[i-j] < ll) ll = lows[i-j];
                    }
                    rawK.push({ index: i, value: 100 * (closes[i] - ll) / (hh - ll || 1) });
                }
                const k = sma(rawK.map(k=>k.value), slowing);
                const d = sma(k.map(k=>k.value), dPeriod);
                return {
                    name: indicatorName, type: 'oscillator', data: [],
                    lines: [
                        { id: 'k', color: kColor, lineWidth: kWidth, data: k.map(m=>({time: candles[rawK[m.index].index].time, value: m.value})) },
                        { id: 'd', color: dColor, lineWidth: dWidth, data: d.map(m=>({time: candles[rawK[k[m.index].index].index].time, value: m.value})) }
                    ]
                };
            }
            case 'Schaff Trend Cycle': {
                const cycle = Math.max(2, Math.floor(settings?.params?.cycle ?? 10));
                const fast = Math.max(1, Math.floor(settings?.params?.fast ?? 23));
                const slow = Math.max(fast + 1, Math.floor(settings?.params?.slow ?? 50));
                const color = settings?.plots?.stc?.color || settings?.plots?.up?.color || Object.values(settings?.plots || {})[0]?.color || '#00e676';
                const lineWidth = settings?.plots?.stc?.lineWidth || Object.values(settings?.plots || {})[0]?.lineWidth || 2;

                const fastEMA = ema(closes, fast);
                const slowEMA = ema(closes, slow);
                const macdVals: { index: number; value: number }[] = [];
                for (let i = slow - 1; i < candles.length; i++) {
                    const f = fastEMA.find(m => m.index === i)?.value || 0;
                    const s = slowEMA.find(m => m.index === i)?.value || 0;
                    macdVals.push({ index: i, value: f - s });
                }

                const fastK1: { index: number; value: number }[] = [];
                for (let i = cycle - 1; i < macdVals.length; i++) {
                    let minM = macdVals[i].value, maxM = macdVals[i].value;
                    for (let j = 0; j < cycle; j++) {
                        const v = macdVals[i - j].value;
                        if (v < minM) minM = v;
                        if (v > maxM) maxM = v;
                    }
                    const diff = maxM - minM;
                    const k = diff === 0 ? 50 : ((macdVals[i].value - minM) / diff) * 100;
                    fastK1.push({ index: macdVals[i].index, value: k });
                }

                const halfCycle = Math.max(1, Math.floor(cycle / 2));
                const pfRaw = ema(fastK1.map(x => x.value), halfCycle);
                const pf: { index: number; value: number }[] = pfRaw.map(p => ({
                    index: fastK1[p.index].index,
                    value: p.value
                }));

                const fastK2: { index: number; value: number }[] = [];
                for (let i = cycle - 1; i < pf.length; i++) {
                    let minP = pf[i].value, maxP = pf[i].value;
                    for (let j = 0; j < cycle; j++) {
                        const v = pf[i - j].value;
                        if (v < minP) minP = v;
                        if (v > maxP) maxP = v;
                    }
                    const diff = maxP - minP;
                    const k = diff === 0 ? 50 : ((pf[i].value - minP) / diff) * 100;
                    fastK2.push({ index: pf[i].index, value: k });
                }

                const stcRaw = ema(fastK2.map(x => x.value), halfCycle);
                const stcData = stcRaw.map(s => ({
                    time: candles[fastK2[s.index].index].time,
                    value: Math.max(0, Math.min(100, s.value))
                }));

                return { name: indicatorName, type: 'oscillator', data: stcData, color, lineWidth };
            }
            case 'Vortex': {
                const period = settings?.params?.period ?? 14;
                const pColor = settings?.plots?.viPlus?.color || '#00e676';
                const pWidth = settings?.plots?.viPlus?.lineWidth || 2;
                const mColor = settings?.plots?.viMinus?.color || '#ff1744';
                const mWidth = settings?.plots?.viMinus?.lineWidth || 2;

                const tr = getTrueRange(candles);
                const vmp = [0], vmm = [0];
                for(let i=1; i<candles.length; i++) {
                    vmp.push(Math.abs(highs[i] - lows[i-1]));
                    vmm.push(Math.abs(lows[i] - highs[i-1]));
                }
                const viPlus = [], viMinus = [];
                for(let i=period; i<candles.length; i++) {
                    let sumTR = 0, sumVMP = 0, sumVMM = 0;
                    for(let j=0; j<period; j++) {
                        sumTR += tr[i-j];
                        sumVMP += vmp[i-j];
                        sumVMM += vmm[i-j];
                    }
                    viPlus.push({ time: candles[i].time, value: sumVMP / (sumTR || 1) });
                    viMinus.push({ time: candles[i].time, value: sumVMM / (sumTR || 1) });
                }
                return {
                    name: indicatorName, type: 'oscillator', data: [],
                    lines: [
                        { id: 'viPlus', color: pColor, lineWidth: pWidth, data: viPlus },
                        { id: 'viMinus', color: mColor, lineWidth: mWidth, data: viMinus }
                    ]
                };
            }
            case 'Volume Oscillator': {
                const fast = settings?.params?.fast ?? 14;
                const slow = settings?.params?.slow ?? 28;
                const color = settings?.plots?.vo?.color || '#2979ff';
                const lineWidth = settings?.plots?.vo?.lineWidth || 2;

                const f = sma(volumes, fast), s = sma(volumes, slow);
                const vo = [];
                for(let i=slow-1; i<candles.length; i++) {
                    const fVal = f.find(m=>m.index===i)?.value || 0;
                    const sVal = s.find(m=>m.index===i)?.value || 1;
                    vo.push({ time: candles[i].time, value: ((fVal - sVal) / (sVal || 1)) * 100 });
                }
                return { name: indicatorName, type: 'oscillator', data: vo, color, lineWidth };
            }
            case 'Williams %R': {
                const period = settings?.params?.period ?? 14;
                const color = settings?.plots?.wr?.color || '#ff9800';
                const lineWidth = settings?.plots?.wr?.lineWidth || 2;

                const wr = [];
                for(let i=period-1; i<candles.length; i++) {
                    let hh = highs[i], ll = lows[i];
                    for(let j=1; j<period; j++) {
                        if(highs[i-j] > hh) hh = highs[i-j];
                        if(lows[i-j] < ll) ll = lows[i-j];
                    }
                    wr.push({ time: candles[i].time, value: -100 * (hh - closes[i]) / (hh - ll || 1) });
                }
                return { name: indicatorName, type: 'oscillator', data: wr, color, lineWidth };
            }
            case 'Weis Waves Volume Oscillator': {
                const dev = (settings?.params?.deviation ?? 2) / 100;
                const color = settings?.plots?.weis?.color || '#00e676';

                const waves = [];
                let dir = 0, waveVol = 0, lastPivot = closes[0];
                for(let i=1; i<candles.length; i++) {
                    const diff = (closes[i] - lastPivot) / (lastPivot || 1);
                    if(dir === 0) {
                        if(Math.abs(diff) >= dev) { dir = diff > 0 ? 1 : -1; lastPivot = closes[i]; waveVol = volumes[i]; }
                    } else if(dir === 1) {
                        if(diff <= -dev) { dir = -1; lastPivot = closes[i]; waveVol = volumes[i]; }
                        else { if(closes[i] > lastPivot) lastPivot = closes[i]; waveVol += volumes[i]; }
                    } else if(dir === -1) {
                        if(diff >= dev) { dir = 1; lastPivot = closes[i]; waveVol = volumes[i]; }
                        else { if(closes[i] < lastPivot) lastPivot = closes[i]; waveVol += volumes[i]; }
                    }
                    waves.push({ time: candles[i].time, value: dir === 1 ? waveVol : (dir === -1 ? -waveVol : 0), color: dir === 1 ? '#4CAF50' : '#F44336' });
                }
                return { name: indicatorName, type: 'oscillator', data: [], histograms: [{ id: 'weis', color, data: waves }] };
            }
            default: {
                const period = settings?.params?.period ?? 14;
                return { name: indicatorName, type: 'overlay', data: formatLine(sma(closes, period)) };
            }
        }
    }
}
