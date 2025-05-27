import { StaticImageData } from 'next/image';

export type Category = {
  id: string;
  name: string;
  checked: boolean;
  type: 'energy' | 'rarity' | 'extra' | 'product' | 'series' | 'sealed_type' | 'psa_grade';
  image?: StaticImageData;  // Optional image path for energy types
};

// Import energy type images
import fire from '../../../../public/fire.png';
import water from '../../../../public/water.png';
import grass from '../../../../public/grass.png';
import colorless from '../../../../public/colorless.png';
import lightning from '../../../../public/lightning.png';
import psychic from '../../../../public/psychic.png';
import fighting from '../../../../public/fighting.png';
import dragon from '../../../../public/dragon.png';
import darkness from '../../../../public/darkness.png';
import metal from '../../../../public/metal.png';
import fairy from '../../../../public/fairy.png';

export const initialCategories: Category[] = [
  // Product Type Selection
  { id: 'all', name: 'All', checked: true, type: 'product' },
  { id: 'cards', name: 'Cards', checked: false, type: 'product' },
  { id: 'sealed', name: 'Sealed Products', checked: false, type: 'product' },

  // PSA Grades
  { id: 'AllPSA', name: 'All Grades', checked: true, type: 'psa_grade' },
  { id: 'PSA10', name: 'PSA 10', checked: false, type: 'psa_grade' },
  { id: 'PSA9', name: 'PSA 9', checked: false, type: 'psa_grade' },
  { id: 'PSA8', name: 'PSA 8', checked: false, type: 'psa_grade' },
  { id: 'PSA7', name: 'PSA 7', checked: false, type: 'psa_grade' },
  { id: 'Ungraded', name: 'Ungraded', checked: false, type: 'psa_grade' },

  // Sealed Product Types
  { id: 'AllSealed', name: 'All', checked: true, type: 'sealed_type' },
  { id: 'Booster Pack', name: 'Booster Pack', checked: false, type: 'sealed_type' },
  { id: 'Booster Sleeve', name: 'Booster Sleeve', checked: false, type: 'sealed_type' },
  { id: '3pk Blister', name: '3pk Blister', checked: false, type: 'sealed_type' },
  { id: 'B & B Deck', name: 'B & B Deck', checked: false, type: 'sealed_type' },
  { id: 'Booster Bundle', name: 'Booster Bundle', checked: false, type: 'sealed_type' },
  { id: 'ETB', name: 'ETB', checked: false, type: 'sealed_type' },
  { id: 'Booster Box', name: 'Booster Box', checked: false, type: 'sealed_type' },
  { id: 'EX Box', name: 'EX Box', checked: false, type: 'sealed_type' },
  { id: 'Tins', name: 'Tins', checked: false, type: 'sealed_type' },
  { id: 'Poncho Special', name: 'Poncho Special', checked: false, type: 'sealed_type' },
  { id: 'Special', name: 'Special', checked: false, type: 'sealed_type' },

  // Series
  { id: 'AllSeries', name: 'All', checked: true, type: 'series' },
  { id: 'Scarlet & Violet', name: 'Scarlet & Violet', checked: false, type: 'series' },
  { id: 'Sword & Shield', name: 'Sword & Shield', checked: false, type: 'series' },
  { id: 'Sun & Moon', name: 'Sun & Moon', checked: false, type: 'series' },
  { id: 'XY', name: 'XY', checked: false, type: 'series' },

  // Energy Types
  { id: 'All', name: 'All', checked: true, type: 'energy' },
  { id: 'None', name: 'None', checked: false, type: 'energy' },
  { id: 'Fire', name: 'Fire', checked: false, type: 'energy', image: fire },
  { id: 'Water', name: 'Water', checked: false, type: 'energy', image: water },
  { id: 'Grass', name: 'Grass', checked: false, type: 'energy', image: grass },
  { id: 'Colorless', name: 'Colorless', checked: false, type: 'energy', image: colorless },
  { id: 'Lightning', name: 'Lightning', checked: false, type: 'energy', image: lightning },
  { id: 'Psychic', name: 'Psychic', checked: false, type: 'energy', image: psychic },
  { id: 'Fighting', name: 'Fighting', checked: false, type: 'energy', image: fighting },
  { id: 'Dragon', name: 'Dragon', checked: false, type: 'energy', image: dragon },
  { id: 'Darkness', name: 'Darkness', checked: false, type: 'energy', image: darkness },
  { id: 'Metal', name: 'Metal', checked: false, type: 'energy', image: metal },
  { id: 'Fairy', name: 'Fairy', checked: false, type: 'energy', image: fairy },
  
  // Rarities
  { id: 'AllRarity', name: 'All', checked: true, type: 'rarity' },
  { id: 'Common', name: 'Common', checked: false, type: 'rarity' },
  { id: 'Uncommon', name: 'Uncommon', checked: false, type: 'rarity' },
  { id: 'Rare', name: 'Rare', checked: false, type: 'rarity' },
  { id: 'Double Rare', name: 'Double Rare', checked: false, type: 'rarity' },
  { id: 'Ultra Rare', name: 'Ultra Rare', checked: false, type: 'rarity' },
  { id: 'Illustration Rare', name: 'Illustration Rare', checked: false, type: 'rarity' },
  { id: 'SIR', name: 'SIR', checked: false, type: 'rarity' },
  { id: 'Hyper Rare', name: 'Hyper Rare', checked: false, type: 'rarity' },
  { id: 'Promo', name: 'Promo', checked: false, type: 'rarity' },
  { id: 'Shiny Rare', name: 'Shiny Rare', checked: false, type: 'rarity' },
  { id: 'Gallery', name: 'Gallery', checked: false, type: 'rarity' },
  { id: 'Super Rare', name: 'Super Rare', checked: false, type: 'rarity' },
  
  // Extra Types
  { id: 'AllExtra', name: 'All', checked: true, type: 'extra' },
  { id: 'Holo', name: 'Holo', checked: false, type: 'extra' },
  { id: 'Reverse Holo', name: 'Reverse Holo', checked: false, type: 'extra' },
  { id: 'EX', name: 'EX', checked: false, type: 'extra' },
  { id: 'V', name: 'V', checked: false, type: 'extra' },
  { id: 'VMAX', name: 'VMAX', checked: false, type: 'extra' },
  { id: 'VSTAR', name: 'VSTAR', checked: false, type: 'extra' },
  { id: 'Secret Rare', name: 'Secret Rare', checked: false, type: 'extra' },
  { id: 'Pokeball', name: 'Pokeball', checked: true, type: 'extra' },
  { id: 'Masterball', name: 'Masterball', checked: false, type: 'extra' },
];

