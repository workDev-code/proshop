import { useParams, useSearchParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Button, Chip } from '@mui/material';
import {
  SearchOff as NoSearchIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters, paramsToQuery } from '../components/ProductFilters';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Pagination } from '../../../components/feedback/Pagination';
import { useGetProductsQuery } from '../productApi';

/**
 * Search results page.
 *
 * Mirrors the storefront's "Featured products" section pattern:
 *   [results header + back button]
 *   [horizontal pill filters]
 *   [4-col product grid + pagination]
 */
export const SearchPage = () => {
  const { keyword = '' } = useParams<{ keyword: string }>();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = paramsToQuery(params);
  const page = Number(params.get('pageNumber') ?? 1);

  const { data, isLoading, isError, refetch } = useGetProductsQuery(query);

  const setPage = (p: number) => {
    const next = new URLSearchParams(params);
    if (p === 1) next.delete('pageNumber');
    else next.set('pageNumber', String(p));
    setParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ pt: { xs: 2, md: 3.5 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: { xs: 3, md: 4 } }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <NoSearchIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
          <Box>
            <Box
              sx={{
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'secondary.main',
                mb: 0.75,
              }}
            >
              Search results
            </Box>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Chip
                label={decodeURIComponent(keyword)}
                color="secondary"
                sx={{ fontWeight: 600, height: 24 }}
              />
              {data && (
                <Typography variant="body2" color="text.secondary">
                  · {data.total} {data.total === 1 ? 'result' : 'results'}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<BackIcon />}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 999 }}
        >
          Back to home
        </Button>
      </Stack>

      {/* Pills */}
      <ProductFilters facets={data?.facets} />

      {/* Grid */}
      {isLoading ? (
        <LoadingState variant="card" count={8} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !data || data.products.length === 0 ? (
        <EmptyState
          title="No matches"
          description={`We couldn't find anything matching "${decodeURIComponent(
            keyword,
          )}". Try different keywords or clear the filters.`}
          action={{
            label: 'Browse all products',
            onClick: () => navigate('/'),
          }}
        />
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2.75, md: 2.25 },
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
            }}
          >
            {data.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </Box>
          <Pagination
            page={page}
            pages={data.pages}
            total={data.total}
            onChange={setPage}
          />
        </>
      )}
    </Box>
  );
};
