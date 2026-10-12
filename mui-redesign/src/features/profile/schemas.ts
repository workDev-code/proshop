import { z } from 'zod';

export const profileSchema = z
  .object({
    name: z.string().min(2, 'Name is required').max(50),
    email: z.string().email('Invalid email'),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is set, confirmPassword must match
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  )
  .refine(
    (data) => {
      // If password is set, must be at least 6 chars
      if (data.password && data.password.length > 0) {
        return data.password.length >= 6;
      }
      return true;
    },
    {
      message: 'Password must be at least 6 characters',
      path: ['password'],
    },
  );

export type ProfileFormValues = z.infer<typeof profileSchema>;
