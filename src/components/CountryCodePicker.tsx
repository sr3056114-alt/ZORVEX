import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

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
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
];

interface CountryCodePickerProps {
  selectedCountry: typeof countries[0];
  onSelect: (country: typeof countries[0]) => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({ selectedCountry, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 flex items-center gap-2 active:scale-95 transition-transform shrink-0"
      >
        <span className="text-base">{selectedCountry.flag}</span>
        <span className="font-bold text-sm">{selectedCountry.code}</span>
        <div className="w-0.5 h-4 bg-white/20" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 mt-auto h-[80vh] rounded-t-3xl flex flex-col animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Select Country</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-white/70 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 border-b border-white/10">
              <div className="bg-black/50 rounded-xl flex items-center px-4 py-3 border border-white/10 focus-within:border-[#ffb700] transition-colors">
                <Search size={20} className="text-white/50 mr-3" />
                <input 
                  type="text" 
                  placeholder="Search country or code..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-sm text-white placeholder:text-white/30"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 pb-8">
              {filtered.map(country => (
                <button
                  key={country.name}
                  onClick={() => {
                    onSelect(country);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors text-white"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-bold text-sm">{country.name}</span>
                  </div>
                  <span className="text-white/50 font-medium text-sm">{country.code}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-white/50 p-8 flex flex-col items-center gap-2">
                  <Search size={32} className="opacity-20" />
                  <p>No countries found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CountryCodePicker;
