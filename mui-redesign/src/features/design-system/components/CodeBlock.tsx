import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { ContentCopy as CopyIcon, Check as CheckIcon } from '@mui/icons-material';

export const CodeBlock = ({ code, }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <Box sx={{ position: 'relative', mt: 1.5 }}>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          bgcolor: '#0F172A',
          color: '#E2E8F0',
          borderRadius: 2,
          overflow: 'auto',
          fontSize: '0.8125rem',
          fontFamily: '"Fira Code", Menlo, monospace',
          lineHeight: 1.6,
        }}
      >
        <code>{code}</code>
      </Box>
      <Tooltip title={copied ? 'Copied!' : 'Copy'}>
        <IconButton
          onClick={copy}
          size="small"
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            bgcolor: 'rgba(255,255,255,0.1)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
          }}
        >
          {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
