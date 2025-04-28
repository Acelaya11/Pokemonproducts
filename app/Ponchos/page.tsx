'use client';

import { useState } from 'react';
import { ItemGrid } from './client-components/grid-ui';
import Sidebar from './client-components/sidebar';
import Header from './client-components/header';
import { NavigationMenu } from './client-components/navigation-menu';
import { Category, initialCategories, updateCategories, ensureDefaultSelection, getSelectedCategoryNames } from './client-components/ssr/advanced-filter';
import Image from 'next/image';
import darkbanette from '../../public/darkbanette.png';
import { RecentlyAdded } from './client-components/recently-added';
import { PokemonGenerator } from './client-components/pokemon-generator';

export default function PonchosPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const handleCategoryChange = (categoryId: string) => {
    const updatedCategories = updateCategories(categories, categoryId);
    const finalCategories = ensureDefaultSelection(updatedCategories);
    setCategories(finalCategories);
  };

  const selectedCategories = getSelectedCategoryNames(categories);

  return (
    <div className="min-h-screen relative">
      <NavigationMenu />
      <RecentlyAdded />
      <ItemGrid selectedCategories={selectedCategories} />
    </div>
  );
}
