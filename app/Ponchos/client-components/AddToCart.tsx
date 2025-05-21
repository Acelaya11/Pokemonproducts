'use client';

import { Button } from "../../../components/ui/button";
import { useCart } from './CartContext';
import { items } from './ssr/items-data';
import { useState } from 'react';

interface AddToCartProps {
  item: items;
}

export function AddToCart({ item }: AddToCartProps) {
  const { addItem, isInCart } = useCart();
  const alreadyInCart = isInCart(item.id);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    if (alreadyInCart || !item.is_available) return;
    setIsAnimating(true);
    addItem(item);
    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <Button 
      variant="outline"
      className={`w-full sm:flex-1 ${
        alreadyInCart 
          ? 'bg-gray-600 hover:bg-gray-600 !cursor-not-allowed' 
          : !item.is_available
          ? 'bg-gray-600 hover:bg-gray-600 !cursor-not-allowed'
          : 'bg-purple-700 hover:bg-purple-800 active:bg-purple-900'
      } text-white text-sm sm:text-base h-9 sm:h-10 whitespace-nowrap transition-transform duration-300 border-0 ${
        isAnimating ? 'float-to-cart' : ''
      }`}
      onClick={handleAddToCart}
      disabled={alreadyInCart || !item.is_available}
    >
      {alreadyInCart ? 'In Cart' : !item.is_available ? 'Not Available' : 'Add to Cart'}
    </Button>
  );
} 