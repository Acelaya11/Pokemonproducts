'use client';

import { useState, useEffect, useMemo } from 'react';
import ItemGrid from './client-components/grid-ui';
import Sidebar from './client-components/sidebar';
import Header from './client-components/header';
import { NavigationMenu } from './client-components/navigation-menu';
import { Category, initialCategories, updateCategories, ensureDefaultSelection, addDynamicCategories } from './client-components/ssr/advanced-filter';
import { getAllItems } from '../../lib/data';
import Image from 'next/image';
import darkbanette from '../../public/darkbanette.png';
import RecentlyAdded from './client-components/recently-added';
import { PokemonGenerator } from './client-components/pokemon-generator';


export default function MiasPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Fetch items and populate dynamic categories
  useEffect(() => {
    const fetchItemsAndPopulateCategories = async () => {
      try {
        const items = await getAllItems();
        const dynamicCategories = addDynamicCategories(initialCategories, items);
        setCategories(dynamicCategories);
      } catch (error) {
        console.error('Error fetching items for dynamic categories:', error);
      }
    };

    fetchItemsAndPopulateCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    const updatedCategories = updateCategories(categories, categoryId);
    
    // Only call ensureDefaultSelection when switching product types
    // This prevents infinite loops when selecting individual categories
    let finalCategories = updatedCategories;
    
    if (categoryId === 'all' || categoryId === 'cards' || categoryId === 'sealed') {
      finalCategories = ensureDefaultSelection(updatedCategories);
    }
    
    setCategories(finalCategories);
  };

  // Get selected categories for filtering - memoized to prevent unnecessary re-renders
  const selectedCategories = useMemo(() => {
    return categories.filter(cat => cat.checked);
  }, [categories]);
  

  return (
    <div className="flex flex-col min-h-screen max-w-screen bg-[#130d24] p-2 md:p-5 pb-30">
      <Header />
      <NavigationMenu />
      <div className="flex justify-center mb-4 relative z-20">
        <PokemonGenerator />
      </div>
      <div className="relative">
        <RecentlyAdded className="mb-0 relative z-10" />
        <div className="w-full flex justify-center -mt-30">
          <Image
            src={darkbanette}
            alt="Dark Banette"
            className="w-full max-w-[800px] h-auto object-contain rounded-lg opacity-30"
            width={800}
            priority
          />
        </div>
      </div>
      <div id="item-grid" className="flex flex-col flex-1 gap-3 md:gap-4 -mt-4">
        <Sidebar 
          categories={categories}
          onCategoryChange={handleCategoryChange}
        />
        <div className="flex-1 py-4 h-full">
          <ItemGrid selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}
