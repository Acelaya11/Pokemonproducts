import { useState, memo } from 'react';
import Image from 'next/image';
import type { CardItem, SealedProduct } from './items-data';

interface ItemCardProps {
  item: CardItem | SealedProduct;
  onViewDetails?: (item: CardItem | SealedProduct) => void;
  isFirstItem?: boolean;
}

const ItemCard = memo(function ItemCard({ item, onViewDetails, isFirstItem = false }: ItemCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const displayRarities = () => {
    if (item.type !== 'card') return 'N/A';
    const cardItem = item as CardItem;
    if (!cardItem.rarities) return 'N/A';
    if (Array.isArray(cardItem.rarities)) {
      return cardItem.rarities.join(', ');
    }
    return String(cardItem.rarities);
  };

  return (
    <div 
      className={`flex flex-col w-full bg-zinc-900 backdrop-blur-sm rounded-lg shadow-lg shadow-black overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 active:shadow-inner ${!item.is_available ? 'opacity-50' : ''}`}
      onClick={() => onViewDetails?.(item)}
    >
      {/* Image Container with Fixed Dimensions */}
      <div className="relative w-full aspect-[3/4]">
        {!isLoaded && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        )}
        <Image
          width={192}
          height={256}
          src={item.imageUrl}
          alt={item.item_name}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          quality={isFirstItem ? 90 : 75}
          priority={isFirstItem}
          loading={isFirstItem ? 'eager' : 'lazy'}
          fetchPriority={isFirstItem ? 'high' : 'auto'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Item Details */}
      <div className="p-2 sm:p-3 md:p-4 bg-zinc-700/50 backdrop-blur-sm">
        <h3 className="text-xs sm:text-sm md:text-md font-semibold text-white mb-1 sm:mb-2 line-clamp-1">{item.item_name}</h3>
        <div className="space-y-0.5 sm:space-y-1">
          {item.type === 'card' ? (
            <>
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300 line-clamp-1">Set: {(item as CardItem).set}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300 line-clamp-1">Rarity: {displayRarities()}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300">PSA Grade: {(item as CardItem).psa_grade}</p>
            </>
          ) : (
            <>
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300 line-clamp-1">Type: {(item as SealedProduct).product_type}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300 line-clamp-1">Series: {(item as SealedProduct).series}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-300">Packs: {(item as SealedProduct).packs}</p>
            </>
          )}
          <p className="text-sm sm:text-lg md:text-xl font-bold text-white mt-1 sm:mt-2">${item.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
});

export default ItemCard;
