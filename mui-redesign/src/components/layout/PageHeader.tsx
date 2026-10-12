import { ReactNode } from 'react';
import {
  Box,
  Stack,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { NavigateNext as ChevronIcon } from '@mui/icons-material';

export interface Crumb {
  label: string;
  to?: string;
}

export interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  /**
   * Optional icon. Only renders as a small accent to the LEFT of the
   * title (no boxed avatar - too admin-template-y).
   */
  icon?: ReactNode;
  /** Bottom margin override */
  mb?: number;
}

/**
 * Editorial-style page header.
 *
 *  - Title uses a fluid size (clamp) so it never wraps awkwardly on
 *    narrow columns.
 *  - Optional icon is a flat 28x28 accent, NOT a colored avatar box.
 *  - Action buttons wrap to a second line on narrow viewports instead
 *    of squeezing the title.
 */
export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  icon,
  mb = 4,
}: Props) => (
  <Box sx={{ mb }}>
    {breadcrumbs && breadcrumbs.length > 0 && (
      <Breadcrumbs
        separator={<ChevronIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
        sx={{ mb: 1.5 }}
      >
        {breadcrumbs.map((c, i) =>
          c.to ? (
            <MuiLink
              key={i}
              component={Link}
              to={c.to}
              underline="hover"
              color="text.secondary"
              sx={{ fontSize: '0.8125rem' }}
            >
              {c.label}
            </MuiLink>
          ) : (
            <Typography
              key={i}
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.8125rem' }}
            >
              {c.label}
            </Typography>
          ),
        )}
      </Breadcrumbs>
    )}

    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'center' }}
      spacing={2}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ minWidth: 0, flex: 1 }}
      >
        {icon && (
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'grid',
              placeItems: 'center',
              color: 'secondary.main',
              flexShrink: 0,
              '& svg': { fontSize: 24 },
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.5, fontSize: '0.95rem' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      {actions && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </Box>
      )}
    </Stack>
  </Box>
);
