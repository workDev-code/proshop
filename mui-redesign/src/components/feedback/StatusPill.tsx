import { Box, type SxProps, type Theme } from '@mui/material';

export type PillTone = 'success' | 'warning' | 'info' | 'error' | 'neutral';

const TONE: Record<
  PillTone,
  { bg: string; fg: string }
> = {
  success:  { bg: '#e8f7f0', fg: '#17845e' },
  warning:  { bg: '#fff4df', fg: '#a96a0b' },
  info:     { bg: '#eaf2ff', fg: '#326bc4' },
  error:    { bg: '#ffeded', fg: '#c84c4c' },
  neutral:  { bg: '#f0f2f5', fg: '#5e6057' },
};

interface Props {
  label: string;
  tone?: PillTone;
  sx?: SxProps<Theme>;
}

/**
 * Small status pill matching the prototype (9px, pill shape).
 *
 *   .status.paid { background:#e8f7f0; color:#17845e }
 *   .status.pending { background:#fff4df; color:#a96a0b }
 *   .status.shipped { background:#eaf2ff; color:#326bc4 }
 *   .status.cancelled { background:#ffeded; color:#c84c4c }
 */
export const StatusPill = ({ label, tone = 'neutral', sx }: Props) => {
  const t = TONE[tone];
  return (
    <Box
      component="span"
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          px: 1,
          py: 0.6,
          borderRadius: 99,
          fontSize: '0.5625rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          bgcolor: t.bg,
          color: t.fg,
          whiteSpace: 'nowrap',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {label}
    </Box>
  );
};
