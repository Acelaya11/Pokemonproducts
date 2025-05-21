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
  try {
    const [cards, sealedProducts] = await Promise.all([
      getCards().catch(error => {
        console.error('Error fetching cards:', error);
        return [];
      }),
      getSealedProducts().catch(error => {
        console.error('Error fetching sealed products:', error);
        return [];
      })
    ]);

    // Filter out any items that are no longer available
    const allItems = [...cards, ...sealedProducts].filter(item => item !== null);
    
    // Sort by ID to ensure consistent ordering
    return allItems.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Error in getAllItems:', error);
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
} 