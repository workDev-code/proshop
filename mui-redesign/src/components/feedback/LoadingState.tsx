import { Box, Stack, Skeleton, Card, CardContent } from '@mui/material';


interface Props {
  variant?: 'card' | 'list' | 'inline' | 'detail';
  count?: number;
}

export const LoadingState = ({ variant = 'card', count = 6 }: Props) => {
  if (variant === 'inline') {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ width: 120 }} />
      </Stack>
    );
  }

  if (variant === 'detail') {
    return (
      <Box>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '2rem', mt: 2, width: '60%' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', mt: 1, width: '90%' }} />
        <Skeleton variant="rectangular" height={80} sx={{ mt: 2, borderRadius: 2 }} />
      </Box>
    );
  }

  if (variant === 'list') {
    return (
      <Stack spacing={1}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={56}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Stack>
    );
  }

  // default: card grid
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <Skeleton variant="rectangular" height={180} />
          <CardContent>
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%' }} />
            <Skeleton variant="text" sx={{ fontSize: '1.25rem', mt: 1, width: '40%' }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

// keep Typography import used
