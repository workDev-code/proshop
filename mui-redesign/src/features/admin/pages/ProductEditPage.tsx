// Extends the admin product form with the v3.0 product schema fields:
//   compareAtPrice, sku, tags (chip-style comma input), isActive (Switch),
//   weight, dimensions (3 separate inputs), and an `images[]` array edited
//   through useFieldArray with a "+" button below the main image upload.
import { useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, useFieldArray, Controller, type FieldValues } from 'react-hook-form';
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
  Switch,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { ProductImage } from '../../products/components/ProductImage';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { useToast } from '../../../hooks/useToast';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
} from '../adminApi';
import { useGetProductByIdQuery, useGetProductsQuery } from '../../products/productApi';
import { useGetCategoriesQuery } from '../../categories/categoryApi';
import {
  adminH1Sx,
  adminPanelSx,
  adminSubtitleSx,
  adminTitleRowSx,
} from '../components/adminStyles';

/* ─── zod schema ─────────────────────────────────────────────── */

const optionalNumber = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = typeof v === 'string' ? Number(v) : v;
    return Number.isFinite(n) ? n : undefined;
  });

const requiredNumber = z
  .union([z.string(), z.number()])
  .transform((v) => {
    if (v === undefined || v === null || v === '') return 0;
    const n = typeof v === 'string' ? Number(v) : v;
    return Number.isFinite(n) ? n : 0;
  });

const dimensionsSchema = z
  .object({
    length: optionalNumber,
    width: optionalNumber,
    height: optionalNumber,
  })
  .optional();

const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  brand: z.string().min(1, 'Brand is required').max(50),
  category: z.string().min(1, 'Category is required').max(50),
  price: requiredNumber.refine((n) => n >= 0, 'Price must be ≥ 0'),
  countInStock: requiredNumber.refine((n) => Number.isInteger(n) && n >= 0, 'Stock must be ≥ 0'),
  description: z.string().min(10, 'Description too short').max(2000),
  image: z.string().min(1, 'Image is required'),
  // v3.0 schema additions
  sku: z.string().max(80, 'SKU too long').optional().or(z.literal('')),
  compareAtPrice: optionalNumber,
  tagsText: z.string().max(500, 'Tags too long').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  weight: optionalNumber,
  dimensions: dimensionsSchema,
  images: z.array(z.string()).default([]),
});
type ProductFormValues = z.infer<typeof productSchema> & FieldValues;

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

/* ─── helpers ──────────────────────────────────────────────── */

/** Convert a tags string from the backend to a comma-separated display
 *  string for the chip-style text field. */
const tagsToText = (tags: string[] | undefined): string => (tags ?? []).join(', ');

