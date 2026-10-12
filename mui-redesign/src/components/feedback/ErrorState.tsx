import { Box, Typography, Button, Stack } from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { ReactNode } from 'react';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: ReactNode;
  /** Show full-page layout (centered) vs inline */
  fullPage?: boolean;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not load this data. Please try again.',
  onRetry,
  icon,
  fullPage = false,
}: Props) => {
  const content = (
    <Stack alignItems="center" spacing={2} sx={{ p: 3, textAlign: 'center' }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'error.lighter',
          color: 'error.main',
        }}
      >
        {icon ?? <ErrorIcon sx={{ fontSize: 32 }} />}
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          {message}
        </Typography>
      </Box>
      {onRetry && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </Stack>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {content}
      </Box>
    );
  }
  return content;
};
