import { useEffect, useState } from 'react';

const ITEMS = [
  { id: 'brand',       label: '🎨 Brand Identity',  short: 'A' },
  { id: 'buttons',     label: '🔘 Buttons',         short: 'B' },
  { id: 'forms',       label: '📝 Forms',           short: 'B' },
  { id: 'alerts',      label: '⚠️ Alerts',          short: 'B' },
  { id: 'badges',      label: '🏷️ Badges',          short: 'B' },
  { id: 'cards',       label: '🃏 Cards',           short: 'B' },
  { id: 'tables',      label: '📊 Tables',          short: 'B' },
  { id: 'product',     label: '🛍️ Product Cards',   short: 'D' },
  { id: 'wishlist',    label: '❤️ Wishlist',        short: 'D' },
  { id: 'coupon',      label: '🎟️ Coupons',         short: 'D' },
  { id: 'price',       label: '💲 Pricing',         short: 'D' },
  { id: 'order',       label: '📦 Order Status',    short: 'D' },
  { id: 'filter',      label: '🔍 Filter Sidebar',  short: 'D' },
];

const TocSidebar = () => {
  const [active, setActive] = useState('brand');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    ITEMS.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className='ds-toc'
      style={{
        position: 'sticky',
        top: 24,
        padding: 16,
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 8,
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
      }}
    >
      <h6 className='text-uppercase text-muted mb-3' style={{ fontSize: 11 }}>
        Contents
      </h6>
      <ul className='list-unstyled mb-0'>
        {ITEMS.map((it) => (
          <li key={it.id} className='mb-1'>
            <a
              href={`#${it.id}`}
              className={`d-flex align-items-center px-2 py-1 rounded text-decoration-none ${
                active === it.id
                  ? 'bg-primary text-white'
                  : 'text-body'
              }`}
              style={{ fontSize: 13 }}
            >
              <span
                className='me-2 font-monospace small opacity-50'
                style={{ width: 16 }}
              >
                {it.short}
              </span>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      <hr />
      <a
        href='/'
        className='btn btn-sm btn-outline-secondary w-100'
      >
        ← Back to Store
      </a>
    </nav>
  );
};

export default TocSidebar;
