import { Card, Form, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'top_sellers', label: 'Top Sellers' },
  { value: 'name', label: 'Name A→Z' },
];

const RATING_OPTIONS = [4, 3, 2, 1];

const FilterSidebar = ({
  facets,
  filters,
  setFilter,
  toggleBrand,
  resetFilters,
  hasActiveFilters,
  total,
}) => {
  return (
    <Card className='mb-3'>
      <Card.Body>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h5 className='mb-0'>Filters</h5>
          {hasActiveFilters && (
            <Button
              variant='link'
              size='sm'
              className='p-0 text-decoration-none'
              onClick={resetFilters}
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Sort */}
        <Form.Group className='mb-3'>
          <Form.Label className='fw-bold'>Sort by</Form.Label>
          <Form.Select
            size='sm'
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Category */}
        {facets?.categories?.length > 0 && (
          <Form.Group className='mb-3'>
            <Form.Label className='fw-bold'>Category</Form.Label>
            <div>
              {facets.categories.map((cat) => (
                <Form.Check
                  key={cat}
                  type='radio'
                  name='category'
                  id={`cat-${cat}`}
                  label={cat}
                  checked={filters.category === cat}
                  onChange={() =>
                    setFilter(
                      'category',
                      filters.category === cat ? '' : cat
                    )
                  }
                />
              ))}
              {filters.category && (
                <Button
                  variant='link'
                  size='sm'
                  className='p-0 mt-1 text-decoration-none'
                  onClick={() => setFilter('category', '')}
                >
                  <FaTimes /> Clear category
                </Button>
              )}
            </div>
          </Form.Group>
        )}

        {/* Brand (multi-select) */}
        {facets?.brands?.length > 0 && (
          <Form.Group className='mb-3'>
            <Form.Label className='fw-bold'>Brand</Form.Label>
            <div>
              {facets.brands.map((brand) => (
                <Form.Check
                  key={brand}
                  type='checkbox'
                  id={`brand-${brand}`}
                  label={brand}
                  checked={filters.brand.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
              ))}
            </div>
          </Form.Group>
        )}

        {/* Price range */}
        <Form.Group className='mb-3'>
          <Form.Label className='fw-bold'>Price (USD)</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type='number'
                size='sm'
                placeholder='Min'
                value={filters.priceMin}
                onChange={(e) =>
                  setFilter('priceMin', e.target.value)
                }
              />
            </Col>
            <Col>
              <Form.Control
                type='number'
                size='sm'
                placeholder='Max'
                value={filters.priceMax}
                onChange={(e) =>
                  setFilter('priceMax', e.target.value)
                }
              />
            </Col>
          </Row>
        </Form.Group>

        {/* Rating */}
        <Form.Group className='mb-3'>
          <Form.Label className='fw-bold'>Minimum rating</Form.Label>
          <Form.Select
            size='sm'
            value={filters.minRating}
            onChange={(e) => setFilter('minRating', e.target.value)}
          >
            <option value=''>Any</option>
            {RATING_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}★ & up
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* In stock only */}
        <Form.Group className='mb-3'>
          <Form.Check
            type='checkbox'
            id='inStock'
            label='In stock only'
            checked={filters.inStock === 'true'}
            onChange={(e) =>
              setFilter('inStock', e.target.checked ? 'true' : '')
            }
          />
        </Form.Group>

        <small className='text-muted'>
          <Badge bg='secondary'>{total ?? 0}</Badge> result(s)
        </small>
      </Card.Body>
    </Card>
  );
};

export default FilterSidebar;
