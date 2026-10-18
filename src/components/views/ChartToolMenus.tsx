import React from 'react';
import { X, Trash2, ChevronRight, Activity, TrendingUp, BarChart2, Compass, PenTool, Sliders } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Common Types
export type ChartMenuType = 'drawings' | 'timeframe' | 'chartType' | 'indicators' | null;

// Mock Data
const DRAWING_TOOLS = [
  'Parallel Channel', 'Gann Box', 'Ray', 'Pitchfan', 'Cross Line',
  'Pitchfork', 'Curve', 'Trend Line', 'Price Range', 'Triangle',
  'Cyclic Lines', 'Extended Line', 'Rectangle', 'Vertical Line',
  'Arc', 'Trend Angle', 'Date and Price Range', 'Flat Top/Bottom',
  'Horizontal Line', 'Fibonacci Retracement', 'Date Range',
  'Disjoint Channel', 'Fibonacci Fan'
];

const TIMEFRAMES = [
  ['5s', '10s', '15s', '30s'],
  ['1m', '2m', '3m', '5m'],
  ['10m', '15m', '30m', '1h'],
  ['4h', '1d']
];

const CHART_TYPES = [
  { id: 'area', label: 'Area', icon: TrendingUp },
  { id: 'candles', label: 'Candles', icon: BarChart2 },
  { id: 'bars', label: 'Bars', icon: Activity },
  { id: 'heikenAshi', label: 'Heiken Ashi', icon: BarChart2 },
];

const TREND_INDICATORS = [
  'Alligator', 'Bollinger Bands', 'Envelopes', 'Fractal',
  'Ichimoku Cloud', 'Keltner Channel', 'Donchian Channel',
  'Supertrend', 'Moving Average', 'Parabolic SAR', 'Zig Zag'
];

const OSCILLATORS = [
  'ADX', 'Aroon', 'Awesome Oscillator', 'Bears Power',
  'Bulls Power', 'CCI', 'DeMarker', 'ATR', 'MACD',
  'Momentum', 'RSI', 'Rate Of Change', 'Stochastic Oscillator',
  'Schaff Trend Cycle', 'Vortex', 'Volume Oscillator',
  'Williams %R', 'Weis Waves Volume Oscillator'
];

interface SidePanelProps {
  title: string;
  onClose: () => void;
  onClearAll?: () => void;
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ title, onClose, onClearAll, children }) => {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[var(--bg-panel)] border-r border-[var(--border-color)] z-30 flex flex-col shadow-2xl animate-in slide-in-from-left-4 duration-200">
      <div className="h-14 flex items-center justify-between px-4 shrink-0 border-b border-[var(--border-color)]">
        <h2 className="text-[var(--text-primary)] font-bold text-lg">{title}</h2>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
      {onClearAll && (
        <div className="p-4 border-t border-[var(--border-color)] shrink-0">
          <button onClick={onClearAll} className="w-full h-10 bg-[var(--hover-bg)] hover:bg-[#e33f4a] hover:text-[var(--text-primary)] text-[#e33f4a] rounded flex items-center justify-center gap-2 font-bold text-sm transition-colors">
            <Trash2 size={16} /> Delete all
          </button>
        </div>
      )}
    </div>
  );
};

