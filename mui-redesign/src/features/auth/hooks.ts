import { useGetProfileQuery } from './authApi';
import type { User } from './types';

/**
 * Returns the current authenticated user from RTK Query cache, or null if not logged in.
 * Also returns the loading state for bootstrap checks.
 *
 * Usage:
 *   const { user, isLoading, isError } = useCurrentUser();
 */
export const useCurrentUser = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetProfileQuery();

  return {
    user: (data ?? null) as User | null,
    isLoading: isLoading || isFetching,
    isAuthenticated: !!data && !isError,
    isError,
    refetch,
  };
};
