// API base URL
//  - In development: empty string so webpack-dev-server proxy works
//    (configured in frontend/package.json "proxy": "http://localhost:5000")
//  - In production: set REACT_APP_API_URL=https://proshop-api.onrender.com
//    in Vercel environment variables
export const BASE_URL = process.env.REACT_APP_API_URL || '';

export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';
export const COUPONS_URL = '/api/coupons';
export const WISHLIST_URL = '/api/users/wishlist';
