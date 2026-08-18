import { createServerFn } from '@tanstack/react-start';
import { auth } from '@clerk/tanstack-react-start/server';
import { z } from 'zod';

import { findUserContactById, updateUserContact } from '@/server/db/queries/users';
import { error, success, type Result } from '@/shared/lib/result';
import type { UserContactData } from '@/features/profile/types';
import { logServerError } from '@/server/lib/log-error';
import { toSafeHttpUrl } from '@/shared/lib/urls';

const contactLinkSchema = z.object({
  href: z.string().trim().min(1).max(2_000),
  label: z.string().trim().min(1).max(100),
});

const contactSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').or(z.literal('')),
  links: z.array(contactLinkSchema).max(20),
  phoneNumber: z.string().trim().max(50),
});

function validateContactInput(input: unknown): Result<z.infer<typeof contactSchema>> {
  const parsed = contactSchema.safeParse(input);
  return parsed.success ? success(parsed.data) : error('Invalid contact information.');
}

function normalizeLink(link: z.infer<typeof contactLinkSchema>): UserContactData['links'][number] | null {
  const href = toSafeHttpUrl(link.href);
  return href ? { href, label: link.label } : null;
}

export const getUserContact = createServerFn({ method: 'GET' }).handler(async (): Promise<Result<UserContactData>> => {
  const { userId } = await auth();
  if (!userId) return error('Unauthorized');

  try {
    const contact = await findUserContactById(userId);
    if (!contact) return error('Profile not found.');

    return success({
      email: contact.email,
      links: contact.links.map(({ url, label }) => ({ href: url, label })),
      phoneNumber: contact.phoneNumber,
    });
  } catch (cause) {
    logServerError('profile:get-contact', cause);
    return error('We could not load your contact information.');
  }
});

export const saveUserContact = createServerFn({ method: 'POST' })
  .validator(validateContactInput)
  .handler(async ({ data }): Promise<Result<UserContactData>> => {
    if (!data.success) return data;

    const { userId } = await auth();
    if (!userId) return error('Unauthorized');

    const links = data.data.links.map(normalizeLink);
    if (links.some((link) => link === null)) return error('Enter valid public links.');

    try {
      const user = await updateUserContact(userId, {
        email: data.data.email || null,
        links: links.filter((link): link is UserContactData['links'][number] => link !== null),
        phoneNumber: data.data.phoneNumber || null,
      });
      if (!user) return error('Profile not found.');

      return success({
        email: user.email,
        links: links.filter((link): link is UserContactData['links'][number] => link !== null),
        phoneNumber: user.phoneNumber,
      });
    } catch (cause) {
      logServerError('profile:save-contact', cause);
      return error('We could not save your contact information.');
    }
  });
