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
 *  - Group labels ("Category", "Brand", "Availability") sit above each
 *    row of chips so the design reads as filter groups, not a single wall.
 *  - Chips are 36px high, gap 8px, horizontal scroll on mobile.
 *  - Active chip: orange #E8795A bg + dark #1C1C1A text.
 *  - Inactive chip: transparent bg + #3A3A36 border + #F5F3EE text.
 *  - Each chip is an `aria-pressed` toggle button with focus-visible ring.
 *
 *  Falls back to a single "All" pill when no facets are present.
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

  // Reusable pill style — explicit dark-mode tokens so it never inverts
  // in light theme and never washes out in dark theme.
  const pillSx = (active: boolean) => ({
    border: '1px solid',
    borderColor: active ? '#E8795A' : '#3A3A36',
    bgcolor: active ? '#E8795A' : 'transparent',
    color: active ? '#1C1C1A' : '#F5F3EE',
    borderRadius: 999,
    height: 36,                     // fixed 36px per design spec
    px: 2,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition:
      'background-color 200ms ease, border-color 200ms ease, color 200ms ease',
    '&:hover': {
      bgcolor: active ? '#d96a4b' : 'transparent',
      borderColor: '#E8795A',
      color: active ? '#1C1C1A' : '#E8795A',
    },
    '&:focus-visible': {
      outline: '2px solid #E8795A',
      outlineOffset: 2,
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  });

  const groupLabelSx = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#B8B5AD',
    mb: 1,
  };

  const categories = facets?.categories ?? [];
  const brands = facets?.brands ?? [];

  return (
    <Box sx={{ mb: { xs: 3, md: 3.5 } }}>
      {/* Group 1: Category */}
      {(categories.length > 0 || true) && (
        <Box sx={{ mb: 2 }}>
          <Box sx={groupLabelSx}>Category</Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: { xs: 'nowrap', md: 'wrap' },
              overflowX: { xs: 'auto', md: 'visible' },
              pb: { xs: 1, md: 0 },
              // Hide scrollbar on mobile for a cleaner pill bar
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            <Button
              onClick={() => setCategory('')}
              aria-pressed={!category}
              disableRipple
              sx={pillSx(!category)}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c}
                onClick={() => setCategory(category === c ? '' : c)}
                aria-pressed={category === c}
                disableRipple
                sx={pillSx(category === c)}
              >
                {c}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* Group 2: Brand */}
      {brands.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={groupLabelSx}>Brand</Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: { xs: 'nowrap', md: 'wrap' },
              overflowX: { xs: 'auto', md: 'visible' },
              pb: { xs: 1, md: 0 },
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {brands.slice(0, 6).map((b) => (
              <Button
                key={b}
                onClick={() => setBrand(brand === b ? '' : b)}
                aria-pressed={brand === b}
                disableRipple
                sx={pillSx(brand === b)}
              >
                {b}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* Group 3: Availability + Sort */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Box sx={groupLabelSx}>Availability</Box>
          <Button
            onClick={setInStock}
            aria-pressed={inStock}
            disableRipple
            sx={pillSx(inStock)}
          >
            In stock
          </Button>
        </Box>

        {!hideSort && (
          <Stack
            direction="row"
            alignItems="baseline"
            spacing={1.5}
            sx={{ mt: { xs: 0, md: 3 } /* offset for group label */ }}
          >
            <Box
              component="label"
              htmlFor="sort-select"
              sx={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#B8B5AD',
                cursor: 'pointer',
              }}
            >
              Sort
            </Box>
            <Box
              component="select"
              id="sort-select"
              value={sort}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSort(e.target.value as SortOption)
              }
              aria-label="Sort products"
              sx={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                height: 40,
                border: '1px solid #3A3A36',
                borderRadius: 999,
                bgcolor: '#2F2F2C',
                px: 2.5,
                pr: 4,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'inherit',
                color: '#F5F3EE',
                cursor: 'pointer',
                outline: 'none',
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23B8B5AD\'%3E%3Cpath d=\'M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '14px',
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
                '&:hover': { borderColor: '#E8795A' },
                '&:focus-visible': {
                  borderColor: '#E8795A',
                  boxShadow: '0 0 0 3px rgba(232, 121, 90, 0.18)',
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              }}
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
                <option key={k} value={k} style={{ background: '#1C1C1A' }}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </Box>
          </Stack>
        )}
      </Box>

      {/* Clear all (only when at least one filter is active) */}
      {activeCount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Button
            startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
            onClick={clearAll}
            disableRipple
            sx={{
              ...pillSx(false),
              color: '#E8795A',
              borderColor: '#E8795A',
              '&:hover': {
                bgcolor: 'rgba(232, 121, 90, 0.10)',
                color: '#E8795A',
                borderColor: '#E8795A',
              },
            }}
          >
            Clear all filters
          </Button>
        </Box>
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
