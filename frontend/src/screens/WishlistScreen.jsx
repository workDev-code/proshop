import { Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} from '../slices/wishlistApiSlice';
import { addToCart } from '../slices/cartSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const WishlistScreen = () => {
  const dispatch = useDispatch();

  const { data: wishlist = [], isLoading, error } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [clearWishlist] = useClearWishlistMutation();

  const moveToCartHandler = async (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    try {
      await removeFromWishlist(product._id).unwrap();
      toast.success(`${product.name} moved to cart`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const removeHandler = async (product) => {
    try {
      await removeFromWishlist(product._id).unwrap();
      toast.info(`${product.name} removed from wishlist`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const clearAllHandler = async () => {
    if (!window.confirm('Clear your entire wishlist?')) return;
    try {
      await clearWishlist().unwrap();
      toast.info('Wishlist cleared');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Meta title='My Wishlist' />
      <Row className='align-items-center mb-3'>
        <Col>
          <h1>My Wishlist</h1>
        </Col>
        <Col className='text-end'>
          {wishlist.length > 0 && (
            <Button variant='outline-danger' onClick={clearAllHandler}>
              Clear All
            </Button>
          )}
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : wishlist.length === 0 ? (
        <Message>
          Your wishlist is empty. <Link to='/'>Go shopping</Link>
        </Message>
      ) : (
        <Row>
          {wishlist.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Card className='my-3 p-3 rounded'>
                <Link to={`/product/${product._id}`}>
                  <Card.Img src={product.image} variant='top' />
                </Link>
                <Card.Body>
                  <Link to={`/product/${product._id}`}>
                    <Card.Title as='div' className='product-title'>
                      <strong>{product.name}</strong>
                    </Card.Title>
                  </Link>
                  <Card.Text as='h3'>${product.price}</Card.Text>
                  <div className='d-flex justify-content-between'>
                    <Button
                      variant='primary'
                      size='sm'
                      disabled={product.countInStock === 0}
                      onClick={() => moveToCartHandler(product)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant='outline-danger'
                      size='sm'
                      onClick={() => removeHandler(product)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default WishlistScreen;
