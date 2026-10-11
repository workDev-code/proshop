import { Form, InputGroup, Button, Badge, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { CodeBlock } from './CodeBlock';

const CouponDemo = () => (
  <>
    <h5>Checkout coupon box — 2 states</h5>

    <div className='row g-3 mb-4'>
      {/* Empty state */}
      <div className='col-md-6'>
        <p className='small text-muted mb-2'>Empty state</p>
        <Card>
          <Card.Body>
            <h6>Have a coupon?</h6>
            <InputGroup>
              <Form.Control placeholder='Enter code (e.g. WELCOME10)' />
              <Button variant='outline-primary'>Apply</Button>
            </InputGroup>
            <small className='text-muted'>
              Try <code>WELCOME10</code>, <code>SAVE20</code>, <code>FLAT15</code>
            </small>
          </Card.Body>
        </Card>
      </div>

      {/* Applied state */}
      <div className='col-md-6'>
        <p className='small text-muted mb-2'>Applied state</p>
        <Card>
          <Card.Body>
            <h6>Have a coupon?</h6>
            <div className='d-flex justify-content-between align-items-center'>
              <span>
                <strong>WELCOME10</strong>{' '}
                <span className='text-success'>(-$9.00)</span>
              </span>
              <Button variant='outline-danger' size='sm'>
                <FaTrash className='me-1' /> Remove
              </Button>
            </div>
            <small className='text-success'>
              ✓ Discount applied to order
            </small>
          </Card.Body>
        </Card>
      </div>
    </div>

    <h5>Order summary with discount</h5>
    <Card className='mb-4' style={{ maxWidth: 380 }}>
      <Card.Body>
        <div className='d-flex justify-content-between'>
          <span>Items</span><span>$89.99</span>
        </div>
        <div className='d-flex justify-content-between text-success'>
          <span>Discount (WELCOME10)</span>
          <span>-$9.00</span>
        </div>
        <div className='d-flex justify-content-between'>
          <span>Shipping</span><span>$10.00</span>
        </div>
        <div className='d-flex justify-content-between'>
          <span>Tax (15%)</span><span>$12.15</span>
        </div>
        <hr />
        <div className='d-flex justify-content-between'>
          <strong>Total</strong>
          <strong>$103.14</strong>
        </div>
      </Card.Body>
    </Card>

    <h5>Admin: Coupon card</h5>
    <div className='row g-3 mb-4'>
      <div className='col-md-6'>
        <Card>
          <Card.Body>
            <div className='d-flex justify-content-between align-items-start'>
              <div>
                <h5 className='mb-1'><code>WELCOME10</code></h5>
                <Badge bg='primary'>percentage 10%</Badge>
              </div>
              <Badge bg='success'>Active</Badge>
            </div>
            <p className='text-muted mt-2 mb-2'>
              10% off for first-time customers
            </p>
            <small className='text-muted'>
              Min $50 · Max discount $50 · 12 / 1000 used · Expires 2026-11-11
            </small>
            <div className='mt-3 d-flex gap-2'>
              <Button size='sm' variant='outline-primary'>Edit</Button>
              <Button size='sm' variant='outline-danger'>Delete</Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className='col-md-6'>
        <Card>
          <Card.Body>
            <div className='d-flex justify-content-between align-items-start'>
              <div>
                <h5 className='mb-1'><code>SAVE20</code></h5>
                <Badge bg='primary'>percentage 20%</Badge>
              </div>
              <Badge bg='success'>Active</Badge>
            </div>
            <p className='text-muted mt-2 mb-2'>
              20% off when you spend $200 or more
            </p>
            <small className='text-muted'>
              Min $200 · Max discount $100 · 0 / 500 used · Expires 2026-11-11
            </small>
            <div className='mt-3 d-flex gap-2'>
              <Button size='sm' variant='outline-primary'>Edit</Button>
              <Button size='sm' variant='outline-danger'>Delete</Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>

    <h5>Backend validation rules</h5>
    <CodeBlock
      code={`// Server computes discount — never trust client
const { isAvailable, minOrderAmount, maxDiscount, type, value } = coupon;

// Percentage capped by maxDiscount
discount = (subtotal * value) / 100;
if (maxDiscount && discount > maxDiscount) discount = maxDiscount;

// Fixed: never exceed subtotal
if (type === 'fixed') discount = Math.min(value, subtotal);

// Per-user usage limit
const used = await Order.countDocuments({
  user: req.user._id,
  'coupon.code': coupon.code,
});
if (used >= perUserLimit) throw 'Already used';`}
    />

    <p className='small text-muted mt-3'>
      Coupon snapshot is stored on every Order for auditability.
    </p>
  </>
);

export default CouponDemo;
