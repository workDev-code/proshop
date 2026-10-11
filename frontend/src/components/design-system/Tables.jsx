import { Table, Button, Badge } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Tables = () => (
  <>
    <h5>Striped with hover</h5>
    <Table striped hover responsive className='mb-4'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>#001</td>
          <td>Admin User</td>
          <td>admin@email.com</td>
          <td><Badge bg='dark'>admin</Badge></td>
          <td>
            <Button size='sm' variant='light' className='me-1'>
              <FaEdit />
            </Button>
            <Button size='sm' variant='danger'>
              <FaTrash style={{ color: 'white' }} />
            </Button>
          </td>
        </tr>
        <tr>
          <td>#002</td>
          <td>John Doe</td>
          <td>john@email.com</td>
          <td><Badge bg='secondary'>customer</Badge></td>
          <td>
            <Button size='sm' variant='light' className='me-1'>
              <FaEdit />
            </Button>
            <Button size='sm' variant='danger'>
              <FaTrash style={{ color: 'white' }} />
            </Button>
          </td>
        </tr>
        <tr>
          <td>#003</td>
          <td>Jane Doe</td>
          <td>jane@email.com</td>
          <td><Badge bg='secondary'>customer</Badge></td>
          <td>
            <Button size='sm' variant='light' className='me-1'>
              <FaEdit />
            </Button>
            <Button size='sm' variant='danger'>
              <FaTrash style={{ color: 'white' }} />
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>

    <h5>Compact (table-sm)</h5>
    <Table striped bordered hover size='sm' responsive>
      <thead>
        <tr>
          <th>Code</th>
          <th>Type</th>
          <th>Value</th>
          <th>Used / Limit</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>WELCOME10</code></td>
          <td>percentage</td>
          <td>10%</td>
          <td>12 / 1000</td>
          <td><Badge bg='success'>Yes</Badge></td>
        </tr>
        <tr>
          <td><code>SAVE20</code></td>
          <td>percentage</td>
          <td>20%</td>
          <td>0 / 500</td>
          <td><Badge bg='success'>Yes</Badge></td>
        </tr>
      </tbody>
    </Table>
  </>
);

export default Tables;
