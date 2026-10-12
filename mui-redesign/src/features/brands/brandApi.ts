import { api } from '../../store/api';
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
} from './types';

/**
 * Brand API — referenced by product metadata + the hero's
 * "Featured · {brand}" eyebrow.
 *
 *   GET    /api/brands             (public)
 *   POST   /api/brands             (admin)
 *   GET    /api/brands/:id         (public)
 *   PUT    /api/brands/:id         (admin)
 *   DELETE /api/brands/:id         (admin)
 */
export const brandApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBrands: build.query<Brand[], void>({
      query: () => '/api/brands',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Brand' as const, id: _id })),
              { type: 'Brand' as const, id: 'LIST' },
            ]
          : [{ type: 'Brand' as const, id: 'LIST' }],
    }),
    getBrandById: build.query<Brand, string>({
      query: (id) => `/api/brands/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Brand', id }],
    }),
    createBrand: build.mutation<Brand, CreateBrandPayload>({
      query: (body) => ({ url: '/api/brands', method: 'POST', body }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),
    updateBrand: build.mutation<
      Brand,
      { id: string; payload: UpdateBrandPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/brands/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Brand', id },
        { type: 'Brand', id: 'LIST' },
      ],
    }),
    deleteBrand: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/brands/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Brand', id },
        { type: 'Brand', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
