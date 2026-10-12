import { Box, Pagination as MuiPagination, Stack, Typography } from '@mui/material';

interface Props {
  page: number;
  pages: number;
  total: number;
  onChange: (page: number) => void;
  showCount?: boolean;
}

/**
 * Paginated navigation for backend-backed lists.
 *  - `page` is 1-indexed
 *  - `pages` is total page count
 *  - `total` is total item count
 *  - Hides itself if there's only 1 page
 */
export const Pagination = ({
  page,
  pages,
  total,
  onChange,
  showCount = true,
}: Props) => {
  if (pages <= 1) return null;

  const start = (page - 1) * Math.ceil(total / Math.max(pages, 1)) + 1;
  const end = Math.min(start + Math.ceil(total / Math.max(pages, 1)) - 1, total);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ mt: 3 }}
    >
      {showCount && (
        <Typography variant="body2" color="text.secondary">
          Showing {start}–{end} of {total} products
        </Typography>
      )}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
        <MuiPagination
          page={page}
          count={pages}
          color="primary"
          shape="rounded"
          onChange={(_, value) => onChange(value)}
          showFirstButton
          showLastButton
          siblingCount={1}
        />
      </Box>
    </Stack>
  );
};
