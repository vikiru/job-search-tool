import { FileUp, ShieldCheck } from 'lucide-react';

function ResumeUploader() {
  return (
    <div className="space-y-4">
      <label
        htmlFor="resume-upload"
        className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/35 bg-primary/[0.03] px-5 py-8 text-center transition-colors motion-reduce:transition-none hover:border-primary/60 hover:bg-primary/[0.06] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform motion-reduce:transition-none group-hover:-translate-y-0.5">
          <FileUp className="size-icon-lg" aria-hidden="true" />
        </span>
        <span className="mt-4 font-heading text-p font-semibold leading-tight tracking-tight">
          Drop your resume here
        </span>
        <span className="mt-2 max-w-md text-small leading-relaxed text-muted-foreground">
          Or choose a PDF from your device. We’ll extract the text so you can review it before using it for analysis.
        </span>
        <span className="mt-4 inline-flex h-9 items-center rounded-lg bg-primary px-3 font-heading text-small font-medium text-primary-foreground">
          Choose PDF
        </span>
        <input id="resume-upload" className="sr-only" type="file" accept="application/pdf" />
      </label>
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-caption leading-relaxed text-muted-foreground">
        <ShieldCheck className="size-icon-sm text-success" aria-hidden="true" />
        <span className="font-heading font-medium text-foreground">PDF only · up to 5 MB</span>
        <span aria-hidden="true">·</span>
        <span>Converted to text. Original file isn’t stored.</span>
      </p>
    </div>
  );
}

export { ResumeUploader };
