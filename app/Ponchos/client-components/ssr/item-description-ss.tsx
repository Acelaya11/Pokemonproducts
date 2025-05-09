import Image from 'next/image';
import { items} from './items-data';
import { useState} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../CartContext';

interface ItemDescriptionContentProps {
  item: items;
}

export function ItemDescriptionContent({ item }: ItemDescriptionContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, items: cartItems } = useCart();

  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

  const nextImage = () => {
    if (item.additionalImages && item.additionalImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === item.additionalImages.length - 1 ? 0 : prevIndex + 1
      );
      setIsLoading(true);
    }
  };

  const prevImage = () => {
    if (item.additionalImages && item.additionalImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? item.additionalImages.length - 1 : prevIndex - 1
      );
      setIsLoading(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-5">
      {/* Item Image Column */}
      <div className="flex-shrink-0 flex flex-col space-y-2 w-full md:w-auto">
        {/* Image Carousel */}
        <div className="relative w-full aspect-[3/4] md:w-[400px] group">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin z-10"></div>
            </div>
          )}
          {item.additionalImages && item.additionalImages.length > 0 ? (
            <>
              <Image
                fill
                src={item.additionalImages[currentImageIndex]} 
                alt={`${item.item_name} - Image ${currentImageIndex + 1}`}
                className="rounded-lg object-cover relative z-20"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
                {currentImageIndex + 1} / {item.additionalImages.length}
              </div>
            </>
          ) : (
            <Image
              fill
              src={item.imageUrl} 
              alt={item.item_name}
              className="rounded-lg object-cover relative z-10"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          )}
        </div>

        {/* Thumbnails with Navigation */}
        {item.additionalImages && item.additionalImages.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <Button
              onClick={prevImage}
              className="p-1.5 sm:p-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-full transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <div className="flex justify-center gap-1 sm:gap-2 py-2 w-[calc(100%-60px)] sm:w-[calc(100%-80px)] overflow-x-auto scrollbar-hide">
              {item.additionalImages.map((image, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsLoading(true);
                  }}
                  className={`p-0 h-12 w-12 sm:h-16 sm:w-16 rounded-md overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-black scale-105' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    width={64}
                    height={64}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </div>

            <Button
              onClick={nextImage}
              className="p-1.5 sm:p-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-full transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Item Details */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold text-white">{item.item_name}</h2>
        
        <div className="space-y-4">
          {item.type === 'card' ? (
            <>
              <div className="flex justify-between">
                <span className="font-medium text-white">Energy Type:</span> 
                <span className="text-white">{item.energy_type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">Rarity:</span> 
                <span className="text-white">{item.rarities.join(', ')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">Set:</span> 
                <span className="text-white">{item.set}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">PSA Grade:</span> 
                <span className="text-white">{item.psa_grade}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">Release Date:</span> 
                <span className="text-white">{item.releaseDate}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="font-medium text-white">Product Type:</span> 
                <span className="text-white">{item.product_type}</span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">Series:</span>
                <span className="text-white">{item.series}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-white">Release Date:</span> 
                <span className="text-white">{item.release_date}</span>
              </div>
              
              {item.contents.packs && (
                <div className="flex justify-between">
                  <span className="font-medium text-white">Packs:</span> 
                  <span className="text-white">{item.contents.packs}</span>
                </div>
              )}
              
              {item.contents.promos && (
                <div className="flex justify-between">
                  <span className="font-medium text-white">Promos:</span> 
                  <span className="text-white">{item.contents.promos}</span>
                </div>
              )}
              
              {item.contents.other_items && item.contents.other_items.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium text-white">Other Items:</span> 
                  <span className="text-white">{item.contents.other_items.join(', ')}</span>
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

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <Button 
            className="w-full sm:w-auto px-4 sm:px-8 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white transition-colors duration-200"
            onClick={() => {
              const event = new CustomEvent('openContactDialog');
              window.dispatchEvent(event);
            }}
          >
            Contact Seller
          </Button>
          <Button
            className={`w-full sm:w-auto px-4 sm:px-8 ${
              isInCart 
                ? 'bg-gray-600 hover:bg-gray-600 !cursor-not-allowed' 
                : 'bg-purple-700 hover:bg-purple-800 active:bg-purple-900'
            } text-white transition-colors duration-200`}
            onClick={() => !isInCart && addItem(item)}
          >
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}