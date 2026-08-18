import { useState } from 'react';

import type { ApplicationStatus, InterestRating } from '@/pages/applications/application-model';

import { Button } from '@/shared/components/ui/button';
import { DialogClose, DialogFooter } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

interface ManualApplicationValues {
  company?: string;
  position?: string;
  location?: string;
  applicationUrl?: string;
  source?: string;
  status?: ApplicationStatus;
  workArrangement?: string;
  interestRating?: InterestRating | null;
  jobDescription?: string;
}

export type ManualApplicationSubmitValues = {
  company: string;
  position: string;
  location: string;
  applicationUrl: string;
  source: string;
  status: ApplicationStatus;
  interestRating: InterestRating | null;
  workArrangement: string;
  jobDescriptionMd: string;
};

interface ManualApplicationFormProps {
  initialValues?: ManualApplicationValues;
  idPrefix?: string;
  isSubmitting?: boolean;
  onSubmit: (values: ManualApplicationSubmitValues) => void | Promise<void>;
  submitLabel?: string;
}

function ManualApplicationForm({
  initialValues,
  idPrefix = 'manual',
  isSubmitting = false,
  onSubmit,
  submitLabel = 'Save application',
}: ManualApplicationFormProps) {
  const fieldId = (name: string) => `${idPrefix}-${name}`;
  const [company, setCompany] = useState(initialValues?.company ?? '');
  const [position, setPosition] = useState(initialValues?.position ?? '');
  const [location, setLocation] = useState(initialValues?.location ?? '');
  const [applicationUrl, setApplicationUrl] = useState(initialValues?.applicationUrl ?? '');
  const [source, setSource] = useState(initialValues?.source ?? '');
  const [status, setStatus] = useState<ApplicationStatus>(initialValues?.status ?? 'SAVED');
  const [interestRating, setInterestRating] = useState(initialValues?.interestRating ?? null);
  const [workArrangement, setWorkArrangement] = useState(initialValues?.workArrangement ?? '');
  const [jobDescriptionMd, setJobDescriptionMd] = useState(initialValues?.jobDescription ?? '');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      applicationUrl,
      company,
      interestRating,
      jobDescriptionMd,
      location,
      position,
      source,
      status,
      workArrangement,
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <ManualApplicationInput
          id={fieldId('company')}
          label="Company"
          onChange={setCompany}
          value={company}
          placeholder="Northstar Labs"
          required
        />
        <ManualApplicationInput
          id={fieldId('position')}
          label="Role"
          onChange={setPosition}
          value={position}
          placeholder="Product Designer"
          required
        />
        <ManualApplicationInput
          id={fieldId('location')}
          label="Location"
          onChange={setLocation}
          value={location}
          placeholder="Remote or Toronto, ON"
          optional
        />
        <ManualApplicationInput
          id={fieldId('url')}
          label="Job posting URL"
          onChange={setApplicationUrl}
          value={applicationUrl}
          placeholder="https://company.com/role"
          type="url"
          optional
        />
        <ManualApplicationInput
          id={fieldId('source')}
          label="Source"
          onChange={setSource}
          value={source}
          placeholder="LinkedIn, referral, company site"
          optional
        />
        <div className="space-y-2">
          <label htmlFor={fieldId('status')} className="block font-heading text-small font-medium tracking-tight">
            Status
          </label>
          <Select value={status} onValueChange={(value) => setStatus(value as ApplicationStatus)}>
            <SelectTrigger id={fieldId('status')} className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="SAVED">Saved</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="SCREENING">Screening</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              <SelectItem value="GHOSTED">Ghosted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor={fieldId('interest')} className="block font-heading text-small font-medium tracking-tight">
            Interest
          </label>
          <Select
            value={interestRating ? String(interestRating) : ''}
            onValueChange={(value) => setInterestRating(value ? (Number(value) as InterestRating) : null)}
          >
            <SelectTrigger id={fieldId('interest')} className="h-10 w-full">
              <SelectValue placeholder="Not rated" />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="5">5 of 5</SelectItem>
              <SelectItem value="4">4 of 5</SelectItem>
              <SelectItem value="3">3 of 5</SelectItem>
              <SelectItem value="2">2 of 5</SelectItem>
              <SelectItem value="1">1 of 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor={fieldId('work-arrangement')}
            className="block font-heading text-small font-medium tracking-tight"
          >
            Work arrangement
          </label>
          <Select value={workArrangement} onValueChange={(value) => setWorkArrangement(value ?? '')}>
            <SelectTrigger id={fieldId('work-arrangement')} className="h-10 w-full">
              <SelectValue placeholder="Choose one" />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="REMOTE">Remote</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
              <SelectItem value="ONSITE">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={fieldId('description')} className="font-heading text-small font-medium tracking-tight">
            Job description
          </label>
          <span className="text-caption text-muted-foreground">Required</span>
        </div>
        <Textarea
          id={fieldId('description')}
          onChange={(event) => setJobDescriptionMd(event.target.value)}
          value={jobDescriptionMd}
          className="min-h-36 resize-y text-small leading-relaxed sm:min-h-44"
          placeholder="Add the job description or the details you want to keep nearby..."
          required
        />
      </div>
      <DialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-border/60 bg-transparent p-0 pt-5 sm:justify-end">
        <DialogClose render={<Button variant="ghost" className="font-heading" />}>Cancel</DialogClose>
        <Button type="submit" className="font-heading" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface ManualApplicationInputProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  optional?: boolean;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'url';
  value: string;
}

function ManualApplicationInput({
  id,
  label,
  onChange,
  optional = false,
  placeholder,
  required = false,
  value,
  type = 'text',
}: ManualApplicationInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-heading text-small font-medium tracking-tight">
        {label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </label>
      <Input
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}

export type { ManualApplicationValues };
export { ManualApplicationForm };
