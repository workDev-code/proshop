import { Button, Spinner, ButtonGroup } from 'react-bootstrap';
import { FaTrash, FaHeart } from 'react-icons/fa';

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger',
  'warning', 'info', 'light', 'dark', 'outline-primary',
];

const Buttons = () => (
  <>
    <h5>Variants</h5>
    <div className='d-flex flex-wrap gap-2 mb-4'>
      {VARIANTS.map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>

    <h5>Sizes</h5>
    <div className='d-flex align-items-center gap-2 mb-4'>
      <Button variant='primary' size='sm'>Small</Button>
      <Button variant='primary'>Default</Button>
      <Button variant='primary' size='lg'>Large</Button>
    </div>

    <h5>States</h5>
    <div className='d-flex flex-wrap gap-2 mb-4'>
      <Button variant='primary'>Normal</Button>
      <Button variant='primary' disabled>Disabled</Button>
      <Button variant='primary' active>Active</Button>
      <Button variant='primary'>
        <Spinner animation='border' size='sm' className='me-2' />
        Loading...
      </Button>
    </div>

    <h5>With Icons</h5>
    <div className='d-flex gap-2 mb-4'>
      <Button variant='primary'>
        <FaHeart className='me-2' />
        Add to Wishlist
      </Button>
      <Button variant='outline-danger'>
        <FaTrash className='me-2' />
        Remove
      </Button>
    </div>

    <h5>Block</h5>
    <Button variant='primary' className='w-100'>
      Place Order
    </Button>

    <h5 className='mt-4'>Button Group</h5>
    <ButtonGroup>
      <Button variant='outline-primary'>1</Button>
      <Button variant='outline-primary'>2</Button>
      <Button variant='outline-primary'>3</Button>
    </ButtonGroup>
  </>
);

export default Buttons;
