import { Box, Typography, Button } from '@mui/material';
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
      py: { xs: 6, sm: 8 },
      px: 2,
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'action.hover',
        color: 'text.secondary',
        mb: 2,
        '& svg': { fontSize: 28 },
      }}
    >
      {icon ?? <InboxIcon fontSize="inherit" />}
    </Box>
    <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: action ? 3 : 0 }}>
        {description}
      </Typography>
    )}
    {action && (
      <Button
        variant="contained"
        onClick={action.onClick}
        startIcon={action.icon}
        sx={{ mt: 1 }}
      >
        {action.label}
      </Button>
    )}
  </Box>
);
