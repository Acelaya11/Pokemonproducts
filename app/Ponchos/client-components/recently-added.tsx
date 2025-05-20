'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ItemDescriptionDialog } from './item-description';
import { ContactDialog } from './contact-card';
import { getAllItems } from '../../../lib/data';
import type { CardItem, SealedProduct } from './ssr/items-data';

interface RecentlyAddedProps {
  className?: string;
}

export default function RecentlyAdded({ className = '' }: RecentlyAddedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CardItem | SealedProduct | null>(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [recentItems, setRecentItems] = useState<(CardItem | SealedProduct)[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Memoize the fetch function
  const fetchItems = useCallback(async () => {
    try {
      const data = await getAllItems();
      // Sort by ID in descending order and get 10 items
      const sortedItems = [...data]
        .sort((a, b) => b.id - a.id)
        .slice(0, 10);
      setRecentItems(sortedItems);
    } catch (error) {
      console.error('Error fetching recent items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch items from Supabase only once on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleViewDetails = useCallback((item: CardItem | SealedProduct) => {
    setSelectedItem(item);
    setDescriptionOpen(true);
  }, []);

  const handleImageLoad = useCallback((itemId: number) => {
    setLoadedImages(prev => new Set(prev).add(itemId));
  }, []);

  // Memoize the skeleton loaders
  const skeletonLoaders = useMemo(() => (
    Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex-shrink-0 w-36 sm:w-48 bg-zinc-900 rounded-lg shadow-md shadow-black overflow-hidden">
        <div className="h-36 sm:h-48 w-full bg-zinc-800 animate-pulse" />
        <div className="p-2 sm:p-3 bg-zinc-700/50">
          <div className="h-4 bg-zinc-600 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-3 bg-zinc-600 rounded w-1/2 mb-2 animate-pulse" />
          <div className="h-5 bg-zinc-600 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    ))
  ), []);

  // Memoize the item list
  const itemList = useMemo(() => (
    recentItems.map((item) => (
      <div 
        key={item.id} 
        className="flex-shrink-0 w-36 sm:w-48 bg-zinc-900 rounded-lg shadow-md shadow-black overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 active:shadow-inner"
        onClick={() => handleViewDetails(item)}
      >
        {/* Image Container with Fixed Dimensions */}
        <div className="relative w-full aspect-[3/4]">
          {!loadedImages.has(item.id) && (
            <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
          )}
          <Image
            width={192}
            height={256}
            src={item.imageUrl} 
            alt={item.item_name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(item.id)}
            quality={item.id === recentItems[0]?.id ? 90 : 75}
            priority={item.id === recentItems[0]?.id}
            loading={item.id === recentItems[0]?.id ? 'eager' : 'lazy'}
            fetchPriority={item.id === recentItems[0]?.id ? 'high' : 'auto'}
            sizes="(max-width: 768px) 144px, 192px"
          />
        </div>
        
        {/* Item Details */}
        <div className="p-2 sm:p-3 bg-zinc-700/50 backdrop-blur-sm">
          <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{item.item_name}</h3>
          <p className="text-xs sm:text-sm text-zinc-300">
            {item.type === 'card' ? (item as CardItem).set : (item as SealedProduct).series}
          </p>
          <p className="text-base sm:text-lg font-bold text-white">${item.price.toFixed(2)}</p>
        </div>
      </div>
    ))
  ), [recentItems, loadedImages, handleViewDetails, handleImageLoad]);

  return (
    <div className={`w-full mb-4 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-4">Recently Added</h2>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {isLoading ? skeletonLoaders : itemList}
      </div>

      {/* Item Details Dialog */}
      {selectedItem && (
        <ItemDescriptionDialog 
          item={selectedItem}
          open={descriptionOpen}
          onOpenChange={setDescriptionOpen}
        />
      )}

      {/* Contact Dialog */}
      {selectedItem && (
        <ContactDialog 
          item={selectedItem}
          open={contactOpen}
          onOpenChange={setContactOpen}
        />
      )}
    </div>
  );
} 