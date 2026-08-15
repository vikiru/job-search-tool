import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl">Job Search OS</h1>
      <p className="mt-4 max-w-lg text-lg text-muted-foreground font-body">
        An AI-powered system designed to track, analyze, and optimize your job applications.
      </p>
      <div className="mt-8 flex gap-4">
        <Button size="lg">Get Started</Button>
      </div>
    </main>
  );
}
