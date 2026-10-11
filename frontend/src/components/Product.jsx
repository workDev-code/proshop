import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import WishlistButton from './WishlistButton';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded position-relative'>
      {/* Heart icon top-right */}
      <div
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
      >
        <WishlistButton productId={product._id} size='sm' />
      </div>

      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
