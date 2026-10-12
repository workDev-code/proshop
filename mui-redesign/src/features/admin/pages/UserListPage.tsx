import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Group as UsersIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { AdminSubNav } from '../components/AdminSubNav';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useGetAllUsersQuery, useDeleteUserMutation } from '../adminApi';
import { useToast } from '../../../hooks/useToast';

export const UserListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const filtered = users?.filter((u) =>
    [u.name, u.email].some((f) => f.toLowerCase().includes(search.toLowerCase())),
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success('User deleted');
      setConfirmDelete(null);
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Failed to delete user');
    }
  };

  const initials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'User',
      flex: 1,
      minWidth: 240,
      renderCell: ({ row }: any) => (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: row.isAdmin ? 'primary.main' : 'secondary.main',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {initials(row.name)}
          </Avatar>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {row.name}
              </Typography>
              {row.isAdmin && <AdminIcon fontSize="small" color="primary" />}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'isAdmin',
      headerName: 'Role',
      width: 120,
      renderCell: ({ value }: any) => (
        <Chip
          label={value ? 'Admin' : 'Customer'}
          color={value ? 'primary' : 'default'}
          size="small"
          variant={value ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: '_id',
      headerName: 'User ID',
      width: 220,
      renderCell: ({ value }: any) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => navigate(`/admin/users/${row._id}/edit`)}
          sx={{ color: 'primary.main' }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setConfirmDelete(row._id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle={`${users?.length ?? 0} registered users`}
        icon={<UsersIcon />}
      />

      <AdminSubNav />

      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by name or email…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 360 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ height: 620, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <DataGrid
          rows={filtered ?? []}
          columns={columns}
          getRowId={(r) => r._id}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-row:hover': { bgcolor: 'action.hover' },
          }}
        />
      </Box>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete user?"
        message="This user will be permanently removed. Their orders and reviews will keep the snapshot data but the user account will be gone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </Box>
  );
};
