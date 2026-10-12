import { useState, type FormEvent } from 'react';
import { Box, Typography, Button, InputBase } from '@mui/material';
import { useToast } from '../../../hooks/useToast';

/**
 * Newsletter signup card — centered, beige #e4e6dc background, 22px radius.
 * Matches `.newsletter` / `.subscribe` from the approved HTML prototype.
 *
 *  - Kicker + h2 + paragraph + subscribe input + pill button
 *  - The input is wrapped in a white pill; the button is the dark pill
 *  - On submit, shows a success toast and clears the input
 *
 *  Pure presentational — no backend call (matches the prototype's behaviour).
 */
export const Newsletter = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <Box
      component="section"
      aria-label="Newsletter"
      sx={{
        bgcolor: 'rgba(228, 230, 220, 0.7)', // #e4e6dc
        py: { xs: 5, md: 7.25 },
        px: { xs: 3, md: 6 },
        textAlign: 'center',
        borderRadius: { xs: '18px', md: '22px' },
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'secondary.main',
          mb: 1.25,
        }}
      >
        A note from us
      </Typography>

      <Typography
        component="h2"
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.6875rem, 3vw, 2.25rem)',
          lineHeight: 1.12,
          letterSpacing: '-0.04em',
          color: 'text.primary',
          m: 0,
          mb: 1.5,
        }}
      >
        Good finds, straight to your inbox.
      </Typography>

      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'text.secondary',
          lineHeight: 1.7,
          maxWidth: 440,
          mx: 'auto',
          mb: 2.75,
        }}
      >
        New arrivals, thoughtful guides and a little inspiration for your
        everyday. No noise, just the good stuff.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          maxWidth: 430,
          mx: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 999,
          p: '5px',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <InputBase
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          inputProps={{ 'aria-label': 'Your email address' }}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: '0.75rem',
            px: 1.5,
            color: 'text.primary',
            '& input::placeholder': {
              color: 'text.disabled',
              opacity: 1,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 999,
            bgcolor: 'primary.main',
            color: 'common.white',
            px: 2.25,
            py: 1.5,
            fontSize: '0.6875rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: 'secondary.main' },
          }}
        >
          Count me in ↗
        </Button>
      </Box>
    </Box>
  );
};
