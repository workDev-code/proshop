import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetCouponDetailsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from '../../slices/couponsApiSlice';

const CouponEditScreen = () => {
  const { id: couponId } = useParams();
  const navigate = useNavigate();
  const isCreate = !couponId || couponId === 'create';

  const [form, setForm] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: 10,
    minOrderAmount: 0,
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: 1,
    startDate: '',
    expiresAt: '',
    isActive: true,
  });

  const {
    data: coupon,
    isLoading: loadingDetails,
    error: errorDetails,
  } = useGetCouponDetailsQuery(couponId, { skip: isCreate });

  const [createCoupon, { isLoading: loadingCreate }] =
    useCreateCouponMutation();
  const [updateCoupon, { isLoading: loadingUpdate }] =
    useUpdateCouponMutation();

  useEffect(() => {
    if (!isCreate && coupon) {
      setForm({
        code: coupon.code || '',
        description: coupon.description || '',
        type: coupon.type || 'percentage',
        value: coupon.value ?? 10,
        minOrderAmount: coupon.minOrderAmount ?? 0,
        maxDiscount: coupon.maxDiscount ?? '',
        usageLimit: coupon.usageLimit ?? '',
        perUserLimit: coupon.perUserLimit ?? 1,
        startDate: coupon.startDate
          ? coupon.startDate.substring(0, 10)
          : '',
        expiresAt: coupon.expiresAt
          ? coupon.expiresAt.substring(0, 10)
          : '',
        isActive: coupon.isActive ?? true,
      });
    }
  }, [coupon, isCreate]);

  const onChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      code: form.code.toUpperCase().trim(),
      description: form.description,
      type: form.type,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount:
        form.maxDiscount === '' ? null : Number(form.maxDiscount),
      usageLimit:
        form.usageLimit === '' ? null : Number(form.usageLimit),
      perUserLimit: Number(form.perUserLimit) || 1,
      startDate: form.startDate || null,
      expiresAt: form.expiresAt || null,
      isActive: form.isActive,
    };

    try {
      if (isCreate) {
        await createCoupon(payload).unwrap();
        toast.success('Coupon created');
      } else {
        await updateCoupon({ ...payload, _id: couponId }).unwrap();
        toast.success('Coupon updated');
      }
      navigate('/admin/couponlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/couponlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <h1>{isCreate ? 'Create' : 'Edit'} Coupon</h1>

      {loadingCreate || loadingUpdate ? (
        <Loader />
      ) : loadingDetails ? (
        <Loader />
      ) : errorDetails ? (
        <Message variant='danger'>
          {errorDetails?.data?.message || errorDetails.error}
        </Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group className='my-2' controlId='code'>
                <Form.Label>Code</Form.Label>
                <Form.Control
                  name='code'
                  value={form.code}
                  onChange={onChange}
                  required
                  placeholder='e.g. WELCOME10'
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name='description'
                  value={form.description}
                  onChange={onChange}
                  placeholder='10% off first order'
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='type'>
                <Form.Label>Discount Type</Form.Label>
                <Form.Select
                  name='type'
                  value={form.type}
                  onChange={onChange}
                >
                  <option value='percentage'>Percentage (%)</option>
                  <option value='fixed'>Fixed Amount ($)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className='my-2' controlId='value'>
                <Form.Label>Value</Form.Label>
                <Form.Control
                  type='number'
                  step='0.01'
                  name='value'
                  value={form.value}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='minOrderAmount'>
                <Form.Label>Min Order Amount</Form.Label>
                <Form.Control
                  type='number'
                  step='0.01'
                  name='minOrderAmount'
                  value={form.minOrderAmount}
                  onChange={onChange}
                />
              </Form.Group>

              {form.type === 'percentage' && (
                <Form.Group className='my-2' controlId='maxDiscount'>
                  <Form.Label>Max Discount Cap (optional)</Form.Label>
                  <Form.Control
                    type='number'
                    step='0.01'
                    name='maxDiscount'
                    value={form.maxDiscount}
                    onChange={onChange}
                    placeholder='Leave empty for unlimited'
                  />
                </Form.Group>
              )}
            </Col>

            <Col md={6}>
              <Form.Group className='my-2' controlId='usageLimit'>
                <Form.Label>Total Usage Limit (optional)</Form.Label>
                <Form.Control
                  type='number'
                  name='usageLimit'
                  value={form.usageLimit}
                  onChange={onChange}
                  placeholder='Leave empty for unlimited'
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='perUserLimit'>
                <Form.Label>Per-User Limit</Form.Label>
                <Form.Control
                  type='number'
                  name='perUserLimit'
                  value={form.perUserLimit}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='startDate'>
                <Form.Label>Start Date (optional)</Form.Label>
                <Form.Control
                  type='date'
                  name='startDate'
                  value={form.startDate}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='expiresAt'>
                <Form.Label>Expiry Date (optional)</Form.Label>
                <Form.Control
                  type='date'
                  name='expiresAt'
                  value={form.expiresAt}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='isActive'>
                <Form.Check
                  type='checkbox'
                  name='isActive'
                  label='Active'
                  checked={form.isActive}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type='submit' variant='primary' className='my-3'>
            {isCreate ? 'Create' : 'Update'}
          </Button>
        </Form>
      )}
    </>
  );
};

export default CouponEditScreen;
