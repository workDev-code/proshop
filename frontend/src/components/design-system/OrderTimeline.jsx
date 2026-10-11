import { CodeBlock } from './CodeBlock';

const STEPS = [
  { key: 'pending',   label: 'Pending',   desc: 'Order placed, awaiting payment' },
  { key: 'paid',      label: 'Paid',      desc: 'PayPal / card confirmed' },
  { key: 'shipped',   label: 'Shipped',   desc: 'Carrier picked up the package' },
  { key: 'delivered', label: 'Delivered', desc: 'Customer received' },
];

const OrderTimeline = () => {
  const current = 2; // simulating "shipped" state

  return (
    <>
      <h5>Order status — 4 step pipeline</h5>

      <div className='mb-4'>
        <div className='d-flex justify-content-between align-items-center mb-2'>
          {STEPS.map((s, i) => {
            const reached = i <= current;
            const isCurrent = i === current;
            return (
              <div
                key={s.key}
                className='text-center flex-fill'
                style={{ minWidth: 0 }}
              >
                <div
                  className={`mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle ${
                    reached ? 'bg-success' : 'bg-light border'
                  } ${isCurrent ? 'shadow' : ''}`}
                  style={{
                    width: 36,
                    height: 36,
                    color: reached ? 'white' : '#999',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}
                >
                  {reached ? '✓' : i + 1}
                </div>
                <div className='small fw-bold'>{s.label}</div>
                <div
                  className='small text-muted d-none d-md-block'
                  style={{ fontSize: 11 }}
                >
                  {s.desc}
                </div>
              </div>
            );
          })}
        </div>
        {/* Bars between */}
        <div className='d-flex' style={{ marginTop: -52 }}>
          {STEPS.slice(0, -1).map((_, i) => (
            <div key={i} className='flex-fill' style={{ marginLeft: '12.5%', marginRight: '12.5%' }}>
              <div
                style={{
                  height: 4,
                  background: i < current ? '#198754' : '#e9ecef',
                  borderRadius: 2,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <h5>Multiple states</h5>

      {[0, 1, 2, 3].map((idx) => (
        <div
          key={idx}
          className='mb-3 p-3 border rounded d-flex justify-content-between align-items-center'
        >
          <div>
            <strong>Order #{(1024 + idx).toString()}</strong>
            <span className='text-muted ms-2'>
              {STEPS[idx].label}
            </span>
          </div>
          <OrderPill state={STEPS[idx].key} />
        </div>
      ))}

      <h5 className='mt-4'>Pills</h5>
      <div className='d-flex gap-2 mb-3 flex-wrap'>
        <OrderPill state='pending' />
        <OrderPill state='paid' />
        <OrderPill state='shipped' />
        <OrderPill state='delivered' />
      </div>

      <h5>Backend model</h5>
      <CodeBlock
        code={`// Order schema (backend/models/orderModel.js)
isPaid:       { type: Boolean, default: false },
paidAt:       { type: Date },
isDelivered:  { type: Boolean, default: false },
deliveredAt:  { type: Date },

// State machine via PUT endpoints:
//   PUT /api/orders/:id/pay      → marks paid
//   PUT /api/orders/:id/deliver  → marks delivered (admin)`}
      />
    </>
  );
};

const OrderPill = ({ state }) => {
  const map = {
    pending:   { bg: 'secondary', text: 'Pending' },
    paid:      { bg: 'success',   text: 'Paid' },
    shipped:   { bg: 'info',      text: 'Shipped' },
    delivered: { bg: 'primary',   text: 'Delivered' },
  };
  const cfg = map[state] || { bg: 'light', text: state };
  return <span className={`badge bg-${cfg.bg}`}>{cfg.text}</span>;
};

export default OrderTimeline;
