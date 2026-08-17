import type { ApplicationRecord } from '@/pages/applications/data';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface ChangeStatusDialogProps {
  application: ApplicationRecord;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function ChangeStatusDialog({ application, onOpenChange, open }: ChangeStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-7 p-6 sm:max-w-md sm:p-7">
        <DialogHeader className="gap-3 pr-8">
          <DialogTitle className="font-heading text-h3 font-semibold leading-tight tracking-tight">
            Change application status
          </DialogTitle>
          <DialogDescription className="max-w-prose text-small leading-relaxed text-pretty">
            Update the status for your {application.position} application at {application.company}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label
            htmlFor={`status-${application.id}`}
            className="block font-heading text-small font-medium tracking-tight"
          >
            Status
          </label>
          <Select defaultValue={application.status}>
            <SelectTrigger id={`status-${application.id}`} className="h-10 w-full" aria-label="Application status">
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
        <DialogFooter className="mx-0 mb-0 gap-2 rounded-none border-t border-border/60 bg-transparent p-0 pt-5 sm:justify-end">
          <DialogClose render={<Button variant="ghost" className="font-heading" />}>Cancel</DialogClose>
          <Button className="font-heading">Save status</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ChangeStatusDialog };
