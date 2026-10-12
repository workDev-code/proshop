import { Box, Stack, Typography, Avatar, Divider } from '@mui/material';
import type { Review } from '../types';
import { ProductRating } from './ProductRating';
import { fmtDate } from '../../../utils/fmt';

interface Props {
  review: Review;
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** Lightweight date formatter: "Oct 12, 2026" */


export const ReviewItem = ({ review }: Props) => (
  <Box sx={{ py: 2 }}>
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Avatar sx={{ bgcolor: 'primary.main', fontSize: 14, fontWeight: 600 }}>
        {initials(review.name)}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 0.5, sm: 2 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {review.name}
          </Typography>
          <ProductRating value={review.rating} showCount={false} size="small" />
          <Typography variant="caption" color="text.secondary">
            {fmtDate(review.createdAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
          {review.comment}
        </Typography>
      </Box>
    </Stack>
    <Divider sx={{ mt: 2 }} />
  </Box>
);
