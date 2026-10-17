export const PRODUCT_CATEGORIES = [
  'Perfumes',
  'Skincare',
  'Cosmetics',
  'Beauty essentials',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductCurrency = 'UGX' | 'USD';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  currency: ProductCurrency;
  description: string;
  images: string[];
  createdAt: number;
}

export type ProductDraft = Omit<Product, 'id' | 'createdAt'>;
export type StorePage = 'home' | 'shop' | 'about' | 'visit' | 'admin';