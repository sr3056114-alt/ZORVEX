import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Check, Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  isRtl?: boolean;
}

// Exactly 23 languages requested by user + Russian from screenshot
export const ALL_23_LANGUAGES: LanguageOption[] = [
  { code: 'EN', name: 'English', nativeName: 'English' },
  { code: 'HI', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'RU', name: 'Russian', nativeName: 'Русский' },
  { code: 'ES', name: 'Spanish', nativeName: 'Español' },
  { code: 'AR', name: 'Arabic', nativeName: 'العربية', isRtl: true },
  { code: 'BN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'FA', name: 'Persian', nativeName: 'فارسی', isRtl: true },
  { code: 'FIL', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'FR', name: 'French', nativeName: 'Français' },
  { code: 'HA', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'JA', name: 'Japanese', nativeName: '日本語' },
  { code: 'KO', name: 'Korean', nativeName: '한국어' },
  { code: 'MS', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'MY', name: 'Burmese', nativeName: 'မြန်မာဘာသာ' },
  { code: 'PT', name: 'Portuguese', nativeName: 'Português' },
  { code: 'SW', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'TH', name: 'Thai', nativeName: 'ภาษาไทย' },
  { code: 'TR', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'UK', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'UZ', name: 'Uzbek', nativeName: 'O\'zbekcha' },
  { code: 'VI', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ZH', name: 'Chinese', nativeName: '简体中文' }
];

export default function QuotexLanguageDropdown({ isLight }: { isLight?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLightMode = isLight !== undefined ? isLight : (typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light'));

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current active language code for the header button (e.g. EN, HI, AR, etc.)
  const currentLang = ALL_23_LANGUAGES.find(
    l => l.name.toLowerCase() === (language || '').toLowerCase() || 
         l.nativeName.toLowerCase() === (language || '').toLowerCase() ||
         l.code.toLowerCase() === (language || '').toLowerCase()
  ) || ALL_23_LANGUAGES[0];

  const filteredLanguages = useMemo(() => {
    if (!search.trim()) return ALL_23_LANGUAGES;
    const query = search.toLowerCase().trim();
    return ALL_23_LANGUAGES.filter(
      l => l.name.toLowerCase().includes(query) || 
           l.nativeName.toLowerCase().includes(query) ||
           l.code.toLowerCase().includes(query)
    );
  }, [search]);

  const handleSelectLanguage = (langName: string) => {
    setLanguage(langName);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative select-none" ref={dropdownRef}>
      {/* Top Header Button (Exact Image 3: Blue Globe + EN) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-bold transition-colors cursor-pointer select-none ${
          isLightMode 
            ? 'text-gray-800 hover:text-gray-950 hover:bg-gray-100 border border-gray-200 shadow-xs' 
            : 'text-gray-300 hover:text-white hover:bg-white/5'
        }`}
        title="Change Platform Language"
      >
        <Globe size={18} className="text-[#0088ff] shrink-0" />
        <span className={`font-bold text-[13px] tracking-wider ${isLightMode ? 'text-gray-800' : 'text-gray-200'}`}>
          {currentLang.code}
        </span>
      </button>

      {/* Quotex Dropdown Menu (Exact match to image.png) */}
      {isOpen && (
        <div 
          className={`absolute top-full right-0 mt-2 w-52 rounded-xl shadow-2xl overflow-hidden z-[9999] animate-in fade-in zoom-in-95 duration-150 flex flex-col border ${
            isLightMode 
              ? 'bg-white border-gray-200 text-gray-900 shadow-xl' 
              : 'bg-[#18202d] border-[#2b3547] text-white shadow-2xl'
          }`}
          style={{ boxShadow: isLightMode ? '0 12px 30px rgba(0,0,0,0.15)' : '0 12px 36px rgba(0,0,0,0.7)' }}
        >
          {/* Quick Search for 23 languages */}
          <div className={`p-2 border-b flex items-center gap-1.5 ${
            isLightMode ? 'bg-gray-50 border-gray-200' : 'bg-[#141b26] border-[#242e3f]'
          }`}>
            <Search size={14} className="text-gray-400 shrink-0 ml-1" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 23 languages..."
              className={`bg-transparent border-none outline-none text-xs w-full py-1 ${
                isLightMode ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
              }`}
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')} className={isLightMode ? "text-gray-400 hover:text-gray-700 mr-1" : "text-gray-400 hover:text-white mr-1"}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Languages list with custom scrollbar */}
          <div className={`max-h-[340px] overflow-y-auto custom-scrollbar flex flex-col py-0.5 divide-y ${
            isLightMode ? 'divide-gray-100 bg-white' : 'divide-[#20293a] bg-[#18202d]'
          }`}>
            {filteredLanguages.map((lang, idx) => {
              const isSelected = 
                currentLang.code === lang.code || 
                language.toLowerCase() === lang.name.toLowerCase() ||
                language.toLowerCase() === lang.nativeName.toLowerCase();

              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.name)}
                  className={`w-full text-left px-4 py-2.5 text-[14px] transition-all flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? 'bg-[#0077ff] text-white font-bold shadow-sm' 
                      : (isLightMode 
                          ? 'text-gray-700 hover:text-gray-950 hover:bg-gray-100 font-medium' 
                          : 'text-[#9aa7b5] hover:text-white hover:bg-[#20293a] font-medium')
                  } ${idx === 0 && isSelected && !search ? 'rounded-t-sm' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold opacity-70 ${isLightMode ? (isSelected ? 'text-white' : 'text-gray-400') : 'text-gray-400'}`}>
                      {lang.code}
                    </span>
                    <span className={lang.isRtl ? 'font-arabic' : ''}>
                      {lang.nativeName}
                    </span>
                  </div>
                  {isSelected && (
                    <Check size={14} strokeWidth={2.5} className="text-white shrink-0" />
                  )}
                </button>
              );
            })}

            {filteredLanguages.length === 0 && (
              <div className="py-6 text-center text-xs text-gray-400">
                No language found matching "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
