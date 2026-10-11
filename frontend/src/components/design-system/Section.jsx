import { Card } from 'react-bootstrap';

/**
 * Wrapper for a single design-system section.
 * Renders an anchor target (id) so the sticky ToC can deep-link to it.
 */
const Section = ({ id, title, subtitle, children, count }) => (
  <section id={id} className='ds-section' style={{ scrollMarginTop: 24 }}>
    <div className='d-flex align-items-baseline mb-3'>
      <h2 className='mb-0'>{title}</h2>
      {count && (
        <span
          className='badge bg-secondary ms-3'
          style={{ fontSize: '0.7rem' }}
        >
          {count}
        </span>
      )}
    </div>
    {subtitle && (
      <p className='text-muted mb-4'>{subtitle}</p>
    )}
    <Card className='p-4'>
      {children}
    </Card>
  </section>
);

export default Section;
