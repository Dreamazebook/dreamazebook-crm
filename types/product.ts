export interface Product {
  spu_code: string;
  name: string;
  category: string;
  category_text: string;
  base_price: string;
  market_price: string;
  current_price: number;
  is_on_sale: boolean;
  discount_percentage: number;
  images: string[];
  primary_image: string | null;
  description: string;
  is_featured: boolean;
  total_sales: number;
  view_count: number;
  favorite_count: number;
  supports_customization: boolean;
  requires_ai_processing: boolean;
  estimated_production_time: number; // in minutes
  is_purchasable: boolean;
  rating: number;
  review_count: number;
}

// Types for new products API
// type Product = {
//   spu_code: string;
//   name: string;
//   category: string;
//   current_price: number;
//   primary_image: string | null;
//   base_price?: string;
//   market_price?: string;
//   description?: string;
// };

export type ProductsResponse = {
  success: boolean;
  data: Product[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  meta?: { timestamp: number; version: string };
};

// Helper type for product creation/update
export type CreateProductInput = Omit<Product, 
  'total_sales' | 
  'view_count' | 
  'favorite_count' | 
  'rating' | 
  'review_count'
>;

// Helper type for product listing/filtering
export interface ProductFilters {
  category?: string;
  is_featured?: boolean;
  is_on_sale?: boolean;
  min_price?: number;
  max_price?: number;
  supports_customization?: boolean;
}

// Helper type for product sorting
export type ProductSortField = 
  | 'current_price'
  | 'rating'
  | 'total_sales'
  | 'view_count'
  | 'estimated_production_time';

export type ProductSortOrder = 'asc' | 'desc';

export interface ProductSortOption {
  field: ProductSortField;
  order: ProductSortOrder;
}