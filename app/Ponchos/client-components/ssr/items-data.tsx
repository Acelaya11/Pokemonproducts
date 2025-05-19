import sylveon156 from '../../images/sylveon156.jpg';
import umbreon161 from '../../images/umbreon161.jpg';
import eevee167 from '../../images/eevee167.jpg';
import jolteon153 from '../../images/jolteon153.jpg';
import espeon155 from '../../images/espeon155.jpg';
import vaporeon149 from '../../images/vaporeon149.jpg';
import glaceon150 from '../../images/glaceon150.jpg';
import vividvoltage1 from '../../images/vividvoltage1.jpg';
import vividvoltage2 from '../../images/vividvoltage2.jpg';
import vividvoltage3 from '../../images/vividvoltage3.jpg';
import vividvoltage4 from '../../images/vividvoltage4.jpg';
import dudunsparce121 from '../../images/dundunsparce121.jpg';
import clodsire94 from '../../images/clodsire94.jpg';
import tapukoko51 from '../../images/tapukoko51.jpg';
import cyclizarpromo18 from '../../images/cyclizarpromo18.jpg';
import bellibolt53 from '../../images/bellibolt53.jpg';
import blastoise9 from '../../images/blastoise9.jpg';
import luxray68 from '../../images/luxray68.jpg';
import brockscout179 from '../../images/brocks-scouting179.jpg';
import spikyenergy190 from '../../images/spikyenergy190.jpg';
import mrmime179 from '../../images/mrmime179.jpg';
import zacian16 from '../../images/zacian16.jpg';
import darknessablaze1 from '../../images/darknessablaze1.jpg';
import sunandmoon1 from '../../images/sunandmoon1.jpg';
import sunandmoon2 from '../../images/sunandmoon2.jpg';
import chillingreign1 from '../../images/chillingreign1.jpg';
import chillingreign2 from '../../images/chillingreign2.jpg';
import crownzenithetb1 from '../../images/crownzenithetb.jpg';
import crownzenithetb2 from '../../images/crownzenithetbback.jpg';
import journeytogether1 from '../../images/jtboosterbox.jpg';
import journeytogether2 from '../../images/jtboosterboxside.jpg';
import journeytogether3 from '../../images/jtboosterboxback.jpg';
import prismaticetb from '../../images/prismaticetb.jpg';
import pikachuvmaxbox from '../../images/pikachuvmaxbox.jpg';
import pikachuvmaxbox2 from '../../images/pikachuvmaxboxback.jpg';
import squirtletin from '../../images/squirtletin1.jpg';
import mewtin from '../../images/mewtin1.jpg';
import dragonitetin from '../../images/dragonitetin1.jpg';
import charmandertin from '../../images/charmandertin1.jpg';
import charizardtin from '../../images/charizardtin1.jpg';
import darkraitin from '../../images/bigdarkraitin.jpg';
import darkraitin2 from '../../images/bigdarkraitinback.jpg';






import { StaticImageData } from 'next/image';

export interface CardItem {
    id: number;     
    id_name: string;
    item_name: string;
    energy_type: 'Fire' | 'Water' | 'Grass' | 'Colorless' | 'Lightning' | 'Psychic' | 'Fighting' | 'Dragon' | 'Darkness' | 'Metal' | 'Fairy' | 'None';
    rarities: ('Common' | 'Uncommon' | 'Rare' | 'Double Rare' | 'Ultra Rare' | 'Illustration Rare' | 'Special Illustration Rare' | 'Hyper Rare' | 'Promo' | 'Shiny Rare' | 'Gallery' | 'Super Rare')[];
    extra_types: ('Holo' | 'Reverse Holo' | 'EX' | 'V' | 'VMAX' | 'VSTAR' | 'Secret Rare')[];
    set: string;
    set_id: string;
    psa_grade: string;
    price: number;
    imageUrl: StaticImageData;
    additionalImages: StaticImageData[];
    uploadDate: string;
    description: string;
    type: 'card';
}

