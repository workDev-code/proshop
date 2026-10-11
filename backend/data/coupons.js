// Sample coupons for seeder
// Dates use a window around the seed execution time so they are usable.
const now = new Date();
const inOneMonth = new Date(now);
inOneMonth.setMonth(now.getMonth() + 1);
const oneYearAgo = new Date(now);
oneYearAgo.setFullYear(now.getFullYear() - 1);

const coupons = [
  {
    code: 'WELCOME10',
    description: '10% off for first-time customers',
    type: 'percentage',
    value: 10,
    minOrderAmount: 50,
    maxDiscount: 50,
    perUserLimit: 1,
    usageLimit: 1000,
    startDate: null,
    expiresAt: inOneMonth,
    isActive: true,
  },
  {
    code: 'SAVE20',
    description: '20% off when you spend $200 or more',
    type: 'percentage',
    value: 20,
    minOrderAmount: 200,
    maxDiscount: 100,
    perUserLimit: 2,
    usageLimit: 500,
    startDate: null,
    expiresAt: inOneMonth,
    isActive: true,
  },
  {
    code: 'FLAT15',
    description: '$15 off any order',
    type: 'fixed',
    value: 15,
    minOrderAmount: 30,
    perUserLimit: 1,
    usageLimit: 200,
    startDate: null,
    expiresAt: inOneMonth,
    isActive: true,
  },
  {
    code: 'EXPIRED50',
    description: 'Old expired coupon for testing',
    type: 'percentage',
    value: 50,
    minOrderAmount: 0,
    perUserLimit: 10,
    usageLimit: 100,
    startDate: null,
    expiresAt: oneYearAgo, // in the past
    isActive: true,
  },
];

export default coupons;
