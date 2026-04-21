import { Product } from '../types';

export const seedProducts: Product[] = [
  {
    id: '1',
    name: 'Sport Athletic Gloves',
    description: 'High-performance athletic gloves with breathable fabric and lime green accents. Perfect for sports and outdoor activities.',
    price: 245,
    category: 'Sport',
    sizes: ['S', 'M', 'L'],
    colors: ['White/Lime'],
    stock: 50,
    images: [
      '/products/sport/1.jpg',
      '/products/sport/2.jpg'
    ],
    featured: true,
    rating: 4.5,
    reviews: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Red Welding Gloves',
    description: 'Heavy-duty heat-resistant welding gloves made from premium red suede. Provides excellent protection for industrial work.',
    price: 430,
    category: 'Work',
    sizes: ['M', 'L', 'XL'],
    colors: ['Red'],
    stock: 35,
    images: [
      '/products/welding/1.jpg',
      '/products/welding/2.jpg',
      '/products/welding/3.png',
      '/products/welding/4.png',
      '/products/welding/5.png'
    ],
    featured: true,
    rating: 4.8,
    reviews: 24,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'White Gauntlet Gloves',
    description: 'Professional grade white leather gauntlet gloves. Durable, comfortable, and designed for safety and precision.',
    price: 280,
    category: 'Safety',
    sizes: ['M', 'L'],
    colors: ['White'],
    stock: 40,
    images: [
      '/products/gauntlet/1.jpg',
      '/products/gauntlet/2.jpg',
      '/products/gauntlet/3.jpg',
      '/products/gauntlet/4.png',
      '/products/gauntlet/5.png'
    ],
    featured: false,
    rating: 4.6,
    reviews: 18,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Work Industrial Gloves',
    description: 'Premium yellow leather work gloves with black mesh for breathability. Ideal for construction and heavy manual labor.',
    price: 680,
    category: 'Work',
    sizes: ['M', 'L', 'XL'],
    colors: ['Yellow/Black'],
    stock: 25,
    images: [
      '/products/industrial/1.jpg',
      '/products/industrial/2.jpg'
    ],
    featured: true,
    rating: 4.9,
    reviews: 31,
    createdAt: new Date().toISOString(),
  },
];
