import { useSearchParams, useParams, useNavigate } from 'react-router-dom';

/**
 * Hook for managing product filter state via URL search params.
 * Supports legacy URL route /page/:pageNumber as fallback.
 */
export const useProductFilters = () => {
  const [searchParams] = useSearchParams();
  const { keyword: urlKeyword, pageNumber: urlPage } = useParams();
  const navigate = useNavigate();

  const get = (key, fallback = '') => searchParams.get(key) || fallback;

  const brandsRaw = searchParams.get('brand') || '';
  const brands = brandsRaw ? brandsRaw.split(',') : [];

  // pageNumber: prefer query string ?page=, fallback to URL param /page/:n
  const pageFromQuery = Number(searchParams.get('page'));
  const pageNumber =
    !Number.isNaN(pageFromQuery) && pageFromQuery > 0
      ? pageFromQuery
      : Number(urlPage) || 1;

  const filters = {
    keyword: urlKeyword || get('keyword'),
    category: get('category'),
    brand: brands,
    priceMin: get('priceMin'),
    priceMax: get('priceMax'),
    minRating: get('minRating'),
    inStock: get('inStock'),
    sort: get('sort', 'newest'),
    pageNumber,
  };

  const buildBaseUrl = () =>
    urlKeyword ? `/search/${urlKeyword}` : '/';

  const updateUrl = (updater) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updater).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined ||
          (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','));
      } else if (key === 'pageNumber') {
        if (Number(value) > 1) newParams.set('page', String(value));
        else newParams.delete('page');
      } else {
        newParams.set(key, String(value));
      }
    });

    // Reset page when changing anything except page itself
    if (!('pageNumber' in updater)) {
      newParams.delete('page');
    }

    const qs = newParams.toString();
    const base = buildBaseUrl();
    navigate(qs ? `${base}?${qs}` : base);
  };

  const setFilter = (name, value) => {
    updateUrl({ [name]: value, pageNumber: 1 });
  };

  const toggleBrand = (brand) => {
    const next = brands.includes(brand)
      ? brands.filter((b) => b !== brand)
      : [...brands, brand];
    setFilter('brand', next);
  };

  const resetFilters = () => {
    navigate(buildBaseUrl());
  };

  const setPage = (n) => {
    updateUrl({ pageNumber: n });
  };

  return {
    filters,
    setFilter,
    toggleBrand,
    resetFilters,
    setPage,
    hasActiveFilters:
      !!filters.category ||
      filters.brand.length > 0 ||
      !!filters.priceMin ||
      !!filters.priceMax ||
      !!filters.minRating ||
      !!filters.inStock,
  };
};
