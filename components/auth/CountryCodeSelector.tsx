
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsUpDown, Search } from 'lucide-react';
import { countryData, Country } from '../../data/countries';
import { cn } from '../../lib/utils';

const CountryCodeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Country>(countryData.find(c => c.code === 'US')!);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countryData.filter(
    country =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dial_code.includes(search)
  );

  const handleSelect = (country: Country) => {
    setSelected(country);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-200 bg-neutral-800 border border-neutral-600 rounded-l-lg hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{selected.flag}</span>
        <ChevronsUpDown size={16} className="ml-2 opacity-50"/>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 top-full mt-2 w-72 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg"
          >
            <div className="p-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-neutral-700/50 border border-neutral-600 text-white rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <ul className="max-h-60 overflow-y-auto py-1">
              {filteredCountries.map(country => (
                <li key={country.code}>
                  <button
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-blue-600/50 transition-colors",
                        selected.code === country.code && "bg-blue-600/30"
                    )}
                  >
                    <span className="w-6 text-center">{country.flag}</span>
                    <span className="flex-grow text-neutral-200">{country.name}</span>
                    <span className="text-neutral-400">{country.dial_code}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountryCodeSelector;
