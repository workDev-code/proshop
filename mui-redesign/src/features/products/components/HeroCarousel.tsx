import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  IconButton,
  Typography,
  Button,
  MobileStepper,
} from '@mui/material';
import {
  KeyboardArrowLeft as PrevIcon,
  KeyboardArrowRight as NextIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import type { Product } from '../types';
import { PriceDisplay } from './PriceDisplay';
import { ProductRating } from './ProductRating';

interface Props {
  products: Product[];
  /** Auto-rotate interval in ms; set to 0 to disable */
  interval?: number;
}

/**
 * Auto-rotating hero banner showcasing top products.
 * - Pure MUI; no third-party carousel lib
 * - Manual prev/next + dot indicators
 * - Pauses on hover/focus
 */
export const HeroCarousel = ({ products, interval = 5000 }: Props) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = products.length;

  const next = useCallback(() => {
    setActive((a) => (a + 1) % count);
  }, [count]);
  const prev = () => setActive((a) => (a - 1 + count) % count);

  useEffect(() => {
    if (paused || count <= 1 || interval === 0) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [paused, count, interval, next]);

  if (count === 0) return null;

  const product = products[active];

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        height: { xs: 360, sm: 420, md: 460 },
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Background image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 100%), url(${product.image.replace(/\.jpg$/, '.svg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 400ms ease',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: { xs: 3, sm: 4, md: 5 },
          color: 'common.white',
        }}
      >
        <Stack spacing={1.5} sx={{ maxWidth: 560 }}>
          <Typography
            variant="overline"
            sx={{ opacity: 0.85, letterSpacing: 1, color: 'common.white' }}
          >
            Featured · {product.brand}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              lineHeight: 1.1,
              color: 'common.white',
            }}
          >
            {product.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ProductRating value={product.rating} numReviews={product.numReviews} size="medium" />
            <PriceDisplay
              value={product.price}
              variant="h5"
              color="common.white"
              sx={{ color: 'common.white' }}
            />
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            <Button
              component={RouterLink}
              to={`/product/${product._id}`}
              variant="contained"
              size="large"
              startIcon={<CartIcon />}
            >
              Shop now
            </Button>
            <Button
              component={RouterLink}
              to={`/product/${product._id}`}
              variant="outlined"
              size="large"
              sx={{
                color: 'common.white',
                borderColor: 'rgba(255,255,255,0.6)',
                '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Details
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Prev / Next arrows */}
      {count > 1 && (
        <>
          <IconButton
            onClick={prev}
            aria-label="Previous slide"
            size="small"
            sx={{
              position: 'absolute',
              left: { xs: 8, sm: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              bgcolor: 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              boxShadow: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            <PrevIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={next}
            aria-label="Next slide"
            size="small"
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              bgcolor: 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              boxShadow: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            <NextIcon fontSize="small" />
          </IconButton>
        </>
      )}

      {/* Stepper dots */}
      {count > 1 && (
        <MobileStepper
          steps={count}
          position="static"
          activeStep={active}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'transparent',
            '& .MuiMobileStepper-dot': { bgcolor: 'rgba(255,255,255,0.4)' },
            '& .MuiMobileStepper-dotActive': { bgcolor: 'common.white' },
          }}
          backButton={null}
          nextButton={null}
        />
      )}
    </Box>
  );
};
