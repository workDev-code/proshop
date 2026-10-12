import { useState, type ChangeEvent } from 'react';
import {
  Box,
  Stack,
  Button,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useToast } from '../../../hooks/useToast';
import {
  adminH1Sx,
  adminPanelDescSx,
  adminPanelH2Sx,
  adminPanelHeadSx,
  adminPanelSx,
  adminSubtitleSx,
  adminTitleRowSx,
} from '../components/adminStyles';

/**
 * Admin store settings (demo-only, local state).
 *
 * No backend persistence — the form is intentionally a UX preview so the
 * page mirrors the approved prototype without pretending to save anywhere.
 */

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'VND', label: 'VND — Vietnamese Dong' },
];

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh (GMT+7)' },
  { value: 'UTC', label: 'UTC' },
];

interface NotificationsState {
  newOrders: boolean;
  lowStock: boolean;
  weeklySummary: boolean;
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: 12,
    bgcolor: '#fff',
  },
  '& .MuiInputLabel-root': { fontSize: 11 },
  '& .MuiFormHelperText-root': { fontSize: 10, mt: 0.5 },
};

export const AdminSettingsPage = () => {
  const toast = useToast();

  const [storeName, setStoreName] = useState('ProShop');
  const [supportEmail, setSupportEmail] = useState('support@proshop.demo');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');
  const [notifications, setNotifications] = useState<NotificationsState>({
    newOrders: true,
    lowStock: true,
    weeklySummary: false,
  });

  const handleNotification =
    (key: keyof NotificationsState) => (e: ChangeEvent<HTMLInputElement>) =>
      setNotifications((prev) => ({ ...prev, [key]: e.target.checked }));

  const handleSave = () => {
    toast.info('Settings are local-only in this demo.');
  };

  return (
    <>
      {/* Title row */}
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            Store settings
          </Typography>
          <Typography sx={adminSubtitleSx}>
            Manage your store details and operational preferences.
          </Typography>
        </Box>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: '#e65f3b',
            '&:hover': { bgcolor: '#d55634' },
            borderRadius: '8px',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'none',
            px: 1.625,
            py: 1.125,
            whiteSpace: 'nowrap',
            color: '#fff',
          }}
        >
          Save changes
        </Button>
      </Box>

      {/* General information */}
      <Box sx={{ ...adminPanelSx, maxWidth: 760, mb: 2.25 }}>
        <Box sx={adminPanelHeadSx}>
          <Box>
            <Typography component="h2" sx={adminPanelH2Sx}>
              General information
            </Typography>
            <Typography sx={adminPanelDescSx}>
              Public store details and contact information
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          <TextField
            label="Store name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            fullWidth
            size="small"
            sx={inputSx}
          />
          <TextField
            label="Support email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            fullWidth
            size="small"
            sx={inputSx}
          />
          <TextField
            label="Currency"
            select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            fullWidth
            size="small"
            sx={inputSx}
          >
            {CURRENCY_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Timezone"
            select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            fullWidth
            size="small"
            sx={inputSx}
          >
            {TIMEZONE_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {/* Notifications */}
      <Box sx={{ ...adminPanelSx, maxWidth: 760 }}>
        <Box sx={adminPanelHeadSx}>
          <Box>
            <Typography component="h2" sx={adminPanelH2Sx}>
              Notifications
            </Typography>
            <Typography sx={adminPanelDescSx}>
              Choose which store events you want to track
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.5}>
          <FormControlLabel
            control={
              <Checkbox
                checked={notifications.newOrders}
                onChange={handleNotification('newOrders')}
                size="small"
                sx={{ p: 0.5 }}
              />
            }
            label={
              <Typography sx={{ fontSize: 11, color: '#50596a' }}>
                Notify me about new orders
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={notifications.lowStock}
                onChange={handleNotification('lowStock')}
                size="small"
                sx={{ p: 0.5 }}
              />
            }
            label={
              <Typography sx={{ fontSize: 11, color: '#50596a' }}>
                Alert me when products are low in stock
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={notifications.weeklySummary}
                onChange={handleNotification('weeklySummary')}
                size="small"
                sx={{ p: 0.5 }}
              />
            }
            label={
              <Typography sx={{ fontSize: 11, color: '#50596a' }}>
                Weekly performance summary
              </Typography>
            }
          />
        </Stack>
      </Box>
    </>
  );
};
