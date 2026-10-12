import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TextField,
  Slider,
  Rating,
  Switch,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  ClearAll as ClearIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import type { ProductListResponse, SortOption, ProductQueryParams } from '../types';
import { SORT_LABELS } from '../types';

const ALL = '__all__';

interface Props {
  facets: ProductListResponse['facets'] | undefined;
}

/**
 * URL-driven filter sidebar.
 *  - Reads initial state from ?category, ?brand, ?priceMin, ?priceMax, ?minRating, ?inStock, ?sort
 *  - Updates URL on every change → shareable links & back-button support
 *  - Parent pages (HomePage/SearchPage) read the same URL via useSearchParams and pass
 *    the resulting ProductQueryParams to useGetProductsQuery
 */
export const ProductFilters = ({ facets }: Props) => {
  const [params, setParams] = useSearchParams();
  const [expanded, setExpanded] = useState(true);

  // --- Read current filter values from URL ---
  const category = params.get('category') ?? '';
  const brands = (params.get('brand') ?? '').split(',').filter(Boolean);
  const priceMin = Number(params.get('priceMin') ?? 0);
  const priceMax = Number(params.get('priceMax') ?? 2000);
  const minRating = Number(params.get('minRating') ?? 0);
  const inStock = params.get('inStock') === 'true';
  const sort = (params.get('sort') ?? 'newest') as SortOption;

  // --- URL update helpers ---
  const update = useCallback(
    (patch: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === '' || v === '0') next.delete(k);
            else next.set(k, v);
          });
          // Reset page when filters change
          if (!('pageNumber' in patch)) next.delete('pageNumber');
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const setCategory = (v: string) => update({ category: v === ALL ? null : v });
  const toggleBrand = (b: string) => {
    const next = brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b];
    update({ brand: next.length ? next.join(',') : null });
  };
  const setPrice = (lo: number, hi: number) =>
    update({
      priceMin: lo > 0 ? String(lo) : null,
      priceMax: hi < 2000 ? String(hi) : null,
    });
  const setMinRating = (v: number | null) =>
    update({ minRating: v && v > 0 ? String(v) : null });
  const setInStock = (v: boolean) => update({ inStock: v ? 'true' : null });
  const setSort = (v: SortOption) => update({ sort: v === 'newest' ? null : v });
  const resetAll = () => setParams(new URLSearchParams(), { replace: true });

  const activeCount =
    (category ? 1 : 0) +
    brands.length +
    (priceMin > 0 || priceMax < 2000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStock ? 1 : 0);

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        position: { md: 'sticky' },
        top: { md: 80 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TuneIcon fontSize="small" color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Filters
          </Typography>
          {activeCount > 0 && (
            <Chip label={activeCount} size="small" color="primary" />
          )}
        </Stack>
        <Stack direction="row">
          <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
            <IconButton size="small" onClick={() => setExpanded((v) => !v)}>
              {expanded ? <CollapseIcon /> : <ExpandIcon />}
            </IconButton>
          </Tooltip>
          {activeCount > 0 && (
            <Tooltip title="Clear all">
              <IconButton size="small" onClick={resetAll}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
      <Divider sx={{ mb: 1.5 }} />

      <Collapse in={expanded}>
        <Stack spacing={2.5}>
          {/* Sort */}
          <Box>
            <Typography variant="overline" color="text.secondary">
              Sort by
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              SelectProps={{ native: true }}
              sx={{ mt: 0.5 }}
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </TextField>
          </Box>

          <Divider />

          {/* Category */}
          {facets?.categories && facets.categories.length > 0 && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Category
              </Typography>
              <RadioGroup
                value={category || ALL}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ mt: 0.5 }}
              >
                <FormControlLabel value={ALL} control={<Radio size="small" />} label="All" />
                {facets.categories.map((c) => (
                  <FormControlLabel
                    key={c}
                    value={c}
                    control={<Radio size="small" />}
                    label={c}
                  />
                ))}
              </RadioGroup>
            </Box>
          )}

          {facets?.categories && facets.categories.length > 0 && (
            <Divider />
          )}

          {/* Brand */}
          {facets?.brands && facets.brands.length > 0 && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Brand
              </Typography>
              <FormGroup sx={{ mt: 0.5, maxHeight: 200, overflowY: 'auto' }}>
                {facets.brands.map((b) => (
                  <FormControlLabel
                    key={b}
                    control={
                      <Checkbox
                        size="small"
                        checked={brands.includes(b)}
                        onChange={() => toggleBrand(b)}
                      />
                    }
                    label={b}
                  />
                ))}
              </FormGroup>
            </Box>
          )}

          {facets?.brands && facets.brands.length > 0 && <Divider />}

          {/* Price range */}
          <Box>
            <Typography variant="overline" color="text.secondary">
              Price
            </Typography>
            <Box sx={{ px: 1, mt: 2 }}>
              <Slider
                value={[priceMin, priceMax]}
                onChange={(_, v) => {
                  const [lo, hi] = v as number[];
                  setPrice(lo, hi);
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `$${v}`}
                min={0}
                max={2000}
                step={10}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 2000, label: '$2k' },
                ]}
              />
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <TextField
                size="small"
                label="Min"
                type="number"
                value={priceMin}
                onChange={(e) => {
                  const v = Math.max(0, Number(e.target.value) || 0);
                  setPrice(Math.min(v, priceMax), priceMax);
                }}
                inputProps={{ min: 0 }}
                sx={{ width: '50%' }}
              />
              <TextField
                size="small"
                label="Max"
                type="number"
                value={priceMax}
                onChange={(e) => {
                  const v = Math.min(2000, Number(e.target.value) || 2000);
                  setPrice(priceMin, v);
                }}
                inputProps={{ min: 0 }}
                sx={{ width: '50%' }}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Min rating */}
          <Box>
            <Typography variant="overline" color="text.secondary">
              Min rating
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
              <Rating
                value={minRating}
                onChange={(_, v) => setMinRating(v)}
                precision={0.5}
              />
              {minRating > 0 && (
                <Button size="small" onClick={() => setMinRating(null)}>
                  Clear
                </Button>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* In stock */}
          <FormControlLabel
            control={
              <Switch
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
            }
            label="In stock only"
          />

          {activeCount > 0 && (
            <Button variant="outlined" fullWidth onClick={resetAll} startIcon={<ClearIcon />}>
              Clear all filters
            </Button>
          )}
        </Stack>
      </Collapse>
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
