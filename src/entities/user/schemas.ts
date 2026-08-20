import { z } from 'zod';

import { httpUrlSchema } from '@/shared/lib/validation';

export const userContactLinkSchema = z.object({
  href: httpUrlSchema.refine((value) => value.length <= 2_000, 'URL is too long.'),
  label: z.string().trim().min(1).max(100),
});

export const userContactSchema = z.object({
  email: z.string().trim().email().or(z.literal('')),
  links: z.array(userContactLinkSchema).max(20),
  phoneNumber: z.string().trim().max(50),
});

export type UserContactLink = z.infer<typeof userContactLinkSchema>;
export type UserContactData = {
  email: string | null;
  links: UserContactLink[];
  phoneNumber: string | null;
};
export type UserContactUpdate = z.infer<typeof userContactSchema>;
