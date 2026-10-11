import { Alert } from 'react-bootstrap';

const Alerts = () => (
  <>
    <Alert variant='primary'>Primary — informational banner</Alert>
    <Alert variant='secondary'>Secondary — muted notice</Alert>
    <Alert variant='success'>
      ✓ Success — operation completed (e.g., added to cart)
    </Alert>
    <Alert variant='danger'>
      ✕ Danger — Something went wrong. Please try again.
    </Alert>
    <Alert variant='warning'>
      ⚠ Warning — Your discount is expiring soon!
    </Alert>
    <Alert variant='info'>
      ℹ Info — Free shipping on orders over $100
    </Alert>

    <h5 className='mt-4'>Dismissible</h5>
    <Alert variant='success' dismissible>
      Saved! You can dismiss this alert.
    </Alert>

    <h5 className='mt-4'>With content</h5>
    <Alert variant='primary'>
      <Alert.Heading>Verification required</Alert.Heading>
      <p>Please check your inbox to confirm your email address.</p>
      <hr />
      <p className='mb-0'>Didn't receive an email? Check your spam folder.</p>
    </Alert>
  </>
);

export default Alerts;