/** Convert the chip-style text field back into a clean string[]. */
const textToTags = (text: string | undefined): string[] =>
  (text ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

/* ─── page ──────────────────────────────────────────────────────── */

export const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const { data: existing, isLoading: loadingProduct } = useGetProductByIdQuery(id ?? '', {
    skip: !isEdit,
  });
  // Get category list from the products endpoint (facets) as the legacy source,
  // and also from the categories endpoint for the canonical list.
  const { data: productsData } = useGetProductsQuery(undefined);
  const { data: categories } = useGetCategoriesQuery();
  const categoryOptions = (() => {
    const fromCats = (categories ?? []).map((c) => c.name);
    const fromFacets = productsData?.facets?.categories ?? [];
    return Array.from(new Set([...fromCats, ...fromFacets])).filter(Boolean);
  })();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
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
      sku: '',
      compareAtPrice: undefined,
      tagsText: '',
      isActive: true,
      weight: undefined,
      dimensions: { length: undefined, width: undefined, height: undefined },
      images: [],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
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
        sku: existing.sku ?? '',
        compareAtPrice: existing.compareAtPrice,
        tagsText: tagsToText(existing.tags),
        isActive: existing.isActive !== false,
        weight: existing.weight,
        dimensions: {
          length: existing.dimensions?.length,
          width: existing.dimensions?.width,
          height: existing.dimensions?.height,
        },
        images: existing.images ?? [],
      });
    }
  }, [existing, reset]);

  const imageUrl = watch('image');
  const isActiveValue = watch('isActive');
  const tagsTextValue = watch('tagsText') ?? '';
  const compareAtPriceValue = watch('compareAtPrice');

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
    // Build the payload — strip empty optional fields, derive tags[] from text
    const tags = textToTags(values.tagsText);
    const payload = {
      name: values.name,
      brand: values.brand,
      category: values.category,
      price: values.price,
      countInStock: values.countInStock,
      description: values.description,
      image: values.image,
      images: values.images.filter((s) => s && s.trim().length > 0),
      isActive: values.isActive,
      ...(values.sku ? { sku: values.sku } : {}),
      ...(values.compareAtPrice !== undefined ? { compareAtPrice: values.compareAtPrice } : {}),
      ...(tags.length > 0 ? { tags } : {}),
      ...(values.weight !== undefined ? { weight: values.weight } : {}),
      ...(values.dimensions &&
      (values.dimensions.length !== undefined ||
        values.dimensions.width !== undefined ||
        values.dimensions.height !== undefined)
        ? {
            dimensions: {
              length: values.dimensions.length ?? 0,
              width: values.dimensions.width ?? 0,
              height: values.dimensions.height ?? 0,
            },
          }
        : {}),
    };
    try {
      if (isEdit && id) {
        await updateProduct({ id, payload }).unwrap();
        toast.success('Product updated');
      } else {
        const created = await createProduct(payload as never).unwrap();
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
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category} sx={selectSx}>
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        {...field}
                        labelId="category-label"
                        label="Category"
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="" disabled>
                          <em>Select a category</em>
                        </MenuItem>
                        {categoryOptions.map((c) => (
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
                  )}
                />
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
                  {...register('compareAtPrice')}
                  label="Compare-at price (USD)"
                  type="number"
                  fullWidth
                  inputProps={{ step: '0.01', min: 0 }}
                  error={!!errors.compareAtPrice}
                  helperText={
                    errors.compareAtPrice?.message ??
                    'If > 0, shown on storefront as strikethrough'
                  }
                  sx={fieldSx}
                />
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr 1fr' },
                  gap: 1.5,
                }}
              >
                <TextField
                  {...register('countInStock')}
                  label="Stock"
                  type="number"
                  fullWidth
                  inputProps={{ step: '1', min: 0 }}
                  error={!!errors.countInStock}
                  helperText={errors.countInStock?.message}
                  sx={fieldSx}
                />
                <TextField
                  {...register('sku')}
                  label="SKU"
                  fullWidth
                  error={!!errors.sku}
                  helperText={errors.sku?.message ?? 'Optional'}
                  sx={fieldSx}
                />
                <TextField
                  {...register('weight')}
                  label="Weight (g)"
                  type="number"
                  fullWidth
                  inputProps={{ step: '1', min: 0 }}
                  error={!!errors.weight}
                  helperText={errors.weight?.message ?? 'Optional'}
                  sx={fieldSx}
                />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 0.75,
                    alignItems: 'start',
                  }}
                >
                  <TextField
                    {...register('dimensions.length')}
                    label="L (cm)"
                    type="number"
                    fullWidth
                    inputProps={{ step: '0.1', min: 0 }}
                    error={!!errors.dimensions?.length}
                    sx={fieldSx}
                  />
                  <TextField
                    {...register('dimensions.width')}
                    label="W (cm)"
                    type="number"
                    fullWidth
                    inputProps={{ step: '0.1', min: 0 }}
                    error={!!errors.dimensions?.width}
                    sx={fieldSx}
                  />
                  <TextField
                    {...register('dimensions.height')}
                    label="H (cm)"
                    type="number"
                    fullWidth
                    inputProps={{ step: '0.1', min: 0 }}
                    error={!!errors.dimensions?.height}
                    sx={fieldSx}
                  />
                </Box>
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
              <Box>
                <TextField
                  {...register('tagsText')}
                  label="Tags"
                  placeholder="e.g. summer, cotton, sale"
                  fullWidth
                  error={!!errors.tagsText}
                  helperText={errors.tagsText?.message ?? 'Comma-separated'}
                  sx={fieldSx}
                />
                {tagsTextValue.trim().length > 0 && (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    flexWrap="wrap"
                    sx={{ mt: 1, rowGap: 0.75 }}
                  >
                    {textToTags(tagsTextValue).map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{
                          bgcolor: '#fff0eb',
                          color: '#dc6241',
                          fontWeight: 700,
                          fontSize: 10,
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Visibility toggle */}
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      py: 1,
                      borderTop: '1px solid #f0f2f5',
                      mt: 0.5,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: '"Manrope", sans-serif',
                          fontWeight: 700,
                          fontSize: 13,
                          color: '#242b39',
                        }}
                      >
                        Visible on storefront
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: '#818999', mt: 0.5 }}>
                        When off, this product is hidden from search and category pages.
                      </Typography>
                    </Box>
                    <Switch
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={isSaving}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#e65f3b' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          bgcolor: '#e65f3b',
                        },
                      }}
                    />
                  </Box>
                )}
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

        {/* RIGHT — image upload + meta panels */}
        <Stack spacing={2.125}>
          <Box sx={adminPanelSx}>
            <Typography sx={overlineSx}>Main image</Typography>
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

            {/* Additional images — useFieldArray */}
            <Box sx={{ mt: 2.5 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#818999',
                  }}
                >
                  Gallery images
                </Typography>
                <Button
                  type="button"
                  onClick={() => appendImage('')}
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    ...secondaryBtnSx,
                    py: 0.5,
                    px: 1.25,
                    fontSize: 10,
                    minWidth: 0,
                  }}
                >
                  + Add
                </Button>
              </Stack>
              {imageFields.length === 0 ? (
                <Typography sx={{ fontSize: 10, color: '#9aa3b3', fontStyle: 'italic' }}>
                  No gallery images yet. Click "+ Add" to add a URL.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {imageFields.map((f, idx) => (
                    <Stack
                      key={f.id}
                      direction="row"
                      spacing={0.75}
                      alignItems="center"
                    >
                      <TextField
                        {...register(`images.${idx}` as const)}
                        placeholder={`https://…/image-${idx + 1}.jpg`}
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                      <IconButton
                        type="button"
                        onClick={() => removeImage(idx)}
                        size="small"
                        sx={{
                          color: '#c84c4c',
                          bgcolor: '#fff5f5',
                          '&:hover': { bgcolor: '#ffe5e5' },
                        }}
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>
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
              {compareAtPriceValue !== undefined && Number(compareAtPriceValue) > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 11, color: '#5e6057' }}>Compare-at</Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#9aa3b3',
                      textDecoration: 'line-through',
                    }}
                  >
                    ${Number(compareAtPriceValue).toFixed(2)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 11, color: '#5e6057' }}>Visibility</Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: isActiveValue ? '#17845e' : '#c84c4c',
                  }}
                >
                  {isActiveValue ? 'Active' : 'Hidden'}
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
