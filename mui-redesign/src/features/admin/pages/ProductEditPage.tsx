import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Grid2 as Grid,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CloudUpload as UploadIcon,
  Inventory2 as ProductsIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContainer } from '../../../components/layout/PageContainer';
import { AdminSubNav } from '../components/AdminSubNav';
import { ProductImage } from '../../products/components/ProductImage';
import { LoadingState } from '../../../components/feedback/LoadingState';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
} from '../adminApi';
import { useGetProductByIdQuery } from '../../products/productApi';
import { useToast } from '../../../hooks/useToast';

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

export const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const { data: existing, isLoading: loadingProduct } = useGetProductByIdQuery(id ?? '', {
    skip: !isEdit,
  });
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

  if (isEdit && loadingProduct) return <LoadingState variant="detail" />;

  return (
    <PageContainer>
      <Button
        component={RouterLink}
        to="/admin/products"
        startIcon={<BackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Back to products
      </Button>

      <PageHeader
        title={isEdit ? 'Edit product' : 'New product'}
        subtitle={isEdit ? `ID: ${id}` : 'Add a product to your catalog'}
        icon={<ProductsIcon />}
      />

      <AdminSubNav />

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Image upload */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Product image
                </Typography>
                <Box sx={{ aspectRatio: '1 / 1', borderRadius: 2, overflow: 'hidden' }}>
                  <ProductImage src={imageUrl} alt={watch('name') || 'Product'} />
                </Box>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
                    disabled={uploading}
                    fullWidth
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
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Form fields */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Product details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('name')}
                      label="Product name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('brand')}
                      label="Brand"
                      fullWidth
                      error={!!errors.brand}
                      helperText={errors.brand?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('category')}
                      label="Category"
                      fullWidth
                      error={!!errors.category}
                      helperText={errors.category?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('price')}
                      label="Price (USD)"
                      type="number"
                      fullWidth
                      inputProps={{ step: '0.01', min: 0 }}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...register('countInStock')}
                      label="Stock quantity"
                      type="number"
                      fullWidth
                      inputProps={{ step: '1', min: 0 }}
                      error={!!errors.countInStock}
                      helperText={errors.countInStock?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      {...register('description')}
                      label="Description"
                      multiline
                      minRows={5}
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {errors.image && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.image.message}
                  </Alert>
                )}

                <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                  <Button onClick={() => navigate('/admin/products')} disabled={creating || updating}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={creating || updating}
                    startIcon={creating || updating ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {isEdit ? 'Save changes' : 'Create product'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
