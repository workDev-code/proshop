import { api } from '../../store/api';
import type {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from './types';

/**
 * Address API — saved shipping addresses per user.
 *
 *   GET    /api/addresses             (auth)
 *   POST   /api/addresses             (auth)
 *   PUT    /api/addresses/:id         (auth, owner only)
 *   DELETE /api/addresses/:id         (auth, owner only)
 */
export const addressApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMyAddresses: build.query<Address[], void>({
      query: () => '/api/addresses',
      providesTags: ['Address'],
    }),
    createAddress: build.mutation<Address, CreateAddressPayload>({
      query: (body) => ({ url: '/api/addresses', method: 'POST', body }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: build.mutation<
      Address,
      { id: string; payload: UpdateAddressPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/addresses/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
