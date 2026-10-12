import { Box, Chip, Tooltip } from '@mui/material';
import { Science as DemoIcon } from '@mui/icons-material';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

/**
 * Fixed banner shown only in demo builds.
 * Tells the viewer this is in-memory data, not a live backend.
 */
export const DemoBanner = () => {
  if (!DEMO_MODE) return null;
  return (
    <Tooltip title="All data is in-memory mock. No real backend is running.">
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 9999,
          opacity: 0.85,
        }}
      >
        <Chip
          icon={<DemoIcon />}
          label="Demo mode"
          color="info"
          variant="filled"
          size="small"
          sx={{ fontWeight: 700, letterSpacing: 0.5 }}
        />
      </Box>
    </Tooltip>
  );
};
