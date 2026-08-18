CREATE INDEX "application_links_application_created_idx" ON "application_links" USING btree ("application_id", "created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "application_notes_application_created_idx" ON "application_notes" USING btree ("application_id", "created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "applications_user_application_date_idx" ON "applications" USING btree ("user_id", "application_date");--> statement-breakpoint
DROP INDEX "applications_app_date_idx";
