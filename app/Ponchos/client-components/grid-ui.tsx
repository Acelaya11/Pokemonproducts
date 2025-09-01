'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ItemDescriptionDialog } from './item-description';
import { Button } from "../../../components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AddToCart } from './AddToCart';
import { CartIcon } from './CartIcon';
import { getAllItems } from '../../../lib/data';
import type { CardItem, SealedProduct } from './ssr/items-data';
import Image from 'next/image';

interface ItemGridProps {
  selectedCategories: Array<{
    id: string;
    name: string;
    checked: boolean;
    type: 'energy' | 'rarity' | 'extra' | 'product' | 'series' | 'set' | 'sealed_type' | 'sealed_series' | 'psa_grade';
    image?: string | null;
    parentSeriesId?: string;
    parentSetId?: string;
  }>;
}

export default function ItemGrid({ selectedCategories }: ItemGridProps) {
  const [selectedItem, setSelectedItem] = useState<CardItem | SealedProduct | null>(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'price' | 'psa_grade' | 'uploadDate' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [items, setItems] = useState<(CardItem | SealedProduct)[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 16;
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getAllItems();

        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
          setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Reset current page when search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories]);

  // Reset current page when sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortField, sortDirection]);



  // Handle sorting
  const handleSort = (field: 'price' | 'psa_grade' | 'uploadDate') => {
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
  const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | null }) => (
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

  const handleViewDetails = useCallback((item: CardItem | SealedProduct) => {
    setSelectedItem(item);
    setDescriptionOpen(true);
  }, []);

  // Simple but effective filtering
  const filteredItems = useMemo(() => {
    
    // Start with all valid items
    let result = items.filter(item => 
      item && 
      item.id && 
      item.type && 
      item.price !== undefined &&
      (item.type === 'card' ? 
        (item as CardItem).card :
        (item as SealedProduct).product_name
      )
    );



    // Check if "All" is selected for product type (OR logic, not AND)
    const isAllProductsSelected = selectedCategories.some(cat => cat.id === 'all');
    const isCardsSelected = selectedCategories.some(cat => cat.id === 'cards');
    const isSealedSelected = selectedCategories.some(cat => cat.id === 'sealed');

    // Apply product type filter first (OR logic)
    if (!isAllProductsSelected) {
      // If neither cards nor sealed is selected, show nothing
      if (!isCardsSelected && !isSealedSelected) {
        result = [];
      } else if (isCardsSelected && !isSealedSelected) {
        // Show only cards
        result = result.filter(item => item.type === 'card');
      } else if (isSealedSelected && !isCardsSelected) {
        // Show only sealed products
        result = result.filter(item => item.type === 'sealed');
      }
      // If both are selected, show everything (same as "All")
    }



    // Get specific filters (not the "All" options)
    const specificFilters = selectedCategories.filter(cat => 
      !cat.id.startsWith('All') && 
      cat.id !== 'all' && 
      cat.type !== 'product'
    );

    // Separate rarity filters from other filters (rarities only apply to cards)
    const rarityFilters = specificFilters.filter(cat => cat.type === 'rarity');
    const nonRarityFilters = specificFilters.filter(cat => cat.type !== 'rarity');



    // Apply specific filters
    if (specificFilters.length > 0) {
      result = result.filter(item => {
        // For cards, we need to check if ALL selected filters match
        if (item.type === 'card') {
          const cardItem = item as CardItem;
          
          // Get selected series, sets, and rarities
          const selectedSeries = nonRarityFilters.filter(f => f.type === 'series').map(f => f.id);
          const selectedSets = nonRarityFilters.filter(f => f.type === 'set').map(f => f.id);
          const selectedRarities = rarityFilters.map(f => f.id);
          const selectedExtraRarities = nonRarityFilters.filter(f => f.type === 'extra').map(f => f.id);
          const selectedPSAGrades = nonRarityFilters.filter(f => f.type === 'psa_grade').map(f => f.id);
          const selectedEnergyTypes = nonRarityFilters.filter(f => f.type === 'energy').map(f => f.id);
          
          // Check if card matches ALL selected filters
          let matches = true;
          
          // Series filter: card must match ANY selected series OR "All Series" if selected
          if (selectedSeries.length > 0) {
            const isAllSeriesSelected = selectedSeries.includes('AllSeries');
            const isSpecificSeriesSelected = selectedSeries.includes(cardItem.series);
            
            matches = matches && (isAllSeriesSelected || isSpecificSeriesSelected);
          }

          // Set filter: card must match ANY selected set (including "All Sets" logic)
          if (selectedSets.length > 0) {
            const cardSetId = `${cardItem.series}:${cardItem.set}`;
            const allSetsId = `${cardItem.series}:AllSets`;
            
            // Check if either the specific set is selected OR "All Sets" for this series is selected
            const isSetSelected = selectedSets.includes(cardSetId);
            const isAllSetsSelected = selectedSets.includes(allSetsId);
            
            matches = matches && (isSetSelected || isAllSetsSelected);
          }
          
          // Rarity filter: handle "All Rarities" and specific rarity selection
          if (selectedRarities.length > 0) {
            const cardRarityId = `${cardItem.series}:${cardItem.set}:${cardItem.rarity}`;
            const allRaritiesId = `${cardItem.series}:${cardItem.set}:AllRarities`;
            
            // Check if either the specific rarity is selected OR "All Rarities" for this set is selected
            const isRaritySelected = selectedRarities.includes(cardRarityId);
            const isAllRaritiesSelected = selectedRarities.includes(allRaritiesId);
            
            matches = matches && (isRaritySelected || isAllRaritiesSelected);
          }
          
          // Extra rarities filter: card must match ANY selected extra rarity
          if (selectedExtraRarities.length > 0) {
            // Simple logic: if card has ANY of the selected special properties, show it
            const hasAnyExtraRarity = selectedExtraRarities.some(extraRarityId => {
              // Check if the card's other_rarities array contains this special property
              return Array.isArray(cardItem.other_rarities) && 
                     cardItem.other_rarities.includes(extraRarityId);
            });
            
            matches = matches && hasAnyExtraRarity;
          }
          
          // PSA Grade filter: card must match ANY selected PSA grade
          if (selectedPSAGrades.length > 0) {
            matches = matches && selectedPSAGrades.includes(cardItem.psa_grade);
          }
          
          // Energy Type filter: card must match ANY selected energy type
          if (selectedEnergyTypes.length > 0) {
            matches = matches && selectedEnergyTypes.includes(cardItem.energy_type);
          }
          
          return matches;
        }
        
        // For sealed products, handle filtering properly
        if (item.type === 'sealed') {
          const sealedItem = item as SealedProduct;
          
          // If no non-rarity filters are selected, show all sealed products
          if (nonRarityFilters.length === 0) {
            return true;
          }
          
          // Check if item matches ALL of the selected non-rarity categories
          return nonRarityFilters.every(filter => {
            // Check sealed product type
            if (filter.type === 'sealed_type') {
              return sealedItem.product_type === filter.id;
            }
            
            // Check sealed series (separate from card series)
            if (filter.type === 'sealed_series') {
              return filter.id.startsWith('sealed_') && sealedItem.sealed_series === filter.id.substring(7);
            }
            
            // If filter type is not recognized, exclude the item
            return false;
          });
        }
        
        return true;
      });
    }



    // Apply search filter
    if (searchTerm) {
      const searchKeywords = searchTerm.toLowerCase()
              .replace(/'/g, '') // Remove ' characters
        .split(/\s+/)
        .filter(Boolean);
      
      result = result.filter(item => {
        if (item.type === 'card') {
          const cardItem = item as CardItem;
          // Normalize card_id: lowercase, remove apostrophes and quotes, keep spaces
          const itemText = cardItem.card_id.toLowerCase()
            .replace(/'/g, ''); // Remove ' characters from item text
          
          return searchKeywords.every(keyword => {
            // Split the item text into words
            const words = itemText.split(/\s+/);
            // Check if any word starts with the keyword
            return words.some(word => word.startsWith(keyword));
          });
        } else {
          const sealedItem = item as SealedProduct;
          const itemText = sealedItem.product_id.toLowerCase()
            .replace(/'/g, ''); // Remove ' characters from item text
          
          return searchKeywords.every(keyword => {
            // Split the item text into words
            const words = itemText.split(/\s+/);
            // Check if any word starts with the keyword
            return words.some(word => word.startsWith(keyword));
          });
        }
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
          // Only sort by PSA grade for cards
          if (a.type === 'card' && b.type === 'card') {
          const gradeA = (a as CardItem).psa_grade === 'Ungraded' ? 0 : parseInt((a as CardItem).psa_grade);
          const gradeB = (b as CardItem).psa_grade === 'Ungraded' ? 0 : parseInt((b as CardItem).psa_grade);
            
            if (sortDirection === 'asc') {
              // Ascending: Ungraded first, then smallest number to greatest
              if (gradeA === 0 && gradeB !== 0) return -1; // Ungraded first
              if (gradeA !== 0 && gradeB === 0) return 1;  // Ungraded first
              return gradeA - gradeB; // Then by number
            } else {
              // Descending: Greatest to smallest, then Ungraded last
              if (gradeA === 0 && gradeB !== 0) return 1;  // Ungraded last
              if (gradeA !== 0 && gradeB === 0) return -1; // Ungraded last
              return gradeB - gradeA; // Then by number (reverse)
            }
          }
          return 0;
        }
        return 0;
      });
    } else {
      // Default sort by ID if no other sort is selected
      result = [...result].sort((a, b) => a.id - b.id);
    }



    return result;
  }, [selectedCategories, searchTerm, sortField, sortDirection, items]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = useMemo(() => 
    filteredItems.slice(startIndex, endIndex),
    [filteredItems, startIndex, endIndex]
  );

  // Skeleton loaders
  const skeletonLoaders = useMemo(() => (
    Array.from({ length: 20 }).map((_, index) => (
      <div key={index} className="w-full">
        <div className="flex flex-col w-full mx-auto p-1 sm:p-3 rounded-lg backdrop-blur-sm">
          <div className="w-full bg-zinc-900 rounded-lg shadow-lg shadow-black overflow-hidden">
            <div className="w-full aspect-[3/4] bg-zinc-800 animate-pulse" />
            <div className="p-2 sm:p-3 md:p-4 bg-zinc-700/50">
              <div className="h-4 bg-zinc-600 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-zinc-600 rounded w-1/2 mb-2 animate-pulse" />
              <div className="h-3 bg-zinc-600 rounded w-1/2 mb-2 animate-pulse" />
              <div className="h-5 bg-zinc-600 rounded w-1/3 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <div className="h-9 sm:h-10 bg-zinc-600 rounded animate-pulse" />
            <div className="h-9 sm:h-10 bg-zinc-600 rounded animate-pulse" />
          </div>
        </div>
      </div>
    ))
  ), []);

  // Item grid
  const itemGrid = useMemo(() => (
    currentItems.map((item, index) => (
      <div key={item.id} className="w-full">
        <div className="flex flex-col w-full mx-auto p-1 sm:p-3 rounded-lg backdrop-blur-sm">
          <div className="w-full bg-zinc-900 rounded-lg shadow-lg shadow-black overflow-hidden">
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.type === 'card' ? (item as CardItem).card : (item as SealedProduct).product_name}
                  fill
                  className="object-contain"
                  priority={index < 4}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.querySelector('.no-image');
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              {/* No Image Placeholder */}
              <div className={`no-image ${item.imageUrl ? 'hidden' : 'flex'} absolute inset-0 bg-zinc-800 items-center justify-center`}>
                <span className="text-zinc-400 text-sm">No Image</span>
              </div>
            </div>
            
            {/* Item Details */}
            <div className="p-2 sm:p-3 md:p-4 bg-zinc-700/50 backdrop-blur-sm">
              <h3 className="text-xs sm:text-sm md:text-md font-semibold text-white mb-1 sm:mb-2 line-clamp-1">
                {item.type === 'card' ? ((item as CardItem).card || 'Unknown Card') : ((item as SealedProduct).product_name || 'Unknown Product')}
              </h3>
              <div className="space-y-0.5 sm:space-y-1">
                {item.type === 'card' ? (
                  <>
                    <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300 line-clamp-1">Set: {(item as CardItem).set || 'Unknown'}</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300 line-clamp-1">Rarity: {(item as CardItem).rarity || 'Unknown'}</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300">PSA Grade: {(item as CardItem).psa_grade || 'Ungraded'}</p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300 line-clamp-1">Type: {(item as SealedProduct).product_type || 'Unknown'}</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300 line-clamp-1">Series: {(item as SealedProduct).sealed_series || 'Unknown'}</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300">Packs: {(item as SealedProduct).packs || 0}</p>
                  </>
                )}
                <p className="text-sm sm:text-lg md:text-xl font-bold text-white mt-1 sm:mt-2">${(item.price || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline" 
              className="w-full bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white text-sm sm:text-base h-9 sm:h-10 whitespace-nowrap transition-all duration-200 border-0 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 cursor-pointer"
              onClick={() => handleViewDetails(item)}
            >
              View Details
            </Button>
            <AddToCart item={item} />
          </div>
        </div>
      </div>
    ))
  ), [currentItems, handleViewDetails]);

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
      <div ref={gridRef} className="w-full max-w-screen mx-auto rounded-lg px-4 py-8 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-600 shadow-lg shadow-zinc-700">
        <h2 className="text-2xl font-bold mb-8 text-white text-center">Pokemon Shop</h2>
        
        {/* Search and Sort Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product name..."
                  className="w-full h-10 px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                />

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
              {/* Only show PSA Grade button when cards are selected */}
              {selectedCategories.some(cat => cat.id === 'cards') && (
              <Button
                variant="default"
                onClick={() => handleSort('psa_grade')}
                className="flex-1 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base border-0"
              >
                PSA Grade
                <SortIcon direction={sortField === 'psa_grade' ? sortDirection : null} />
              </Button>
              )}
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
        </div>

        {/* Item Count */}
        <p className="text-base sm:text-lg font-medium text-white mb-4">
            Showing {filteredItems.length} of {items.length} items
          </p>

        {/* Grid of Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4">
          {loading ? skeletonLoaders : itemGrid}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 mt-8">
            <Button
              variant="outline"
              className="w-24 sm:w-auto bg-purple-700 hover:bg-purple-800 text-white border-0"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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