export const updateCategories = (currentCategories: Category[], categoryId: string): Category[] => {
  return currentCategories.map(category => {
    // Get the type of the clicked category
    const clickedCategoryType = currentCategories.find(cat => cat.id === categoryId)?.type;
    
    if (categoryId === 'all' || categoryId === 'All' || categoryId === 'AllRarity' || categoryId === 'AllExtra' || 
        categoryId === 'AllSealed' || categoryId === 'AllSeries' || categoryId === 'AllPSA') {
      // If clicking any "All" option, only affect categories of the same type
      if (category.type === clickedCategoryType) {
        if (categoryId === 'all') {
          // For product type "All", uncheck other product types and reset filters
          if (category.type === 'product') {
            return {
              ...category,
              checked: category.id === 'all',
            };
          }
        }
        return {
          ...category,
          checked: category.id === categoryId
        };
      }
      // Reset all filters when "all" is selected
      if (categoryId === 'all' && (category.type === 'energy' || category.type === 'rarity' || 
          category.type === 'extra' || category.type === 'sealed_type' || category.type === 'series' || 
          category.type === 'psa_grade')) {
        return {
          ...category,
          checked: category.id === 'All' || category.id === 'AllRarity' || category.id === 'AllExtra' || 
                  category.id === 'AllSealed' || category.id === 'AllSeries' || category.id === 'AllPSA'
        };
      }
      return category;
    }

    // If clicking any other category
    if (category.type === clickedCategoryType) {
      if (category.id === 'all' || category.id === 'All' || category.id === 'AllRarity' || 
          category.id === 'AllExtra' || category.id === 'AllSealed' || category.id === 'AllSeries' || 
          category.id === 'AllPSA') {
        // Deselect the corresponding "All" when selecting any other category of the same type
        return { ...category, checked: false };
      }
      
      // For product type categories, make them mutually exclusive and reset filters when switching
      if (category.type === 'product') {
        if (categoryId === 'cards') {
          return { ...category, checked: category.id === 'cards' };
        } else if (categoryId === 'sealed') {
          return { ...category, checked: category.id === 'sealed' };
        }
      }
      
      // Toggle the clicked category
      return {
        ...category,
        checked: category.id === categoryId ? !category.checked : category.checked
      };
    }

    // Reset filters when switching between cards and sealed products
    if ((categoryId === 'cards' || categoryId === 'sealed') && 
        (category.type === 'energy' || category.type === 'rarity' || category.type === 'extra' || 
         category.type === 'sealed_type' || category.type === 'series' || category.type === 'psa_grade')) {
      return {
        ...category,
        checked: category.id === 'All' || category.id === 'AllRarity' || category.id === 'AllExtra' || 
                category.id === 'AllSealed' || category.id === 'AllSeries' || category.id === 'AllPSA'
      };
    }
    return category;
  });
};

