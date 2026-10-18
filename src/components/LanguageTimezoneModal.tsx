import React, { useState } from 'react';
import { Search, X, Check, Globe, Clock } from 'lucide-react';
import { ALL_LANGUAGES, QUOTEX_TIMEZONES, LanguageItem, TimezoneItem } from '../context/LanguageContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');

  if (!isOpen) return null;

  // Filter languages by search query and letter
  const filtered = ALL_LANGUAGES.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.countryCode.toLowerCase().includes(q) ||
      l.serial.toString() === q ||
      `#${l.serial}` === q;

    const matchesLetter =
      selectedLetter === 'ALL' ||
      l.name.toUpperCase().startsWith(selectedLetter);

    return matchesSearch && matchesLetter;
  });

  // Group languages by first letter for clear A-Z presentation
  const groupedByLetter: Record<string, LanguageItem[]> = {};
  filtered.forEach((item) => {
    const firstChar = item.name.charAt(0).toUpperCase();
    if (!groupedByLetter[firstChar]) {
      groupedByLetter[firstChar] = [];
    }
    groupedByLetter[firstChar].push(item);
  });

  const availableLetters = Object.keys(groupedByLetter).sort();

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl w-full max-w-[480px] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-panel)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Globe size={19} className="text-[#1e88e5] shrink-0" />
            <span className="text-[var(--text-primary)] font-bold text-base tracking-tight">Select Language</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1e88e5]/15 text-[#1e88e5] border border-[#1e88e5]/30 shrink-0">
              {ALL_LANGUAGES.length} Languages (A-Z)
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-full transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-lg focus-within:border-[#1e88e5] transition-colors">
            <Search size={16} className="text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              placeholder="Search language (name, native, code, #number)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value && selectedLetter !== 'ALL') {
                  setSelectedLetter('ALL');
                }
              }}
              className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] w-full placeholder:text-[var(--text-muted)]"
              autoFocus
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* A to Z Letter Filter / Jump Bar */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-0.5">
            {ALPHABET.map((letter) => {
              const isActive = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1e88e5] text-white shadow-sm'
                      : 'bg-[#141b25] text-[#8e9cb0] hover:bg-[#243042] hover:text-white border border-[#232d3d]'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language List - Serial Numbered & Alphabetical A to Z */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] font-medium">
              No languages found matching "{search}" {selectedLetter !== 'ALL' ? `under letter "${selectedLetter}"` : ''}
            </div>
          ) : (
            availableLetters.map((letter) => {
              const letterLanguages = groupedByLetter[letter] || [];
              return (
                <div key={letter} className="space-y-1">
                  {/* Letter Group Header */}
                  <div className="sticky top-0 z-10 px-3 py-1 bg-[var(--bg-panel)]/95 backdrop-blur-md rounded-md flex items-center justify-between border-y border-[var(--border-color)]/60 text-[#1e88e5] font-extrabold text-xs">
                    <span className="tracking-wider">Letter {letter}</span>
                    <span className="text-[10px] text-[#78879b] font-medium font-mono">
                      {letterLanguages.length} {letterLanguages.length === 1 ? 'language' : 'languages'}
                    </span>
                  </div>

                  {/* Languages under this letter */}
                  <div className="space-y-1 pt-0.5">
                    {letterLanguages.map((item) => {
                      const isSelected =
                        item.name.toLowerCase() === currentLanguage.toLowerCase() ||
                        item.code.toLowerCase() === currentLanguage.toLowerCase();

                      return (
                        <button
                          key={item.code}
                          onClick={() => {
                            onSelectLanguage(item.name);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#18273d] text-[#1e88e5] font-bold border border-[#1e88e5]/40 shadow-sm' 
                              : 'hover:bg-[#1a2230] text-[#e1e7f0] font-medium border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Serial Number */}
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 select-none font-bold ${
                              isSelected
                                ? 'bg-[#1e88e5]/25 text-[#1e88e5] border border-[#1e88e5]/40'
                                : 'bg-[#141b25] text-[#718298] border border-[#232d3d]'
                            }`}>
                              #{item.serial < 10 ? `0${item.serial}` : item.serial}
                            </span>

                            {/* 2-Letter Country Code */}
                            <span className={`w-7 text-center text-xs font-black tracking-wider shrink-0 select-none ${
                              isSelected ? 'text-[#1e88e5]' : 'text-[#8492a6]'
                            }`}>
                              {item.countryCode}
                            </span>

                            {/* Language Name and Native Script */}
                            <div className="flex flex-col truncate">
                              <span className={`text-sm leading-tight font-semibold truncate ${isSelected ? 'text-[#1e88e5]' : 'text-white'}`}>
                                {item.name}
                              </span>
                              <span className="text-[11px] text-[#78879b] leading-tight mt-0.5 font-normal truncate">
                                {item.nativeName}
                              </span>
                            </div>
                          </div>

                          {/* Selected Checkmark */}
                          {isSelected && (
                            <Check size={16} className="text-[#1e88e5] shrink-0 ml-2 stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>Active: <strong className="text-[var(--text-primary)]">{currentLanguage}</strong></span>
          <span className="text-[10px] font-mono">Showing {filtered.length} of {ALL_LANGUAGES.length}</span>
        </div>
      </div>
    </div>
  );
};

interface TimezoneSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimezone: string;
  onSelectTimezone: (tz: string) => void;
}

export const TimezoneSelectorModal: React.FC<TimezoneSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTimezone,
  onSelectTimezone
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = QUOTEX_TIMEZONES.filter(
    tz => tz.label.toLowerCase().includes(search.toLowerCase()) ||
          tz.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-base">
            <Clock size={18} className="text-[#1e88e5]" />
            <span>Select Quotex Timezone</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-lg focus-within:border-[#1e88e5] transition-colors">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by UTC offset or city (e.g. 05:30, London, Delhi, Tokyo)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] w-full placeholder:text-[var(--text-muted)]"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Timezone List */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] font-medium">
              No timezones found matching "{search}"
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = currentTimezone.includes(item.value);
              // Calculate preview time in this timezone
              const d = new Date();
              const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
              const tzTime = new Date(utc + (item.offsetMinutes * 60000));
              const timeStr = tzTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

              return (
                <button
                  key={item.value}
                  onClick={() => {
                    onSelectTimezone(item.value);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#18273d] text-[#1e88e5] font-bold border border-[#1e88e5]/40 shadow-sm' 
                      : 'hover:bg-[#1a2230] text-[#e1e7f0] font-medium border border-transparent'
                  }`}
                >
                  <div className="flex flex-col pr-3 min-w-0">
                    <span className={`text-sm leading-tight truncate ${isSelected ? 'text-[#1e88e5] font-bold' : 'text-white font-semibold'}`}>
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[#78879b] mt-0.5 font-mono">
                      {item.value}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#131924] border border-[#232d3d] text-[#8e9cb0]">
                      {timeStr}
                    </span>
                    {isSelected && <Check size={16} className="text-[#1e88e5] stroke-[2.5]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
