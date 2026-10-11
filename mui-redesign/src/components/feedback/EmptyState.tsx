import { Box, Typography, Button, Stack } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void; icon?: ReactNode };
}

export const EmptyState = ({ title, description, icon, action }: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 2,
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'action.hover',
        color: 'text.secondary',
        mb: 2,
        fontSize: 36,
      }}
    >
      {icon ?? <InboxIcon fontSize="inherit" />}
    </Box>
    <Typography variant="h6" sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 3 }}>
        {description}
      </Typography>
    )}
    {action && (
      <Stack>
        <Button
          variant="contained"
          onClick={action.onClick}
          startIcon={action.icon ?? undefined}
        >
          {action.label}
        </Button>
      </Stack>
    )}
  </Box>
);
