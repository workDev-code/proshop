import { Form, InputGroup } from 'react-bootstrap';

const Forms = () => (
  <>
    <h5>Inputs</h5>
    <Form>
      <div className='row g-3 mb-3'>
        <div className='col-md-6'>
          <Form.Label>Name</Form.Label>
          <Form.Control placeholder='Enter name' />
        </div>
        <div className='col-md-6'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' placeholder='email@example.com' />
        </div>
      </div>

      <Form.Label>Password (with validation)</Form.Label>
      <Form.Control
        type='password'
        isInvalid
        placeholder='min 6 chars'
        className='mb-3'
      />
      <Form.Control.Feedback type='invalid'>
        Too short.
      </Form.Control.Feedback>

      <Form.Label>Search</Form.Label>
      <InputGroup className='mb-3'>
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control placeholder='Search products...' />
      </InputGroup>

      <div className='row g-3 mb-3'>
        <div className='col-md-6'>
          <Form.Label>Category</Form.Label>
          <Form.Select>
            <option>All categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
          </Form.Select>
        </div>
        <div className='col-md-6'>
          <Form.Label>Quantity</Form.Label>
          <Form.Select>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </Form.Select>
        </div>
      </div>

      <Form.Label>Description</Form.Label>
      <Form.Control as='textarea' rows={3} className='mb-3' />

      <div className='mb-3'>
        <Form.Check
          type='checkbox'
          label='I agree to terms of service'
          defaultChecked
        />
      </div>

      <Form.Label>Payment method</Form.Label>
      <div className='mb-3'>
        {['PayPal', 'Credit card', 'Cash on delivery'].map((m, i) => (
          <Form.Check
            key={m}
            type='radio'
            name='payment'
            label={m}
            defaultChecked={i === 0}
          />
        ))}
      </div>

      <Form.Label>File upload</Form.Label>
      <Form.Control type='file' />
    </Form>
  </>
);

export default Forms;
