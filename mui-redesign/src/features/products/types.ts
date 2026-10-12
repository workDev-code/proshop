/**
 * Product domain types
 * Mirrors backend/models/productModel.js
 */

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  user?: string;
}

/**
 * Backend response shape from GET /api/products
 * (see backend/controllers/productController.js → getProducts)
 */
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

/**
 * Query string parameters accepted by GET /api/products
 */
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
