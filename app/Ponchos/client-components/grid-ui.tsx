'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ItemDescriptionDialog } from './item-description';
import { Button } from "../../../components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ItemCard from './ssr/item-card';
import { AddToCart } from './AddToCart';
import { CartIcon } from './CartIcon';
import { getAllItems } from '../../../lib/data';
import type { CardItem, SealedProduct } from './ssr/items-data';

interface ItemGridProps {
  selectedCategories: string[];
}

type SortField = 'price' | 'psa_grade' | 'uploadDate';
type SortDirection = 'asc' | 'desc' | null;
type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Double Rare' | 'Ultra Rare' | 'Illustration Rare' | 'Special Illustration Rare' | 'Hyper Rare' | 'Promo' | 'Shiny Rare' | 'Gallery' | 'Super Rare';

export default function ItemGrid({ selectedCategories }: ItemGridProps) {
  const [selectedItem, setSelectedItem] = useState<CardItem | SealedProduct | null>(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [setNameSearch, setSetNameSearch] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [items, setItems] = useState<(CardItem | SealedProduct)[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItems();
        // Sort by ID by default
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setItems(sortedData);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Reset current page when search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, setNameSearch, selectedCategories]);

  // Reset current page when sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort icon component
  const SortIcon = ({ direction }: { direction: SortDirection }) => (
    <span className="ml-1 text-current">
      {direction ? (
        <span className="flex items-center text-current">
          {direction === 'desc' ? '↑↓' : '↓↑'}
        </span>
      ) : (
        <span className="flex items-center opacity-50 text-current">↓↑</span>
      )}
    </span>
  );

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      // Get selected categories by type
      const selectedEnergyTypes = selectedCategories.filter(cat => 
        ['Fire', 'Water', 'Grass', 'Colorless', 'Lightning', 'Psychic', 'Fighting', 'Dragon', 'Darkness', 'Metal', 'Fairy', 'None'].includes(cat)
      );
      const selectedRarities = selectedCategories.filter(cat => 
        ['Common', 'Uncommon', 'Rare', 'Double Rare', 'Ultra Rare', 'Illustration Rare', 'Special Illustration Rare', 'Hyper Rare', 'Promo', 'Shiny Rare', 'Gallery', 'Super Rare'].includes(cat)
      ) as Rarity[];
      const selectedExtras = selectedCategories.filter(cat => 
        ['Holo', 'Reverse Holo', 'EX', 'V', 'VMAX', 'VSTAR', 'Secret Rare'].includes(cat)
      ) as ('Holo' | 'Reverse Holo' | 'EX' | 'V' | 'VMAX' | 'VSTAR' | 'Secret Rare')[];
      const selectedProductTypes = selectedCategories.filter(cat =>
        ['Booster Pack', 'Booster Sleeve', '3pk Blister', 'B & B Deck', 'Booster Bundle', 'ETB', 'Booster Box', 'EX Box', 'Tins', 'Poncho Special', 'Special'].includes(cat)
      );
      const selectedExpansions = selectedCategories.filter(cat =>
        ['Scarlet & Violet', 'Sword & Shield', 'Sun & Moon', 'XY'].includes(cat)
      );
      const selectedPSAGrades = selectedCategories.filter(cat => 
        ['PSA 10', 'PSA 9', 'PSA 8', 'PSA 7', 'Ungraded'].includes(cat)
      );

      // Check product type selection
      const isCardsSelected = selectedCategories.includes('Cards');
      const isSealedSelected = selectedCategories.includes('Sealed Products');
      const isAllSelected = selectedCategories.includes('All');

      // If no categories are selected, show all items
      if (selectedCategories.length === 0) return true;

      // If "All" is selected, show all items
      if (isAllSelected) return true;

      // Filter by product type first
      if (isCardsSelected && !isSealedSelected && item.type !== 'card') return false;
      if (isSealedSelected && !isCardsSelected && item.type !== 'sealed') return false;

      if (item.type === 'card') {
        const cardItem = item as CardItem;
        // Check if item matches selected energy type
        const matchesEnergyType = selectedEnergyTypes.length === 0 || selectedEnergyTypes.includes(cardItem.energy_type);

        // Check if item matches any of the selected rarities
        const matchesRarity = selectedRarities.length === 0 || 
          selectedRarities.some(rarity => cardItem.rarities.includes(rarity));

        // Check if item matches any of the selected extra types
        const matchesExtra = selectedExtras.length === 0 || 
          selectedExtras.some(extra => cardItem.extra_types.includes(extra));

        // Check if item matches selected PSA grades
        const matchesPSAGrade = selectedPSAGrades.length === 0 || 
          selectedPSAGrades.some(grade => {
            if (grade === 'Ungraded') {
              return cardItem.psa_grade === 'Ungraded';
            }
            const numericGrade = parseInt(grade.replace('PSA ', ''));
            return parseInt(cardItem.psa_grade) === numericGrade;
          });

        return matchesEnergyType && matchesRarity && matchesExtra && matchesPSAGrade;
      } else {
        const sealedItem = item as SealedProduct;
        // For sealed products, check both product type and series
        const matchesProductType = selectedProductTypes.length === 0 || selectedProductTypes.includes(sealedItem.product_type);
        const matchesSeries = selectedExpansions.length === 0 || selectedExpansions.includes(sealedItem.series);
        return matchesProductType && matchesSeries;
      }
    });

    // Apply search filters
    if (searchTerm) {
      const searchKeywords = searchTerm.toLowerCase()
        .replace(/#/g, '') // Remove # characters
        .replace(/'/g, '') // Remove ' characters
        .split(/\s+/)
        .filter(Boolean);
      
      result = result.filter(item => {
        const itemText = `${item.id_name} ${item.item_name} ${item.type === 'card' ? (item as CardItem).set : (item as SealedProduct).series}`.toLowerCase()
          .replace(/'/g, ''); // Remove ' characters from item text
        return searchKeywords.every(keyword => {
          // Split the item text into words
          const words = itemText.split(/\s+/);
          // Check if any word starts with the keyword
          return words.some(word => word.startsWith(keyword));
        });
      });
    }

    if (setNameSearch) {
      const setKeywords = setNameSearch.toLowerCase()
        .replace(/#/g, '') // Remove # characters
        .replace(/'/g, '') // Remove ' characters
        .split(/\s+/)
        .filter(Boolean);
      
      result = result.filter(item => {
        const setText = item.set_id.toLowerCase()
          .replace(/'/g, ''); // Remove ' characters from set text
        const words = setText.split(/\s+/);
        return setKeywords.every(keyword => 
          words.some(word => word.startsWith(keyword))
        );
      });
    }

    // Apply sorting
    if (sortField && sortDirection) {
      result = [...result].sort((a, b) => {
        if (sortField === 'uploadDate') {
          const dateA = new Date(a.uploadDate);
          const dateB = new Date(b.uploadDate);
          return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        } else if (sortField === 'price') {
          return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (sortField === 'psa_grade') {
          const gradeA = (a as CardItem).psa_grade === 'Ungraded' ? 0 : parseInt((a as CardItem).psa_grade);
          const gradeB = (b as CardItem).psa_grade === 'Ungraded' ? 0 : parseInt((b as CardItem).psa_grade);
          return sortDirection === 'asc' ? gradeA - gradeB : gradeB - gradeA;
        }
        return 0;
      });
    } else {
      // Default sort by ID if no other sort is selected
      result = [...result].sort((a, b) => a.id - b.id);
    }

    return result;
  }, [selectedCategories, searchTerm, setNameSearch, sortField, sortDirection, items]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = useMemo(() => 
    filteredItems.slice(startIndex, endIndex),
    [filteredItems, startIndex, endIndex]
  );

  const handleViewDetails = useCallback((item: CardItem | SealedProduct) => {
    setSelectedItem(item);
    setDescriptionOpen(true);
  }, []);

  const scrollToTop = useCallback(() => {
    if (gridRef.current) {
      const elementPosition = gridRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    setTimeout(scrollToTop, 100);
  }, [scrollToTop]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    setTimeout(scrollToTop, 100);
  }, [totalPages, scrollToTop]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <CartIcon />
      <div ref={gridRef} className="container mx-auto rounded-lg px-4 py-8 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-600 shadow-lg shadow-zinc-700">
        <h2 className="text-2xl font-bold mb-8 text-white text-center">Pokemon Shop</h2>
        {/* Search and Sort Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product name..."
                  className="w-full h-10 px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={setNameSearch}
                  onChange={(e) => setSetNameSearch(e.target.value)}
                  placeholder="Search by set name..."
                  className="w-full h-10 px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                onClick={() => handleSort('price')}
                className="flex-1 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base border-0"
              >
                Price
                <SortIcon direction={sortField === 'price' ? sortDirection : null} />
              </Button>
              <Button
                variant="default"
                onClick={() => handleSort('psa_grade')}
                className="flex-1 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base border-0"
              >
                PSA Grade
                <SortIcon direction={sortField === 'psa_grade' ? sortDirection : null} />
              </Button>
              <Button
                variant="default"
                onClick={() => handleSort('uploadDate')}
                className="flex-1 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base border-0"
              >
                Upload Date
                <SortIcon direction={sortField === 'uploadDate' ? sortDirection : null} />
              </Button>
            </div>
          </div>
          <p className="text-base sm:text-lg font-medium text-white">
            Showing {filteredItems.length} of {items.length} items
          </p>
        </div>

        {/* Grid of Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentItems.map((item) => (
            <div key={item.id} className="w-full">
              <div className="flex flex-col w-full mx-auto p-2 sm:p-3 rounded-lg backdrop-blur-sm">
                <ItemCard item={item} onViewDetails={handleViewDetails} />
                <div className="mt-3 flex flex-col sm:flex-row gap-2 w-full">
                  <Button 
                    variant="outline" 
                    className="w-full sm:flex-1 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white text-sm sm:text-base h-9 sm:h-10 whitespace-nowrap transition-transform duration-300 border-0"
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </Button>
                  <AddToCart item={item} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 mt-8">
            <Button
              variant="outline"
              className="w-24 sm:w-auto bg-purple-700 hover:bg-purple-800 text-white border-0"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            
            <span className="text-white font-medium text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              className="w-24 sm:w-auto bg-purple-700 hover:bg-purple-800 text-white border-0"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Item Description Dialog */}
      {selectedItem && (
        <ItemDescriptionDialog 
          item={selectedItem} 
          open={descriptionOpen} 
          onOpenChange={setDescriptionOpen} 
        />
      )}
    </div>
  );
}