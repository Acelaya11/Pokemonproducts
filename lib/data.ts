import { supabase } from './supabase';
import { CardItem, SealedProduct } from '../app/Ponchos/client-components/ssr/items-data';

type ItemWithJsonFields = CardItem | SealedProduct;

function parseJsonFields(item: ItemWithJsonFields) {
  // Helper function to safely parse JSON or return the original value
  const safeParse = (value: string | string[] | (string | null)[] | null): (string | null)[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return [];
    
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If parsing fails, try to handle it as a comma-separated string
      if (value.includes(',')) {
        return value.split(',').map((v: string) => v.trim()).filter(v => v.length > 0);
      }
      return [value];
    }
  };

  // Parse additionalImages field that might be JSON (handle NULL values)
  if (item.additionalImages !== null && item.additionalImages !== undefined) {
    const parsed = safeParse(item.additionalImages);
    item.additionalImages = parsed;
  } else {
    // Set default empty array for NULL values
    item.additionalImages = [];
  }

  // Parse other_rarities if it's a string (for backward compatibility)
  if (item.type === 'card') {
    const cardItem = item as CardItem;
    
    if (typeof cardItem.other_rarities === 'string') {
      cardItem.other_rarities = safeParse(cardItem.other_rarities) as string[];
    } else if (cardItem.other_rarities === null || cardItem.other_rarities === undefined) {
      // Set default empty array for NULL values
      cardItem.other_rarities = [];
    }
    
    // Ensure other_rarities is always an array, even if it's a single value
    if (!Array.isArray(cardItem.other_rarities)) {
      // If it's not an array, convert it to an array
      cardItem.other_rarities = [cardItem.other_rarities as string];
    }
    
    // Filter out any null/undefined/empty values and ensure all values are strings
    cardItem.other_rarities = cardItem.other_rarities
      .filter(Boolean)
      .map(value => String(value).trim())
      .filter(value => value.length > 0);
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

  return data ? data.map(parseJsonFields) as CardItem[] : [];
}

export async function getSealedProducts(): Promise<SealedProduct[]> {
  const { data, error } = await supabase
    .from('sealed')
    .select('*');

  if (error) {
    console.error('Error fetching sealed products:', error);
    return [];
  }

  return data ? data.map(parseJsonFields) as SealedProduct[] : [];
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

    // Filter out any items that are null or have missing essential data
    const allItems = [...cards, ...sealedProducts].filter(item => 
      item !== null && 
      item.id && 
      item.type &&
      (item.type === 'card' ? (item as CardItem).card : (item as SealedProduct).product_name)
    );
    
    // Sort by ID in descending order (newest first) for Recently Added
    return allItems.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error('Error in getAllItems:', error);
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
} 