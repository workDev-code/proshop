import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Link as MuiLink } from '@mui/material';
import { ArrowOutward as ArrowIcon } from '@mui/icons-material';
import { EmptyState } from '../../../components/feedback/EmptyState';

interface Props {
  /** List of category names from the backend facets. */
  categories?: string[];
  /** Optional preview image per category (e.g. first product of that category). */
  previews?: Record<string, string | undefined>;
}

/**
 * 4-column grid of category tiles (responsive: 2-col on mobile).
 * Matches `.categories` / `.category` from the approved HTML prototype.
 *
 *  - Each tile is a Link to `/?category=<name>` (pushes URL search param)
 *  - Dark gradient overlay on top of the image for legibility
 *  - Arrow button in the bottom-right corner
 *
 *  Falls back to the shared <EmptyState> when no categories exist.
 *  Never renders hardcoded categories.
 */
export const CategoryGrid = ({ categories, previews }: Props) => {
  const navigate = useNavigate();

  const items = categories ?? [];
  const hasItems = items.length > 0;

  return (
    <Box component="section" id="categories" sx={{ py: { xs: 6, md: 9 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
        gap={3}
        sx={{ mb: { xs: 3, md: 3.5 } }}
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
            Find your everyday
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.045em',
              m: 0,
            }}
          >
            Shop by category
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1.25, fontSize: '0.75rem' }}
          >
            Useful things, thoughtfully made.
          </Typography>
        </Box>
        <MuiLink
          href="#featured"
          underline="none"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'text.primary',
            pb: 0.75,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.25,
            whiteSpace: 'nowrap',
            '&:hover': { color: 'secondary.main', borderColor: 'secondary.main' },
          }}
        >
          Browse everything
          <ArrowIcon sx={{ fontSize: 14 }} />
        </MuiLink>
      </Stack>

      {!hasItems ? (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <EmptyState
            title="No categories yet"
            description="Once products are added with categories, they'll appear here."
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 1.25, md: 2 },
          }}
        >
          {items.map((name) => (
            <CategoryTile
              key={name}
              name={name}
              image={previews?.[name]}
              onClick={() => navigate(`/?category=${encodeURIComponent(name)}`)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

interface TileProps {
  name: string;
  image?: string;
  onClick: () => void;
}

const TILE_BGS = ['#e7e8df', '#e8e0d8', '#e4e7e9', '#e8e5dc'];

const CategoryTile = ({ name, image, onClick }: TileProps) => {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const fallbackBg = TILE_BGS[hash % TILE_BGS.length];

  return (
    <Box
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        position: 'relative',
        minHeight: { xs: 180, md: 220 },
        borderRadius: 2.25,
        overflow: 'hidden',
        cursor: 'pointer',
        bgcolor: fallbackBg,
        display: 'flex',
        alignItems: 'flex-end',
        p: { xs: 1.75, md: 2.75 },
        isolation: 'isolate',
        transition: 'transform 250ms ease, box-shadow 250ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 18px 50px rgba(32,33,31,0.10)',
        },
        '&:hover .category-img': { transform: 'scale(1.06)' },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'secondary.main',
          outlineOffset: 2,
        },
      }}
    >
      {image ? (
        <Box
          className="category-img"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 500ms ease',
            zIndex: -2,
          }}
        />
      ) : null}

      {/* Dark gradient overlay */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(0deg, rgba(24,25,22,0.58) 0%, transparent 70%)',
          zIndex: -1,
        }}
      />

      <Box sx={{ position: 'relative', color: 'common.white' }}>
        <Typography
          component="h3"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1rem', md: '1.1875rem' },
            letterSpacing: '-0.025em',
            color: 'common.white',
            m: 0,
            mb: 0.75,
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.6875rem',
            color: 'rgba(255,255,255,0.78)',
            m: 0,
          }}
        >
          Shop now
        </Typography>
      </Box>

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          right: { xs: 12, md: 18 },
          bottom: { xs: 13, md: 20 },
          width: { xs: 27, md: 32 },
          height: { xs: 27, md: 32 },
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.55)',
          color: 'common.white',
          display: 'grid',
          placeItems: 'center',
          '& svg': { fontSize: { xs: 14, md: 16 } },
        }}
      >
        <ArrowIcon />
      </Box>
    </Box>
  );
};