export const ensureDefaultSelection = (categories: Category[]): Category[] => {
  const hasSelectedEnergyCategories = categories.some(cat => cat.checked && cat.type === 'energy' && cat.id !== 'All');
  const hasSelectedRarityCategories = categories.some(cat => cat.checked && cat.type === 'rarity' && cat.id !== 'AllRarity');
  const hasSelectedExtraCategories = categories.some(cat => cat.checked && cat.type === 'extra' && cat.id !== 'AllExtra');
  const hasSelectedPSACategories = categories.some(cat => cat.checked && cat.type === 'psa_grade' && cat.id !== 'AllPSA');

  return categories.map(cat => {
    if (cat.type === 'energy' && !hasSelectedEnergyCategories) {
      return { ...cat, checked: cat.id === 'All' };
    }
    if (cat.type === 'rarity' && !hasSelectedRarityCategories) {
      return { ...cat, checked: cat.id === 'AllRarity' };
    }
    if (cat.type === 'extra' && !hasSelectedExtraCategories) {
      return { ...cat, checked: cat.id === 'AllExtra' };
    }
    if (cat.type === 'psa_grade' && !hasSelectedPSACategories) {
      return { ...cat, checked: cat.id === 'AllPSA' };
    }
    return cat;
  });
};

export const getSelectedCategoryNames = (categories: Category[]): string[] => {
  const selectedCategories = categories.filter(cat => cat.checked);
  const selectedProductCategories = selectedCategories.filter(cat => cat.type === 'product');
  const selectedEnergyCategories = selectedCategories.filter(cat => cat.type === 'energy');
  const selectedRarityCategories = selectedCategories.filter(cat => cat.type === 'rarity');
  const selectedExtraCategories = selectedCategories.filter(cat => cat.type === 'extra');
  const selectedSealedTypeCategories = selectedCategories.filter(cat => cat.type === 'sealed_type');
  const selectedSeriesCategories = selectedCategories.filter(cat => cat.type === 'series');
  const selectedPSACategories = selectedCategories.filter(cat => cat.type === 'psa_grade');

  const result: string[] = [];

  // Add product type categories
  if (selectedProductCategories.some(cat => cat.id === 'all')) {
    result.push(...categories.filter(cat => cat.type === 'product' && cat.id !== 'all').map(cat => cat.name));
  } else {
    result.push(...selectedProductCategories.map(cat => cat.name));
  }

  // Add energy type categories
  if (selectedEnergyCategories.some(cat => cat.id === 'All')) {
    result.push(...categories.filter(cat => cat.type === 'energy' && cat.id !== 'All').map(cat => cat.name));
  } else {
    result.push(...selectedEnergyCategories.map(cat => cat.name));
  }

  // Add rarity categories
  if (selectedRarityCategories.some(cat => cat.id === 'AllRarity')) {
    result.push(...categories.filter(cat => cat.type === 'rarity' && cat.id !== 'AllRarity').map(cat => cat.name));
  } else {
    result.push(...selectedRarityCategories.map(cat => cat.name));
  }

  // Add extra categories
  if (selectedExtraCategories.some(cat => cat.id === 'AllExtra')) {
    result.push(...categories.filter(cat => cat.type === 'extra' && cat.id !== 'AllExtra').map(cat => cat.name));
  } else {
    result.push(...selectedExtraCategories.map(cat => cat.name));
  }

  // Add sealed type categories
  if (selectedSealedTypeCategories.some(cat => cat.id === 'AllSealed')) {
    result.push(...categories.filter(cat => cat.type === 'sealed_type' && cat.id !== 'AllSealed').map(cat => cat.name));
  } else {
    result.push(...selectedSealedTypeCategories.map(cat => cat.name));
  }

  // Add series categories
  if (selectedSeriesCategories.some(cat => cat.id === 'AllSeries')) {
    result.push(...categories.filter(cat => cat.type === 'series' && cat.id !== 'AllSeries').map(cat => cat.name));
  } else {
    result.push(...selectedSeriesCategories.map(cat => cat.name));
  }

  // Add PSA grade categories
  if (selectedPSACategories.some(cat => cat.id === 'AllPSA')) {
    result.push(...categories.filter(cat => cat.type === 'psa_grade' && cat.id !== 'AllPSA').map(cat => cat.name));
  } else {
    result.push(...selectedPSACategories.map(cat => cat.name));
  }

  return result;
}; 