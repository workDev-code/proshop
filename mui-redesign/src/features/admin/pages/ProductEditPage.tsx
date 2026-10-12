import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { CloudUpload as UploadIcon, Image as ImageIcon } from '@mui/icons-material';
import { ProductImage } from '../../products/components/ProductImage';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useToast } from '../../../hooks/useToast';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
} from '../adminApi';
import { useGetProductByIdQuery, useGetProductsQuery } from '../../products/productApi';
import {
  adminH1Sx,
  adminPanelSx,
  adminSubtitleSx,
  adminTitleRowSx,
} from '../components/adminStyles';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  brand: z.string().min(1, 'Brand is required').max(50),
  category: z.string().min(1, 'Category is required').max(50),
  price: z.coerce.number().min(0, 'Price must be ≥ 0'),
  countInStock: z.coerce.number().int().min(0, 'Stock must be ≥ 0'),
  description: z.string().min(10, 'Description too short').max(2000),
  image: z.string().min(1, 'Image is required'),
});
type ProductFormValues = z.infer<typeof productSchema>;

/* ─── shared style tokens (admin edit pages) ─────────────────────── */

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: 13,
    bgcolor: '#fff',
  },
  '& .MuiOutlinedInput-input': {
    py: 1.375,
  },
  '& .MuiInputLabel-root': {
    fontSize: 11,
    fontWeight: 600,
  },
  '& .MuiFormHelperText-root': {
    fontSize: 10,
    mx: 0,
    mt: 0.5,
  },
};

const selectSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: 13,
    bgcolor: '#fff',
  },
  '& .MuiSelect-select': {
    py: 1.375,
  },
  '& .MuiInputLabel-root': {
    fontSize: 11,
    fontWeight: 600,
  },
};

const overlineSx = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#818999',
  mb: 1.5,
};

const primaryBtnSx = {
  bgcolor: '#e65f3b',
  '&:hover': { bgcolor: '#d55634' },
  borderRadius: '8px',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'none' as const,
  px: 2,
  py: 1.125,
  color: '#fff',
  whiteSpace: 'nowrap' as const,
};

const secondaryBtnSx = {
  border: '1px solid #e1e5eb',
  bgcolor: '#fff',
  color: '#303747',
  '&:hover': { bgcolor: '#f7f7f9' },
  borderRadius: '8px',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'none' as const,
  px: 2,
  py: 1.125,
  whiteSpace: 'nowrap' as const,
};

/* ─── page ──────────────────────────────────────────────────────── */

