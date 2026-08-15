import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
  users,
  applications,
  applicationLinks,
  applicationNotes,
  applicationAnalysis,
  resumes,
  applicationStatusEnum,
  workArrangementEnum,
  salaryPeriodEnum,
} from '@/server/db/schema';

export const ApplicationStatusSchema = z.enum(applicationStatusEnum.enumValues);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const WorkArrangementSchema = z.enum(workArrangementEnum.enumValues);
export type WorkArrangement = z.infer<typeof WorkArrangementSchema>;

export const SalaryPeriodSchema = z.enum(salaryPeriodEnum.enumValues);
export type SalaryPeriod = z.infer<typeof SalaryPeriodSchema>;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

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

export const insertResumeSchema = createInsertSchema(resumes);
export const selectResumeSchema = createSelectSchema(resumes);
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type SelectResume = z.infer<typeof selectResumeSchema>;
