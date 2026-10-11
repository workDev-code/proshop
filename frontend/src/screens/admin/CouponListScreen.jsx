import { Table, Button, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
} from '../../slices/couponsApiSlice';

const CouponListScreen = () => {
  const { data: coupons, isLoading, error, refetch } = useGetCouponsQuery();

  const [deleteCoupon, { isLoading: loadingDelete }] =
    useDeleteCouponMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await deleteCoupon(id).unwrap();
        toast.success('Coupon deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Coupons</h1>
        </Col>
        <Col className='text-end'>
          <Button
            as={Link}
            to='/admin/coupon/create'
            className='my-3'
          >
            <FaPlus /> Create Coupon
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : coupons.length === 0 ? (
        <Message>No coupons yet</Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>CODE</th>
              <th>TYPE</th>
              <th>VALUE</th>
              <th>MIN</th>
              <th>USED / LIMIT</th>
              <th>EXPIRES</th>
              <th>ACTIVE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>
                  <strong>{coupon.code}</strong>
                </td>
                <td>{coupon.type}</td>
                <td>
                  {coupon.type === 'percentage'
                    ? `${coupon.value}%`
                    : `$${coupon.value}`}
                </td>
                <td>${coupon.minOrderAmount}</td>
                <td>
                  {coupon.usageCount} /{' '}
                  {coupon.usageLimit || '∞'}
                </td>
                <td>{fmtDate(coupon.expiresAt)}</td>
                <td>
                  {coupon.isActive ? (
                    <Badge bg='success'>Yes</Badge>
                  ) : (
                    <Badge bg='secondary'>No</Badge>
                  )}
                </td>
                <td>
                  <Button
                    as={Link}
                    to={`/admin/coupon/${coupon._id}/edit`}
                    variant='light'
                    className='btn-sm'
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant='danger'
                    className='btn-sm ms-2'
                    onClick={() => deleteHandler(coupon._id)}
                  >
                    <FaTrash style={{ color: 'white' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default CouponListScreen;
