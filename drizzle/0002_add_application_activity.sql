CREATE TYPE "public"."application_activity_event" AS ENUM('APPLICATION_CREATED', 'STATUS_CHANGED');--> statement-breakpoint
CREATE TABLE "application_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"application_id" uuid NOT NULL,
	"event_type" "application_activity_event" NOT NULL,
	"previous_status" "application_status",
	"next_status" "application_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_activity" ADD CONSTRAINT "application_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_activity" ADD CONSTRAINT "application_activity_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "application_activity_user_created_idx" ON "application_activity" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "application_activity_application_created_idx" ON "application_activity" USING btree ("application_id","created_at" DESC NULLS LAST);
