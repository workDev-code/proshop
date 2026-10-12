import { Card, CardContent, Stack, Typography, Box, Chip } from '@mui/material';
import type { ReactNode } from 'react';
import {
  TrendingUp as UpIcon,
  TrendingDown as DownIcon,
  TrendingFlat as FlatIcon,
} from '@mui/icons-material';

export type StatColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface Props {
  /** Overline label (rendered uppercase). */
  label: string;
  /** Headline value — usually a number or money string. */
  value: string | number;
  /** Icon shown inside the colored badge. */
  icon: ReactNode;
  /** Tone for the icon badge. Defaults to primary. */
  color?: StatColor;
  /** Optional trend chip (e.g. "+12% vs last week"). */
  trend?: { delta: string; direction: 'up' | 'down' | 'flat' };
  /** Subtle supporting line under the value (e.g. "5 paid · 2 pending"). */
  sublabel?: string;
}

/** Map a StatColor token to a soft background + saturated foreground. */
const TONE: Record<
  StatColor,
  { bg: string; fg: string; bar: string }
> = {
  primary:   { bg: 'rgba(217, 93, 57, 0.10)', fg: '#d95d39', bar: '#d95d39' },
  secondary: { bg: 'rgba(32, 33, 31, 0.06)',  fg: '#20211f', bar: '#20211f' },
  success:   { bg: 'rgba(74, 107, 58, 0.10)', fg: '#4a6b3a', bar: '#4a6b3a' },
  warning:   { bg: 'rgba(201, 138, 37, 0.12)', fg: '#c98a25', bar: '#c98a25' },
  error:     { bg: 'rgba(184, 68, 37, 0.10)',  fg: '#b84425', bar: '#b84425' },
  info:      { bg: 'rgba(90, 107, 122, 0.12)', fg: '#5a6b7a', bar: '#5a6b7a' },
};

export const StatCard = ({
  label,
  value,
  icon,
  color = 'primary',
  trend,
  sublabel,
}: Props) => {
  const tone = TONE[color];
  const TrendIcon =
    trend?.direction === 'up' ? UpIcon : trend?.direction === 'down' ? DownIcon : FlatIcon;
  const trendColor =
    trend?.direction === 'up'
      ? 'success.main'
      : trend?.direction === 'down'
      ? 'error.main'
      : 'text.secondary';

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        '&:hover': { transform: 'translateY(-1px)', boxShadow: 2 },
      }}
    >
      {/* Tone bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: tone.bar,
        }}
      />
      <CardContent sx={{ p: 2.5, pb: '20px !important' }}>
        <Stack direction="row" alignItems="flex-start" spacing={1.75}>
          {/* Icon badge */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: tone.bg,
              color: tone.fg,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              '& .MuiSvgIcon-root': { fontSize: 22 },
            }}
          >
            {icon}
          </Box>

          {/* Text */}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{
                display: 'block',
                lineHeight: 1.2,
                letterSpacing: 0.6,
                fontSize: '0.65rem',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {label}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'text.primary',
                fontFeatureSettings: '"tnum" 1',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value}
            </Typography>

            {/* Sublabel OR trend chip — never both */}
            {sublabel && !trend && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5, lineHeight: 1.3 }}
              >
                {sublabel}
              </Typography>
            )}
            {trend && (
              <Chip
                icon={<TrendIcon sx={{ fontSize: '14px !important' }} />}
                label={trend.delta}
                size="small"
                variant="outlined"
                sx={{
                  mt: 1,
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: 0.3,
                  color: trendColor,
                  borderColor: 'divider',
                  bgcolor: 'transparent',
                  '& .MuiChip-icon': { ml: 0.5, color: 'inherit' },
                }}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
