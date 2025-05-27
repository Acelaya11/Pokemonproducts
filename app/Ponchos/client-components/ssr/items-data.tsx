export interface CardItem {
    id: number;     
    id_name: string;
    item_name: string;
    energy_type: 'Fire' | 'Water' | 'Grass' | 'Colorless' | 'Lightning' | 'Psychic' | 'Fighting' | 'Dragon' | 'Darkness' | 'Metal' | 'Fairy' | 'None';
    rarities: ('Common' | 'Uncommon' | 'Rare' | 'Double Rare' | 'Ultra Rare' | 'Illustration Rare' | 'SIR' | 'Hyper Rare' | 'Promo' | 'Shiny Rare' | 'Gallery' | 'Super Rare')[];
    extra_types: ('Holo' | 'Reverse Holo' | 'EX' | 'V' | 'VMAX' | 'VSTAR' | 'Secret Rare' | 'Super Rare' | 'Pokeball' | 'Masterball')[];
    set: string;
    set_id: string;
    psa_grade: string;
    price: number;
    imageUrl: string;
    additionalImages: string[];
    uploadDate: string;
    description: string;
    type: 'card';
    is_available: boolean;
    weight: number;
}

export interface SealedProduct {
    id: number;
    id_name: string;
    item_name: string;
    product_type: 'Booster Pack' | 'Booster Sleeve' | '3pk Blister' | 'B & B Deck' | 'Booster Bundle' | 'ETB' | 'Booster Box' | 'EX Box' | 'Poncho Special' | 'Special';
    series: string;
    set_id: string;
    uploadDate: string;
    price: number;
    imageUrl: string;
    additionalImages: string[];
    description: string;
    packs: number;
    type: 'sealed';
    is_available: boolean;
    weight: number;
}

export type items = CardItem | SealedProduct; 