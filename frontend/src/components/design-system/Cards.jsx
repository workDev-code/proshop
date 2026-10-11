import { Card, Button, Badge } from 'react-bootstrap';

const Cards = () => (
  <>
    <h5>Basic card</h5>
    <Card className='mb-4' style={{ maxWidth: 360 }}>
      <Card.Body>
        <Card.Title>Free Shipping</Card.Title>
        <Card.Text>
          On orders over $100. Most items ship within 24 hours.
        </Card.Text>
        <Button variant='primary'>Learn more</Button>
      </Card.Body>
    </Card>

    <h5>With image</h5>
    <div className='row g-3 mb-4'>
      <div className='col-md-6'>
        <Card>
          <Card.Img variant='top' src='/images/airpods.jpg' />
          <Card.Body>
            <Card.Title>Airpods Wireless</Card.Title>
            <Card.Text>Bluetooth with high-quality AAC audio.</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>

    <h5>With header & footer</h5>
    <Card style={{ maxWidth: 480 }} className='mb-4'>
      <Card.Header as='h5'>Order #12345</Card.Header>
      <Card.Body>
        <Card.Title>$89.99</Card.Title>
        <Card.Text>
          2 items · Paid via PayPal · Shipped from HCM
        </Card.Text>
      </Card.Body>
      <Card.Footer className='text-muted'>2 days ago</Card.Footer>
    </Card>

    <h5>Pricing card</h5>
    <Card style={{ maxWidth: 320 }} className='mb-4'>
      <Card.Body className='text-center'>
        <Badge bg='primary' className='mb-2'>POPULAR</Badge>
        <Card.Title as='h3'>$49/mo</Card.Title>
        <Card.Text>
          Up to 100 orders/month<br />
          Free shipping labels<br />
          Email support
        </Card.Text>
        <Button variant='primary' className='w-100'>Choose Plan</Button>
      </Card.Body>
    </Card>
  </>
);

export default Cards;
