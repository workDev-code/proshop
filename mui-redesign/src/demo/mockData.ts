/**
 * In-memory mock data for the demo build (VITE_DEMO_MODE=true).
 * Editorial lifestyle brand: home, tech, accessories, lifestyle, footwear, books.
 * Real Unsplash images (CDN-cached, no auth required).
 */

import type { Product } from '../features/products/types';
import type { User } from '../features/auth/types';
import type { Coupon } from '../features/admin/types';

// =================== USERS ===================
export const mockUsers: User[] = [
  { _id: 'u_admin', name: 'Avery Stone', email: 'admin@proshop.com', isAdmin: true },
  { _id: 'u_jane', name: 'Jane Meyer', email: 'jane@proshop.com', isAdmin: false },
  { _id: 'u_jack', name: 'Jack Rivera', email: 'jack@proshop.com', isAdmin: false },
];

export const MOCK_PASSWORD = '123456';

// =================== PRODUCTS ===================
// Real Unsplash CDN photos, 250x250 for cards, 650x650 for detail
const u = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const mockProducts: Product[] = [
  {
    _id: 'p_1',
    name: 'Everyday Runner Sneaker',
    image: u('photo-1542291026-7eec264c27ff'),
    brand: 'Common Ground',
    category: 'Footwear',
    description: 'A daily sneaker built for long walks and short runs alike. Soft cushioned sole, breathable knit upper, and a clean silhouette that pairs with anything in your closet.',
    rating: 4.6,
    numReviews: 84,
    price: 89,
    countInStock: 24,
    reviews: [],
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    _id: 'p_2',
    name: 'Studio Wireless Headphones',
    image: u('photo-1505740420928-5e560c06d30e'),
    brand: 'Sonus',
    category: 'Tech & Audio',
    description: 'Over-ear headphones tuned for long listening sessions. Soft memory-foam cushions, 35-hour battery life, and warm detailed sound that flatters every track.',
    rating: 4.7,
    numReviews: 142,
    price: 129,
    countInStock: 18,
    reviews: [
      { _id: 'r1', name: 'Jane Meyer', rating: 5, comment: 'So comfortable I forget I have them on.', user: 'u_jane', createdAt: '2026-09-10T10:00:00Z' },
    ],
    createdAt: '2026-07-15T00:00:00Z',
    updatedAt: '2026-09-10T10:00:00Z',
  },
  {
    _id: 'p_3',
    name: 'Minimal Everyday Watch',
    image: u('photo-1523275335684-37898b6baf30'),
    brand: 'North Field',
    category: 'Accessories',
    description: 'A quiet timepiece with a matte case, sapphire crystal, and Italian leather strap. Designed to be the only watch you reach for.',
    rating: 4.8,
    numReviews: 63,
    price: 74,
    countInStock: 12,
    reviews: [],
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    _id: 'p_4',
    name: 'Daily Carry Tote',
    image: u('photo-1544816155-12df9643f363'),
    brand: 'Hide & Seek',
    category: 'Lifestyle',
    description: 'A roomy canvas tote with leather handles and an interior laptop sleeve. Fits everything you actually carry to the studio, the café, or the office.',
    rating: 4.5,
    numReviews: 51,
    price: 42,
    countInStock: 30,
    reviews: [],
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
  {
    _id: 'p_5',
    name: 'Ceramic Pour-Over Kit',
    image: u('photo-1495474472287-4d71bcdd2085'),
    brand: 'Slow Mornings',
    category: 'Home',
    description: 'Hand-thrown ceramic dripper, two-cup server, and bamboo lid. The 30-minute ritual that makes your morning feel intentional.',
    rating: 4.9,
    numReviews: 38,
    price: 58,
    countInStock: 15,
    reviews: [],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z',
  },
  {
    _id: 'p_6',
    name: 'Linen Throw Blanket',
    image: u('photo-1584100936595-c06587b119a3'),
    brand: 'Field Linen',
    category: 'Home',
    description: 'Pre-washed European linen in five quiet colors. Gets softer with every wash. Perfect on a sofa, a bed, or a shoulder on cool evenings.',
    rating: 4.7,
    numReviews: 92,
    price: 89,
    countInStock: 8,
    reviews: [],
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    _id: 'p_7',
    name: 'Walnut Desk Lamp',
    image: u('photo-1507473885765-e6ed057f782c'),
    brand: 'Slow Mornings',
    category: 'Home',
    description: 'Solid walnut base with a brass arm and a warm dimmable LED. Three brightness levels. The light your desk has been asking for.',
    rating: 4.6,
    numReviews: 47,
    price: 124,
    countInStock: 6,
    reviews: [],
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    _id: 'p_8',
    name: 'Leather Card Wallet',
    image: u('photo-1627123424571-abae0f3b8ec6'),
    brand: 'Hide & Seek',
    category: 'Accessories',
    description: 'Slim vegetable-tanned leather with 4 pockets and a pull-tab. Holds 8 cards plus folded bills. Designed to disappear in your front pocket.',
    rating: 4.4,
    numReviews: 28,
    price: 38,
    countInStock: 40,
    reviews: [],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    _id: 'p_9',
    name: 'Field Notebook Set (3-pack)',
    image: u('photo-1531346878377-a5be20888e57'),
    brand: 'North Field',
    category: 'Stationery',
    description: 'Three 96-page thread-bound notebooks with dot-grid pages and kraft covers. Pocket notebook for lists, A5 for projects, A4 for big thinking.',
    rating: 4.8,
    numReviews: 56,
    price: 28,
    countInStock: 50,
    reviews: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'p_10',
    name: 'Reusable Water Bottle',
    image: u('photo-1602143407151-7111542de6e8'),
    brand: 'Common Ground',
    category: 'Lifestyle',
    description: 'Double-walled stainless steel, keeps cold drinks cold for 24 hours and hot drinks hot for 12. Fits in your car cupholder and your bag.',
    rating: 4.5,
    numReviews: 113,
    price: 32,
    countInStock: 35,
    reviews: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'p_11',
    name: 'The Pragmatic Programmer',
    image: u('photo-1544947950-fa07a98d237f'),
    brand: 'Addison-Wesley',
    category: 'Books',
    description: '20th anniversary edition of the classic. Your journey from journeyman to master, with new essays on AI, remote work, and modern tooling.',
    rating: 4.9,
    numReviews: 50,
    price: 39,
    countInStock: 22,
    reviews: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'p_12',
    name: 'Leather-bound Journal',
    image: u('photo-1531346878377-a5be20888e57'),
    brand: 'North Field',
    category: 'Stationery',
    description: 'Hand-stitched journal with 240 pages of cream laid paper. Opens flat. Made to be passed down.',
    rating: 4.7,
    numReviews: 34,
    price: 48,
    countInStock: 18,
    reviews: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// =================== COUPONS ===================
export const mockCoupons: Coupon[] = [
  {
    _id: 'c_1',
    code: 'WELCOME10',
    description: '10% off your first order',
    type: 'percentage',
    value: 10,
    minOrderAmount: 0,
    maxDiscount: 30,
    usageLimit: 200,
    usageCount: 47,
    perUserLimit: 1,
    startDate: '2026-01-01T00:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'c_2',
    code: 'SAVE20',
    description: '$20 off orders over $100',
    type: 'fixed',
    value: 20,
    minOrderAmount: 100,
    usageLimit: 100,
    usageCount: 12,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'c_3',
    code: 'FREESHIP',
    description: '15% off (covers shipping on small orders)',
    type: 'percentage',
    value: 15,
    minOrderAmount: 0,
    usageLimit: null,
    usageCount: 89,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'c_4',
    code: 'EXPIRED',
    description: 'Old promo — should fail validation',
    type: 'percentage',
    value: 50,
    minOrderAmount: 0,
    isActive: true,
    startDate: '2025-01-01T00:00:00Z',
    expiresAt: '2025-12-31T23:59:59Z',
    usageCount: 99,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// =================== ORDERS ===================
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
};

export const mockOrders: any[] = [
  {
    _id: 'o_2401',
    user: 'u_jane',
    orderItems: [
      { name: 'Everyday Runner Sneaker', qty: 1, image: u('photo-1542291026-7eec264c27ff', 200), price: 89, product: 'p_1' },
      { name: 'Reusable Water Bottle', qty: 1, image: u('photo-1602143407151-7111542de6e8', 200), price: 32, product: 'p_10' },
    ],
    shippingAddress: { address: '742 Evergreen Terrace', city: 'Brooklyn', postalCode: '11201', country: 'USA' },
    paymentMethod: 'PayPal',
    itemsPrice: 121, taxPrice: 18.15, shippingPrice: 0, discountPrice: 12.10,
    totalPrice: 127.05,
    coupon: { code: 'WELCOME10', type: 'percentage', value: 10, discount: 12.10 },
    isPaid: true, paidAt: daysAgo(2),
    isDelivered: false,
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
  },
  {
    _id: 'o_2402',
    user: 'u_jane',
    orderItems: [
      { name: 'Studio Wireless Headphones', qty: 1, image: u('photo-1505740420928-5e560c06d30e', 200), price: 129, product: 'p_2' },
    ],
    shippingAddress: { address: '742 Evergreen Terrace', city: 'Brooklyn', postalCode: '11201', country: 'USA' },
    paymentMethod: 'Stripe',
    itemsPrice: 129, taxPrice: 19.35, shippingPrice: 0, discountPrice: 0,
    totalPrice: 148.35,
    isPaid: true, paidAt: daysAgo(7),
    isDelivered: true, deliveredAt: daysAgo(5),
    createdAt: daysAgo(7), updatedAt: daysAgo(5),
  },
  {
    _id: 'o_2403',
    user: 'u_jane',
    orderItems: [
      { name: 'Ceramic Pour-Over Kit', qty: 1, image: u('photo-1495474472287-4d71bcdd2085', 200), price: 58, product: 'p_5' },
    ],
    shippingAddress: { address: '742 Evergreen Terrace', city: 'Brooklyn', postalCode: '11201', country: 'USA' },
    paymentMethod: 'CashOnDelivery',
    itemsPrice: 58, taxPrice: 8.7, shippingPrice: 10, discountPrice: 0,
    totalPrice: 76.7,
    isPaid: false, isDelivered: false,
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
  },
  {
    _id: 'o_2404',
    user: 'u_jack',
    orderItems: [
      { name: 'Walnut Desk Lamp', qty: 1, image: u('photo-1507473885765-e6ed057f782c', 200), price: 124, product: 'p_7' },
      { name: 'Leather-bound Journal', qty: 1, image: u('photo-1531346878377-a5be20888e57', 200), price: 48, product: 'p_12' },
    ],
    shippingAddress: { address: '12 Magnolia Ave', city: 'Portland', postalCode: '97201', country: 'USA' },
    paymentMethod: 'PayPal',
    itemsPrice: 172, taxPrice: 25.8, shippingPrice: 0, discountPrice: 0,
    totalPrice: 197.8,
    isPaid: true, paidAt: daysAgo(10),
    isDelivered: true, deliveredAt: daysAgo(8),
    createdAt: daysAgo(10), updatedAt: daysAgo(8),
  },
  {
    _id: 'o_2405',
    user: 'u_admin',
    orderItems: [
      { name: 'Linen Throw Blanket', qty: 2, image: u('photo-1584100936595-c06587b119a3', 200), price: 89, product: 'p_6' },
    ],
    shippingAddress: { address: '1 Hilltop Way', city: 'Seattle', postalCode: '98101', country: 'USA' },
    paymentMethod: 'PayPal',
    itemsPrice: 178, taxPrice: 26.7, shippingPrice: 0, discountPrice: 0,
    totalPrice: 204.7,
    isPaid: true, paidAt: daysAgo(15),
    isDelivered: false,
    createdAt: daysAgo(15), updatedAt: daysAgo(15),
  },
  {
    _id: 'o_2406',
    user: 'u_jack',
    orderItems: [
      { name: 'The Pragmatic Programmer', qty: 1, image: u('photo-1544947950-fa07a98d237f', 200), price: 39, product: 'p_11' },
      { name: 'Field Notebook Set (3-pack)', qty: 1, image: u('photo-1531346878377-a5be20888e57', 200), price: 28, product: 'p_9' },
    ],
    shippingAddress: { address: '12 Magnolia Ave', city: 'Portland', postalCode: '97201', country: 'USA' },
    paymentMethod: 'Stripe',
    itemsPrice: 67, taxPrice: 10.05, shippingPrice: 0, discountPrice: 20,
    totalPrice: 57.05,
    coupon: { code: 'SAVE20', type: 'fixed', value: 20, discount: 20 },
    isPaid: true, paidAt: daysAgo(3),
    isDelivered: true, deliveredAt: daysAgo(1),
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
  {
    _id: 'o_2407',
    user: 'u_jane',
    orderItems: [
      { name: 'Minimal Everyday Watch', qty: 1, image: u('photo-1523275335684-37898b6baf30', 200), price: 74, product: 'p_3' },
      { name: 'Leather Card Wallet', qty: 1, image: u('photo-1627123424571-abae0f3b8ec6', 200), price: 38, product: 'p_8' },
    ],
    shippingAddress: { address: '742 Evergreen Terrace', city: 'Brooklyn', postalCode: '11201', country: 'USA' },
    paymentMethod: 'PayPal',
    itemsPrice: 112, taxPrice: 16.8, shippingPrice: 0, discountPrice: 0,
    totalPrice: 128.8,
    isPaid: true, paidAt: daysAgo(20),
    isDelivered: true, deliveredAt: daysAgo(18),
    createdAt: daysAgo(20), updatedAt: daysAgo(18),
  },
];

// =================== WISHLIST ===================
export const mockWishlist: string[] = ['p_2', 'p_7']; // Jane has these

// =================== CATEGORIES ===================
// Mirrors backend Category collection. Used by the storefront
// CategoryGrid and the admin Categories page.
import type { Category } from '../features/categories/types';
import type { Brand } from '../features/brands/types';
import type { Address } from '../features/addresses/types';

export const mockCategories: Category[] = [
  {
    _id: 'c_footwear', name: 'Footwear', slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    description: 'Sneakers, boots, and everyday shoes.',
    displayOrder: 1, isActive: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    _id: 'c_tech', name: 'Tech', slug: 'tech',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Audio, wearables, smart home.',
    displayOrder: 2, isActive: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    _id: 'c_accessories', name: 'Accessories', slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: 'Watches, bags, small carry.',
    displayOrder: 3, isActive: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    _id: 'c_lifestyle', name: 'Lifestyle', slug: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    description: 'Home, kitchen, and everyday carry.',
    displayOrder: 4, isActive: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z',
  },
];

// =================== BRANDS ===================
export const mockBrands: Brand[] = [
  { _id: 'b_common_ground', name: 'Common Ground', slug: 'common-ground',
    description: 'Honest basics for everyday wear.', isActive: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { _id: 'b_sonus', name: 'Sonus', slug: 'sonus',
    description: 'Sound, considered.', isActive: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { _id: 'b_north', name: 'North', slug: 'north',
    description: 'Watches and small leather goods.', isActive: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
  { _id: 'b_field', name: 'Field', slug: 'field',
    description: 'Home and carry essentials.', isActive: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z' },
];

// =================== ADDRESSES ===================
export const mockAddresses: Address[] = [
  {
    _id: 'a_jane_home', user: 'u_jane', label: 'Home', fullName: 'Jane Meyer',
    phone: '+1 555 010 0003', address: '88 Mission Street', city: 'San Francisco',
    postalCode: '94105', country: 'US', isDefault: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    _id: 'a_jane_office', user: 'u_jane', label: 'Office', fullName: 'Jane Meyer',
    phone: '+1 555 010 0003', address: '500 Howard Street', city: 'San Francisco',
    postalCode: '94105', country: 'US', isDefault: false,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    _id: 'a_admin_home', user: 'u_admin', label: 'Home', fullName: 'Avery Stone',
    phone: '+1 555 010 0001', address: '742 Evergreen Terrace', city: 'Springfield',
    postalCode: '49007', country: 'US', isDefault: true,
    createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-01T00:00:00Z',
  },
];
