import { WardrobeItem } from './types';

// Helper to generate clean aesthetic minimalist SVG fashion illustration data URLs
function createItemSvg(type: string, colorHex: string, accentHex: string = '#2B2B2B'): string {
  let shapeSvg = '';

  switch (type) {
    case 'top-fitted':
      shapeSvg = `<path d="M70,30 L130,30 L150,60 L130,70 L120,55 L120,170 L80,170 L80,55 L70,70 L50,60 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M85,30 Q100,50 115,30" fill="none" stroke="${accentHex}" stroke-width="2"/>`;
      break;
    case 'top-knit':
      shapeSvg = `<path d="M60,35 L140,35 L165,85 L145,95 L130,70 L130,170 L70,170 L70,70 L55,95 L35,85 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M85,35 Q100,45 115,35" fill="none" stroke="${accentHex}" stroke-width="2"/>
      <line x1="70" y1="160" x2="130" y2="160" stroke="${accentHex}" stroke-width="1.5" stroke-dasharray="3,3"/>`;
      break;
    case 'blouse':
      shapeSvg = `<path d="M65,30 L135,30 L160,80 L140,88 L125,60 L125,170 L75,170 L75,60 L60,88 L40,80 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M85,30 L100,60 L115,30" fill="none" stroke="${accentHex}" stroke-width="2"/>
      <circle cx="100" cy="80" r="2" fill="${accentHex}"/>
      <circle cx="100" cy="110" r="2" fill="${accentHex}"/>
      <circle cx="100" cy="140" r="2" fill="${accentHex}"/>`;
      break;
    case 'bottom-wide':
      shapeSvg = `<path d="M65,40 L135,40 L155,180 L110,180 L100,75 L90,180 L45,180 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <line x1="65" y1="52" x2="135" y2="52" stroke="${accentHex}" stroke-width="1.5"/>
      <line x1="80" y1="55" x2="80" y2="175" stroke="${accentHex}" stroke-width="1" stroke-opacity="0.5"/>
      <line x1="120" y1="55" x2="120" y2="175" stroke="${accentHex}" stroke-width="1" stroke-opacity="0.5"/>`;
      break;
    case 'bottom-denim':
      shapeSvg = `<path d="M65,40 L135,40 L145,180 L110,180 L100,80 L90,180 L55,180 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <line x1="65" y1="50" x2="135" y2="50" stroke="${accentHex}" stroke-width="2"/>
      <path d="M72,58 Q85,75 90,58" fill="none" stroke="${accentHex}" stroke-width="1.5"/>
      <path d="M110,58 Q115,75 128,58" fill="none" stroke="${accentHex}" stroke-width="1.5"/>`;
      break;
    case 'skirt-fluid':
      shapeSvg = `<path d="M75,40 L125,40 L155,175 Q100,185 45,175 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <line x1="75" y1="50" x2="125" y2="50" stroke="${accentHex}" stroke-width="2"/>
      <path d="M85,55 Q90,120 75,175" fill="none" stroke="${accentHex}" stroke-width="1" stroke-opacity="0.4"/>
      <path d="M115,55 Q110,120 125,175" fill="none" stroke="${accentHex}" stroke-width="1" stroke-opacity="0.4"/>`;
      break;
    case 'outerwear-blazer':
      shapeSvg = `<path d="M50,40 L150,40 L165,160 L135,165 L125,75 L125,175 L75,175 L75,75 L65,165 L35,160 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M75,40 L100,105 L125,40" fill="none" stroke="${accentHex}" stroke-width="2.5"/>
      <line x1="100" y1="105" x2="100" y2="175" stroke="${accentHex}" stroke-width="2"/>
      <rect x="58" y="115" width="22" height="6" rx="2" fill="${accentHex}" fill-opacity="0.3"/>
      <rect x="120" y="115" width="22" height="6" rx="2" fill="${accentHex}" fill-opacity="0.3"/>`;
      break;
    case 'shoes-loafers':
      shapeSvg = `<path d="M40,110 Q55,90 100,95 Q140,100 160,120 Q165,135 150,140 L50,140 Q35,135 40,110 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M80,100 Q100,95 120,102" fill="none" stroke="${accentHex}" stroke-width="3"/>
      <rect x="45" y="140" width="30" height="12" rx="2" fill="${accentHex}"/>
      <line x1="40" y1="140" x2="155" y2="140" stroke="${accentHex}" stroke-width="4"/>`;
      break;
    case 'bag-structured':
      shapeSvg = `<path d="M55,80 L145,80 L155,165 L45,165 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M80,80 C80,45 120,45 120,80" fill="none" stroke="${accentHex}" stroke-width="3"/>
      <polygon points="100,95 108,105 92,105" fill="${accentHex}"/>
      <line x1="55" y1="80" x2="145" y2="80" stroke="${accentHex}" stroke-width="2"/>`;
      break;
    case 'dress-midi':
      shapeSvg = `<path d="M70,30 L130,30 L140,70 L120,70 L115,95 L145,180 Q100,190 55,180 L85,95 L80,70 L60,70 Z" fill="${colorHex}" stroke="${accentHex}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M85,30 Q100,50 115,30" fill="none" stroke="${accentHex}" stroke-width="2"/>
      <line x1="85" y1="95" x2="115" y2="95" stroke="${accentHex}" stroke-width="2"/>`;
      break;
    default:
      shapeSvg = `<rect x="50" y="50" width="100" height="100" rx="10" fill="${colorHex}" stroke="${accentHex}" stroke-width="3"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
    <rect width="200" height="200" fill="#FAF8F5" rx="16"/>
    <g transform="translate(0, 0)">${shapeSvg}</g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SEED_WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: 'seed-1',
    name: 'Crimson Ribbed Mockneck',
    category: 'Tops',
    subcategory: 'Knit / Sweater',
    primaryColor: 'Red',
    shape: 'Fitted',
    finishTexture: 'Knit',
    occasions: ['Work', 'Dinner', 'Weekends'],
    seasons: ['Spring / Autumn', 'Winter'],
    imageUrl: createItemSvg('top-knit', '#BA2D2D'),
    brand: 'Totême',
    notes: 'Pairs with Camel, Navy, Cream per guide.',
    favorite: true,
    timesWorn: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    name: 'Pleated High-Rise Trousers',
    category: 'Bottoms',
    subcategory: 'Tailored Trousers',
    primaryColor: 'Camel',
    shape: 'Wide-Leg',
    finishTexture: 'Wool',
    occasions: ['Work', 'Dinner', 'Travel'],
    seasons: ['All Season'],
    imageUrl: createItemSvg('bottom-wide', '#C49767'),
    brand: 'The Frankie Shop',
    notes: 'The ultimate shape balancing staple for fitted tops.',
    favorite: true,
    timesWorn: 9,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    name: 'Double-Breasted Wool Blazer',
    category: 'Outerwear',
    subcategory: 'Structured Blazer',
    primaryColor: 'Navy',
    shape: 'Structured',
    finishTexture: 'Wool',
    occasions: ['Work', 'Dinner', 'Events'],
    seasons: ['Spring / Autumn', 'Winter'],
    imageUrl: createItemSvg('outerwear-blazer', '#1E293B'),
    brand: 'COS',
    notes: 'Adds architectural finish to casual looks.',
    favorite: true,
    timesWorn: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-4',
    name: 'Relaxed Silk Button-Down',
    category: 'Tops',
    subcategory: 'Button-Down Shirt',
    primaryColor: 'Cream',
    shape: 'Relaxed',
    finishTexture: 'Silk / Satin',
    occasions: ['Work', 'Weekends', 'Dinner', 'Travel'],
    seasons: ['All Season'],
    imageUrl: createItemSvg('blouse', '#F7F3E9', '#8C8275'),
    brand: 'Equipment',
    notes: 'Universal neutral bridge top.',
    favorite: true,
    timesWorn: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-5',
    name: 'Straight Leg Vintage Wash Denim',
    category: 'Bottoms',
    subcategory: 'Jeans',
    primaryColor: 'Denim',
    shape: 'Structured',
    finishTexture: 'Denim',
    occasions: ['Weekends', 'Travel', 'Dinner'],
    seasons: ['All Season'],
    imageUrl: createItemSvg('bottom-denim', '#4F759B'),
    brand: 'Agolde',
    notes: 'Dependable anchor pairing for Orange, Pink, and Green.',
    favorite: false,
    timesWorn: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-6',
    name: 'Forest Green Cashmere Crew',
    category: 'Tops',
    subcategory: 'Knit / Sweater',
    primaryColor: 'Green',
    shape: 'Relaxed',
    finishTexture: 'Knit',
    occasions: ['Work', 'Weekends', 'Travel'],
    seasons: ['Spring / Autumn', 'Winter'],
    imageUrl: createItemSvg('top-knit', '#2F664B'),
    brand: 'Loro Piana Style',
    notes: 'Matches Cream, Navy, and Brown.',
    favorite: true,
    timesWorn: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-7',
    name: 'Italian Leather Horsebit Loafers',
    category: 'Shoes',
    subcategory: 'Loafers',
    primaryColor: 'Tan',
    shape: 'Structured',
    finishTexture: 'Leather',
    occasions: ['Work', 'Weekends', 'Travel', 'Dinner'],
    seasons: ['All Season'],
    imageUrl: createItemSvg('shoes-loafers', '#C49767', '#3D2817'),
    brand: 'Gucci style',
    notes: 'Connecting finish detail for all formula pairings.',
    favorite: true,
    timesWorn: 20,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-8',
    name: 'Structured Flap Crossbody Bag',
    category: 'Bags',
    subcategory: 'Crossbody Bag',
    primaryColor: 'Brown',
    shape: 'Structured',
    finishTexture: 'Leather',
    occasions: ['Work', 'Weekends', 'Dinner', 'Travel'],
    seasons: ['All Season'],
    imageUrl: createItemSvg('bag-structured', '#583D28', '#2B1A0E'),
    brand: 'Celine style',
    notes: 'Rich chocolate tone completes the look.',
    favorite: true,
    timesWorn: 18,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-9',
    name: 'Emerald Fluid Slip Midi Skirt',
    category: 'Bottoms',
    subcategory: 'Midi / Maxi Skirt',
    primaryColor: 'Emerald',
    shape: 'Fluid / Flowy',
    finishTexture: 'Silk / Satin',
    occasions: ['Dinner', 'Events', 'Work'],
    seasons: ['All Season'],
    imageUrl: createItemSvg('skirt-fluid', '#165B4C'),
    brand: 'Anine Bing',
    notes: 'Pairs with Red, Cream, and Camel.',
    favorite: false,
    timesWorn: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-10',
    name: 'Sky Blue Crisp Poplin Shirt',
    category: 'Tops',
    subcategory: 'Button-Down Shirt',
    primaryColor: 'Blue',
    shape: 'Relaxed',
    finishTexture: 'Cotton',
    occasions: ['Work', 'Weekends', 'Travel'],
    seasons: ['All Season'],
    imageUrl: createItemSvg('blouse', '#7FA9D0', '#1C3B5E'),
    brand: 'Ralph Lauren',
    notes: 'Pairs with Camel, Brown, and Tan.',
    favorite: true,
    timesWorn: 8,
    createdAt: new Date().toISOString(),
  }
];