export const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const { data: existing, isLoading: loadingProduct } = useGetProductByIdQuery(id ?? '', {
    skip: !isEdit,
  });
  // Get category list from the products endpoint
  const { data: productsData } = useGetProductsQuery(undefined);
  const categories = productsData?.facets?.categories ?? [];
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      price: 0,
      countInStock: 0,
      description: '',
      image: '/images/sample.jpg',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        brand: existing.brand,
        category: existing.category,
        price: existing.price,
        countInStock: existing.countInStock,
        description: existing.description,
        image: existing.image,
      });
    }
  }, [existing, reset]);

  const imageUrl = watch('image');
  const categoryValue = watch('category');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { image } = await uploadImage(formData).unwrap();
      setValue('image', image, { shouldValidate: true });
      toast.success('Image uploaded');
    } catch (err) {
      const e2 = err as { data?: { message?: string } };
      toast.error(e2.data?.message ?? 'Image upload failed');
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (isEdit && id) {
        await updateProduct({ id, payload: values }).unwrap();
        toast.success('Product updated');
      } else {
        const created = await createProduct(values).unwrap();
        toast.success('Product created');
        navigate(`/admin/products/${created._id}/edit`, { replace: true });
      }
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message ?? 'Save failed');
    }
  };

  const isSaving = creating || updating;

  if (isEdit && loadingProduct) return <LoadingState variant="detail" />;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Title row */}
      <Box sx={adminTitleRowSx}>
        <Box>
          <Typography component="h1" sx={adminH1Sx}>
            {isEdit ? 'Edit product' : 'New product'}
          </Typography>
          <Typography sx={adminSubtitleSx}>
            {isEdit
              ? `ID: ${id} · Update catalog details and stock.`
              : 'Add a new product to your catalog.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/admin/products"
            variant="outlined"
            sx={secondaryBtnSx}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : null}
            sx={primaryBtnSx}
          >
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 8fr) minmax(0, 4fr)' },
          gap: 2.125,
        }}
      >
        {/* LEFT — form fields */}
        <Box sx={{ ...adminPanelSx, p: 0 }}>
          <Box sx={{ p: 2.5 }}>
            <Typography sx={overlineSx}>Product details</Typography>
            <Stack spacing={2}>
              <TextField
                {...register('name')}
                label="Product name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={fieldSx}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <TextField
                  {...register('brand')}
                  label="Brand"
                  fullWidth
                  error={!!errors.brand}
                  helperText={errors.brand?.message}
                  sx={fieldSx}
                />
                <FormControl fullWidth error={!!errors.category} sx={selectSx}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    {...register('category')}
                    labelId="category-label"
                    label="Category"
                    value={categoryValue ?? ''}
                  >
                    <MenuItem value="" disabled>
                      <em>Select a category</em>
                    </MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: 'error.main',
                        mt: 0.5,
                      }}
                    >
                      {errors.category.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <TextField
                  {...register('price')}
                  label="Price (USD)"
                  type="number"
                  fullWidth
                  inputProps={{ step: '0.01', min: 0 }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  sx={fieldSx}
                />
                <TextField
                  {...register('countInStock')}
                  label="Stock quantity"
                  type="number"
                  fullWidth
                  inputProps={{ step: '1', min: 0 }}
                  error={!!errors.countInStock}
                  helperText={errors.countInStock?.message}
                  sx={fieldSx}
                />
              </Box>
              <TextField
                {...register('description')}
                label="Description"
                multiline
                minRows={5}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={fieldSx}
              />
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            {errors.image && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: 12 }}>
                {errors.image.message}
              </Alert>
            )}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={() => navigate('/admin/products')}
                disabled={isSaving}
                sx={secondaryBtnSx}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : null}
                sx={primaryBtnSx}
              >
                {isEdit ? 'Save changes' : 'Create product'}
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* RIGHT — image upload meta panel */}
        <Stack spacing={2.125}>
          <Box sx={adminPanelSx}>
            <Typography sx={overlineSx}>Image</Typography>
            <Box
              sx={{
                aspectRatio: '1 / 1',
                borderRadius: '10px',
                overflow: 'hidden',
                bgcolor: '#f4f4ef',
                border: '1px solid #e9ecf1',
              }}
            >
              {imageUrl ? (
                <ProductImage src={imageUrl} alt={watch('name') || 'Product'} />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'text.disabled',
                  }}
                >
                  <ImageIcon sx={{ fontSize: 48 }} />
                </Box>
              )}
            </Box>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={uploading ? <CircularProgress size={14} /> : <UploadIcon sx={{ fontSize: 14 }} />}
              disabled={uploading}
              sx={{
                ...secondaryBtnSx,
                mt: 2,
                justifyContent: 'center',
              }}
            >
              {uploading ? 'Uploading…' : 'Upload new image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
            <TextField
              {...register('image')}
              label="Or paste image path/URL"
              size="small"
              fullWidth
              error={!!errors.image}
              helperText={errors.image?.message ?? 'e.g. /uploads/image-1234.jpg'}
              sx={{ ...fieldSx, mt: 1.5 }}
            />
          </Box>

          <Box sx={adminPanelSx}>
            <Typography sx={overlineSx}>Status</Typography>
            <Stack spacing={1.25}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 11, color: '#5e6057' }}>Stock</Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#242b39' }}>
                  {watch('countInStock') ?? 0} units
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 11, color: '#5e6057' }}>Price</Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#242b39' }}>
                  ${Number(watch('price') ?? 0).toFixed(2)}
                </Typography>
              </Box>
              <Divider />
              <Typography sx={{ fontSize: 10, color: '#818999' }}>
                Save to apply changes to your store.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
