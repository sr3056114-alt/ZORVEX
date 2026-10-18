
import React from 'react';
import { Category } from '../types';

interface CategoryTabsProps {
  active: Category;
  onChange: (cat: Category) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ active, onChange }) => {
  const categories = Object.values(Category);

  return (
    <div className="flex gap-2 mb-6 py-1 w-full">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-1 px-2 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-300 border ${
            active === cat 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent shadow-lg shadow-purple-900/40 text-white' 
            : 'bg-[#1e2329] border-white/10 text-gray-400'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
