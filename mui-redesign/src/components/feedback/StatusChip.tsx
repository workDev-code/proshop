import { Chip, type ChipProps } from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Schedule as PendingIcon,
  LocalShipping as ShipIcon,
  Done as DoneIcon,
  Inventory2 as StockIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import type { ReactNode } from 'react';

/**
 * Semantic status chip with consistent colors + icons.
 * Used across orders, products, coupons, payments.
 *
 * Variants:
 *   - success (Paid, Delivered, Active, In stock)
 *   - warning (Pending, Low stock, Awaiting)
 *   - error   (Failed, Out of stock, Expired, Inactive)
 *   - info    (Shipped, Admin)
 *   - neutral (Draft, Archived)
 */

export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface Props extends Omit<ChipProps, 'color' | 'icon' | 'label' | 'variant'> {
  status: StatusVariant;
  label: string;
  /** Override the default icon for this variant */
  icon?: ReactNode;
}

const ICONS: Record<StatusVariant, ReactNode> = {
  success: <CheckIcon sx={{ fontSize: 14 }} />,
  warning: <PendingIcon sx={{ fontSize: 14 }} />,
  error: <BlockIcon sx={{ fontSize: 14 }} />,
  info: <ShipIcon sx={{ fontSize: 14 }} />,
  neutral: <DoneIcon sx={{ fontSize: 14 }} />,
};

const COLOR_MAP: Record<StatusVariant, ChipProps['color']> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  neutral: 'default',
};

export const StatusChip = ({
  status,
  label,
  icon,
  size = 'small',
  sx,
  ...rest
}: Props) => (
  <Chip
    icon={icon !== undefined ? (icon as any) : (ICONS[status] as any)}
    label={label}
    color={COLOR_MAP[status]}
    variant="outlined"
    size={size}
    sx={{
      fontWeight: 600,
      fontSize: '0.7rem',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      ...sx,
    }}
    {...rest}
  />
);

/* ─── Convenience shortcuts for common statuses ─── */

export const PaidChip = (props: Partial<Props>) => (
  <StatusChip status="success" label="Paid" {...props} />
);

export const PendingChip = (props: Partial<Props>) => (
  <StatusChip status="warning" label="Pending" {...props} />
);

export const DeliveredChip = (props: Partial<Props>) => (
  <StatusChip
    status="info"
    label="Delivered"
    icon={<DoneIcon sx={{ fontSize: 14 }} />}
    {...props}
  />
);

export const ShippedChip = (props: Partial<Props>) => (
  <StatusChip status="info" label="Shipped" {...props} />
);

export const InStockChip = (props: Partial<Props>) => (
  <StatusChip
    status="success"
    label="In stock"
    icon={<StockIcon sx={{ fontSize: 14 }} />}
    {...props}
  />
);

export const OutOfStockChip = (props: Partial<Props>) => (
  <StatusChip status="error" label="Out of stock" {...props} />
);

export const LowStockChip = (props: Partial<Props>) => (
  <StatusChip status="warning" label="Low stock" {...props} />
);

export const ActiveChip = (props: Partial<Props>) => (
  <StatusChip status="success" label="Active" {...props} />
);

export const InactiveChip = (props: Partial<Props>) => (
  <StatusChip status="neutral" label="Inactive" {...props} />
);

export const AdminChip = (props: Partial<Props>) => (
  <StatusChip status="info" label="Admin" {...props} />
);
