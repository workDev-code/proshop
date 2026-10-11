import FilterSidebar from '../FilterSidebar';
import { CodeBlock } from './CodeBlock';

const SAMPLE_FACETS = {
  categories: ['Electronics', 'Clothing', 'Books'],
  brands: ['Apple', 'Sony', 'Samsung', 'Logitech', 'Amazon'],
};

const FilterSidebarDemo = () => {
  const filters = {
    keyword: '',
    category: 'Electronics',
    brand: ['Apple'],
    priceMin: '50',
    priceMax: '500',
    minRating: '4',
    inStock: 'true',
    sort: 'price_asc',
    pageNumber: 1,
  };

  return (
    <>
      <h5>Filter & Sort sidebar — live preview</h5>
      <p className='text-muted small'>
        Reads/writes URL <code>?category=X&brand=Y&...</code> ·
        Shareable · Refresh-safe · Browser back/forward works.
      </p>
      <div className='row'>
        <div className='col-md-6 col-lg-5'>
          <FilterSidebar
            facets={SAMPLE_FACETS}
            filters={filters}
            setFilter={() => {}}
            toggleBrand={() => {}}
            resetFilters={() => {}}
            hasActiveFilters
            total={42}
          />
          <p className='small text-muted'>
            Non-interactive preview (handlers no-op). Real one navigates via
            React Router on each change.
          </p>
        </div>
        <div className='col-md-6 col-lg-7'>
          <h5>URL state shape</h5>
          <CodeBlock
            code={`/products?category=Electronics
        &brand=Apple,Sony
        &priceMin=50
        &priceMax=500
        &minRating=4
        &inStock=true
        &sort=price_asc
        &page=2`}
          />

          <h5 className='mt-4'>Backend query (Mongo)</h5>
          <CodeBlock
            code={`const filter = {
  ...(keyword && { name: { $regex: keyword, $options: 'i' } }),
  ...(category && { category }),
  ...(brand   && { brand: { $in: brand.split(',') } }),
  // price filter, rating filter, in-stock filter combined
};

const sortMap = {
  price_asc:  { price: 1 },
  price_desc: { price: -1 },
  rating:     { rating: -1 },
  top_sellers:{ rating: -1, numReviews: -1 },
  name:       { name: 1 },
  newest:     { createdAt: -1 },  // default
};

Product.find(filter).sort(sortMap[sort] || sortMap.newest)
  .limit(pageSize).skip((page - 1) * pageSize);`}
          />
        </div>
      </div>
    </>
  );
};

export default FilterSidebarDemo;
