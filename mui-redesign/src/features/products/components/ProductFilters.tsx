import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Stack, Button } from '@mui/material';
import { ClearAll as ClearIcon } from '@mui/icons-material';
import type { ProductListResponse, SortOption, ProductQueryParams } from '../types';
import { SORT_LABELS } from '../types';

interface Props {
  facets: ProductListResponse['facets'] | undefined;
  /** Hide the right-aligned "View all" hint when rendered inside narrow pages. */
  hideSort?: boolean;
}

/**
 * URL-driven filter row (horizontal pills), matching `.filter-row`
 * from the approved HTML prototype.
 *
 *  - Reads initial state from URL: ?category, ?brand, ?inStock, ?sort
 *  - Updates URL on every change → shareable links & back-button support
 *  - Parent pages (HomePage/SearchPage) read the same URL via
 *    useSearchParams and pass the resulting ProductQueryParams to
 *    useGetProductsQuery
 *
 *  Active pill = ink bg + white text + ink border.
 *  Inactive pill = transparent bg + sage border + ink text.
 *
 *  Falls back to a single "All" pill when no facets are present.
 *  Never renders hardcoded category or brand lists.
 */
export const ProductFilters = ({ facets, hideSort }: Props) => {
  const [params, setParams] = useSearchParams();

  const category = params.get('category') ?? '';
  const brand = params.get('brand') ?? '';
  const inStock = params.get('inStock') === 'true';
  const sort = (params.get('sort') ?? 'newest') as SortOption;

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === '') next.delete(k);
            else next.set(k, v);
          });
          if (!('pageNumber' in patch)) next.delete('pageNumber');
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const setCategory = (v: string) => update({ category: v || null });
  const setBrand = (v: string) => update({ brand: v || null });
  const setInStock = () => update({ inStock: inStock ? null : 'true' });
  const setSort = (v: SortOption) =>
    update({ sort: v === 'newest' ? null : v });
  const clearAll = () => {
    const next = new URLSearchParams(params);
    next.delete('category');
    next.delete('brand');
    next.delete('inStock');
    next.delete('minRating');
    next.delete('priceMin');
    next.delete('priceMax');
    next.set('pageNumber', '1');
    setParams(next, { replace: true });
  };

  const activeCount =
    (category ? 1 : 0) +
    (brand ? 1 : 0) +
    (inStock ? 1 : 0);

  const pillSx = (active: boolean) => ({
    border: '1px solid',
    borderColor: active ? 'primary.main' : 'rgba(219, 220, 211, 1)',
    bgcolor: active ? 'primary.main' : 'transparent',
    color: active ? 'common.white' : 'text.primary',
    borderRadius: 999,
    px: 2,
    py: 1.125,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    transition: 'background-color 200ms ease, border-color 200ms ease, color 200ms ease',
    '&:hover': {
      bgcolor: active ? 'primary.main' : 'rgba(32,33,31,0.06)',
      borderColor: 'primary.main',
    },
  });

  const categories = facets?.categories ?? [];
  const brands = facets?.brands ?? [];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        mb: { xs: 3, md: 3.125 },
      }}
    >
      {/* Categories */}
      <Button
        onClick={() => setCategory('')}
        sx={pillSx(!category)}
        disableRipple
      >
        All
      </Button>
      {categories.map((c) => (
        <Button
          key={c}
          onClick={() => setCategory(category === c ? '' : c)}
          sx={pillSx(category === c)}
          disableRipple
        >
          {c}
        </Button>
      ))}

      {/* Brand segment - inline */}
      {brands.length > 0 && (
        <>
          <Box sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 1 }} />
          {brands.slice(0, 6).map((b) => (
            <Button
              key={b}
              onClick={() => setBrand(brand === b ? '' : b)}
              sx={pillSx(brand === b)}
              disableRipple
            >
              {b}
            </Button>
          ))}
        </>
      )}

      {/* In-stock toggle */}
      <Box sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 1 }} />
      <Button
        onClick={setInStock}
        sx={pillSx(inStock)}
        disableRipple
      >
        In stock
      </Button>

      <Box sx={{ flexGrow: 1 }} />

      {/* Sort dropdown */}
      {!hideSort && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box component="span" sx={{ fontSize: 10, color: 'text.secondary', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Sort
          </Box>
          <Box
            component="select"
            value={sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as SortOption)}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 999,
              bgcolor: 'background.paper',
              px: 1.5,
              py: 0.875,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'inherit',
              color: 'text.primary',
              cursor: 'pointer',
              outline: 'none',
              '&:focus': { borderColor: 'primary.main' },
            }}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </Box>
        </Stack>
      )}

      {/* Clear */}
      {activeCount > 0 && (
        <Button
          startIcon={<ClearIcon sx={{ fontSize: 14 }} />}
          onClick={clearAll}
          sx={{
            ...pillSx(false),
            color: 'secondary.main',
            borderColor: 'secondary.main',
            '&:hover': { bgcolor: 'rgba(217,93,57,0.08)' },
          }}
          disableRipple
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

/**
 * Parse URL search params → ProductQueryParams for the API.
 * Use this in any page that wants to drive useGetProductsQuery from the URL.
 */
export const paramsToQuery = (
  searchParams: URLSearchParams,
): ProductQueryParams => {
  const q: ProductQueryParams = {};
  const keyword = searchParams.get('keyword');
  if (keyword) q.keyword = keyword;
  const category = searchParams.get('category');
  if (category) q.category = category;
  const brand = searchParams.get('brand');
  if (brand) q.brand = brand;
  const priceMin = searchParams.get('priceMin');
  if (priceMin) q.priceMin = Number(priceMin);
  const priceMax = searchParams.get('priceMax');
  if (priceMax) q.priceMax = Number(priceMax);
  const minRating = searchParams.get('minRating');
  if (minRating) q.minRating = Number(minRating);
  const inStock = searchParams.get('inStock');
  if (inStock === 'true') q.inStock = true;
  const sort = searchParams.get('sort') as SortOption | null;
  if (sort) q.sort = sort;
  const pageNumber = searchParams.get('pageNumber');
  if (pageNumber) q.pageNumber = Number(pageNumber);
  return q;
};
