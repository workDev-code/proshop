import { useParams, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography, Grid2 as Grid, Button, Chip } from '@mui/material';
import {
  SearchOff as NoSearchIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters, paramsToQuery } from '../components/ProductFilters';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Pagination } from '../../../components/feedback/Pagination';
import { useGetProductsQuery } from '../productApi';

export const SearchPage = () => {
  const { keyword = '' } = useParams<{ keyword: string }>();
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
    <Box>
      <PageHeader
        title="Search results"
        icon={<NoSearchIcon />}
        actions={
          <Button
            component={RouterLink}
            to="/"
            startIcon={<BackIcon />}
            variant="outlined"
            size="small"
          >
            Back to home
          </Button>
        }
      />

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Results for
        </Typography>
        <Chip
          label={decodeURIComponent(keyword)}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
        {data && (
          <Typography variant="body2" color="text.secondary">
            · {data.total} {data.total === 1 ? 'result' : 'results'}
          </Typography>
        )}
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <ProductFilters facets={data?.facets} />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {isLoading ? (
            <LoadingState variant="card" count={6} />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : !data || data.products.length === 0 ? (
            <EmptyState
              title="No matches"
              description={`We couldn't find anything matching "${decodeURIComponent(
                keyword,
              )}". Try different keywords or adjust the filters.`}
              action={{
                label: 'Browse all products',
                onClick: () => window.location.assign('/'),
              }}
            />
          ) : (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
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
        </Grid>
      </Grid>
    </Box>
  );
};
