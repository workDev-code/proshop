import { CodeBlock } from './CodeBlock';

const PriceDisplay = () => (
  <>
    <h5>Pricing patterns</h5>
    <div className='row g-4'>
      <div className='col-md-4'>
        <h6 className='text-muted'>Single price</h6>
        <h3>$89.99</h3>
      </div>
      <div className='col-md-4'>
        <h6 className='text-muted'>Sale (price + crossed)</h6>
        <h3>
          <span className='text-danger'>$79.99</span>{' '}
          <small className='text-muted text-decoration-line-through'>
            $99.99
          </small>{' '}
          <span className='badge bg-danger ms-1'>-20%</span>
        </h3>
      </div>
      <div className='col-md-4'>
        <h6 className='text-muted'>With discount applied</h6>
        <h3>
          $80.99 <small className='text-success'>(-$9.00 WELCOME10)</small>
        </h3>
      </div>
    </div>

    <h5 className='mt-4'>In product card</h5>
    <div className='row g-3'>
      <div className='col-md-4'>
        <div className='card p-3'>
          <img
            src='/images/airpods.jpg'
            alt=''
            className='img-fluid'
            style={{ height: 140, objectFit: 'contain' }}
          />
          <h6 className='mt-2 mb-0'>Airpods Wireless</h6>
          <h3 className='mb-0'>$89.99</h3>
        </div>
      </div>
      <div className='col-md-4'>
        <div className='card p-3'>
          <img
            src='/images/camera.jpg'
            alt=''
            className='img-fluid'
            style={{ height: 140, objectFit: 'contain' }}
          />
          <h6 className='mt-2 mb-0'>Cannon EOS 80D</h6>
          <div>
            <h3 className='mb-0 d-inline me-2 text-danger'>$749.99</h3>
            <small className='text-decoration-line-through text-muted'>
              $929.99
            </small>
            <span className='badge bg-danger ms-1'>-19%</span>
          </div>
        </div>
      </div>
      <div className='col-md-4'>
        <div className='card p-3'>
          <img
            src='/images/playstation.jpg'
            alt=''
            className='img-fluid'
            style={{ height: 140, objectFit: 'contain' }}
          />
          <h6 className='mt-2 mb-0'>Sony PS5</h6>
          <h3 className='mb-0'>$399.99</h3>
        </div>
      </div>
    </div>

    <h5 className='mt-4'>Implementation notes</h5>
    <CodeBlock
      code={`// Cart compute (utils/cartUtils.js)
const itemsPrice = cartItems.reduce(...);
const taxableAmount = Math.max(itemsPrice - discountPrice, 0);
const taxPrice = 0.15 * taxableAmount;
const totalPrice = taxableAmount + shippingPrice + taxPrice;

// All prices stored as strings fixed to 2 decimals:
//   addDecimals = n => Math.round(n * 100) / 100).toFixed(2)`}
    />
  </>
);

export default PriceDisplay;
