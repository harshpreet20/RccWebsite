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
  {
    name: 'RCC Court Cap',
    price: '₹499',
    image: '/products/cap.jpeg',
    url: 'https://store.racquetsclubcommunity.com/product/rcc-court-cap',
  },
  {
    name: 'RCC Wristband',
    price: '₹299',
    image: '/products/wristband.jpeg',
    url: 'https://store.racquetsclubcommunity.com/product/rcc-wristbands',
  },
  {
    name: 'RCC Annual Membership',
    price: '₹999/yr',
    image: null,
    url: 'https://store.racquetsclubcommunity.com/product/rcc-annual-membership',
  },
];
