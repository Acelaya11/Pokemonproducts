'use client';

import { featuredCards } from './ssr/items-data';
import Image from 'next/image';
import { useState } from 'react';
import { items } from './ssr/items-data';
import { ItemDescriptionDialog } from './item-description';
import { ContactDialog } from './contact-card';

interface RecentlyAddedProps {
  className?: string;
}

export default function RecentlyAdded({ className = '' }: RecentlyAddedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<items | null>(null);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const recentItems = [...featuredCards]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 10); // Get 10 most recent items

  const handleViewDetails = (item: items) => {
    setSelectedItem(item);
    setDescriptionOpen(true);
  };

  return (
    <div className={`w-full mb-4 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-4">Recently Added</h2>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {recentItems.map((item: items) => (
          <div 
            key={item.id} 
            className="flex-shrink-0 w-36 sm:w-48 bg-zinc-900 rounded-lg shadow-md shadow-black overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 active:shadow-inner"
            onClick={() => handleViewDetails(item)}
          >
            {/* Image */}
            <div className="h-36 sm:h-48 w-full relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                width={192}
                height={192}
                src={item.imageUrl} 
                alt={item.item_name}
                className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                quality={85}
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, 192px"
              />
            </div>
            
            {/* Item Details */}
            <div className="p-2 sm:p-3 bg-zinc-700/50 backdrop-blur-sm">
              <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{item.item_name}</h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                {item.type === 'card' ? item.set : item.series}
              </p>
              <p className="text-base sm:text-lg font-bold text-white">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
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