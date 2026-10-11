import Product from '../Product';
import { CodeBlock } from './CodeBlock';

const SAMPLE = {
  _id: 'demo123',
  name: 'Airpods Wireless Bluetooth Headphones',
  image: '/images/airpods.jpg',
  price: 89.99,
  rating: 4.5,
  numReviews: 12,
  countInStock: 10,
};

const STATES = [
  { label: 'In stock', override: { countInStock: 10 } },
  { label: 'Low stock (2 left)', override: { countInStock: 2 } },
  { label: 'Out of stock', override: { countInStock: 0 } },
  { label: 'Top rated', override: { rating: 5, numReviews: 99 } },
];

const ProductCardStates = () => (
  <>
    <p className='text-muted'>
      These are the <strong>real</strong> Product card components used in the
      catalog. Modify <code>countInStock</code>, <code>rating</code>,
      and click the heart to toggle wishlist state.
    </p>

    <h5 className='mt-4'>Inventory states</h5>
    <div className='row g-3'>
      {STATES.map((s) => (
        <div key={s.label} className='col-md-6 col-lg-3'>
          <p className='small text-muted mb-2'>{s.label}</p>
          <Product
            product={{ ...SAMPLE, ...s.override, name: s.label }}
          />
        </div>
      ))}
    </div>

    <h5 className='mt-4'>Wishlist toggle — interactive</h5>
    <p className='text-muted small'>
      Note: to actually toggle you need to log in. The button shows a hint.
    </p>
    <div className='row g-3'>
      <div className='col-md-4'>
        <p className='small text-muted mb-2'>Heart on Card</p>
        <Product product={SAMPLE} />
        <CodeBlock code={`<Product product={product} />`} />
      </div>
    </div>
  </>
);

export default ProductCardStates;
