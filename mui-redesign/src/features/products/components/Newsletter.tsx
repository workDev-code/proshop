import { useState, type FormEvent } from 'react';
import { Box, Typography, Button, InputBase, CircularProgress } from '@mui/material';
import { useToast } from '../../../hooks/useToast';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Newsletter signup card — centered, solid --surface bg, 24px radius.
 * Matches `.newsletter` / `.subscribe` from the approved HTML prototype.
 *
 *  - 64px vertical / 24px horizontal padding, max-width 640px
 *  - Kicker (12px uppercase accent) + h2 + sub-paragraph + form
 *  - Form: input + button both 52px tall, side-by-side on desktop,
 *    stacked on ≤600px.
 *  - Input: bg --bg, border --border, accent border on focus, sr-only label
 *  - Button: orange #E8795A + dark text
 *  - aria-live status region (loading / success / error)
 *  - Pure presentational — no backend call. Surfaces status via toast AND
 *    inline aria-live message so screen readers hear it.
 */
export const Newsletter = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setMessage('Subscribing…');
    // Simulate async signup (presentational only — wire to API later)
    window.setTimeout(() => {
      setStatus('success');
      setMessage('Thanks for subscribing! Check your inbox.');
      toast.success('Thanks for subscribing!');
      setEmail('');
      window.setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3500);
    }, 700);
  };

  const isLoading = status === 'loading';

  return (
    <Box
      component="section"
      aria-label="Newsletter signup"
      sx={{
        bgcolor: '#262624',          // --surface
        border: '1px solid #3A3A36', // --border
        py: { xs: 5, md: 8 },       // 64px on desktop
        px: { xs: 3, md: 6 },
        textAlign: 'center',
        borderRadius: { xs: '18px', md: '24px' },
        maxWidth: 640,
        mx: 'auto',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.25,
          color: '#E8795A',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          mb: 1.5,
        }}
      >
        <Box
          aria-hidden
          sx={{
            width: 10,
            height: 10,
            bgcolor: 'currentColor',
            borderRadius: '2px',
          }}
        />
        A note from us
      </Box>

      <Typography
        component="h2"
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.6875rem, 3vw, 2.25rem)',
          lineHeight: 1.12,
          letterSpacing: '-0.04em',
          color: '#F5F3EE',
          m: 0,
          mb: 1.5,
        }}
      >
        Good finds, straight to your inbox.
      </Typography>

      <Typography
        component="p"
        sx={{
          fontSize: 16,
          color: '#B8B5AD',
          lineHeight: 1.6,
          maxWidth: 520,
          mx: 'auto',
          mb: 3, // ~24px from title to form
        }}
      >
        Curated weekly. Quietly chosen, easy to unsubscribe anytime.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'stretch',
          gap: { xs: 1.25, sm: 1 },
          maxWidth: 520,
          mx: 'auto',
        }}
      >
        <label htmlFor="newsletter-email" style={{ position: 'absolute', left: -9999 }}>
          Email address
        </label>
        <InputBase
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') {
              setStatus('idle');
              setMessage('');
            }
          }}
          placeholder="Your email address"
          disabled={isLoading}
          aria-invalid={status === 'error'}
          aria-describedby="newsletter-status"
          sx={{
            flex: 1,
            minWidth: 0,
            height: 52,
            bgcolor: '#1C1C1A',        // --bg
            border: '1px solid #3A3A36',
            borderRadius: { xs: 999, sm: 999 },
            fontSize: 14,
            px: 2.5,
            color: '#F5F3EE',
            transition: 'border-color 200ms ease, box-shadow 200ms ease',
            '&.Mui-focused': {
              borderColor: '#E8795A',
              boxShadow: '0 0 0 3px rgba(232, 121, 90, 0.18)',
            },
            '& input::placeholder': {
              color: '#B8B5AD', // ≥4.5:1 on #1C1C1A
              opacity: 1,
            },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            height: 52,
            minWidth: { sm: 160 },
            borderRadius: 999,
            bgcolor: '#E8795A',
            color: '#1C1C1A',
            fontSize: 14,
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: 0,
            boxShadow: '0 6px 18px rgba(232, 121, 90, 0.28)',
            transition:
              'transform 220ms ease, background-color 220ms ease, box-shadow 220ms ease',
            '&:hover': {
              bgcolor: '#d96a4b',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 22px rgba(232, 121, 90, 0.36)',
            },
            '&:focus-visible': {
              outline: '2px solid #F5F3EE',
              outlineOffset: 3,
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(232, 121, 90, 0.45)',
              color: '#1C1C1A',
            },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          }}
          startIcon={
            isLoading ? (
              <CircularProgress size={14} sx={{ color: '#1C1C1A' }} />
            ) : null
          }
        >
          {isLoading ? 'Subscribing' : 'Count me in ↗'}
        </Button>
      </Box>

      {/* Live status region for screen readers */}
      <Box
        id="newsletter-status"
        role="status"
        aria-live="polite"
        sx={{
          mt: 1.5,
          minHeight: 20,
          fontSize: 13,
          color:
            status === 'error'
              ? '#E8795A'
              : status === 'success'
                ? '#7ba05e'
                : 'transparent',
          transition: 'color 200ms ease',
        }}
      >
        {message || '\u00A0'}
      </Box>
    </Box>
  );
};
