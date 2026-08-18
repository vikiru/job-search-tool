import '@tanstack/react-start/server-only';

import pdf from 'pdf-parse';

import { MAX_RESUME_FILE_SIZE } from '@/features/resumes/constants';
import { error, success, type Result } from '@/shared/lib/result';

const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phonePattern = /(?<!\w)(?:\+?\d[\d\s().-]{7,}\d)(?!\w)/g;

function sanitizeResumeText(text: string): string {
  return text
    .replace(emailPattern, '')
    .replace(phonePattern, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function parseResumePdf(buffer: Buffer): Promise<Result<string>> {
  if (buffer.byteLength === 0) {
    return error('The PDF file is empty.');
  }

  if (buffer.byteLength > MAX_RESUME_FILE_SIZE) {
    return error('Resume files must be 5 MB or smaller.');
  }

  if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
    return error('Please upload a valid PDF file.');
  }

  try {
    const result = await pdf(buffer);
    const extractedText = sanitizeResumeText(result.text);

    if (!extractedText) {
      return error('We could not extract readable text from this PDF.');
    }

    return success(extractedText);
  } catch {
    return error('We could not extract readable text from this PDF.');
  }
}
