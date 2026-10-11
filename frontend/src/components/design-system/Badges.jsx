import { Badge } from 'react-bootstrap';
import { FaHeart, FaCartPlus } from 'react-icons/fa';

const Badges = () => (
  <>
    <h5>Contextual</h5>
    <div className='d-flex flex-wrap gap-2 mb-4'>
      <Badge bg='primary'>Primary</Badge>
      <Badge bg='secondary'>Secondary</Badge>
      <Badge bg='success'>Success</Badge>
      <Badge bg='danger'>Danger</Badge>
      <Badge bg='warning' text='dark'>Warning</Badge>
      <Badge bg='info'>Info</Badge>
      <Badge bg='light' text='dark'>Light</Badge>
      <Badge bg='dark'>Dark</Badge>
    </div>

    <h5>Pill badges (counter)</h5>
    <div className='d-flex flex-wrap gap-3 mb-4' style={{ fontSize: 18 }}>
      <span>Cart <Badge pill bg='success'>3</Badge></span>
      <span>Wishlist <Badge pill bg='danger'>5</Badge></span>
    </div>

    <h5>In a heading</h5>
    <h3>
      ProShop <Badge bg='primary'>v2</Badge>
    </h3>

    <h5 className='mt-4'>With icons</h5>
    <Badge bg='danger' className='me-2'>
      <FaHeart className='me-1' /> Sale
    </Badge>
    <Badge bg='success'>
      <FaCartPlus className='me-1' /> In Stock
    </Badge>
  </>
);

export default Badges;
