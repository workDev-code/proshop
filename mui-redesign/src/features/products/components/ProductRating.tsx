import { Box, Rating, Typography, Stack } from '@mui/material';

interface Props {
  value: number;
  numReviews?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

/**
 * Star rating display.
 * - Filled up to `value` (e.g. 4.3)
 * - Optional review count next to it
 */
export const ProductRating = ({
  value,
  numReviews,
  size = 'small',
  showCount = true,
}: Props) => {
  const fontSize = size === 'large' ? '1.5rem' : size === 'medium' ? '1rem' : '0.875rem';

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Rating
        value={value}
        precision={0.5}
        readOnly
        size={size}
        sx={{ color: 'warning.main' }}
      />
      {showCount && numReviews !== undefined && (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize }}>
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
  <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
    {count} {count === 1 ? 'review' : 'reviews'}
  </Box>
);
