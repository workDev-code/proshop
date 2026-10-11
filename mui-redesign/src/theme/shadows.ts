/**
 * Subtle elevation system. Higher offsets but lower opacities for that
 * flat-modern aesthetic.
 */
export const shadows = [
  'none',
  // 1
  '0 1px 2px 0 rgb(0 0 0 / 0.04)',
  // 2
  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  // 3
  '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  // 4
  '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
  // 5
  '0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  // 6
  '0 25px 50px -12px rgb(0 0 0 / 0.20)',
  ...Array(18).fill('none'),
] as const;
