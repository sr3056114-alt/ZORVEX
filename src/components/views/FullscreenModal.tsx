import React, { useState } from 'react';
import { 
  X, Grid, Settings, Bell, ChevronDown, Plus, ShieldCheck, Lock,
  Navigation, User, ArrowLeftRight, HelpCircle, Trophy, ShoppingBag, 
  MoreHorizontal, Moon, Sun, CloudMoon, BellOff, Image as ImageIcon, Check, Trash2, Globe, Clock
} from 'lucide-react';
import { useBalance } from '../../../App';
import { useLanguage } from '../../context/LanguageContext';
import { TimezoneSelectorModal } from '../LanguageTimezoneModal';
import QuotexLanguageDropdown from '../QuotexLanguageDropdown';
import MoreView from './MoreView';
import HistoryView from './HistoryView';
import AccountView from './AccountView';

export default function FullscreenModal({ onClose, themeMode, setThemeMode, appSettings, setAppSettings, onDeposit, onWithdrawal }) {
  const { language, setLanguage, timezone, setTimezone, t } = useLanguage();
  const [isTzModalOpen, setIsTzModalOpen] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
      const reader = new FileReader();
      reader.onload = (e) => setAppSettings(prev => ({ ...prev, bgImage: e.target?.result }));
      reader.readAsDataURL(file);
    } else if (file) {
      alert("File is too large! Maximum size is 2MB.");
    }
  };
  const { balance } = useBalance();
  const [activeTab, setActiveTab] = useState('');

  const THEMES = {
    'Light Mode': {
      bg: 'bg-[var(--bg-main)]',
      panelBg: 'bg-[var(--bg-panel)]',
      border: 'border-[var(--border-color)]',
      text: 'text-[var(--text-primary)]',
      textMuted: 'text-[var(--text-muted)]',
      inputBg: 'bg-transparent',
      hover: 'hover:bg-[var(--hover-bg)]'
    },
    'Twilight': {
      bg: 'bg-[var(--bg-main)]',
      panelBg: 'bg-[var(--hover-bg)]',
      border: 'border-[var(--border-color)]',
      text: 'text-[var(--text-primary)]',
      textMuted: 'text-[var(--text-muted)]',
      inputBg: 'bg-transparent',
      hover: 'hover:bg-[var(--hover-bg)]'
    },
    'Full Night': {
      bg: 'bg-[var(--bg-main)]',
      panelBg: 'bg-[var(--bg-panel)]',
      border: 'border-[var(--border-color)]',
      text: 'text-[var(--text-primary)]',
      textMuted: 'text-[var(--text-muted)]',
      inputBg: 'bg-transparent',
      hover: 'hover:bg-[var(--hover-bg)]'
    }
  };

  const currentTheme = THEMES[themeMode];
  const isLight = themeMode === 'Light Mode';

  const tabs = [
    { id: 'DEPOSIT', label: t('deposit') },
    { id: 'WITHDRAWAL', label: t('withdrawal') },
    { id: 'Withdrawal History', label: t('withdrawalHistory') },
    { id: 'Deposit History', label: t('depositHistory') },
    { id: 'Trade History', label: t('tradeHistory') },
    { id: 'My account', label: t('myAccount') },
    { id: 'Market', label: t('market') },
    { id: 'Tournaments', label: t('tournaments') },
    { id: 'Analytics', label: t('analytics') }
  ];

  return (
    <div className={`fixed inset-0 z-50 flex ${activeTab ? currentTheme.bg : 'pointer-events-none'} animate-in fade-in duration-200`}>
      {/* Left Settings Sidebar */}
      <div className={`w-[250px] ${currentTheme.panelBg} flex flex-col shrink-0 border-r ${currentTheme.border} shadow-xl z-20 pointer-events-auto`}>
        {/* Settings Header */}
        <div className={`h-14 flex items-center justify-between px-6 border-b ${currentTheme.border}`}>
          <span className={`${currentTheme.text} font-bold text-lg`}>{t('settings') || 'Settings'}</span>
          <button onClick={onClose} className={`${currentTheme.textMuted} hover:${currentTheme.text} transition-colors`}>
            <X size={18} />
          </button>
        </div>

        {/* Global Settings List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
          
          {/* Quotex Language Dropdown (moved from header per user request) */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-color)] bg-[var(--hover-bg)]/30">
            <div className="flex items-center gap-2.5">
              <Globe size={16} className="text-[#1e88e5] shrink-0" />
              <span className={`${currentTheme.text} text-sm font-semibold`}>{t('language') || 'Language'}</span>
            </div>
            <QuotexLanguageDropdown isLight={themeMode === 'Light Mode'} />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium z-10`}>{t('timezone')}</label>
            <button 
              type="button"
              onClick={() => setIsTzModalOpen(true)}
              className={`w-full ${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2.5 ${currentTheme.text} text-sm flex items-center justify-between hover:border-[#1e88e5] transition-colors text-left cursor-pointer`}
            >
              <div className="flex items-center gap-2 truncate">
                <Clock size={15} className="text-[#1e88e5] shrink-0" />
                <span className="truncate text-xs">{timezone}</span>
              </div>
              <ChevronDown size={14} className={`${currentTheme.textMuted} shrink-0`} />
            </button>
          </div>

          {/* Theme Modes */}
          <div className="flex flex-col gap-2 mt-2">
            <span className={`${currentTheme.textMuted} text-[11px] font-bold uppercase px-1`}>{t('template') || 'TEMPLATE'}</span>
            
            <button 
              onClick={() => setThemeMode('Light Mode')}
              className={`flex items-center justify-between p-3 rounded-full border transition-all ${
                themeMode === 'Light Mode' 
                  ? 'border-[#1e88e5] bg-[#1e88e5]/10' 
                  : `${currentTheme.border} ${currentTheme.hover}`
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun size={18} className="text-[#f59e0b]" />
                <span className={`${themeMode === 'Light Mode' ? currentTheme.text : currentTheme.textMuted} font-bold text-sm`}>{t('lightMode') || 'Light Mode'}</span>
              </div>
              {themeMode === 'Light Mode' && <div className="w-4 h-4 rounded-full bg-[#1e88e5]"></div>}
              {themeMode !== 'Light Mode' && <div className={`w-4 h-4 rounded-full ${isLight ? 'bg-gray-200' : 'bg-[var(--hover-bg)]'}`}></div>}
            </button>

            <button 
              onClick={() => setThemeMode('Twilight')}
              className={`flex items-center justify-between p-3 rounded-full border transition-all ${
                themeMode === 'Twilight' 
                  ? 'border-[#1e88e5] bg-[#1e88e5]/10' 
                  : `${currentTheme.border} ${currentTheme.hover}`
              }`}
            >
              <div className="flex items-center gap-2">
                <CloudMoon size={18} className="text-[#f59e0b]" />
                <span className={`${themeMode === 'Twilight' ? currentTheme.text : currentTheme.textMuted} font-bold text-sm`}>{t('twilight') || 'Twilight'}</span>
              </div>
              {themeMode === 'Twilight' && <div className="w-4 h-4 rounded-full bg-[#1e88e5]"></div>}
              {themeMode !== 'Twilight' && <div className={`w-4 h-4 rounded-full ${isLight ? 'bg-gray-200' : 'bg-[var(--hover-bg)]'}`}></div>}
            </button>

            <button 
              onClick={() => setThemeMode('Full Night')}
              className={`flex items-center justify-between p-3 rounded-full border transition-all ${
                themeMode === 'Full Night' 
                  ? 'border-[#1e88e5] bg-[#1e88e5]/10' 
                  : `${currentTheme.border} ${currentTheme.hover}`
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon size={18} className="text-[#f59e0b]" />
                <span className={`${themeMode === 'Full Night' ? currentTheme.text : currentTheme.textMuted} font-bold text-sm`}>{t('fullNight') || 'Full Night'}</span>
              </div>
              {themeMode === 'Full Night' && <div className="w-4 h-4 rounded-full bg-[#1e88e5]"></div>}
              {themeMode !== 'Full Night' && <div className={`w-4 h-4 rounded-full ${isLight ? 'bg-gray-200' : 'bg-[var(--hover-bg)]'}`}></div>}
            </button>
          </div>

        
        {/* Platform Settings */}
        <div className="flex flex-col gap-4 mt-6">
          <span className={`${currentTheme.textMuted} text-[11px] font-bold uppercase px-1`}>{t('platformSettings') || 'PLATFORM'}</span>
          
          <div className="flex flex-col relative border border-[var(--border-color)] rounded p-2">
            <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium z-10`}>{t('gridOpacity') || "Grid's opacity"}</label>
            <div className="flex items-center justify-between px-2 pt-1">
              <button onClick={() => setAppSettings(s => ({...s, gridOpacity: Math.max(0, s.gridOpacity - 1)}))} className="w-6 h-6 rounded-full bg-[var(--hover-bg)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--hover-bg-strong)]">-</button>
              <span className={`${currentTheme.text} font-bold`}>{appSettings.gridOpacity}</span>
              <button onClick={() => setAppSettings(s => ({...s, gridOpacity: Math.min(100, s.gridOpacity + 1)}))} className="w-6 h-6 rounded-full bg-[var(--hover-bg)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--hover-bg-strong)]">+</button>
            </div>
          </div>

          {[
            { id: 'showVerticalGridLines', label: t('verticalGridLines') || 'Vertical Grid Lines', desc: t('verticalGridDesc') || 'Show vertical lines on chart' },
            { id: 'showHorizontalGridLines', label: t('horizontalGridLines') || 'Horizontal Grid Lines', desc: t('horizontalGridDesc') || 'Show horizontal lines on chart' },
            { id: 'autoScrolling', label: t('autoScrolling') || 'Auto-scrolling', desc: t('autoScrollDesc') || 'Automatic graphic scrolling' },
            { id: 'oneClickTrade', label: t('oneClickTrade') || '1-click trade', desc: t('oneClickDesc') || 'Open trades without confirmation' },
            { id: 'performanceMode', label: t('performanceMode') || 'Performance Mode', desc: t('perfDesc') || 'Use optimized rendering for chart and candles' },
            { id: 'shortOrderLabel', label: t('shortOrderLabel') || 'Short order label', desc: t('shortOrderDesc') || 'Use short order element mode' },
            { id: 'hideTradeResults', label: t('hideTradeResults') || 'Hide trade results', desc: t('hideTradeDesc') || 'Use hide trade results mode' },
          ].map(opt => (
            <div key={opt.id} className="flex gap-3 px-1 items-start cursor-pointer group" onClick={() => setAppSettings(s => ({ ...s, [opt.id]: !s[opt.id] }))}>
              <div className={`w-[18px] h-[18px] rounded mt-0.5 flex items-center justify-center border transition-colors ${appSettings[opt.id] ? 'bg-white border-white' : 'border-[var(--text-muted)] group-hover:border-[var(--text-primary)]'}`}>
                {appSettings[opt.id] && <Check size={14} className="text-black" strokeWidth={3} />}
              </div>
              <div className="flex flex-col">
                <span className={`${currentTheme.text} text-sm font-medium leading-tight`}>{opt.label}</span>
                <span className={`${currentTheme.textMuted} text-xs mt-0.5`}>{opt.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Graph Colors */}
        <div className="flex flex-col gap-4 mt-6">
          <span className={`${currentTheme.textMuted} text-[11px] font-bold uppercase px-1`}>{t('graphColors') || 'GRAPH COLORS'}</span>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 rounded-full" style={{backgroundColor: appSettings.upColor}}></div>
              <span className={`${currentTheme.text} text-sm font-bold`}>{t('upTrend') || 'Up Trend'}</span>
            </div>
            <div className={`p-2 rounded flex gap-2 ${isLight ? 'bg-gray-100' : 'bg-[var(--hover-bg-strong)]'}`}>
               {['#22c55e', '#0ba259', '#06b6d4', '#67e8f9', '#ffffff', '#000000'].map(color => (
                 <div key={color} onClick={() => setAppSettings(s => ({...s, upColor: color}))} className="w-6 h-6 rounded cursor-pointer flex items-center justify-center shadow-sm border border-black/10" style={{backgroundColor: color}}>
                   {appSettings.upColor === color && <Check size={12} className={color === '#ffffff' ? 'text-black' : 'text-white'} />}
                 </div>
               ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 rounded-full" style={{backgroundColor: appSettings.downColor}}></div>
              <span className={`${currentTheme.text} text-sm font-bold`}>{t('downTrend') || 'Down Trend'}</span>
            </div>
            <div className={`p-2 rounded flex gap-2 ${isLight ? 'bg-gray-100' : 'bg-[var(--hover-bg-strong)]'}`}>
               {['#ef4444', '#e33f4a', '#fbbf24', '#d946ef', '#000000', '#1e88e5'].map(color => (
                 <div key={color} onClick={() => setAppSettings(s => ({...s, downColor: color}))} className="w-6 h-6 rounded cursor-pointer flex items-center justify-center shadow-sm border border-black/10" style={{backgroundColor: color}}>
                   {appSettings.downColor === color && <Check size={12} className={color === '#000000' ? 'text-white' : 'text-white'} />}
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Background */}
        <div className="flex flex-col gap-2 mt-6 mb-10">
          <span className={`${currentTheme.textMuted} text-[11px] font-bold uppercase px-1`}>{t('backgroundSetting') || 'BACKGROUND'}</span>
          <div className="px-1">
            <label className={`w-full py-3 rounded border border-dashed ${isLight ? 'border-[#1e88e5] text-[#1e88e5]' : 'border-[var(--text-muted)] text-[var(--text-primary)] hover:border-[#1e88e5]'} flex items-center justify-center gap-2 cursor-pointer transition-colors group relative overflow-hidden bg-transparent hover:bg-[#1e88e5]/5`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <ImageIcon size={20} className={isLight ? 'text-[#1e88e5]' : 'text-white'} />
              <div className="flex flex-col items-start">
                <span className={`text-sm font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{appSettings.bgImage ? (t('changeFile') || 'Change file') : (t('chooseFile') || 'Choose file')}</span>
                <span className={`text-xs ${isLight ? 'text-gray-600' : 'text-[var(--text-muted)]'}`}>{t('maxSize2Mb') || '(Max size — 2 Mb)'}</span>
              </div>
              {appSettings.bgImage && (
                 <button onClick={(e) => { e.preventDefault(); setAppSettings(s => ({...s, bgImage: null})) }} className="absolute right-2 p-1 text-[var(--text-muted)] hover:text-red-500 bg-[var(--bg-panel)] rounded-full z-10">
                   <Trash2 size={14} />
                 </button>
              )}
            </label>
          </div>
        </div>

        </div>

      </div>

      {/* Main Content Area */}
      {activeTab && (
      <div className="flex-1 flex flex-col relative min-w-0 pointer-events-auto">
        
        {/* Top App Header (Inside Modal) */}
        <div className={`h-14 ${currentTheme.panelBg} border-b ${currentTheme.border} flex items-center justify-between px-6 shrink-0`}>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="flex items-end gap-[2px]">
                  <div className={`w-[5px] h-3 ${isLight ? 'bg-[#e33f4a]' : 'bg-white'} rounded-[1px]`}></div>
                  <div className={`w-[5px] h-5 ${isLight ? 'bg-[#e33f4a]' : 'bg-white'} rounded-[1px]`}></div>
                  <div className={`w-[5px] h-4 ${isLight ? 'bg-[#e33f4a]' : 'bg-white'} rounded-[1px]`}></div>
                </div>
                <span className={`${currentTheme.text} font-black tracking-wider text-xl`}>ZORVEX</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button className={`relative w-9 h-9 flex items-center justify-center rounded-full ${isLight ? 'bg-gray-200 text-gray-600' : 'bg-[var(--hover-bg)] text-white'}`}>
                <Bell size={18} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#e33f4a] rounded-full text-[10px] flex items-center justify-center font-bold text-white border-2 border-transparent">2</div>
              </button>
              <div className={`flex items-center ${isLight ? 'bg-gray-200' : 'bg-[var(--hover-bg)]'} rounded cursor-pointer overflow-hidden`}>
                <div className="px-4 py-1.5 flex flex-col justify-center min-w-[140px]">
                  <span className={`${isLight ? 'text-[#0ea960]' : 'text-[#0ba259]'} text-[10px] font-black leading-none uppercase tracking-wide flex items-center gap-1`}><User size={10}/> {t('demoAccount')}</span>
                  <span className={`${currentTheme.text} text-sm font-bold leading-tight mt-0.5`}>${balance.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                </div>
                <div className={`px-2 border-l ${isLight ? 'border-gray-300' : 'border-[#1f2631]'} self-stretch flex items-center justify-center`}>
                  <ChevronDown size={14} className={currentTheme.textMuted} />
                </div>
              </div>
              <button onClick={onDeposit} className="bg-[#0ba259] hover:bg-[#0ba259]/90 text-white font-bold text-sm px-5 py-2.5 rounded flex items-center gap-1.5 transition-colors">
                <Plus size={16} strokeWidth={3} /> {t('deposit')}
              </button>
              <button onClick={onWithdrawal} className={`${isLight ? 'bg-gray-800 hover:bg-gray-700' : 'bg-[#3b4353] hover:bg-[#4a5468]'} text-white font-bold text-sm px-5 py-2.5 rounded transition-colors`}>
                {t('withdrawal')}
              </button>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex flex-col ${currentTheme.bg} px-6 pt-6`}>
          <div className={`flex gap-1 overflow-x-auto custom-scrollbar border-b ${currentTheme.border}`}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'DEPOSIT') {
                    onClose();
                    onDeposit();
                  } else if (tab.id === 'WITHDRAWAL') {
                    onClose();
                    onWithdrawal();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`px-6 py-2.5 text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? `${currentTheme.panelBg} ${currentTheme.text} rounded-t shadow-sm`
                    : `${currentTheme.textMuted} hover:${currentTheme.panelBg} rounded-t`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic View Content */}
        <div className={`flex-1 overflow-y-auto p-6 ${currentTheme.bg}`}>
          {activeTab === 'Analytics' && <MoreView theme={currentTheme} isLight={isLight} />}
          {activeTab === 'My account' && <AccountView theme={currentTheme} isLight={isLight} />}
          {activeTab === 'Deposit History' && <HistoryView type="deposit" theme={currentTheme} isLight={isLight} />}
          {activeTab === 'Withdrawal History' && <HistoryView type="withdrawal" theme={currentTheme} isLight={isLight} />}
          {activeTab === 'Trade History' && <HistoryView type="trades" theme={currentTheme} isLight={isLight} />}
          {activeTab !== 'Analytics' && activeTab !== 'My account' && activeTab !== 'Deposit History' && activeTab !== 'Withdrawal History' && activeTab !== 'Trade History' && (
            <div className="flex h-full items-center justify-center text-2xl font-bold text-gray-500 opacity-50">
              {activeTab} Content Area
            </div>
          )}
        </div>

      </div>
      )}

      <TimezoneSelectorModal
        isOpen={isTzModalOpen}
        onClose={() => setIsTzModalOpen(false)}
        currentTimezone={timezone}
        onSelectTimezone={setTimezone}
      />
    </div>
  );
}
