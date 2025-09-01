'use client';

import { useState, useEffect } from 'react';
import { ItemDescriptionDialog } from './item-description';
import { getAllItems } from '../../../lib/data';
import type { CardItem, SealedProduct } from './ssr/items-data';
import Image from 'next/image';

interface RecentlyAddedProps {
  className?: string;
}

export default function RecentlyAdded({ className = '' }: RecentlyAddedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CardItem | SealedProduct | null>(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [recentItems, setRecentItems] = useState<(CardItem | SealedProduct)[]>([]);

  // Simple fetch function - get items and take first 10
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const data = await getAllItems();
        
        // Just take the first 10 items (already sorted by ID descending)
        const items = data.slice(0, 10);
        
        setRecentItems(items);
      } catch (error) {
        console.error('Error fetching recent items:', error);
        setRecentItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleViewDetails = (item: CardItem | SealedProduct) => {
    setSelectedItem(item);
    setDescriptionOpen(true);
  };

  if (isLoading) {
    return (
      <div className={`w-full mb-4 ${className}`}>
        <h2 className="text-xl font-bold text-white mb-4">Recently Added</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-36 sm:w-48 bg-zinc-900 rounded-lg shadow-md shadow-black overflow-hidden">
              <div className="h-36 sm:h-48 w-full bg-zinc-800 animate-pulse" />
              <div className="p-2 sm:p-3 bg-zinc-700/50">
                <div className="h-4 bg-zinc-600 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-zinc-600 rounded w-1/2 mb-2 animate-pulse" />
                <div className="h-5 bg-zinc-600 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full mb-4 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-4">Recently Added</h2>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {recentItems.length > 0 ? (
          recentItems.map((item) => (
            <div 
              key={item.id} 
              className="flex-shrink-0 w-36 sm:w-48 bg-zinc-900 rounded-lg shadow-md shadow-black overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
              onClick={() => handleViewDetails(item)}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4]">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.type === 'card' ? (item as CardItem).card : (item as SealedProduct).product_name}
                    fill
                    className="object-cover"
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
              <div className="p-2 sm:p-3 bg-zinc-700/50">
                <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
                  {item.type === 'card' ? ((item as CardItem).card || 'Unknown Card') : ((item as SealedProduct).product_name || 'Unknown Product')}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300">
                  {item.type === 'card' ? ((item as CardItem).set || 'Unknown Set') : ((item as SealedProduct).sealed_series || 'Unknown Series')}
                </p>
                <p className="text-base sm:text-lg font-bold text-white">${(item.price || 0).toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-shrink-0 w-full text-center text-zinc-400 py-8">
            No items available at the moment
          </div>
        )}
      </div>

      {/* Item Details Dialog */}
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