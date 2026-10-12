/**
 * Mock RTK Query baseQuery for demo mode (VITE_DEMO_MODE=true).
 *
 * Handles every endpoint the app uses by URL pattern matching.
 * Persists in-memory state (orders, users) across calls during the session.
 * Supports file:// protocol — no fetch() calls to any server.
 */

import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import {
  mockProducts,
  mockUsers,
  mockOrders,
  mockCoupons,
  mockWishlist,
  mockCategories,
  mockBrands,
  mockAddresses,
  MOCK_PASSWORD,
} from './mockData';

// In-memory mutable state (lives for the page session)
const state = {
  products: [...mockProducts],
  users: [...mockUsers],
  orders: [...mockOrders],
  coupons: [...mockCoupons],
  wishlist: [...mockWishlist],
  categories: [...mockCategories],
  brands: [...mockBrands],
  addresses: [...mockAddresses],
  /** order counter for analytic lookups (ms-precision id) */
  orderSeq: 0,
  /** Currently logged in user id (set after login mutation) */
  currentUserId: null as string | null,
  /** Current "JWT cookie" (mock token, just a string) */
  token: null as string | null,
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ApiResponse<T> = { data: T } | { error: { status: number; data: { message: string } } };

const ok = <T>(data: T): ApiResponse<T> => ({ data });
const err = (status: number, message: string): ApiResponse<never> => ({
  error: { status, data: { message } },
});

// =================== Helpers ===================
const calcPrices = (items: { price: number; qty: number }[], discount: number) => {
  const itemsPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discounted = Math.max(0, itemsPrice - discount);
  const taxPrice = Math.round(discounted * 0.15 * 100) / 100;
  const shippingPrice = discounted > 100 || discounted === 0 ? 0 : 10;
  const totalPrice = Math.round((discounted + taxPrice + shippingPrice) * 100) / 100;
  return {
    itemsPrice: Math.round(itemsPrice * 100) / 100,
    discountPrice: discount,
    taxPrice,
    shippingPrice,
    totalPrice,
  };
};

const matchUrl = (url: string, pattern: RegExp) => {
  const m = url.match(pattern);
  return m ? m : null;
};

const getCurrentUser = () => {
  if (!state.currentUserId) return null;
  return state.users.find((u) => u._id === state.currentUserId) ?? null;
};

// =================== Public mock baseQuery ===================
export const mockBaseQuery: BaseQueryFn = async (args) => {
  await wait(120); // simulate network latency for nicer UX

  // RTK Query: if a query function returns a string, that string is the URL.
  // If it returns an object, that object has { url, method, body, params }.
  // Normalize both shapes.
  const normalizedArgs = typeof args === 'string' ? { url: args } : args;
  const { url, method = 'GET', body, params } = normalizedArgs as {
    url: string;
    method?: string;
    body?: unknown;
    params?: Record<string, unknown>;
  };

  // Build a URLSearchParams-like helper from the params object (RTK Query separates query string from URL)
  const qs = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
    }
  }

  // ===== AUTH =====
  if (url === '/api/users/auth' && method === 'POST') {
    const { email, password } = (body as { email: string; password: string }) ?? {};
    const user = state.users.find((u) => u.email === email);
    if (!user || password !== MOCK_PASSWORD) {
      return err(401, 'Invalid email or password');
    }
    state.currentUserId = user._id;
    state.token = `mock-token-${user._id}-${Date.now()}`;
    return ok({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }

  if (url === '/api/users' && method === 'POST') {
    const { name, email, password } = (body as { name: string; email: string; password: string }) ?? {};
    if (!name || !email || !password) return err(400, 'Name, email, and password are required');
    if (state.users.some((u) => u.email === email)) return err(400, 'User already exists');
    const newUser = {
      _id: `u_${Date.now()}`,
      name,
      email,
      isAdmin: false,
    };
    state.users.push(newUser);
    state.currentUserId = newUser._id;
    state.token = `mock-token-${newUser._id}-${Date.now()}`;
    return ok(newUser);
  }

  if (url === '/api/users/logout' && method === 'POST') {
    state.currentUserId = null;
    state.token = null;
    return ok({ message: 'Logged out successfully' });
  }

  if (url === '/api/users/profile' && method === 'GET') {
    const u = getCurrentUser();
    if (!u) return err(401, 'Not authorized, no token');
    return ok({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin });
  }

  if (url === '/api/users/profile' && method === 'PUT') {
    const u = getCurrentUser();
    if (!u) return err(401, 'Not authorized, no token');
    const patch = (body as Partial<typeof u>) ?? {};
    Object.assign(u, patch);
    return ok({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin });
  }

  // ===== PRODUCTS =====
  if (url === '/api/products' && method === 'GET') {
    const keyword = qs.get('keyword')?.toLowerCase() ?? '';
    const category = qs.get('category') ?? '';
    const brand = qs.get('brand') ?? '';
    const minPrice = Number(qs.get('priceMin') ?? 0);
    const maxPrice = Number(qs.get('priceMax') ?? Infinity);
    const minRating = Number(qs.get('minRating') ?? 0);
    const inStock = qs.get('inStock') === 'true';
    const sort = qs.get('sort') ?? 'newest';
    const pageNumber = Number(qs.get('pageNumber') ?? 1);
    const pageSize = Number(qs.get('pageSize') ?? 12);

    let filtered = state.products.filter((p) => {
      if (keyword && !p.name.toLowerCase().includes(keyword)) return false;
      if (category && p.category !== category) return false;
      if (brand && p.brand !== brand) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (inStock && p.countInStock === 0) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sort) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'top_sellers': return b.rating * b.numReviews - a.rating * a.numReviews;
        case 'name': return a.name.localeCompare(b.name);
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const total = filtered.length;
    const start = (pageNumber - 1) * pageSize;
    const products = filtered.slice(start, start + pageSize);

    const allCategories = [...new Set(state.products.map((p) => p.category))].sort();
    const allBrands = [...new Set(state.products.map((p) => p.brand))].sort();

    return ok({
      products,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      total,
      facets: { categories: allCategories, brands: allBrands },
      appliedFilters: {
        keyword: qs.get('keyword') ?? '',
        category: qs.get('category') ?? '',
        brand: qs.get('brand') ?? '',
        priceMin: qs.get('priceMin') ?? '',
        priceMax: qs.get('priceMax') ?? '',
        minRating: qs.get('minRating') ?? '',
        inStock: qs.get('inStock') ?? '',
        sort: qs.get('sort') ?? 'newest',
      },
    });
  }

  if (url === '/api/products/top' && method === 'GET') {
    const top = [...state.products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    return ok(top);
  }

  if (url === '/api/products' && method === 'POST') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const data = body as any;
    const newProduct = {
      ...data,
      _id: `p_${Date.now()}`,
      rating: 0,
      numReviews: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.products.push(newProduct);
    return ok(newProduct);
  }

  // /api/products/:id
  const productMatch = matchUrl(url, /^\/api\/products\/([a-zA-Z0-9_]+)$/);
  if (productMatch && method === 'GET') {
    const id = productMatch[1];
    const product = state.products.find((p) => p._id === id);
    if (!product) return err(404, 'Product not found');
    return ok(product);
  }
  if (productMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = productMatch[1];
    const product = state.products.find((p) => p._id === id);
    if (!product) return err(404, 'Product not found');
    Object.assign(product, body);
    product.updatedAt = new Date().toISOString();
    return ok(product);
  }
  if (productMatch && method === 'DELETE') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = productMatch[1];
    state.products = state.products.filter((p) => p._id !== id);
    return ok({ message: 'Product removed' });
  }

  // /api/products/:id/reviews
  const reviewMatch = matchUrl(url, /^\/api\/products\/([a-zA-Z0-9_]+)\/reviews$/);
  if (reviewMatch && method === 'POST') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const id = reviewMatch[1];
    const product = state.products.find((p) => p._id === id);
    if (!product) return err(404, 'Product not found');
    if (product.reviews.some((r) => r.user === me._id)) {
      return err(400, 'Product already reviewed');
    }
    const { rating, comment } = body as { rating: number; comment: string };
    const newReview = {
      _id: `r_${Date.now()}`,
      name: me.name,
      rating: Number(rating),
      comment,
      user: me._id,
      createdAt: new Date().toISOString(),
    };
    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating =
      Math.round(
        (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length) * 10,
      ) / 10;
    return ok({ message: 'Review added' });
  }

  // ===== ORDERS =====
  if (url === '/api/orders' && method === 'POST') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const data = body as {
      orderItems: { _id: string; qty: number; price: number; name: string; image: string; brand: string; countInStock: number }[];
      shippingAddress: any;
      paymentMethod: string;
      couponCode?: string;
    };
    if (!data.orderItems || data.orderItems.length === 0) {
      return err(400, 'No order items');
    }

    // Use server-side prices (from mockProducts)
    const items = data.orderItems.map((oi) => {
      const product = state.products.find((p) => p._id === oi._id);
      return {
        product: oi._id,
        name: oi.name,
        qty: oi.qty,
        image: oi.image,
        price: product?.price ?? oi.price,
      };
    });

    // Apply coupon
    let discount = 0;
    let couponSnapshot: any = null;
    if (data.couponCode) {
      const coupon = state.coupons.find((c) => c.code === data.couponCode);
      const itemsSubtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      if (!coupon) return err(404, 'Coupon not found');
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return err(400, 'Coupon is expired');
      }
      if (itemsSubtotal < (coupon.minOrderAmount ?? 0)) {
        return err(400, `Order must be at least $${coupon.minOrderAmount}`);
      }
      discount = coupon.type === 'percentage'
        ? (itemsSubtotal * coupon.value) / 100
        : coupon.value;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      if (discount > itemsSubtotal) discount = itemsSubtotal;
      discount = Math.round(discount * 100) / 100;
      couponSnapshot = { code: coupon.code, type: coupon.type, value: coupon.value, discount };
      coupon.usageCount += 1;
    }

    const prices = calcPrices(items, discount);
    const newOrder = {
      _id: `o_${Date.now()}`,
      user: me._id,
      orderItems: items,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod as any,
      ...prices,
      coupon: couponSnapshot,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.orders.unshift(newOrder);

    // Decrement stock
    items.forEach((i) => {
      const p = state.products.find((p) => p._id === i.product);
      if (p) p.countInStock = Math.max(0, p.countInStock - i.qty);
    });

    return ok(newOrder);
  }

  if (url === '/api/orders' && method === 'GET') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    return ok(state.orders);
  }

  if (url === '/api/orders/mine' && method === 'GET') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    return ok(state.orders.filter((o) => {
      const uid = typeof o.user === 'object' ? o.user._id : o.user;
      return uid === me._id;
    }));
  }

  const orderMatch = matchUrl(url, /^\/api\/orders\/([a-zA-Z0-9_]+)$/);
  if (orderMatch && method === 'GET') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const id = orderMatch[1];
    const order = state.orders.find((o) => o._id === id);
    if (!order) return err(404, 'Order not found');
    // Populate user if it's just an id
    if (typeof order.user === 'string') {
      const u = state.users.find((u) => u._id === order.user);
      if (u) {
        return ok({ ...order, user: { _id: u._id, name: u.name, email: u.email } });
      }
    }
    return ok(order);
  }

  const deliverMatch = matchUrl(url, /^\/api\/orders\/([a-zA-Z0-9_]+)\/deliver$/);
  if (deliverMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = deliverMatch[1];
    const order = state.orders.find((o) => o._id === id);
    if (!order) return err(404, 'Order not found');
    order.isDelivered = true;
    order.deliveredAt = new Date().toISOString();
    return ok({ message: 'Order marked as delivered' });
  }

  const payMatch = matchUrl(url, /^\/api\/orders\/([a-zA-Z0-9_]+)\/pay$/);
  if (payMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const id = payMatch[1];
    const order = state.orders.find((o) => o._id === id);
    if (!order) return err(404, 'Order not found');
    // In demo mode, just mark as paid
    order.isPaid = true;
    order.paidAt = new Date().toISOString();
    return ok({ message: 'Order marked as paid (demo)' });
  }

  // ===== COUPONS =====
  if (url === '/api/coupons/validate' && method === 'POST') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const { code, subtotal } = (body as { code: string; subtotal: number }) ?? {};
    const coupon = state.coupons.find((c) => c.code === code?.toUpperCase().trim());
    if (!coupon) return err(404, 'Coupon not found');
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return err(400, 'Coupon is expired');
    }
    if (subtotal < (coupon.minOrderAmount ?? 0)) {
      return err(400, `Order must be at least $${coupon.minOrderAmount} to use this coupon`);
    }
    let discount = coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    if (discount > subtotal) discount = subtotal;
    discount = Math.round(discount * 100) / 100;
    return ok({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      discount,
      finalSubtotal: Math.round((subtotal - discount) * 100) / 100,
    });
  }

  if (url === '/api/coupons' && method === 'GET') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    return ok(state.coupons);
  }
  if (url === '/api/coupons' && method === 'POST') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const data = body as any;
    const newCoupon = {
      ...data,
      _id: `c_${Date.now()}`,
      code: data.code.toUpperCase(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.coupons.push(newCoupon);
    return ok(newCoupon);
  }

  const couponMatch = matchUrl(url, /^\/api\/coupons\/([a-zA-Z0-9_]+)$/);
  if (couponMatch && method === 'GET') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = couponMatch[1];
    const coupon = state.coupons.find((c) => c._id === id);
    if (!coupon) return err(404, 'Coupon not found');
    return ok(coupon);
  }
  if (couponMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = couponMatch[1];
    const coupon = state.coupons.find((c) => c._id === id);
    if (!coupon) return err(404, 'Coupon not found');
    Object.assign(coupon, body);
    coupon.updatedAt = new Date().toISOString();
    return ok(coupon);
  }
  if (couponMatch && method === 'DELETE') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = couponMatch[1];
    state.coupons = state.coupons.filter((c) => c._id !== id);
    return ok({ message: 'Coupon removed' });
  }

  // ===== USERS =====
  if (url === '/api/users' && method === 'GET') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    return ok(state.users);
  }

  const userMatch = matchUrl(url, /^\/api\/users\/([a-zA-Z0-9_]+)$/);
  if (userMatch && method === 'GET') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = userMatch[1];
    const user = state.users.find((u) => u._id === id);
    if (!user) return err(404, 'User not found');
    return ok(user);
  }
  if (userMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = userMatch[1];
    const user = state.users.find((u) => u._id === id);
    if (!user) return err(404, 'User not found');
    Object.assign(user, body);
    return ok({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  }
  if (userMatch && method === 'DELETE') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = userMatch[1];
    state.users = state.users.filter((u) => u._id !== id);
    return ok({ message: 'User removed' });
  }

  // ===== WISHLIST =====
  if (url === '/api/users/wishlist' && method === 'GET') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    return ok(state.products.filter((p) => state.wishlist.includes(p._id)));
  }
  if (url === '/api/users/wishlist' && method === 'DELETE') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    state.wishlist = [];
    return ok([]);
  }

  const wishlistAddMatch = matchUrl(url, /^\/api\/users\/wishlist\/([a-zA-Z0-9_]+)$/);
  if (wishlistAddMatch && method === 'POST') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const productId = wishlistAddMatch[1];
    if (state.wishlist.includes(productId)) {
      return err(400, 'Product already in wishlist');
    }
    state.wishlist.push(productId);
    return ok(state.products.filter((p) => state.wishlist.includes(p._id)));
  }
  if (wishlistAddMatch && method === 'DELETE') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const productId = wishlistAddMatch[1];
    state.wishlist = state.wishlist.filter((id) => id !== productId);
    return ok(state.products.filter((p) => state.wishlist.includes(p._id)));
  }

  // ===== UPLOAD =====
  if (url === '/api/upload' && method === 'POST') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    // In demo mode, return a placeholder image
    return ok({ message: 'Image uploaded successfully (demo)', image: '/images/sample.jpg' });
  }


  // ===== CATEGORIES =====
  if (url === '/api/categories' && method === 'GET') {
    return ok(state.categories.filter(c => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder));
  }
  if (url === '/api/categories' && method === 'POST') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const data = body as any;
    const newCat = {
      _id: `cat_${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\W+/g, '-'),
      image: data.image,
      description: data.description || '',
      displayOrder: data.displayOrder ?? 99,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.categories.push(newCat);
    return ok(newCat);
  }
  const catMatch = matchUrl(url, /^\/api\/categories\/([a-zA-Z0-9_]+)$/);
  if (catMatch && method === 'GET') {
    const c = state.categories.find(c => c._id === catMatch[1]);
    if (!c) return err(404, 'Category not found');
    return ok(c);
  }
  if (catMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const c = state.categories.find(c => c._id === catMatch[1]);
    if (!c) return err(404, 'Category not found');
    Object.assign(c, body);
    c.updatedAt = new Date().toISOString();
    return ok(c);
  }
  if (catMatch && method === 'DELETE') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    state.categories = state.categories.filter(c => c._id !== catMatch[1]);
    return ok({ message: 'Category removed' });
  }

  // ===== BRANDS =====
  if (url === '/api/brands' && method === 'GET') {
    return ok(state.brands.filter(b => b.isActive).sort((a, b) => a.name.localeCompare(b.name)));
  }
  if (url === '/api/brands' && method === 'POST') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const data = body as any;
    const newBrand = {
      _id: `b_${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\W+/g, '-'),
      logo: data.logo || '',
      description: data.description || '',
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.brands.push(newBrand);
    return ok(newBrand);
  }
  const brandMatch = matchUrl(url, /^\/api\/brands\/([a-zA-Z0-9_]+)$/);
  if (brandMatch && method === 'GET') {
    const b = state.brands.find(x => x._id === brandMatch[1]);
    if (!b) return err(404, 'Brand not found');
    return ok(b);
  }
  if (brandMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const b = state.brands.find(x => x._id === brandMatch[1]);
    if (!b) return err(404, 'Brand not found');
    Object.assign(b, body);
    b.updatedAt = new Date().toISOString();
    return ok(b);
  }
  if (brandMatch && method === 'DELETE') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    state.brands = state.brands.filter(b => b._id !== brandMatch[1]);
    return ok({ message: 'Brand removed' });
  }

  // ===== ADDRESSES =====
  if (url === '/api/addresses' && method === 'GET') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    return ok(state.addresses.filter(a => a.user === me._id));
  }
  if (url === '/api/addresses' && method === 'POST') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const data = body as any;
    if (data.isDefault) {
      // Clear other defaults
      state.addresses.forEach(a => {
        if (a.user === me._id) a.isDefault = false;
      });
    }
    const newAddr = {
      _id: `a_${Date.now()}`,
      user: me._id,
      label: data.label || 'Home',
      fullName: data.fullName,
      phone: data.phone || '',
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country || 'US',
      isDefault: !!data.isDefault,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.addresses.push(newAddr);
    return ok(newAddr);
  }
  const addrMatch = matchUrl(url, /^\/api\/addresses\/([a-zA-Z0-9_]+)$/);
  if (addrMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const a = state.addresses.find(x => x._id === addrMatch[1] && x.user === me._id);
    if (!a) return err(404, 'Address not found');
    if ((body as any).isDefault) {
      state.addresses.forEach(x => {
        if (x.user === me._id && x._id !== a._id) x.isDefault = false;
      });
    }
    Object.assign(a, body);
    a.updatedAt = new Date().toISOString();
    return ok(a);
  }
  if (addrMatch && method === 'DELETE') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    state.addresses = state.addresses.filter(x => !(x._id === addrMatch[1] && x.user === me._id));
    return ok({ message: 'Address removed' });
  }

  // ===== ANALYTICS =====
  if (url.startsWith('/api/analytics/overview') && method === 'GET') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const recent = state.orders;
    const allPaid = recent.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered');
    const revenue = allPaid.reduce((s, o) => s + o.totalPrice, 0);
    const paidOrdersCount = allPaid.length;
    const aov = paidOrdersCount > 0 ? revenue / paidOrdersCount : 0;
    const statusMap: Record<string, number> = {};
    recent.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
    const paidUsers = new Set(allPaid.map(o => typeof o.user === 'object' ? o.user._id : o.user));
    const lowStock = state.products.filter(p => p.countInStock > 0 && p.countInStock <= 5).length;
    const outOfStock = state.products.filter(p => p.countInStock === 0).length;
    return ok({
      rangeDays: 30,
      revenue: Math.round(revenue * 100) / 100,
      aov: Math.round(aov * 100) / 100,
      ordersCount: recent.length,
      paidOrdersCount,
      newCustomers: state.users.length,
      totalCustomers: state.users.length,
      repeatCustomers: 0,
      paidCustomerRate: state.users.length > 0 ? Math.round((paidUsers.size / state.users.length) * 1000) / 10 : 0,
      products: { total: state.products.length, lowStock, outOfStock },
      ordersByStatus: {
        pending: statusMap.pending || 0,
        paid: statusMap.paid || 0,
        shipped: statusMap.shipped || 0,
        delivered: statusMap.delivered || 0,
        cancelled: statusMap.cancelled || 0,
      },
      unavailable: {
        conversionRate: null,
        sessions: null,
        refundRate: null,
        salesByChannel: null,
      },
    });
  }
  if (url.startsWith('/api/analytics/top-products') && method === 'GET') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const units = new Map<string, { units: number; revenue: number; orders: number }>();
    state.orders
      .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
      .forEach(o => {
        o.orderItems.forEach((i: any) => {
          const k = i.product;
          const cur = units.get(k) || { units: 0, revenue: 0, orders: 0 };
          cur.units += i.qty;
          cur.revenue += i.price * i.qty;
          cur.orders += 1;
          units.set(k, cur);
        });
      });
    const out = [...units.entries()]
      .map(([productId, v]) => {
        const p = state.products.find(pp => pp._id === productId);
        return p ? {
          productId, name: p.name, image: p.image, category: p.category,
          unitsSold: v.units, revenue: Math.round(v.revenue * 100) / 100, ordersCount: v.orders,
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b as any).revenue - (a as any).revenue);
    return ok(out);
  }
  if (url.startsWith('/api/analytics/revenue-by-month') && method === 'GET') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const monthMap = new Map<string, { revenue: number; orders: number }>();
    state.orders
      .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
      .forEach(o => {
        const d = new Date(o.createdAt);
        const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
        const cur = monthMap.get(k) || { revenue: 0, orders: 0 };
        cur.revenue += o.totalPrice;
        cur.orders += 1;
        monthMap.set(k, cur);
      });
    return ok([...monthMap.entries()].map(([k, v]) => {
      const [y, m] = k.split('-').map(Number);
      return { year: y, month: m, revenue: Math.round(v.revenue * 100) / 100, orders: v.orders };
    }).sort((a, b) => a.year - b.year || a.month - b.month));
  }

  // ===== ORDER STATUS TRANSITIONS =====
  const shipMatch = matchUrl(url, /^\/api\/orders\/([a-zA-Z0-9_]+)\/ship$/);
  if (shipMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me?.isAdmin) return err(401, 'Not authorized as an admin');
    const id = shipMatch[1];
    const order = state.orders.find(o => o._id === id);
    if (!order) return err(404, 'Order not found');
    if (order.status === 'cancelled') return err(400, 'Cannot ship a cancelled order');
    if (order.status === 'delivered') return err(400, 'Order is already delivered');
    const data = (body as any) || {};
    order.status = 'shipped';
    order.trackingNumber = data.trackingNumber || '';
    order.carrier = data.carrier || '';
    order.shippedAt = new Date().toISOString();
    return ok(order);
  }
  const cancelMatch = matchUrl(url, /^\/api\/orders\/([a-zA-Z0-9_]+)\/cancel$/);
  if (cancelMatch && method === 'PUT') {
    const me = getCurrentUser();
    if (!me) return err(401, 'Not authorized, no token');
    const id = cancelMatch[1];
    const order = state.orders.find(o => o._id === id);
    if (!order) return err(404, 'Order not found');
    if (order.status === 'delivered') return err(400, 'Cannot cancel a delivered order');
    if (order.status === 'cancelled') return err(400, 'Order is already cancelled');
    if (!me.isAdmin && order.user !== me._id) return err(403, 'Not authorized to cancel this order');
    const data = (body as any) || {};
    order.status = 'cancelled';
    order.cancelledAt = new Date().toISOString();
    order.cancelReason = data.reason || 'Cancelled by user';
    return ok(order);
  }

  // ===== Fallback =====
  return err(404, `Mock route not implemented: ${method} ${url}`);
};
