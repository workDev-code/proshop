import { Box, Rating, Typography, Stack } from '@mui/material';

interface Props {
  value: number;
  numReviews?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

/**
 * Star rating display.
 *  - Filled up to `value` (e.g. 4.3)
 *  - Optional review count next to it
 *  - Filled stars: brand yellow #F4B740
 *  - Empty stars: outlined in #3A3A36 so they read on dark surface
 */
export const ProductRating = ({
  value,
  numReviews,
  size = 'small',
  showCount = true,
}: Props) => {
  const countFontSize = size === 'large' ? '1rem' : size === 'medium' ? '0.875rem' : '0.8125rem';

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Rating
        value={value}
        precision={0.5}
        readOnly
        size={size}
        sx={{
          color: '#F4B740',
          '& .MuiRating-iconFilled': { color: '#F4B740' },
          '& .MuiRating-iconHover': { color: '#F4B740' },
          '& .MuiRating-iconEmpty': { color: 'transparent' },
        }}
      />
      {showCount && numReviews !== undefined && (
        <Typography
          component="span"
          sx={{
            color: '#B8B5AD',
            fontSize: countFontSize,
            fontVariantNumeric: 'tabular-nums',
            ml: 0.25,
          }}
        >
          ({numReviews})
        </Typography>
      )}
    </Stack>
  );
};

interface CountdownProps {
  count: number;
}
/** Lightweight counter for use in compact places (e.g. detail header). */
export const ReviewCount = ({ count }: CountdownProps) => (
  <Box component="span" sx={{ color: '#B8B5AD', fontSize: '0.875rem' }}>
    {count} {count === 1 ? 'review' : 'reviews'}
  </Box>
);
