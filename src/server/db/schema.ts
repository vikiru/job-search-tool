import { pgEnum, pgTable, text, timestamp, uuid, smallint, numeric, date, index } from 'drizzle-orm/pg-core';

export const applicationStatusEnum = pgEnum('application_status', [
  'SAVED',
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
  'GHOSTED',
]);

export const workArrangementEnum = pgEnum('work_arrangement', ['REMOTE', 'HYBRID', 'ONSITE']);

export const salaryPeriodEnum = pgEnum('salary_period', ['YEARLY', 'HOURLY', 'MONTHLY', 'WEEKLY']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phoneNumber: text('phone_number'),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    company: text('company').notNull(),
    position: text('position').notNull(),
    status: applicationStatusEnum('status').default('SAVED').notNull(),
    interestRating: smallint('interest_rating'),
    location: text('location'),
    workArrangement: workArrangementEnum('work_arrangement'),
    employmentType: text('employment_type'),
    salaryMin: numeric('salary_min'),
    salaryMax: numeric('salary_max'),
    salaryCurrency: text('salary_currency'),
    salaryPeriod: salaryPeriodEnum('salary_period'),
    hoursPerWeek: numeric('hours_per_week', { precision: 5, scale: 2 }),
    requisitionNumber: text('requisition_number'),
    applicationInstructions: text('application_instructions').array(),
    applicationUrl: text('application_url'),
    applicationDate: date('application_date').defaultNow().notNull(),
    source: text('source'),
    jobDescriptionMd: text('job_description_md').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('applications_user_status_idx').on(table.userId, table.status),
    index('applications_user_created_idx').on(table.userId, table.createdAt.desc()),
    index('applications_app_date_idx').on(table.applicationDate),
  ],
);

export const applicationLinks = pgTable('application_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationId: uuid('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  label: text('label'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const applicationNotes = pgTable('application_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationId: uuid('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const applicationAnalysis = pgTable('application_analysis', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationId: uuid('application_id')
    .notNull()
    .unique()
    .references(() => applications.id, { onDelete: 'cascade' }),
  matchScore: smallint('match_score'),
  tldr: text('tldr'),
  technologies: text('technologies').array(),
  skills: text('skills').array(),
  qualifications: text('qualifications').array(),
  responsibilities: text('responsibilities').array(),
  benefits: text('benefits').array(),
  keywords: text('keywords').array(),
  matchedRequirements: text('matched_requirements').array(),
  missingRequirements: text('missing_requirements').array(),
  strengths: text('strengths').array(),
  gaps: text('gaps').array(),
  recommendations: text('recommendations').array(),
  observations: text('observations'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const resumes = pgTable('resumes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  extractedText: text('extracted_text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