export const DrawingsMenu = ({ onClose, onSelect, activeDrawings = [], onRemove, onClearAll, drawingColor = '#1e88e5', onColorChange }: { onClose: () => void; onSelect?: (drawing: string) => void; activeDrawings?: any[]; onRemove?: (id: string) => void; onClearAll?: () => void; drawingColor?: string; onColorChange?: (color: string) => void }) => {
  const { t } = useLanguage();
  return (
    <SidePanel title={t('drawings') || 'Drawings'} onClose={onClose} onClearAll={onClearAll}>
      <div className="p-4">
        <div className="mb-6">
          <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-2">{t('color') || 'Color'}</div>
          <div className="flex gap-2">
            {['#1e88e5', '#0ba259', '#e33f4a', '#f59e0b', '#ffffff'].map(color => (
              <button
                key={color}
                onClick={() => onColorChange && onColorChange(color)}
                className="w-8 h-8 rounded-full border-2 cursor-pointer"
                style={{ backgroundColor: color, borderColor: drawingColor === color ? '#fff' : 'transparent' }}
              />
            ))}
          </div>
        </div>
        {activeDrawings.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] text-[#1e88e5] font-bold uppercase tracking-wider mb-2">{t('active') || 'Active'}</div>
            <div className="flex flex-col">
              {activeDrawings.map(tool => (
                <div key={tool.id} className="flex items-center justify-between h-9 text-[var(--text-primary)] bg-[var(--hover-bg)] px-2 -mx-2 rounded mb-1 group">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <PenTool size={14} className="text-[#f59e0b]" /> {tool.name}
                  </span>
                  <button onClick={() => onRemove && onRemove(tool.id)} className="text-[var(--text-muted)] hover:text-[#e33f4a] p-1 rounded transition-colors cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-2">{t('drawings') || 'Drawings'}</div>
        <div className="flex flex-col">
          {DRAWING_TOOLS.map(tool => (
            <button key={tool} onClick={() => { if(onSelect) onSelect(tool); onClose(); }} className="flex items-center justify-between h-9 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] px-2 -mx-2 rounded transition-colors group cursor-pointer">
              <span className="text-sm font-bold">{tool}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </SidePanel>
  );
};

export const IndicatorsMenu = ({ 
  onClose, 
  onSelect, 
  activeIndicators = [], 
  onRemove,
  onConfigure
}: { 
  onClose: () => void; 
  onSelect?: (indicator: string) => void; 
  activeIndicators?: string[]; 
  onRemove?: (ind: string) => void;
  onConfigure?: (ind: string) => void;
}) => {
  const { t } = useLanguage();
  return (
    <SidePanel title={t('indicators') || 'Indicators'} onClose={onClose}>
      <div className="p-4">
        {activeIndicators.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] text-[#1e88e5] font-bold uppercase tracking-wider mb-2">{t('active') || 'Active'}</div>
            <div className="flex flex-col">
              {activeIndicators.map(tool => (
                <div key={tool} className="flex items-center justify-between h-9 text-[var(--text-primary)] bg-[var(--hover-bg)] px-2 -mx-2 rounded mb-1 group">
                  <button 
                    onClick={() => onConfigure ? onConfigure(tool) : null}
                    className="text-sm font-bold flex items-center gap-2 hover:text-[#1e88e5] transition-colors text-left cursor-pointer"
                  >
                    <span className="text-[#1e88e5] font-black text-xs">fx</span> {tool}
                  </button>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => onConfigure ? onConfigure(tool) : null} 
                      className="text-[var(--text-muted)] hover:text-[#1e88e5] p-1 rounded transition-colors cursor-pointer"
                      title={t('settings') || 'Settings'}
                    >
                      <Sliders size={13} />
                    </button>
                    <button 
                      onClick={() => onRemove && onRemove(tool)} 
                      className="text-[var(--text-muted)] hover:text-[#e33f4a] p-1 rounded transition-colors cursor-pointer"
                      title={t('delete') || 'Delete'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-2">{t('trendIndicators') || 'Trend Indicators'}</div>
        <div className="flex flex-col mb-6">
          {TREND_INDICATORS.map(tool => (
            <button 
              key={tool} 
              onClick={() => { 
                if (onSelect) onSelect(tool); 
                if (onConfigure) onConfigure(tool); 
              }} 
              className="flex items-center justify-between h-9 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] px-2 -mx-2 rounded transition-colors group cursor-pointer"
            >
              <span className="text-sm font-bold">{tool}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
        
        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-2">{t('oscillators') || 'Oscillators'}</div>
        <div className="flex flex-col">
          {OSCILLATORS.map(tool => (
            <button 
              key={tool} 
              onClick={() => { 
                if (onSelect) onSelect(tool); 
                if (onConfigure) onConfigure(tool); 
              }} 
              className="flex items-center justify-between h-9 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] px-2 -mx-2 rounded transition-colors group cursor-pointer"
            >
              <span className="text-sm font-bold">{tool}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </SidePanel>
  );
};

export const TimeframePopup = ({ 
  selected, 
  onSelect 
}: { 
  selected: string, 
  onSelect: (t: string) => void 
}) => {
  return (
    <div className="absolute left-14 bottom-12 z-20 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded shadow-2xl p-2 flex flex-col gap-1 w-[200px] animate-in fade-in zoom-in-95 duration-100">
      {/* Arrow */}
      <div className="absolute -left-[5px] bottom-4 w-2.5 h-2.5 bg-[var(--bg-panel)] border-l border-b border-[var(--border-color)] transform rotate-45"></div>
      
      {TIMEFRAMES.map((row, i) => (
        <div key={i} className="flex gap-1 justify-between">
          {row.map(tf => (
            <button 
              key={tf}
              onClick={() => onSelect(tf)}
              className={`flex-1 h-8 rounded text-sm font-bold transition-colors ${selected === tf ? 'bg-[var(--hover-bg)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'}`}
            >
              {tf}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export const ChartTypePopup = ({ 
  selected, 
  onSelect 
}: { 
  selected: string, 
  onSelect: (t: string) => void 
}) => {
  return (
    <div className="absolute left-14 bottom-[3.25rem] z-20 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded shadow-2xl py-2 w-[160px] animate-in fade-in zoom-in-95 duration-100">
      {/* Arrow */}
      <div className="absolute -left-[5px] bottom-[10px] w-2.5 h-2.5 bg-[var(--bg-panel)] border-l border-b border-[var(--border-color)] transform rotate-45"></div>
      
      <div className="flex flex-col">
        {CHART_TYPES.map(type => {
          const Icon = type.icon;
          return (
            <button 
              key={type.id}
              onClick={() => onSelect(type.label)}
              className={`flex items-center gap-3 h-10 px-4 transition-colors ${selected === type.label ? 'bg-[var(--hover-bg)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'}`}
            >
              <Icon size={16} className={selected === type.label ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'} />
              <span className="text-sm font-bold">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
