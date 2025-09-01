import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../CartContext';
import type { CardItem, SealedProduct } from './items-data';

interface ItemDescriptionContentProps {
  item: CardItem | SealedProduct;
}

export function ItemDescriptionContent({ item }: ItemDescriptionContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const { addItem, isInCart } = useCart();

  // Safely parse additionalImages and filter out null values
  const additionalImages = useMemo(() => {
    let images: (string | null)[] = [];
    
    if (Array.isArray(item.additionalImages)) {
      images = item.additionalImages;
    } else if (typeof item.additionalImages === 'string') {
      try {
        images = JSON.parse(item.additionalImages);
      } catch {
        images = [item.additionalImages];
      }
    }
    
    // Filter out null/undefined values and ensure all are strings
    return images.filter((img): img is string => img !== null && img !== undefined && typeof img === 'string');
  }, [item.additionalImages]);

  // Display name based on item type
  const displayName = item.type === 'card' ? (item as CardItem).card : (item as SealedProduct).product_name;

  // Preload next and previous images
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < additionalImages.length) {
        const img = new window.Image();
        img.src = additionalImages[index];
      }
    };

    // Preload next and previous images
    preloadImage(currentImageIndex + 1);
    preloadImage(currentImageIndex - 1);
  }, [currentImageIndex, additionalImages]);

  const nextImage = useCallback(() => {
    if (additionalImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === additionalImages.length - 1 ? 0 : prevIndex + 1
      );
      setIsLoading(true);
    }
  }, [additionalImages.length]);

  const prevImage = useCallback(() => {
    if (additionalImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? additionalImages.length - 1 : prevIndex - 1
      );
      setIsLoading(true);
    }
  }, [additionalImages.length]);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
    setIsLoading(false);
  }, []);

  // Memoize the main image component
  const MainImage = useMemo(() => (
    <div className="relative w-full aspect-[3/4] md:w-[400px] group">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse z-10" />
      )}
      {additionalImages.length > 0 && additionalImages[currentImageIndex] ? (
        <>
          <Image
            fill
            src={additionalImages[currentImageIndex]} 
            alt={`${displayName} - Image ${currentImageIndex + 1}`}
            className={`rounded-lg object-cover relative z-20 transition-opacity duration-300 ${
              loadedImages.has(currentImageIndex) ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(currentImageIndex)}
            onError={() => setIsLoading(false)}
            priority
            quality={85}
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
            {currentImageIndex + 1} / {additionalImages.length}
          </div>
        </>
      ) : item.imageUrl ? (
        <Image
          fill
          src={item.imageUrl} 
          alt={displayName}
          className={`rounded-lg object-cover relative z-10 transition-opacity duration-300 ${
            loadedImages.has(0) ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => handleImageLoad(0)}
          onError={() => setIsLoading(false)}
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, 400px"
        />
      ) : (
        // Placeholder when no image is available
        <div className="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
          No Image
        </div>
      )}
    </div>
  ), [additionalImages, currentImageIndex, item, isLoading, loadedImages, handleImageLoad, displayName]);

  // Memoize the thumbnails
  const Thumbnails = useMemo(() => (
    additionalImages.length > 1 && (
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <Button
          onClick={prevImage}
          className="p-1.5 sm:p-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-full transition-colors !focus:outline-none !focus:ring-0 !focus:ring-offset-0 !focus-visible:outline-none !focus-visible:ring-0 !focus-visible:ring-offset-0"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        
        <div className="flex justify-center gap-1 sm:gap-2 py-2 w-[calc(100%-60px)] sm:w-[calc(100%-80px)] overflow-x-auto scrollbar-hide">
          {additionalImages.map((image: string, index: number) => (
            <Button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index);
                setIsLoading(true);
              }}
              className={`p-0 h-12 w-12 sm:h-16 sm:w-16 rounded-md overflow-hidden border-2 transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                currentImageIndex === index ? 'border-black scale-105' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                width={64}
                height={64}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(index)}
                quality={75}
                loading="lazy"
              />
            </Button>
          ))}
        </div>

        <Button
          onClick={nextImage}
          className="p-1.5 sm:p-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-full transition-colors !focus:outline-none !focus:ring-0 !focus:ring-offset-0 !focus-visible:outline-none !focus-visible:ring-0 !focus-visible:ring-offset-0"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    )
  ), [additionalImages, currentImageIndex, loadedImages, handleImageLoad, nextImage, prevImage]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-5">
      {/* Item Image Column */}
      <div className="flex-shrink-0 flex flex-col space-y-2 w-full md:w-auto">
        {MainImage}
        {Thumbnails}
      </div>
      
      {/* Item Details */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold text-white">{displayName}</h2>
        
        <div className="space-y-4">
          {item.type === 'card' ? (
            <>
              <div className="flex justify-between">
                <span className="font-medium text-white">Energy Type:</span> 
                <span className="text-white">{(item as CardItem).energy_type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">Rarity:</span> 
                <span className="text-white">{(item as CardItem).rarity}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">Set:</span> 
                <span className="text-white">{(item as CardItem).set}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">PSA Grade:</span> 
                <span className="text-white">{(item as CardItem).psa_grade}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">Upload Date:</span> 
                <span className="text-white">{item.uploadDate}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="font-medium text-white">Product Type:</span> 
                <span className="text-white">{(item as SealedProduct).product_type}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">Series:</span>
                <span className="text-white">{(item as SealedProduct).sealed_series}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">Upload Date:</span> 
                <span className="text-white">{item.uploadDate}</span>
              </div>
              
              {(item as SealedProduct).packs && (
                <div className="flex justify-between">
                  <span className="font-medium text-white">Packs:</span>
                  <span className="text-white">{(item as SealedProduct).packs}</span>
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-between">
            <span className="font-medium text-white">Price:</span> 
            <span className="text-xl font-bold text-white">${item.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-2 text-white">Description</h3>
          <p className="text-white">
            {item.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button 
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg font-medium"
            onClick={() => {
              const event = new CustomEvent('openContactDialog');
              window.dispatchEvent(event);
            }}
          >
            Contact Seller
          </button>
          <button
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 ${
              !item.is_available || isInCart(item.id)
                ? 'bg-gray-600 hover:bg-gray-600 !cursor-not-allowed' 
                : 'bg-purple-700 hover:bg-purple-800 active:bg-purple-900'
            } text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg font-medium`}
            onClick={() => !isInCart(item.id) && item.is_available && addItem(item)}
            disabled={!item.is_available || isInCart(item.id)}
          >
            {!item.is_available ? 'Not Available' : isInCart(item.id) ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}