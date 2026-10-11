import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import {
  useCreateOrderMutation,
} from '../slices/ordersApiSlice';
import { useValidateCouponMutation } from '../slices/couponsApiSlice';
import {
  clearCartItems,
  applyCoupon,
  removeCoupon,
} from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [validateCoupon, { isLoading: loadingCoupon }] =
    useValidateCouponMutation();

  const [couponInput, setCouponInput] = useState('');

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const applyCouponHandler = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    try {
      const res = await validateCoupon({
        code: couponInput.trim(),
        subtotal: Number(cart.itemsPrice),
      }).unwrap();
      dispatch(
        applyCoupon({
          code: res.code,
          discount: Number(res.discount),
        })
      );
      toast.success(`Coupon applied: -$${res.discount}`);
      setCouponInput('');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Coupon invalid');
    }
  };

  const removeCouponHandler = () => {
    dispatch(removeCoupon());
    toast.info('Coupon removed');
  };

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        discountPrice: cart.discountPrice || 0,
        totalPrice: cart.totalPrice,
        couponCode: cart.couponCode, // ✅ gửi kèm
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * (item.price * 100)) / 100}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              {/* ✅ Coupon input */}
              <ListGroup.Item>
                <h5>Have a coupon?</h5>
                {cart.couponCode ? (
                  <div className='d-flex justify-content-between align-items-center'>
                    <span>
                      <strong>{cart.couponCode}</strong>{' '}
                      <span className='text-success'>
                        (-${cart.discountPrice})
                      </span>
                    </span>
                    <Button
                      variant='outline-danger'
                      size='sm'
                      onClick={removeCouponHandler}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Form onSubmit={applyCouponHandler}>
                    <InputGroup>
                      <Form.Control
                        type='text'
                        placeholder='Enter code (e.g. WELCOME10)'
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                      />
                      <Button
                        type='submit'
                        variant='outline-primary'
                        disabled={loadingCoupon}
                      >
                        {loadingCoupon ? '...' : 'Apply'}
                      </Button>
                    </InputGroup>
                    <small className='text-muted'>
                      Try <code>WELCOME10</code>, <code>SAVE20</code>, <code>FLAT15</code>
                    </small>
                  </Form>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* ✅ Discount row */}
              {Number(cart.discountPrice) > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Discount{' '}
                      {cart.couponCode && (
                        <span className='text-muted'>
                          ({cart.couponCode})
                        </span>
                      )}
                    </Col>
                    <Col className='text-success'>
                      -${cart.discountPrice}
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    <strong>${cart.totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant='danger'>
                    {error.data?.message}
                  </Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
