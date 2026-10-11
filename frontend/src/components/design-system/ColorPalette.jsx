
const SWATCHES = [
  { name: 'Primary',   token: '--bs-primary',   hex: '#0d6efd', use: 'CTA, links, brand' },
  { name: 'Secondary', token: '--bs-secondary', hex: '#6c757d', use: 'Muted actions' },
  { name: 'Success',   token: '--bs-success',   hex: '#198754', use: 'Paid, in-stock' },
  { name: 'Danger',    token: '--bs-danger',    hex: '#dc3545', use: 'Sale, error, wishlist' },
  { name: 'Warning',   token: '--bs-warning',   hex: '#ffc107', use: 'Low stock, alerts' },
  { name: 'Info',      token: '--bs-info',      hex: '#0dcaf0', use: 'Hints, info badge' },
  { name: 'Light',     token: '--bs-light',     hex: '#f8f9fa', use: 'Subtle backgrounds' },
  { name: 'Dark',      token: '--bs-dark',      hex: '#212529', use: 'Text, dark surfaces' },
  { name: 'Muted',     token: '--bs-secondary', hex: '#6c757d', use: 'Helper text' },
];

const ColorPalette = () => (
  <div className='row g-3'>
    {SWATCHES.map((c) => (
      <div key={c.name} className='col-6 col-md-4 col-lg-3'>
        <div
          className='rounded shadow-sm position-relative'
          style={{
            backgroundColor: c.hex,
            height: 80,
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <button
            type='button'
            onClick={() =>
              navigator.clipboard?.writeText(c.hex).then(() => {})
            }
            title='Copy hex'
            className='position-absolute'
            style={{
              top: 6,
              right: 6,
              background: 'rgba(255,255,255,0.85)',
              border: 'none',
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            📋
          </button>
        </div>
        <div className='mt-2'>
          <strong>{c.name}</strong>
          <div className='small text-muted font-monospace'>{c.hex}</div>
          <div className='small text-muted' style={{ fontSize: 11 }}>
            {c.use}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ColorPalette;
