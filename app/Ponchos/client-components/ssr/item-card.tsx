import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { CardItem, SealedProduct } from './items-data';

interface ItemCardProps {
  item: CardItem | SealedProduct;
  onViewDetails?: (item: CardItem | SealedProduct) => void;
}

export default function ItemCard({ item, onViewDetails }: ItemCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [imageSrc, setImageSrc] = useState(item.imageUrl);

  const displayRarities = () => {
    if (item.type !== 'card') return 'N/A';
    const cardItem = item as CardItem;
    if (!cardItem.rarities) return 'N/A';
    if (Array.isArray(cardItem.rarities)) {
      return cardItem.rarities.join(', ');
    }
    return String(cardItem.rarities);
  };

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Add a cache-busting parameter to force a fresh load
      const cacheBuster = `?retry=${retryCount + 1}&t=${Date.now()}`;
      setImageSrc(`${item.imageUrl}${cacheBuster}`);
      setIsLoading(true);
      setImageError(false);
    } else {
      setImageError(true);
      setIsLoading(false);
    }
  };

  // Reset states when item changes
  useEffect(() => {
    setRetryCount(0);
    setIsLoading(true);
    setImageError(false);
    setImageSrc(item.imageUrl);
  }, [item.imageUrl]);

  return (
    <div 
      className={`flex flex-col w-full bg-zinc-900 backdrop-blur-sm mb-5 rounded-lg shadow-lg shadow-black overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 active:shadow-inner ${!item.is_available ? 'opacity-50' : ''}`}
      onClick={() => onViewDetails?.(item)}
    >
      {/* Image Container with Fixed Dimensions */}
      <div className="relative w-full aspect-[3/4]">
        {isLoading && !imageError && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
            <div className="text-white text-center p-4">
              <p>Image not available</p>
              {retryCount > 0 && (
                <p className="text-sm text-zinc-400 mt-1">
                  Failed to load after {retryCount} attempts
                </p>
              )}
            </div>
          </div>
        ) : (
          <Image
            src={imageSrc}
            alt={item.item_name}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            loading="lazy"
            unoptimized={retryCount > 0}
          />
        )}
      </div>
      
      {/* Item Details */}
      <div className="p-4 bg-zinc-700/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-2">{item.item_name}</h3>
        <div className="space-y-1">
          {item.type === 'card' ? (
            <>
              <p className="text-sm text-zinc-300">Set: {(item as CardItem).set}</p>
              <p className="text-sm text-zinc-300">Rarity: {displayRarities()}</p>
              <p className="text-sm text-zinc-300">PSA Grade: {(item as CardItem).psa_grade}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-300">Type: {(item as SealedProduct).product_type}</p>
              <p className="text-sm text-zinc-300">Series: {(item as SealedProduct).series}</p>
              <p className="text-sm text-zinc-300">Packs: {(item as SealedProduct).packs}</p>
            </>
          )}
          <p className="text-xl font-bold text-white mt-2">${item.price.toFixed(2)}</p>
          {!item.is_available && (
            <p className="text-red-500 font-semibold mt-2">Sold</p>
          )}
        </div>
      </div>
    </div>
  );
}
