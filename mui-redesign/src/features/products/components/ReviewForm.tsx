import { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateReviewMutation } from '../productApi';
import { useCurrentUser } from '../../auth/hooks';
import { useToast } from '../../../hooks/useToast';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please choose a rating').max(5),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review is too long'),
});
type ReviewFormValues = z.infer<typeof reviewSchema>;

interface Props {
  productId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ productId, onSuccess }: Props) => {
  const toast = useToast();
  const { user } = useCurrentUser();
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState } =
    useForm<ReviewFormValues>({
      resolver: zodResolver(reviewSchema),
      defaultValues: { rating: 0, comment: '' },
    });

  const rating = watch('rating');

  const onSubmit = async (values: ReviewFormValues) => {
    setSubmitError(null);
    try {
      await createReview({ productId, payload: values }).unwrap();
      toast.success('Review submitted. Thanks!');
      reset();
      onSuccess?.();
    } catch (err) {
      const e = err as { data?: { message?: string } };
      const msg = e.data?.message ?? 'Could not submit review';
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  if (!user) {
    return (
      <Alert severity="info">
        Please sign in to leave a review.
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Write a review
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Your rating
          </Typography>
          <Rating
            value={rating}
            onChange={(_, v) => setValue('rating', v ?? 0, { shouldValidate: true })}
            size="large"
          />
          {formState.errors.rating && (
            <Typography variant="caption" color="error">
              {formState.errors.rating.message}
            </Typography>
          )}
        </Box>

        <TextField
          {...register('comment')}
          label="Your review"
          multiline
          minRows={4}
          fullWidth
          placeholder="What did you like or dislike? Share your thoughts..."
          error={!!formState.errors.comment}
          helperText={formState.errors.comment?.message}
        />

        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isLoading ? 'Submitting…' : 'Submit review'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
