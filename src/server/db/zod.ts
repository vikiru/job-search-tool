import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  users,
  applications,
  applicationLinks,
  applicationNotes,
  applicationAnalysis,
  applicationActivity,
  resumes,
  userLinks,
  applicationStatusEnum,
  workArrangementEnum,
  salaryPeriodEnum,
  applicationActivityEventEnum,
} from '@/server/db/schema';

export const ApplicationStatusSchema = z.enum(applicationStatusEnum.enumValues);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const WorkArrangementSchema = z.enum(workArrangementEnum.enumValues);
export type WorkArrangement = z.infer<typeof WorkArrangementSchema>;

export const SalaryPeriodSchema = z.enum(salaryPeriodEnum.enumValues);
export type SalaryPeriod = z.infer<typeof SalaryPeriodSchema>;

export const ApplicationActivityEventSchema = z.enum(applicationActivityEventEnum.enumValues);
export type ApplicationActivityEvent = z.infer<typeof ApplicationActivityEventSchema>;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

export const insertUserLinkSchema = createInsertSchema(userLinks);
export const selectUserLinkSchema = createSelectSchema(userLinks);
export type InsertUserLink = z.infer<typeof insertUserLinkSchema>;
export type SelectUserLink = z.infer<typeof selectUserLinkSchema>;

export const insertApplicationSchema = createInsertSchema(applications);
export const selectApplicationSchema = createSelectSchema(applications);
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type SelectApplication = z.infer<typeof selectApplicationSchema>;

export const insertApplicationLinkSchema = createInsertSchema(applicationLinks);
export const selectApplicationLinkSchema = createSelectSchema(applicationLinks);
export type InsertApplicationLink = z.infer<typeof insertApplicationLinkSchema>;
export type SelectApplicationLink = z.infer<typeof selectApplicationLinkSchema>;

export const insertApplicationNoteSchema = createInsertSchema(applicationNotes);
export const selectApplicationNoteSchema = createSelectSchema(applicationNotes);
export type InsertApplicationNote = z.infer<typeof insertApplicationNoteSchema>;
export type SelectApplicationNote = z.infer<typeof selectApplicationNoteSchema>;

export const insertApplicationAnalysisSchema = createInsertSchema(applicationAnalysis);
export const selectApplicationAnalysisSchema = createSelectSchema(applicationAnalysis);
export type InsertApplicationAnalysis = z.infer<typeof insertApplicationAnalysisSchema>;
export type SelectApplicationAnalysis = z.infer<typeof selectApplicationAnalysisSchema>;

export const insertApplicationActivitySchema = createInsertSchema(applicationActivity);
export const selectApplicationActivitySchema = createSelectSchema(applicationActivity);
export type InsertApplicationActivity = z.infer<typeof insertApplicationActivitySchema>;
export type SelectApplicationActivity = z.infer<typeof selectApplicationActivitySchema>;

export const insertResumeSchema = createInsertSchema(resumes);
export const selectResumeSchema = createSelectSchema(resumes);
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type SelectResume = z.infer<typeof selectResumeSchema>;
