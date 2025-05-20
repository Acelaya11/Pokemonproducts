import { supabase } from './supabase';
import { CardItem, SealedProduct } from '../app/Ponchos/client-components/ssr/items-data';

type ItemWithJsonFields = CardItem | SealedProduct;

function isCardItem(item: ItemWithJsonFields): item is CardItem {
  return item.type === 'card';
}

function parseJsonFields(item: ItemWithJsonFields) {
  // Helper function to safely parse JSON or return the original value
  const safeParse = (value: string | string[] | null) => {
    if (!value) return value;
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return value;
    
    try {
      return JSON.parse(value);
    } catch {
      // If parsing fails, try to handle it as a comma-separated string
      if (value.includes(',')) {
        return value.split(',').map((v: string) => v.trim());
      }
      return value;
    }
  };

  // Parse each field that might be JSON
  if (isCardItem(item)) {
    if (item.rarities) {
      item.rarities = safeParse(item.rarities);
    }
    if (item.extra_types) {
      item.extra_types = safeParse(item.extra_types);
    }
  }
  if (item.additionalImages) {
    item.additionalImages = safeParse(item.additionalImages);
  }

  return item;
}

export async function getCards(): Promise<CardItem[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*');

  if (error) {
    console.error('Error fetching cards:', error);
    return [];
  }

  return data.map(parseJsonFields) as CardItem[];
}

export async function getSealedProducts(): Promise<SealedProduct[]> {
  const { data, error } = await supabase
    .from('sealed_products')
    .select('*');

  if (error) {
    console.error('Error fetching sealed products:', error);
    return [];
  }

  return data.map(parseJsonFields) as SealedProduct[];
}

export async function getAllItems(): Promise<(CardItem | SealedProduct)[]> {
  const [cards, sealedProducts] = await Promise.all([
    getCards(),
    getSealedProducts()
  ]);

  return [...cards, ...sealedProducts];
} 