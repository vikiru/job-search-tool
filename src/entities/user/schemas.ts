import { z } from 'zod';

export const userContactLinkSchema = z.object({
  href: z.string().trim().min(1).url(),
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
