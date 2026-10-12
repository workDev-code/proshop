/**
 * Formatting utilities — single source of truth for dates/currency.
 * Uses fixed en-US locale to avoid inconsistency across browsers/regions.
 */

/** "Oct 12, 2026" — short, readable. */
export const fmtDate = (iso: string | Date | null | undefined): string => {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/** "Oct 12, 2026 · 04:23 PM" — with time. */
export const fmtDateTime = (iso: string | Date | null | undefined): string => {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** "Oct 12" — short (for tables). */
export const fmtDateShort = (iso: string | Date | null | undefined): string => {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/** "4:23 PM" — time only. */
export const fmtTime = (iso: string | Date | null | undefined): string => {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/** "2 days ago" / "3 hours ago" / "Just now" */
export const timeAgo = (iso: string | Date | null | undefined): string => {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

/** $1,234.56 (always 2 decimals, $ prefix, US format) */
export const fmtMoney = (n: number | null | undefined): string => {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

/** 1,234 (with thousands separator, no decimals) */
export const fmtNumber = (n: number | null | undefined): string => {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US').format(n);
};

/** "1.2k" / "23k" / "1.4M" — for compact numbers in tables. */
export const fmtCompact = (n: number | null | undefined): string => {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
};

/** "1.2k" → "1,234" — for tooltips on compact numbers. */

/** Returns the difference between two numbers as +X.X% or -X.X% (or null if previous is 0). */
export const percentDelta = (current: number, previous: number): number | null => {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
};
