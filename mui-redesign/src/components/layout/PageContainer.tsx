import { Box, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * Max-width of the centered content.
   *   'wide' = 1400px (default) — for catalog/dashboards
   *   'narrow' = 960px — for forms, single-column content
   *   'full' = no max-width — for hero pages that need full bleed
   *   number — exact px value
   */
  maxWidth?: 'wide' | 'narrow' | 'full' | number;
  /** Disable horizontal padding (e.g. for hero pages) */
  disableGutters?: boolean;
  /** Vertical padding */
  py?: number | { xs?: number; sm?: number; md?: number };
  sx?: SxProps<Theme>;
}

const MAX_WIDTHS = {
  wide: 1400,
  narrow: 960,
  full: undefined as number | undefined,
};

/**
 * Centers page content with sensible max-width and horizontal padding.
 *
 * Usage:
 *   <PageContainer>
 *     <h1>...</h1>
 *   </PageContainer>
 *
 *   <PageContainer maxWidth="narrow">  // 960px
 *   <PageContainer maxWidth={1200}>    // custom
 *   <PageContainer disableGutters>     // full-bleed (e.g. for hero)
 */
export const PageContainer = ({
  children,
  maxWidth = 'wide',
  disableGutters = false,
  py = 3,
  sx,
}: Props) => {
  const resolvedMaxWidth =
    typeof maxWidth === 'number'
      ? maxWidth
      : MAX_WIDTHS[maxWidth];

  return (
    <Box
      sx={[
        {
          width: '100%',
          maxWidth: resolvedMaxWidth,
          mx: 'auto', // ← centers horizontally
          px: disableGutters ? 0 : { xs: 2, sm: 3, md: 4 },
          py,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
};
