import { api } from '../../store/api';
import type { User, LoginPayload, RegisterPayload } from './types';

/**
 * Auth API endpoints
 * Injected into the root RTK Query api so they share the same cache & baseQuery.
 *
 * Backend routes (see backend/routes/userRoutes.js):
 *   POST   /api/users          - register
 *   POST   /api/users/auth     - login
 *   POST   /api/users/logout   - logout
 *   GET    /api/users/profile  - get current user (requires JWT cookie)
 */

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get current user profile.
     * Returns 401 if no/invalid JWT cookie — used to detect existing sessions on app load.
     */
    getProfile: build.query<User, void>({
      query: () => ({ url: '/api/users/profile', method: 'GET' }),
      providesTags: ['User'],
    }),

    /**
     * Login: sets JWT cookie on success, returns user.
     * We populate the getProfile cache so other components see the user immediately.
     */
    login: build.mutation<User, LoginPayload>({
      query: (body) => ({ url: '/api/users/auth', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: user } = await queryFulfilled;
          // Populate the getProfile cache so useCurrentUser() updates everywhere
          dispatch(
            authApi.util.upsertQueryData('getProfile', undefined, user),
          );
        } catch {
          // error handled in component via toast
        }
      },
    }),

    /**
     * Register: creates user, sets JWT cookie, returns user.
     */
    register: build.mutation<User, RegisterPayload>({
      query: (body) => ({ url: '/api/users', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(
            authApi.util.upsertQueryData('getProfile', undefined, user),
          );
        } catch {
          // error handled in component via toast
        }
      },
    }),

    /**
     * Logout: clears cookie on server, then wipes all RTK Query cache locally
     * (so useCurrentUser() returns undefined).
     */
    /**
     * Update the current user's profile.
     * Optionally include `password` to change it.
     */
    updateProfile: build.mutation<
      User,
      { name?: string; email?: string; password?: string }
    >({
      query: (body) => ({ url: '/api/users/profile', method: 'PUT', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(
            authApi.util.upsertQueryData('getProfile', undefined, user),
          );
        } catch {
          // error handled in component
        }
      },
    }),

    logout: build.mutation<{ message: string }, void>({
      query: () => ({ url: '/api/users/logout', method: 'POST' }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Always clear local cache (success or failure)
          dispatch(api.util.resetApiState());
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;
