import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

/**
 * Returns real KPI numbers that the admin dashboard can render.
 *
 * NOTE: the original prototype asked for "conversion rate", "sessions",
 * "refund rate" etc. — those require session tracking infrastructure
 * we don't have. This endpoint returns what's actually derivable from
 * the orders + users + products collections.
 */
const getOverview = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - Number(days));

  const recent = await Order.find({ createdAt: { $gte: since } });
  const allPaid = recent.filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered');

  const revenue = allPaid.reduce((sum, o) => sum + o.totalPrice, 0);
  const ordersCount = recent.length;
  const paidOrdersCount = allPaid.length;
  const aov = paidOrdersCount > 0 ? revenue / paidOrdersCount : 0;

  const [
    newCustomers,
    totalCustomers,
    paidUsers,
    totalProducts,
    lowStockCount,
    outOfStockCount,
    statusBreakdown,
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: since } }),
    User.countDocuments({}),
    Order.distinct('user', { status: { $in: ['paid', 'shipped', 'delivered'] } }),
    Product.countDocuments({ isActive: { $ne: false } }),
    Product.countDocuments({ countInStock: { $gt: 0, $lte: 5 } }),
    Product.countDocuments({ countInStock: 0 }),
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const statusMap = Object.fromEntries(
    statusBreakdown.map((s) => [s._id, s.count])
  );

  res.json({
    rangeDays: Number(days),
    revenue: Math.round(revenue * 100) / 100,
    aov: Math.round(aov * 100) / 100,
    ordersCount,
    paidOrdersCount,
    newCustomers,
    totalCustomers,
    repeatCustomers: Math.max(0, totalCustomers - newCustomers),
    // "Conversion rate" is unavailable without session tracking.
    // We expose `paidCustomerRate` as the closest honest equivalent:
    //   % of total customers who have placed at least one paid order.
    paidCustomerRate:
      totalCustomers > 0 ? Math.round((paidUsers.length / totalCustomers) * 1000) / 10 : 0,
    products: {
      total: totalProducts,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
    },
    ordersByStatus: {
      pending: statusMap.pending || 0,
      paid: statusMap.paid || 0,
      shipped: statusMap.shipped || 0,
      delivered: statusMap.delivered || 0,
      cancelled: statusMap.cancelled || 0,
    },
    // Honest placeholder for unimplemented metrics.
    unavailable: {
      conversionRate: null,
      sessions: null,
      refundRate: null,
      salesByChannel: null,
    },
  });
});

/**
 * Top products by **units sold** (sum of orderItems.qty for each product).
 * Joins orders → orderItems → product.
 */
const getTopProducts = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  const result = await Order.aggregate([
    { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        unitsSold: { $sum: '$orderItems.qty' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
        ordersCount: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        name: '$product.name',
        image: '$product.image',
        category: '$product.category',
        unitsSold: 1,
        revenue: { $round: ['$revenue', 2] },
        ordersCount: 1,
      },
    },
  ]);

  res.json(result);
});

/**
 * Monthly revenue series for the admin bar chart.
 * Returns the last 12 months (oldest first) so the frontend can
 * render a 7- or 12-bar series without further processing.
 */
const getRevenueByMonth = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const since = new Date();
  since.setMonth(since.getMonth() - Number(months) + 1);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const series = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        status: { $in: ['paid', 'shipped', 'delivered'] },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        revenue: { $round: ['$revenue', 2] },
        orders: 1,
      },
    },
  ]);

  res.json(series);
});

export { getOverview, getTopProducts, getRevenueByMonth };
