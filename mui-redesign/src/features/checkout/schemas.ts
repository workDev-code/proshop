import { z } from 'zod';

export const shippingSchema = z.object({
  address: z.string().min(5, 'Address is too short').max(200),
  city: z.string().min(2, 'City is required').max(100),
  postalCode: z.string().min(3, 'Postal code is too short').max(20),
  country: z.string().min(2, 'Country is required').max(100),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Enter a valid coupon code')
    .max(30, 'Code too long')
    .transform((s) => s.toUpperCase().trim()),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
