'use client';

import { useState } from 'react';
import ItemGrid from './client-components/grid-ui';
import Sidebar from './client-components/sidebar';
import Header from './client-components/header';
import { NavigationMenu } from './client-components/navigation-menu';
import { Category, initialCategories, updateCategories, ensureDefaultSelection, getSelectedCategoryNames } from './client-components/ssr/advanced-filter';
import Image from 'next/image';
import darkbanette from '../../public/darkbanette.png';
import RecentlyAdded from './client-components/recently-added';
import { PokemonGenerator } from './client-components/pokemon-generator';


export default function MiasPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const handleCategoryChange = (categoryId: string) => {
    const updatedCategories = updateCategories(categories, categoryId);
    const finalCategories = ensureDefaultSelection(updatedCategories);
    setCategories(finalCategories);
  };

  const selectedCategories = getSelectedCategoryNames(categories);

  return (
    <div className="flex flex-col min-h-screen max-w-screen bg-[#130d24] p-2 md:p-5 pb-30">
      <Header />
      <NavigationMenu />
      <div className="flex justify-center mb-4">
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
            height={400}
            priority
          />
        </div>
      </div>
      <div id="item-grid" className="flex flex-col md:flex-row flex-1 gap-3 md:gap-4 -mt-4">
        <Sidebar 
          categories={categories}
          onCategoryChange={handleCategoryChange}
        />
        <div className="flex-1 md:pl-2 py-4 h-full">
          <ItemGrid selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}
