import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Admin stat card matching the approved HTML prototype.
 *
 * Layout:
 *   ┌─────────────────────────────────────┐
 *   │ Label                    [icon]      │  <- icon badge in top-right
 *   │                                      │
 *   │ 1,234                                 │  <- large number (Manrope 800)
 *   │ ↗ 12% vs. last month                 │  <- small caption with optional <b>
 *   └─────────────────────────────────────┘
 *
 * Visual: flat white panel, 1px #e9ecf1 border, 13px radius, 19px padding.
 */
export interface StatCardProps {
  /** Overline label (rendered small, muted). */
  label: string;
  /** Headline value — usually a number or money string. */
  value: string | number;
  /** Icon shown inside the badge in the top-right corner. */
  icon: ReactNode;
  /** Caption under the value. Pass a ReactNode to control formatting
   *  (e.g. include a <b> for the trend delta). Plain string works too. */
  caption?: ReactNode;
}

/**
 * Single-tone icon badge in the top-right of the stat card.
 * The prototype always uses the soft terracotta pair (#fff0eb / #dc6241)
 * regardless of the metric being shown, so we hard-code it here.
 */
export const StatCard = ({ label, value, icon, caption }: StatCardProps) => (
  <Box
    sx={{
      bgcolor: '#fff',
      border: '1px solid #e9ecf1',
      borderRadius: '13px',
      p: '19px',
      minWidth: 0,
    }}
  >
    {/* Label (left) + icon badge (right) */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#747e90',
        fontSize: 11,
        gap: 1,
      }}
    >
      <span>{label}</span>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '9px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: '#fff0eb',
          color: '#dc6241',
          fontSize: 15,
          flexShrink: 0,
          '& svg': { fontSize: 17 },
        }}
        aria-hidden
      >
        {icon}
      </Box>
    </Box>

    {/* Headline value */}
    <Typography
      component="strong"
      sx={{
        display: 'block',
        fontFamily: '"Manrope", sans-serif',
        fontSize: 25,
        fontWeight: 800,
        letterSpacing: '-0.8px',
        color: '#222938',
        my: '17px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {value}
    </Typography>

    {/* Caption */}
    {caption && (
      <Box
        component="small"
        sx={{
          display: 'block',
          fontSize: 10,
          color: '#7a8494',
          // If caption is a plain string and contains inline markup, fall
          // back to defaults; ReactNode lets callers pass JSX with <b>.
          '& b': { color: '#1a9b72', marginRight: 0.5 },
        }}
      >
        {caption}
      </Box>
    )}
  </Box>
);
