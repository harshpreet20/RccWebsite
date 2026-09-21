export type Product = {
  name: string;
  price: string;
  image: string | null;
  url: string;
};

export const PRODUCTS: Product[] = [
  {
    name: 'RCC Performance T-Shirt',
    price: '₹899',
    image: '/products/tshirt.png',
    url: 'https://store.racquetsclubcommunity.com/product/rcc-performance-tshirt',
  },
  {
    name: 'RCC Performance Shorts',
    price: '₹699',
    image: '/products/shorts.png',
    url: 'https://store.racquetsclubcommunity.com/product/rcc-performance-shorts',
  },
];