export interface SealedProduct {
    id: number;
    id_name: string;
    item_name: string;
    product_type: 'Booster Pack' | 'Booster Sleeve' | '3pk Blister' | 'B & B Deck' | 'Booster Bundle' | 'ETB' | 'Booster Box' | 'EX Box' | 'Tins' | 'Poncho Special' | 'Special';
    series: string;
    set_id: string;
    uploadDate: string;
    price: number;
    imageUrl: StaticImageData;
    additionalImages: StaticImageData[];
    description: string;
    packs: number;
    promos?: number;
    other_items?: string[];
    type: 'sealed';
}

export type items = CardItem | SealedProduct;

export const featuredCards: items[] = [
    { 
      id: 1,
      id_name: "sylveon ex 156", 
      item_name: "Sylveon EX", 
      energy_type: 'Psychic',
      rarities: ['Special Illustration Rare'],
      extra_types: ['EX', 'Secret Rare', 'Holo'],
      set: 'Prismatic evolutions',
      set_id: 'prismatic evolutions',
      psa_grade: '10',
      price: 940.00,
      imageUrl: sylveon156,
      additionalImages: [sylveon156],
      uploadDate: '2025-01-17',
      description: "A psa 10 sylveon, I'm bedazzled!",
      type: 'card'
    },
    { 
      id: 2,
      id_name: "umbreon ex 161",
      item_name: "Umbreon EX", 
      energy_type: 'Darkness',
      rarities: ['Special Illustration Rare'],
      extra_types: ['EX', 'Secret Rare', 'Holo'],
      set: 'Prismatic evolutions',
      set_id: 'prismatic evolutions',
      psa_grade: '9',
      price: 1200.00,
      imageUrl: umbreon161,
      additionalImages: [umbreon161],
      uploadDate: '2025-01-17',
      description: 'A 9 umbreon holy sh********! a must grab for any collector!',
      type: 'card'
    },
    { 
      id: 3,
      id_name: "eevee ex 167",
      item_name: "Eevee EX", 
      energy_type: 'Colorless',
      rarities: ['Special Illustration Rare'],
      extra_types: ['EX', 'Secret Rare', 'Holo'],
      set: 'Prismatic evolutions',
      set_id: 'prismatic evolutions',
      psa_grade: '10',
      price: 720.00,
      imageUrl: eevee167,
      additionalImages: [eevee167],
      uploadDate: '2025-01-17',
      description: "If your're a real Eevee fan, add this 10 to your collection!",
      type: 'card'
    },
    { 
      id: 4,
      id_name: "jolteon ex 153",
      item_name: 'Jolteon EX', 
      energy_type: 'Lightning',
      rarities: ['Special Illustration Rare'],
      extra_types: ['EX', 'Secret Rare', 'Holo'],
      set: 'Prismatic evolutions',
      set_id: 'prismatic evolutions',
      psa_grade: '9',
      price: 250.00,
      imageUrl: jolteon153,
      additionalImages: [jolteon153],
      uploadDate: '2025-01-17',
      description: "If you hold this card your hair will stick up.",
      type: 'card'
    },
    {
      id: 5,
      id_name: "espeon ex 155",
      item_name: "Espeon EX",
      energy_type: 'Psychic',
      rarities: ['Special Illustration Rare'],
      extra_types: ['EX', 'Secret Rare', 'Holo'],
      set: 'Prismatic evolutions',
      set_id: 'prismatic evolutions',
      psa_grade: '9',
      price: 330.00,
      imageUrl: espeon155,
      additionalImages: [espeon155],
      uploadDate: '2025-01-17',
      description: 'Almost looks like one of those hairless cats, they dont play around.',
      type: 'card'
    },
    { 
      id: 6,
      id_name: "vaporeon ex 149",
      item_name: "Vaporeon EX", 
      energy_type: 'Water',
      rarities: ['Special Illustration Rare'],
      extra_types: ['EX', 'Secret Rare', 'Holo'],
      set: 'Prismatic evolutions',
      set_id: 'prismatic evolutions',
      psa_grade: '9',
      price: 290.00,
      imageUrl: vaporeon149,
      additionalImages: [vaporeon149],
      uploadDate: '2025-01-17',
      description: "Dripping and drowning.",
      type: 'card'
    },
    { 
      id: 7,
      id_name: "glaceon ex 150",
      item_name: "Glaceon EX", 
      energy_type: 'Water',
      rarities: ['Special Illustration Rare'],
      extra_types: ['EX', 'Secret Rare', 'Holo'],
      set: 'Prismatic evolutions',
      set_id: 'prismatic evolutions',
      psa_grade: '9',
      price: 280.00,
      imageUrl: glaceon150,
      additionalImages: [glaceon150],
      uploadDate: '2025-01-17',
      description: "Frozone has one of these as well.",
      type: 'card'
    },
    { 
      id: 8,
      id_name: "Vivid Voltage Booster Pack",
      item_name: "Vivid Voltage Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sword & Shield',
      set_id: 'vivid voltage',
      uploadDate: '2020-11-13',
      price: 7.00,
      imageUrl: vividvoltage1,
      additionalImages: [vividvoltage1],
      description: "Single booster pack from the 4th expansion of Sword & Shield series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 9,
      id_name: "Vivid Voltage Booster Pack",
      item_name: "Vivid Voltage Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sword & Shield',
      set_id: 'vivid voltage',
      uploadDate: '2020-11-13',
      price: 7.00,
      imageUrl: vividvoltage2,
      additionalImages: [vividvoltage2],
      description: "Single booster pack from the 4th expansion of Sword & Shield series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 10,
      id_name: "Vivid Voltage Booster Pack",
      item_name: "Vivid Voltage Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sword & Shield',
      set_id: 'vivid voltage',
      uploadDate: '2020-11-13',
      price: 7.00,
      imageUrl: vividvoltage3,
      additionalImages: [vividvoltage3],
      description: "Single booster pack from the 4th expansion of Sword & Shield series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 11,
      id_name: "Vivid Voltage Booster Pack",
      item_name: "Vivid Voltage Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sword & Shield',
      set_id: 'vivid voltage',
      uploadDate: '2020-11-13',
      price: 7.00,
      imageUrl: vividvoltage4,
      additionalImages: [vividvoltage4],
      description: "Single booster pack from the 4th expansion of Sword & Shield series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 12,
      id_name: "dudunsparce ex 121",
      item_name: "Dudunsparce EX",
      energy_type: 'Colorless',
      rarities: ['Double Rare'],
      extra_types: ['EX', 'Holo'],
      set: 'Journey Together',
      set_id: 'journey together',
      psa_grade: 'Ungraded',
      price: 2.00,
      imageUrl: dudunsparce121,
      additionalImages: [dudunsparce121],
      uploadDate: '2025-03-28',
      description: "Pretty solid centering on this card both front and back, id say a 9 psa, potential 10.",
      type: 'card'
    },
    { 
      id: 13,
      id_name: "clodsire ex 94",
      item_name: "Clodsire EX",
      energy_type: 'Darkness',
      rarities: ['Double Rare'],
      extra_types: ['EX', 'Holo'],
      set: 'Journey Together',
      set_id: 'journey together',
      psa_grade: 'Ungraded',
      price: 1.20,
      imageUrl: clodsire94,
      additionalImages: [clodsire94],
      uploadDate: '2025-03-28',
      description: 'Very beautiful card, gotta get psyched!',
      type: 'card'
    },
    { 
      id: 14,
      id_name: "tapukoko ex 51",
      item_name: "Tapukoko EX",
      energy_type: 'Lightning',
      rarities: ['Double Rare'],
      extra_types: ['EX', 'Holo'],
      set: 'Journey Together',
      set_id: 'journey together',
      psa_grade: 'Ungraded',
      price: 1.20,
      imageUrl: tapukoko51,
      additionalImages: [tapukoko51],
      uploadDate: '2025-03-28',
      description: 'You feel the elctricity tingle in your hands with this card.',
      type: 'card'
    },
    { 
      id: 15,
      id_name: "cyclizar ex promo 18",
      item_name: "Cyclizar EX",
      energy_type: 'Colorless',
      rarities: ['Double Rare'],
      extra_types: ['EX', 'Holo'],
      set: 'Scarlet & Violet',
      set_id: 'scarlet & and violet',
      psa_grade: 'Ungraded',
      price: 1.20,
      imageUrl: cyclizarpromo18,
      additionalImages: [cyclizarpromo18],
      uploadDate: '2025-01-17',
      description: "Promo card recieved from the Cyclizar EX box.",
      type: 'card'
    },
    { 
      id: 16,
      id_name: "bellibolt ex 53",
      item_name: "Bellibolt EX",
      energy_type: 'Lightning',
      rarities: ['Double Rare'],
      extra_types: ['EX', 'Holo'],
      set: 'Journey Together',
      set_id: 'journey together',
      psa_grade: 'Ungraded',
      price: 2.00,
      imageUrl: bellibolt53,
      additionalImages: [bellibolt53],
      uploadDate: '2025-03-28',
      description: "Obvious bae card.",
      type: 'card'
    },
    { 
      id: 17,
      id_name: "blastoise ex 9",
      item_name: "Blastoise EX",
      energy_type: 'Water',
      rarities: ['Double Rare'],
      extra_types: ['EX', 'Holo'],
      set: 'Scarlet & Violet 151',
      set_id: 'scarlet & and violet 151',
      psa_grade: 'Ungraded',
      price: 2.50,
      imageUrl: blastoise9,
      additionalImages: [blastoise9],
      uploadDate: '2023-09-22',
      description: "Who you got if he goes toe to toe with bowser?",
      type: 'card'
    },
    { 
      id: 18,
      id_name: "luxray ex 68",
      item_name: "Luxray EX",
      energy_type: 'Lightning',
      rarities: ['Double Rare'],
      extra_types: ['EX', 'Holo'],
      set: 'Twilight Masquerade',
      set_id: 'twilight masquerade',
      psa_grade: 'Ungraded',
      price: 1.20,
      imageUrl: luxray68,
      additionalImages: [luxray68],
      uploadDate: '2024-05-24',
      description: "I now believe in fairys!",
      type: 'card'
    },
    { 
      id: 79,
      id_name: "brocks scouting 179",
      item_name: "Brock's Scouting", 
      energy_type: 'None',
      rarities: ['Ultra Rare'],
      extra_types: ['Secret Rare', 'Holo'],
      set: 'Journey together',
      set_id: 'journey together',
      psa_grade: 'Ungraded',
      price: 4.20,
      imageUrl: brockscout179,
      additionalImages: [brockscout179],
      uploadDate: '2025-03-28',
      description: 'A supporter card featuring Brock on his adventures.',
      type: 'card'
    },
    { 
      id: 80,
      id_name: "spiky energy 190",
      item_name: "Spiky Energy", 
      energy_type: 'None',
      rarities: ['Hyper Rare'],
      extra_types: ['Secret Rare', 'Holo'],
      set: 'Journey together',
      set_id: 'journey together',
      psa_grade: 'Ungraded',
      price: 9.00,
      imageUrl: spikyenergy190,
      additionalImages: [spikyenergy190],
      uploadDate: '2025-03-28',
      description: 'A special energy card with a shocking design.',
      type: 'card'
    },
    { 
      id: 81,
      id_name: "mr mime 179",
      item_name: "Mr. Mime", 
      energy_type: 'Psychic',
      rarities: ['Illustration Rare'],
      extra_types: ['Secret Rare', 'Holo'],
      set: 'Pokemon scarlet & violet 151',
      set_id: 'scarlet & and violet 151',
      psa_grade: 'Ungraded',
      price: 7.00,
      imageUrl: mrmime179,
      additionalImages: [mrmime179],
      uploadDate: '2023-09-22',
      description: 'The barrier Pokemon with mime-like movements.',
      type: 'card'
    },
    { 
      id: 82,
      id_name: "zacian v 16",
      item_name: "Zacian V", 
      energy_type: 'Psychic',
      rarities: ['Super Rare'],
      extra_types: ['V', 'Holo'],
      set: 'Celebrations',
      set_id: 'celebrations',
      psa_grade: 'Ungraded',
      price: 1.00,
      imageUrl: zacian16,
      additionalImages: [zacian16],
      uploadDate: '2021-10-08',
      description: 'The warrior Pokemon with its mighty sword.',
      type: 'card'
    },
    { 
      id: 83,
      id_name: "darkness ablaze booster pack",
      item_name: "Darkness Ablaze Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sword & Shield',
      set_id: 'darkness ablaze',
      uploadDate: '2020-08-14',
      price: 7.00,
      imageUrl: darknessablaze1,
      additionalImages: [darknessablaze1],
      description: "Single booster pack from the Darkness Ablaze expansion of Sword & Shield series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 84,
      id_name: "sun and & moon booster pack",
      item_name: "Sun & Moon Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sun & Moon',
      set_id: 'sun and & moon',
      uploadDate: '2017-02-03',
      price: 10.00,
      imageUrl: sunandmoon1,
      additionalImages: [sunandmoon1],
      description: "Single booster pack from the Sun & Moon expansion of Sun & Moon series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 85,
      id_name: "sun and & moon booster pack",
      item_name: "Sun & Moon Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sun & Moon',
      set_id: 'sun and & moon',
      uploadDate: '2017-02-03',
      price: 10.00,
      imageUrl: sunandmoon2,
      additionalImages: [sunandmoon2],
      description: "Single booster pack from the Sun & Moon expansion of Sun & Moon series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 86,
      id_name: "chilling reign booster pack",
      item_name: "Chilling Reign Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sword & Shield',
      set_id: 'chilling reign',
      uploadDate: '2021-06-18',
      price: 7.00,
      imageUrl: chillingreign1,
      additionalImages: [chillingreign1],
      description: "Single booster pack from the Chilling Reign expansion of Sword & Shield series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 87,
      id_name: "chilling reign booster pack",
      item_name: "Chilling Reign Booster Pack",
      product_type: 'Booster Pack',
      series: 'Sword & Shield',
      set_id: 'chilling reign',
      uploadDate: '2021-06-18',
      price: 7.00,
      imageUrl: chillingreign2,
      additionalImages: [chillingreign2],
      description: "Single booster pack from the Chilling Reign expansion of Sword & Shield series.",
      packs: 1,
      type: 'sealed'
    },
    { 
      id: 88,
      id_name: "crown zenith elite trainer box ETB",
      item_name: "Crown Zenith ETB",
      product_type: 'ETB',
      series: 'Sword & Shield',
      set_id: 'crown zenith',
      uploadDate: '2023-01-20',
      price: 120.00,
      imageUrl: crownzenithetb1,
      additionalImages: [crownzenithetb1, crownzenithetb2],
      description: "A ETB from the Crown Zenith expansion of Sword & Shield series.",
      packs: 9,
      type: 'sealed'
    },
    { 
      id: 89,
      id_name: "journey together booster box",
      item_name: "Journey Together Booster Box",
      product_type: 'Booster Box',
      series: 'Scarlet & Violet',
      set_id: 'journey together',
      uploadDate: '2025-03-28',
      price: 190.00,
      imageUrl: journeytogether1,
      additionalImages: [journeytogether1, journeytogether2, journeytogether3],
      description: "A booster box from the Journey Together expansion of Scarlet & Violet series.",
      packs: 36,
      type: 'sealed'
    },
    { 
      id: 90,
      id_name: "prismatic evolutions evolution elite trainer box etb",
      item_name: "Prismatic Evolutions ETB",
      product_type: 'ETB',
      series: 'Scarlet & Violet',
      set_id: 'prismatic evolutions',
      uploadDate: '2025-01-17',
      price: 100.00,
      imageUrl: prismaticetb,
      additionalImages: [prismaticetb],
      description: "An Elite Trainer Box from the Prismatic Evolutions expansion from the Scarlet & Violet series.",
      packs: 9,
      type: 'sealed'
    },
    { 
      id: 91,
      id_name: "pikachu vmax box",
      item_name: "Pikachu VMAX Box",
      product_type: 'Special',
      series: 'Sword & Shield',
      set_id: 'crown zenith',
      uploadDate: '2023-01-20',
      price: 80.00,
      imageUrl: pikachuvmaxbox,
      additionalImages: [pikachuvmaxbox, pikachuvmaxbox2],
      description: "A special premium collection box featuring Pikachu VMAX from the Crown Zenith set.",
      packs: 7,
      type: 'sealed'
    },
    { 
      id: 92,
      id_name: "squirtle tin",
      item_name: "Squirtle Tin",
      product_type: 'Tins',
      series: 'Sword & Shield',
      set_id: 'sword & and shield',
      uploadDate: '2021-10-08',
      price: 20.00,
      imageUrl: squirtletin,
      additionalImages: [squirtletin],
      description: "A special tin featuring Squirtle, 2 booster packs, and a coin.",
      packs: 2,
      type: 'sealed'
    },
    { 
      id: 93,
      id_name: "mew tin",
      item_name: "Mew Tin",
      product_type: 'Tins',
      series: 'Scarlet & Violet',
      set_id: 'scarlet & violet',
      uploadDate: '2023-03-31',
      price: 20.00,
      imageUrl: mewtin,
      additionalImages: [mewtin],
      description: "A special tin featuring Mew, 2 booster packs, and a coin.",
      packs: 2,
      type: 'sealed'
    },
    { 
      id: 94,
      id_name: "dragonite tin",
      item_name: "Dragonite Tin",
      product_type: 'Tins',
      series: 'Scarlet & Violet',
      set_id: 'scarlet & violet',
      uploadDate: '2023-03-31',
      price: 20.00,
      imageUrl: dragonitetin,
      additionalImages: [dragonitetin],
      description: "A special tin featuring Dragonite, 2 booster packs, and a coin.",
      packs: 2,
      type: 'sealed'
    },
    { 
      id: 95,
      id_name: "charmander tin",
      item_name: "Charmander Tin",
      product_type: 'Tins',
      series: 'Sword & Shield',
      set_id: 'sword & and shield',
      uploadDate: '2021-10-08',
      price: 20.00,
      imageUrl: charmandertin,
      additionalImages: [charmandertin],
      description: "A special tin featuring Charmander, 2 booster packs, and a coin.",
      packs: 2,
      type: 'sealed'
    },
    { 
      id: 96,
      id_name: "charizard tin",
      item_name: "Charizard Tin",
      product_type: 'Tins',
      series: 'Sword & Shield',
      set_id: 'sword & and shield',
      uploadDate: '2021-10-08',
      price: 20.00,
      imageUrl: charizardtin,
      additionalImages: [charizardtin],
      description: "A special tin featuring Charizard, 2 booster packs, and a coin.",
      packs: 2,
      type: 'sealed'
    },
    { 
      id: 97,
      id_name: "darkrai tin",
      item_name: "Darkrai Tin",
      product_type: 'Tins',
      series: 'Sword & Shield',
      set_id: 'sword & and shield',
      uploadDate: '2021-10-08',
      price: 30.00,
      imageUrl: darkraitin,
      additionalImages: [darkraitin, darkraitin2],
      description: "A special tin featuring Darkrai, 3 foil cards, and 3 Booster Packs.",
      packs: 3,
      type: 'sealed'
    }
];
