import { Pagination } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';

/**
 * Paginate component preserves query string (filters + sort)
 * when paging through results. Supports legacy URL routes + query params.
 */
const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  const location = useLocation();
  const { keyword: urlKeyword } = useParams();
  const activeKeyword = keyword || urlKeyword;

  const buildHref = (pageNum) => {
    if (isAdmin) return `/admin/productlist/${pageNum}`;

    const params = new URLSearchParams(location.search);
    if (pageNum > 1) params.set('page', String(pageNum));
    else params.delete('page');
    const qs = params.toString();

    const base = activeKeyword ? `/search/${activeKeyword}` : '';
    return qs ? `${base}?${qs}` : base || '/';
  };

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <Pagination.Item
            as={Link}
            key={x + 1}
            to={buildHref(x + 1)}
            active={x + 1 === page}
          >
            {x + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
