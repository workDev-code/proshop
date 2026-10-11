import { FaHeart, FaRegHeart } from 'react-icons/fa';
import WishlistButton from '../WishlistButton';
import { CodeBlock } from './CodeBlock';

const WishlistDemo = () => (
  <>
    <div className='row g-4 align-items-center'>
      <div className='col-md-6'>
        <h5>Heart states</h5>
        <div className='d-flex align-items-center gap-4 mb-3'>
          <div className='text-center'>
            <FaRegHeart size={28} color='#888' />
            <div className='small text-muted mt-1'>Not in wishlist</div>
          </div>
          <div className='text-center'>
            <FaHeart size={28} color='red' />
            <div className='small text-muted mt-1'>In wishlist</div>
          </div>
          <div className='text-center'>
            <WishlistButton productId='demo123' size='lg' />
            <div className='small text-muted mt-1'>
              Live component (click!)
            </div>
          </div>
        </div>

        <h6>Header badge</h6>
        <p className='small text-muted'>
          When user is logged in, Header shows:
        </p>
        <p>
          <span style={{ fontSize: 18 }}>
            <FaHeart /> Wishlist{' '}
            <span
              className='badge rounded-pill bg-danger ms-1'
              style={{ fontSize: 11 }}
            >
              3
            </span>
          </span>
        </p>
      </div>

      <div className='col-md-6'>
        <h5>Implementation</h5>
        <CodeBlock
          code={`import WishlistButton from '../components/WishlistButton';

// On any Product card:
<WishlistButton productId={product._id} />

// Server endpoints:
//   POST   /api/users/wishlist/:productId
//   DELETE /api/users/wishlist/:productId
//   GET    /api/users/wishlist (populated list)`}
        />
        <p className='small text-muted mt-3'>
          Backend: User schema có <code>wishlist: [ObjectId]</code> embeds,
          populate khi GET.
        </p>
      </div>
    </div>
  </>
);

export default WishlistDemo;
