import { api } from '../../store/api';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from './types';

/**
 * Category API — drives storefront CategoryGrid + admin management.
 *
 *   GET    /api/categories             (public)
 *   POST   /api/categories             (admin)
 *   GET    /api/categories/:id         (public)
 *   PUT    /api/categories/:id         (admin)
 *   DELETE /api/categories/:id         (admin)
 */
export const categoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => '/api/categories',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
              { type: 'Category' as const, id: 'LIST' },
            ]
          : [{ type: 'Category' as const, id: 'LIST' }],
    }),
    getCategoryById: build.query<Category, string>({
      query: (id) => `/api/categories/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Category', id }],
    }),
    createCategory: build.mutation<Category, CreateCategoryPayload>({
      query: (body) => ({ url: '/api/categories', method: 'POST', body }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: build.mutation<
      Category,
      { id: string; payload: UpdateCategoryPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/categories/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    deleteCategory: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
