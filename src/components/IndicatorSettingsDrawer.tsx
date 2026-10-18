import React from 'react';
import { ChevronLeft, X, Trash2, Check } from 'lucide-react';
import { IndicatorSettings, INDICATOR_REGISTRY } from '../utils/IndicatorEngine';
import { useLanguage } from '../context/LanguageContext';

export interface IndicatorSettingsDrawerProps {
  indicatorName?: string;
  isOpen?: boolean;
  settings: IndicatorSettings;
  onUpdateSettings?: (newSettings: IndicatorSettings) => void;
  onSave?: (newSettings: IndicatorSettings) => void;
  onDelete: (name: string) => void;
  onClose: () => void;
  onBack?: () => void;
}

const COLOR_SWATCHES = [
  '#ff5722', // orange
  '#ff9800', // amber
  '#ffeb3b', // yellow
  '#00e676', // lime
  '#00e5ff', // cyan
  '#2196f3', // blue
  '#7c4dff', // purple
  '#e040fb', // magenta
  '#ff1744', // crimson red
  '#f50057'  // pink
];

export const IndicatorSettingsDrawer: React.FC<IndicatorSettingsDrawerProps> = ({
  indicatorName,
  isOpen = true,
  settings,
  onUpdateSettings,
  onSave,
  onDelete,
  onClose,
  onBack
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const currentName = indicatorName || settings?.name || 'Moving Average';
  const meta = INDICATOR_REGISTRY[currentName] || {
    name: currentName,
    type: 'overlay',
    params: [{ id: 'period', label: 'Period', min: 1, max: 200, step: 1, defaultValue: 14 }],
    plots: [{ id: 'main', label: currentName, defaultColor: '#2979ff', defaultLineWidth: 2 }]
  };

  const emitUpdate = (newSettings: IndicatorSettings) => {
    if (onUpdateSettings) onUpdateSettings(newSettings);
    if (onSave) onSave(newSettings);
  };

  const handleParamChange = (paramId: string, delta: number, min: number, max: number, step: number) => {
    const currentVal = settings.params[paramId] ?? min;
    const newVal = Math.min(max, Math.max(min, Number((currentVal + delta * step).toFixed(2))));
    emitUpdate({
      ...settings,
      name: currentName,
      params: {
        ...settings.params,
        [paramId]: newVal
      }
    });
  };

  const handleParamDirect = (paramId: string, rawVal: number, min: number, max: number) => {
    const clamped = isNaN(rawVal) ? min : Math.min(max, Math.max(min, rawVal));
    emitUpdate({
      ...settings,
      name: currentName,
      params: {
        ...settings.params,
        [paramId]: clamped
      }
    });
  };

  const handlePlotColorChange = (plotId: string, color: string) => {
    const currentPlot = settings.plots[plotId] || { color: '#2979ff', lineWidth: 2 };
    emitUpdate({
      ...settings,
      name: currentName,
      plots: {
        ...settings.plots,
        [plotId]: { ...currentPlot, color }
      }
    });
  };

  const handlePlotWidthChange = (plotId: string, lineWidth: number) => {
    const currentPlot = settings.plots[plotId] || { color: '#2979ff', lineWidth: 2 };
    emitUpdate({
      ...settings,
      name: currentName,
      plots: {
        ...settings.plots,
        [plotId]: { ...currentPlot, lineWidth }
      }
    });
  };

  const handleGoBack = onBack || onClose;

  return (
    <div className="absolute left-0 top-0 bottom-0 w-[300px] z-30 bg-[#141b27] border-r border-[#263042] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 select-none">
      {/* Top Header matching Image 1 */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#242d3d]">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#8e9cb0] hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>{t('indicators') || 'Indicators'}</span>
        </button>
        <button
          onClick={onClose}
          className="text-[#8e9cb0] hover:text-white p-1 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content Scroll */}
      <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar space-y-6">
        {/* Parameters Cards matching Image 1 */}
        <div className="space-y-4">
          {meta.params.map(p => {
            const val = settings.params[p.id] ?? p.defaultValue;
            return (
              <div
                key={p.id}
                className="relative border border-[#242c3d] bg-[#161d29] rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
              >
                <label className="absolute -top-2.5 left-3 bg-[#141b27] px-2 py-0.5 rounded text-[11px] text-[#8e9cb0] font-semibold tracking-wide border border-[#242c3d]">
                  {t(p.id) !== p.id ? t(p.id) : p.label}
                </label>
                <button
                  type="button"
                  onClick={() => handleParamChange(p.id, -1, p.min, p.max, p.step)}
                  className="w-9 h-9 rounded-full bg-[#20293a] hover:bg-[#2c384e] active:scale-95 text-white flex items-center justify-center font-bold text-xl transition-all cursor-pointer"
                >
                  -
                </button>
                <div className="flex items-center justify-center min-w-[60px]">
                  <input
                    type="number"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={val}
                    onChange={(e) => handleParamDirect(p.id, parseFloat(e.target.value), p.min, p.max)}
                    className="text-2xl font-black text-white font-mono tracking-tight text-center bg-transparent outline-none w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleParamChange(p.id, 1, p.min, p.max, p.step)}
                  className="w-9 h-9 rounded-full bg-[#20293a] hover:bg-[#2c384e] active:scale-95 text-white flex items-center justify-center font-bold text-xl transition-all cursor-pointer"
                >
                  +
                </button>
              </div>
            );
          })}
        </div>

        {/* Plots / Lines Color & Width (Matches Image 1) */}
        <div className="space-y-5 pt-1">
          {meta.plots.map(plot => {
            const plotConfig = settings.plots[plot.id] || { color: plot.defaultColor, lineWidth: plot.defaultLineWidth };
            return (
              <div key={plot.id} className="space-y-3">
                {/* Header row: Color square + Label + Width Slider */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-md shadow-sm border border-black/20 shrink-0 transition-colors"
                      style={{ backgroundColor: plotConfig.color }}
                    />
                    <span className="text-xs font-bold text-white tracking-wide">
                      {plot.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={4}
                      step={1}
                      value={plotConfig.lineWidth}
                      onChange={(e) => handlePlotWidthChange(plot.id, Number(e.target.value))}
                      className="w-24 h-1 bg-[#263143] rounded-lg appearance-none cursor-pointer accent-[#2196f3]"
                    />
                  </div>
                </div>

                {/* 2x5 Color Swatches Grid (Exact layout from Image 1) */}
                <div className="grid grid-cols-5 gap-2 p-2 bg-[#18202d] rounded-xl border border-[#263042]">
                  {COLOR_SWATCHES.map(color => {
                    const isSelected = plotConfig.color.toLowerCase() === color.toLowerCase();
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handlePlotColorChange(plot.id, color)}
                        className="h-8 rounded-lg relative flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {isSelected && (
                          <Check size={16} className="text-white drop-shadow stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Delete Button matching Image 1 */}
      <div className="p-4 border-t border-[#242d3d]">
        <button
          type="button"
          onClick={() => {
            onDelete(currentName);
            onClose();
          }}
          className="w-full py-3 bg-[#202736] hover:bg-[#ff3b47]/20 border border-[#2b3548] hover:border-[#ff3b47]/50 rounded-xl text-[#ff4b55] font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <Trash2 size={16} className="text-[#ff4b55]" />
          <span>{t('delete') || 'Delete'}</span>
        </button>
      </div>
    </div>
  );
};
