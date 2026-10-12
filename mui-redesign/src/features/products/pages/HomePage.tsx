import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters, paramsToQuery } from '../components/ProductFilters';
import { HeroBanner } from '../components/HeroBanner';
import { TrustBadges } from '../components/TrustBadges';
import { CategoryGrid } from '../components/CategoryGrid';
import { FeatureCard } from '../components/FeatureCard';
import { EditorialCards } from '../components/EditorialCards';
import { Newsletter } from '../components/Newsletter';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { Pagination } from '../../../components/feedback/Pagination';
import { useGetProductsQuery, useGetTopProductsQuery } from '../productApi';

/**
 * Storefront home page.
 *
 * Sections (per approved HTML prototype):
 *   1. HeroBanner       — 2-col panel with featured product artwork
 *   2. TrustBadges      — 4-col strip (shipping / returns / checkout / support)
 *   3. CategoryGrid     — 4-col tile grid powered by the Category API
 *                         (fetches its own data, no props)
 *   4. Featured products — pill filters + 4-col product grid + pagination
 *   5. FeatureCard      — 2-col editorial panel
 *   6. EditorialCards   — 2-col asymmetric editorial
 *   7. Newsletter       — centered subscribe box
 *
 * All data comes from real backend (no mock arrays). Empty states are
 * rendered when facets/top products are absent.
 */
export const HomePage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const query = paramsToQuery(params);
  const page = Number(params.get('pageNumber') ?? 1);

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchList,
  } = useGetProductsQuery(query);
  const { data: top, isLoading: topLoading } = useGetTopProductsQuery();

  const setPage = (p: number) => {
    const next = new URLSearchParams(params);
    if (p === 1) next.delete('pageNumber');
    else next.set('pageNumber', String(p));
    setParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredHero = top?.[0];
  const featureCardProduct = top?.[1];
  const editorialItems = (top ?? []).slice(2, 4);

  return (
    <Box>
      {/* 1. Hero */}
      <Box sx={{ pt: { xs: 2, md: 3.5 }, pb: { xs: 4, md: 7 } }}>
        {topLoading ? (
          <Box sx={{ minHeight: { xs: 360, md: 480 }, borderRadius: '26px' }}>
            <LoadingState variant="card" count={1} />
          </Box>
        ) : (
          <HeroBanner product={featuredHero} />
        )}
      </Box>

      {/* 2. Trust badges */}
      <Box sx={{ pb: { xs: 3.5, md: 4 } }}>
        <TrustBadges />
      </Box>

      {/* 3. Category grid — fetches its own data via useGetCategoriesQuery */}
      <CategoryGrid />

      {/* 4. Featured products */}
      <Box
        component="section"
        id="featured"
        sx={{
          bgcolor: 'rgba(239, 239, 233, 0.6)',
          borderRadius: { xs: '20px', md: '24px' },
          py: { xs: 6, md: 8.75 },
          px: { xs: 3, md: 5 },
          mb: { xs: 6, md: 9 },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
          gap={2}
          sx={{ mb: { xs: 2.5, md: 3 } }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'secondary.main',
                mb: 1.25,
              }}
            >
              Featured
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                color: 'text.primary',
                m: 0,
              }}
            >
              The everyday edit
            </Typography>
            {list && (
              <Typography sx={{ mt: 1.25, fontSize: 12, color: 'text.secondary' }}>
                {list.total} {list.total === 1 ? 'product' : 'products'} in the collection
              </Typography>
            )}
          </Box>
          <Box
            component="a"
            href="#featured"
            onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/?sort=newest'); }}
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
              borderBottom: '1px solid',
              borderColor: 'text.primary',
              pb: 0.75,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            View all
            <ArrowIcon sx={{ fontSize: 14 }} />
          </Box>
        </Stack>

        {/* Pill filters */}
        <ProductFilters facets={list?.facets} />

        {/* Grid */}
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
                gap: { xs: 2.75, md: 2.25 },
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                  lg: 'repeat(4, minmax(0, 1fr))',
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
      </Box>

      {/* 5. Feature card */}
      {featureCardProduct && (
        <Box sx={{ mb: { xs: 6, md: 9 } }}>
          <FeatureCard product={featureCardProduct} />
        </Box>
      )}

      {/* 6. Editorial cards */}
      {editorialItems.length > 0 && (
        <Box sx={{ mb: { xs: 6, md: 9 } }}>
          <EditorialCards items={editorialItems} />
        </Box>
      )}

      {/* 7. Newsletter */}
      <Box sx={{ mb: { xs: 6, md: 9 } }}>
        <Newsletter />
      </Box>
    </Box>
  );
};
