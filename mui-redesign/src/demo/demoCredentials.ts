/**
 * Demo credentials displayed on the login page.
 *
 * - DEMO_ACCOUNTS — used when VITE_DEMO_MODE=true (in-memory mock).
 *   The mock users live in `mockData.ts`.
 * - BACKEND_ACCOUNTS — used when running against the real Express backend.
 *   These come from `backend/data/users.js` (seeded via `npm run data:import`).
 *
 * Password for both: "123456" (matches MOCK_PASSWORD in mockData.ts and the
 * seeder in backend/data/users.js).
 */

export interface DemoCredential {
  email: string;
  label: string;
  isAdmin: boolean;
}

export const DEMO_ACCOUNTS: DemoCredential[] = [
  { email: 'admin@proshop.com', label: 'admin@proshop.com', isAdmin: true },
  { email: 'jane@proshop.com',  label: 'jane@proshop.com',  isAdmin: false },
];

export const BACKEND_ACCOUNTS: DemoCredential[] = [
  { email: 'admin@email.com', label: 'admin@email.com', isAdmin: true },
  { email: 'jane@email.com',  label: 'jane@email.com',  isAdmin: false },
];

export const DEMO_PASSWORD = '123456';
