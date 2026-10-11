import { ReactNode } from 'react';
import { Box, Stack, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { NavigateNext as ChevronIcon } from '@mui/icons-material';

export interface Crumb { label: string; to?: string }
export interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, breadcrumbs, actions }: Props) => (
  <Box sx={{ mb: 4 }}>
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
            <Typography key={i} variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
              {c.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    )}

    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'center' }}
      spacing={2}
    >
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
    </Stack>
  </Box>
);

// Suppress noUnusedLocals
