import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface Props {
  value: number;
  variant?: 'h4' | 'h5' | 'h6' | 'subtitle1' | 'body1' | 'body2';
  /** Any valid MUI color token (e.g. "primary.main", "text.secondary", "common.white") */
  color?: string;
  sx?: SxProps<Theme>;
  prefix?: string;
}

/**
 * Currency-formatted price display.
 * Defaults to USD; controlled size + color.
 */
export const PriceDisplay = ({
  value,
  variant = 'h6',
  color = 'text.primary',
  sx,
  prefix = '$',
}: Props) => (
  <Typography
    component="span"
    variant={variant}
    color={color}
    sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', ...sx }}
  >
    {prefix}
    {value.toFixed(2)}
  </Typography>
);
