import { Chip } from '@mui/material';
import {
  CheckCircle as InStockIcon,
  Cancel as OutIcon,
  Warning as LowIcon,
} from '@mui/icons-material';

interface Props {
  count: number;
  size?: 'small' | 'medium';
  showCount?: boolean;
}

/**
 * Stock indicator badge.
 *   count > 5   → "In stock" (green)
 *   1 ≤ count ≤ 5 → "Only N left" (orange)
 *   count === 0 → "Out of stock" (red)
 */
export const StockBadge = ({ count, size = 'small', showCount = true }: Props) => {
  if (count === 0) {
    return (
      <Chip
        icon={<OutIcon />}
        label="Out of stock"
        color="error"
        size={size}
        variant="outlined"
        sx={{ fontWeight: 600 }}
      />
    );
  }
  if (count <= 5) {
    return (
      <Chip
        icon={<LowIcon />}
        label={showCount ? `Only ${count} left` : 'Low stock'}
        color="warning"
        size={size}
        variant="outlined"
        sx={{ fontWeight: 600 }}
      />
    );
  }
  return (
    <Chip
      icon={<InStockIcon />}
      label="In stock"
      color="success"
      size={size}
      variant="outlined"
      sx={{ fontWeight: 600 }}
    />
  );
};
