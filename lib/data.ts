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
    
    // Ensure other_rarities is always an array
    if (cardItem.other_rarities === null || cardItem.other_rarities === undefined) {
      cardItem.other_rarities = [];
    } else if (typeof cardItem.other_rarities === 'string') {
      cardItem.other_rarities = safeParse(cardItem.other_rarities) as string[];
    } else if (!Array.isArray(cardItem.other_rarities)) {
      // If it's not an array, convert it to an array
      cardItem.other_rarities = [String(cardItem.other_rarities)];
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
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*');

    if (error) {
      console.error('Error fetching cards:', error);
      return [];
    }

    return data ? data.map(parseJsonFields) as CardItem[] : [];
  } catch (error) {
    console.error('Error in getCards:', error);
    return [];
  }
}

export async function getSealedProducts(): Promise<SealedProduct[]> {
  try {
    // Try the correct table name first
    const { data, error } = await supabase
      .from('sealed')
      .select('*');

    if (error) {
      console.error('Error fetching sealed products:', error);
      // If 'sealed' table doesn't exist, try alternative names
      const { data: altData, error: altError } = await supabase
        .from('sealed_products')
        .select('*');
      
      if (altError) {
        console.error('Error fetching from sealed_products:', altError);
        return [];
      }
      
      return altData ? altData.map(parseJsonFields) as SealedProduct[] : [];
    }

    return data ? data.map(parseJsonFields) as SealedProduct[] : [];
  } catch (error) {
    console.error('Error in getSealedProducts:', error);
    return [];
  }
}

// Fallback data when database is not available
function getFallbackData(): (CardItem | SealedProduct)[] {
  console.warn('Using fallback data - database tables may not exist');
  
  const fallbackCards: CardItem[] = [
    {
      id: 1,
      card_id: 'fallback-001',
      card: 'Fallback Card',
      series: 'Base Set',
      set: 'Base',
      energy_type: 'Colorless',
      rarity: 'Common',
      other_rarities: [],
      psa_grade: 'Ungraded',
      price: 0,
      imageUrl: null,
      additionalImages: [],
      uploadDate: new Date().toISOString(),
      description: 'Fallback card data',
      type: 'card',
      is_available: false,
      weight: 0
    }
  ];
  
  const fallbackSealed: SealedProduct[] = [
    {
      id: 2,
      product_id: 'fallback-sealed-001',
      product_name: 'Fallback Booster Pack',
      product_type: 'Booster Pack',
      sealed_series: 'Base Set',
      sealed_set: 'Base',
      uploadDate: new Date().toISOString(),
      price: 0,
      imageUrl: null,
      additionalImages: [],
      description: 'Fallback sealed product data',
      packs: 1,
      type: 'sealed',
      is_available: false,
      weight: 0
    }
  ];
  
  return [...fallbackCards, ...fallbackSealed];
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

    // If both database calls fail, return fallback data
    if (cards.length === 0 && sealedProducts.length === 0) {
      console.warn('Both database calls failed, using fallback data');
      return getFallbackData();
    }

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
    // Return fallback data instead of empty array to prevent UI from breaking
    return getFallbackData();
  }
} 