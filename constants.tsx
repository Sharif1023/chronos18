
import { Watch, Brand } from './types';

export const BRANDS: Brand[] = [
  { id: 'b1', name: 'Patek Philippe', logo: 'https://picsum.photos/seed/patek/200/100', description: 'Begin your own tradition.' },
  { id: 'b2', name: 'Rolex', logo: 'https://picsum.photos/seed/rolex/200/100', description: 'Every Rolex tells a story.' },
  { id: 'b3', name: 'Audemars Piguet', logo: 'https://picsum.photos/seed/ap/200/100', description: 'To break the rules, you must first master them.' },
  { id: 'b4', name: 'Vacheron Constantin', logo: 'https://picsum.photos/seed/vc/200/100', description: 'One of not many.' },
  { id: 'b5', name: 'Omega', logo: 'https://picsum.photos/seed/omega/200/100', description: 'Precision and heritage since 1848.' }
];

export const WATCHES: Watch[] = [
  {
    id: 'w1',
    name: 'Submariner Date',
    // Fix: brandId -> brand_id
    brand_id: 'b2',
    // Fix: brandName -> brand_name
    brand_name: 'Rolex',
    price: 14500,
    description: 'The archetype of the diver\'s watch, the Submariner Date exemplifies the historic link between Rolex and the underwater world.',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1619134716175-92762a4d0ba0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622434641406-a15812345ad1?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: {
      case: 'Oyster, 41 mm, Oystersteel',
      movement: 'Perpetual, mechanical, self-winding',
      waterResistance: 'Waterproof to 300 metres / 1,000 feet',
      strap: 'Oyster, flat three-piece links'
    },
    stock: 5,
    category: 'Dive',
    featured: true
  },
  {
    id: 'w2',
    name: 'Nautilus 5711',
    // Fix: brandId -> brand_id
    brand_id: 'b1',
    // Fix: brandName -> brand_name
    brand_name: 'Patek Philippe',
    price: 120000,
    description: 'With the rounded octagonal shape of its bezel, the ingenious porthole construction of its case, and its horizontally embossed dial.',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629226863300-c010dec6475d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: {
      case: 'Steel, 40mm',
      movement: 'Self-winding mechanical movement',
      waterResistance: '120m',
      strap: 'Steel bracelet'
    },
    stock: 2,
    category: 'Classic',
    featured: true
  },
  {
    id: 'w3',
    name: 'Royal Oak Offshore',
    // Fix: brandId -> brand_id
    brand_id: 'b3',
    // Fix: brandName -> brand_name
    brand_name: 'Audemars Piguet',
    price: 35000,
    description: 'The Royal Oak Offshore collection has defied established conventions since 1993, giving an ever more powerful and sportier take.',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1619134716175-92762a4d0ba0?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: {
      case: 'Titanium, 42mm',
      movement: 'Calibre 4404',
      waterResistance: '100m',
      strap: 'Rubber strap'
    },
    stock: 8,
    category: 'Sport'
  },
  {
    id: 'w4',
    name: 'Speedmaster Moonwatch',
    // Fix: brandId -> brand_id
    brand_id: 'b5',
    // Fix: brandName -> brand_name
    brand_name: 'Omega',
    price: 7200,
    description: 'The Speedmaster Moonwatch is one of the world’s most iconic timepieces. Having been a part of all six moon missions.',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: {
      case: 'Stainless Steel, 42mm',
      movement: 'Omega Co-Axial Master Chronometer Calibre 3861',
      waterResistance: '50m',
      strap: 'Stainless steel'
    },
    stock: 12,
    category: 'Aviator'
  }
];
