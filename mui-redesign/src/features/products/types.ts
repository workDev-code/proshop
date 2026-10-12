/**
 * Product domain types
 * Mirrors backend/models/productModel.js (v3.0)
 */

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  sku?: string;
  image: string;
  images?: string[];
  brand: string;
  category: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  tags?: string[];
  rating: number;
  numReviews: number;
  countInStock: number;
  reviews: Review[];
  isActive?: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  createdAt: string;
  updatedAt: string;
  user?: string;
}

export interface ProductListResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
  facets: {
    categories: string[];
    brands: string[];
  };
  appliedFilters: {
    keyword: string;
    category: string;
    brand: string;
    priceMin: string;
    priceMax: string;
    minRating: string;
    inStock: string;
    sort: string;
  };
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'top_sellers'
  | 'name';

export const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  price_asc: 'Price: Low → High',
  price_desc: 'Price: High → Low',
  rating: 'Top rated',
  top_sellers: 'Top sellers',
  name: 'Name (A→Z)',
};

export interface ProductQueryParams {
  keyword?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: SortOption;
  pageNumber?: number;
}

export interface CreateReviewPayload {
  rating: number;
  comment: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  brand: string;
  category: string;
  countInStock: number;
  sku?: string;
  compareAtPrice?: number;
  tags?: string[];
  isActive?: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}
