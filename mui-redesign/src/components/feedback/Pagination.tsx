import {
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  FirstPage as FirstIcon,
  LastPage as LastIcon,
  KeyboardArrowLeft as PrevIcon,
  KeyboardArrowRight as NextIcon,
} from '@mui/icons-material';

interface Props {
  page: number;
  pages: number;
  total: number;
  onChange: (page: number) => void;
  showCount?: boolean;
}

/**
 * Custom pagination matching the design spec:
 *  - 40x40 square buttons
 *  - Active page: bg #F5F3EE + text #1C1C1A + aria-current="page"
 *  - Inactive: text #F5F3EE
 *  - Disabled: opacity 0.4 + aria-disabled + not clickable
 *  - First / prev / next / last are icon buttons (also 40x40)
 *  - Count text "Showing X–Y of Z products" in #B8B5AD, 14px
 *  - Hidden if pages <= 1
 */
export const Pagination = ({
  page,
  pages,
  total,
  onChange,
  showCount = true,
}: Props) => {
  if (pages <= 1) return null;

  const pageSize = Math.ceil(total / Math.max(pages, 1));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, total);

  // Build a sliding window of page numbers with ellipsis.
  // Example: 1 … 4 5 [6] 7 8 … 20
  const pageNumbers: (number | 'ellipsis')[] = [];
  const around = 1; // siblings on each side of current
  for (let p = 1; p <= pages; p++) {
    if (
      p === 1 ||
      p === pages ||
      (p >= page - around && p <= page + around)
    ) {
      pageNumbers.push(p);
    } else if (
      pageNumbers[pageNumbers.length - 1] !== 'ellipsis'
    ) {
      pageNumbers.push('ellipsis');
    }
  }

  const isFirst = page <= 1;
  const isLast = page >= pages;

  const navBtnSx = (disabled: boolean) => ({
    width: 40,
    height: 40,
    borderRadius: '10px',
    color: '#F5F3EE',
    opacity: disabled ? 0.4 : 1,
    transition: 'background-color 200ms ease, color 200ms ease',
    '&:hover': disabled
      ? {}
      : { bgcolor: 'rgba(232, 121, 90, 0.10)', color: '#E8795A' },
    '&:focus-visible': {
      outline: '2px solid #E8795A',
      outlineOffset: 2,
    },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  });

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ mt: 4 }}
    >
      {showCount && (
        <Typography
          component="span"
          sx={{ color: '#B8B5AD', fontSize: 14 }}
          aria-live="polite"
        >
          Showing {start}–{end} of {total} products
        </Typography>
      )}

      <Box
        component="nav"
        aria-label="Product pagination"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-end' },
        }}
      >
        {/* First */}
        <Tooltip title="First page">
          <span>
            <IconButton
              size="small"
              aria-label="Go to first page"
              disabled={isFirst}
              aria-disabled={isFirst}
              onClick={() => onChange(1)}
              sx={navBtnSx(isFirst)}
            >
              <FirstIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>

        {/* Prev */}
        <Tooltip title="Previous page">
          <span>
            <IconButton
              size="small"
              aria-label="Go to previous page"
              disabled={isFirst}
              aria-disabled={isFirst}
              onClick={() => onChange(page - 1)}
              sx={navBtnSx(isFirst)}
            >
              <PrevIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: '#3A3A36', mx: 0.5, my: 1.5 }}
        />

        {/* Page numbers */}
        {pageNumbers.map((p, i) =>
          p === 'ellipsis' ? (
            <Box
              key={`e-${i}`}
              aria-hidden
              sx={{
                width: 40,
                height: 40,
                display: 'grid',
                placeItems: 'center',
                color: '#B8B5AD',
                fontSize: 14,
                userSelect: 'none',
              }}
            >
              …
            </Box>
          ) : (
            <Box
              key={p}
              component="button"
              onClick={() => onChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              sx={{
                width: 40,
                height: 40,
                border: 'none',
                borderRadius: '10px',
                bgcolor: p === page ? '#F5F3EE' : 'transparent',
                color: p === page ? '#1C1C1A' : '#F5F3EE',
                fontSize: 14,
                fontWeight: p === page ? 700 : 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'background-color 200ms ease, color 200ms ease',
                '&:hover': {
                  bgcolor:
                    p === page
                      ? '#F5F3EE'
                      : 'rgba(232, 121, 90, 0.10)',
                  color: p === page ? '#1C1C1A' : '#E8795A',
                },
                '&:focus-visible': {
                  outline: '2px solid #E8795A',
                  outlineOffset: 2,
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              }}
            >
              {p}
            </Box>
          ),
        )}

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: '#3A3A36', mx: 0.5, my: 1.5 }}
        />

        {/* Next */}
        <Tooltip title="Next page">
          <span>
            <IconButton
              size="small"
              aria-label="Go to next page"
              disabled={isLast}
              aria-disabled={isLast}
              onClick={() => onChange(page + 1)}
              sx={navBtnSx(isLast)}
            >
              <NextIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>

        {/* Last */}
        <Tooltip title="Last page">
          <span>
            <IconButton
              size="small"
              aria-label="Go to last page"
              disabled={isLast}
              aria-disabled={isLast}
              onClick={() => onChange(pages)}
              sx={navBtnSx(isLast)}
            >
              <LastIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Stack>
  );
};
