import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import FilterSidebar from '../components/FilterSidebar';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useProductFilters } from '../hooks/useProductFilters';

const HomeScreen = () => {
  const {
    filters,
    setFilter,
    toggleBrand,
    resetFilters,
// setPage,
    hasActiveFilters,
  } = useProductFilters();

  const { data, isLoading, error } = useGetProductsQuery(filters);

  return (
    <>
      {!filters.keyword && !hasActiveFilters ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          ← Back to Home
        </Link>
      )}
      <Meta />

      <Row>
        {/* ============ FILTER SIDEBAR (left) ============ */}
        <Col lg={3} md={4} className='mb-3'>
          <FilterSidebar
            facets={data?.facets}
            filters={filters}
            setFilter={setFilter}
            toggleBrand={toggleBrand}
            resetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            total={data?.total}
          />
        </Col>

        {/* ============ PRODUCT LIST (right) ============ */}
        <Col lg={9} md={8}>
          {filters.keyword && (
            <h1 className='mb-3'>
              Search results for "{filters.keyword}" ({data?.total ?? 0})
            </h1>
          )}

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : data.products.length === 0 ? (
            <Message>
              No products found.{' '}
              <Link to='/' onClick={resetFilters}>
                Clear filters
              </Link>
            </Message>
          ) : (
            <>
              <Row>
                {data.products.map((product) => (
                  <Col
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={4}
                    className='mb-3'
                  >
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={filters.keyword}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default HomeScreen;
