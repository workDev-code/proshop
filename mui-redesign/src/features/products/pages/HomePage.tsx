import { useSearchParams } from 'react-router-dom';
import { Box, Stack, Typography, Grid2 as Grid } from '@mui/material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters, paramsToQuery } from '../components/ProductFilters';
import { HeroCarousel } from '../components/HeroCarousel';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Pagination } from '../../../components/feedback/Pagination';
import { useGetProductsQuery, useGetTopProductsQuery } from '../productApi';
import { Storefront as StoreIcon } from '@mui/icons-material';

export const HomePage = () => {
  const [params, setParams] = useSearchParams();
  const query = paramsToQuery(params);
  const page = Number(params.get('pageNumber') ?? 1);

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchList,
  } = useGetProductsQuery(query);
  const {
    data: top,
    isLoading: topLoading,
  } = useGetTopProductsQuery();

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
        title="Welcome to ProShop"
        subtitle="Discover top-rated products curated for you"
        icon={<StoreIcon />}
      />

      {/* Hero carousel */}
      {topLoading ? (
        <Box sx={{ height: { xs: 360, sm: 420, md: 460 }, mb: 4 }}>
          <LoadingState variant="card" count={1} />
        </Box>
      ) : top && top.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <HeroCarousel products={top} />
        </Box>
      ) : null}

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid size={{ xs: 12, md: 3 }}>
          <ProductFilters facets={list?.facets} />
        </Grid>

        {/* Product grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              All products
            </Typography>
            {list && (
              <Typography variant="body2" color="text.secondary">
                {list.total} {list.total === 1 ? 'result' : 'results'}
              </Typography>
            )}
          </Stack>

          {listLoading ? (
            <LoadingState variant="card" count={8} />
          ) : listError ? (
            <ErrorState
              title="Could not load products"
              message="Please check your connection and try again."
              onRetry={refetchList}
            />
          ) : !list || list.products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search terms."
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
                {list.products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </Box>
              <Pagination
                page={page}
                pages={list.pages}
                total={list.total}
                onChange={setPage}
              />
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
