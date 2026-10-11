const STEPS = [
  { token: '0',  px: 0,   use: 'reset' },
  { token: '1',  px: 4,   use: 'tight gap' },
  { token: '2',  px: 8,   use: 'input padding' },
  { token: '3',  px: 16,  use: 'default spacing' },
  { token: '4',  px: 24,  use: 'card padding' },
  { token: '5',  px: 48,  use: 'section gap' },
];

const SpacingScale = () => (
  <div className='row g-3'>
    {STEPS.map((s) => (
      <div key={s.token} className='col-md-2 col-6'>
        <div
          style={{
            width: s.px,
            height: 32,
            background: '#0d6efd',
            borderRadius: 2,
            marginBottom: 6,
          }}
        />
        <div className='small'>
          <strong>p-{s.token}</strong>{' '}
          <span className='text-muted'>({s.px}px)</span>
        </div>
        <div className='text-muted' style={{ fontSize: 11 }}>
          {s.use}
        </div>
      </div>
    ))}
  </div>
);

export default SpacingScale;
