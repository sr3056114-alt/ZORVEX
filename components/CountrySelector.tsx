import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const countries = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+98', name: 'Iran', flag: '🇮🇷' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: '+212', name: 'Morocco', flag: '🇲🇦' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
];

interface CountrySelectorProps {
  selectedCode: string;
  onSelect: (code: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCode, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  const selectedCountry = countries.find(c => c.code === selectedCode) || countries[0];

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/5 border border-white/10 rounded-lg px-2 py-2.5 flex items-center gap-1 hover:bg-white/10 transition-colors h-full"
      >
        <span className="text-base">{selectedCountry.flag}</span>
        <span className="font-bold text-sm">{selectedCountry.code}</span>
        <ChevronDown size={14} className={`text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-gray-900 border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col max-h-64">
          <div className="p-2 border-b border-white/10">
            <div className="bg-black/50 rounded flex items-center px-2 py-1.5">
              <Search size={14} className="text-white/50 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/30"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.name}
                  type="button"
                  onClick={() => {
                    onSelect(country.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 hover:bg-white/10 transition-colors ${selectedCode === country.code ? 'bg-white/10 text-[#ffb700]' : 'text-white'}`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 text-sm">{country.name}</span>
                  <span className="text-sm font-mono text-white/50">{country.code}</span>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-white/50 text-sm">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
