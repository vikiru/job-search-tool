import type { ApplicationStatus, InterestRating } from '@/pages/applications/data';
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

interface ManualApplicationFormProps {
  initialValues?: ManualApplicationValues;
  idPrefix?: string;
  submitLabel?: string;
}

function ManualApplicationForm({
  initialValues,
  idPrefix = 'manual',
  submitLabel = 'Save application',
}: ManualApplicationFormProps) {
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  return (
    <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <ManualInput
          id={fieldId('company')}
          label="Company"
          defaultValue={initialValues?.company}
          placeholder="Northstar Labs"
          required
        />
        <ManualInput
          id={fieldId('position')}
          label="Role"
          defaultValue={initialValues?.position}
          placeholder="Product Designer"
          required
        />
        <ManualInput
          id={fieldId('location')}
          label="Location"
          defaultValue={initialValues?.location}
          placeholder="Remote or Toronto, ON"
          optional
        />
        <ManualInput
          id={fieldId('url')}
          label="Job posting URL"
          defaultValue={initialValues?.applicationUrl}
          placeholder="https://company.com/role"
          type="url"
          optional
        />
        <ManualInput
          id={fieldId('source')}
          label="Source"
          defaultValue={initialValues?.source}
          placeholder="LinkedIn, referral, company site"
          optional
        />
        <div className="space-y-2">
          <span className="block font-heading text-small font-medium tracking-tight">Status</span>
          <Select defaultValue={initialValues?.status ?? 'SAVED'}>
            <SelectTrigger className="h-10 w-full" aria-label="Application status">
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
          <span className="block font-heading text-small font-medium tracking-tight">Interest</span>
          <Select defaultValue={initialValues?.interestRating ? String(initialValues.interestRating) : undefined}>
            <SelectTrigger className="h-10 w-full" aria-label="Interest rating">
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
          <span className="block font-heading text-small font-medium tracking-tight">Work arrangement</span>
          <Select defaultValue={initialValues?.workArrangement}>
            <SelectTrigger className="h-10 w-full" aria-label="Work arrangement">
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
          defaultValue={initialValues?.jobDescription}
          className="min-h-36 resize-y text-small leading-relaxed sm:min-h-44"
          placeholder="Add the job description or the details you want to keep nearby..."
          required
        />
      </div>
      <DialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-border/60 bg-transparent p-0 pt-5 sm:justify-end">
        <DialogClose render={<Button variant="ghost" className="font-heading" />}>Cancel</DialogClose>
        <Button type="submit" className="font-heading">
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ManualInput({
  defaultValue,
  id,
  label,
  optional = false,
  placeholder,
  required = false,
  type = 'text',
}: {
  defaultValue?: string;
  id: string;
  label: string;
  optional?: boolean;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'url';
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-heading text-small font-medium tracking-tight">
        {label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </label>
      <Input id={id} defaultValue={defaultValue} placeholder={placeholder} required={required} type={type} />
    </div>
  );
}

export type { ManualApplicationValues };
export { ManualApplicationForm };
