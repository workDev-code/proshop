import { Box, Container, Stack, Typography, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import { DarkMode as DarkIcon, LightMode as LightIcon, OpenInNew } from '@mui/icons-material';
import { useAppTheme } from '../../../theme/ThemeProvider';
import { Section } from '../components/Section';
import { ColorPalette } from '../components/ColorPalette';
import { TypographyScale } from '../components/TypographyScale';
import { SpacingScale } from '../components/SpacingScale';
import { Buttons } from '../components/Buttons';
import { CodeBlock } from '../components/CodeBlock';

const TOC = [
  { id: 'colors',     label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing',    label: 'Spacing' },
  { id: 'buttons',    label: 'Buttons' },
  { id: 'snippets',   label: 'Code snippets' },
  { id: 'elevation',  label: 'Elevation' },
];

export const DesignSystemPage = () => {
  const { mode, toggle } = useAppTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {/* HERO */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'common.white',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={3}
          >
            <Box>
              <Chip label="v1.0" color="default" sx={{ mb: 2, color: 'common.white', borderColor: 'rgba(255,255,255,0.4)' }} />
              <Typography variant="h2" sx={{ fontWeight: 800, color: 'common.white' }}>
                ProShop Design System
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.85, color: 'common.white' }}>
                MUI v6 · Inter font · 8px spacing · WCAG AA · Light/Dark
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Toggle theme">
                <IconButton
                  onClick={toggle}
                  sx={{
                    color: 'common.white',
                    border: '1px solid rgba(255,255,255,0.4)',
                  }}
                >
                  {mode === 'dark' ? <LightIcon /> : <DarkIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Open in production (current bootstrap version)">
                <IconButton
                  component="a"
                  href="/design-system"
                  target="_blank"
                  sx={{
                    color: 'common.white',
                    border: '1px solid rgba(255,255,255,0.4)',
                  }}
                >
                  <OpenInNew />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* MAIN GRID */}
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '200px 1fr' },
            gap: 4,
          }}
        >
          {/* TOC SIDEBAR */}
          <Box
            component="nav"
            sx={{
              display: { xs: 'none', lg: 'block' },
              position: 'sticky',
              top: 88,
              alignSelf: 'flex-start',
              p: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ pl: 1 }}>
              Sections
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {TOC.map((t) => (
                <Box
                  key={t.id}
                  component="a"
                  href={`#${t.id}`}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    textDecoration: 'none',
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 200ms ease',
                    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                  }}
                >
                  {t.label}
                </Box>
              ))}
            </Stack>
          </Box>

          {/* SECTIONS */}
          <Box>
            <Section
              id="colors"
              title="Color Palette"
              subtitle="Click any swatch to copy its hex. Built on MUI palette tokens."
            >
              <ColorPalette />
            </Section>

            <Section
              id="typography"
              title="Typography"
              subtitle="Inter family · 8px scale · semantic sizes."
            >
              <TypographyScale />
            </Section>

            <Section
              id="spacing"
              title="Spacing"
              subtitle="8px base unit. Use sx prop with spacing(n) for consistent rhythm."
            >
              <SpacingScale />
            </Section>

            <Section
              id="buttons"
              title="Buttons"
              subtitle="3 variants × 6 colors × 3 sizes + loading, disabled, with-icon, group, toggle, icon-only."
            >
              <Buttons />
            </Section>

            <Section
              id="snippets"
              title="Code snippets"
              subtitle="Real implementation examples. Click the copy button at top-right."
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Primary button
              </Typography>
              <CodeBlock
                code={`<Button variant="contained" color="primary">
  Save changes
</Button>`}
              />

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                Card with flex layout
              </Typography>
              <CodeBlock
                code={`<Card sx={{ p: 3, display: 'flex', gap: 2 }}>
  <Avatar>SJ</Avatar>
  <Box>
    <Typography variant="subtitle1">Sarah Johnson</Typography>
    <Typography variant="body2" color="text.secondary">
      sarah@example.com
    </Typography>
  </Box>
</Card>`}
              />

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                Light/Dark toggle hook
              </Typography>
              <CodeBlock
                code={`import { useAppTheme } from '@/theme/ThemeProvider';

const { mode, toggle } = useAppTheme();
<Switch checked={mode === 'dark'} onChange={toggle} />`}
              />
            </Section>

            <Section
              id="elevation"
              title="Elevation"
              subtitle="Subtle shadows · 1px to 25px offset · 4-10% opacity."
            >
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    md: 'repeat(5, 1fr)',
                  },
                }}
              >
                {[1, 2, 4, 8, 16].map((e) => (
                  <Box
                    key={e}
                    sx={{
                      p: 3,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: e,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      elevation {e}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Section>

            <Divider sx={{ my: 6 }} />

            <Typography variant="h6" color="text.secondary" align="center">
              🛠️ ProShop Design System v1.0 — built with MUI v6
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
