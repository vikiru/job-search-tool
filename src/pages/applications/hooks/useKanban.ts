import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useUpdateApplicationStatusMutation } from '@/features/applications/hooks/useApplicationMutations';
import { formatStatus, type ApplicationRecord } from '@/pages/applications/application-model';

const DRAG_DEBOUNCE_MS = 400;

interface PendingStatusChange {
  originalStatus: ApplicationRecord['status'];
  nextStatus: ApplicationRecord['status'];
}

export function useKanban(userId: string) {
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ApplicationRecord['status']>>({});
  const statusMutation = useUpdateApplicationStatusMutation(userId);
  const pendingChanges = useRef(new Map<string, PendingStatusChange>());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      for (const timer of activeTimers.values()) clearTimeout(timer);
    };
  }, []);

  function scheduleStatusChange(application: ApplicationRecord, nextStatus: ApplicationRecord['status']) {
    const existing = pendingChanges.current.get(application.id);
    const originalStatus = existing?.originalStatus ?? application.status;
    const previousTimer = timers.current.get(application.id);
    if (previousTimer) clearTimeout(previousTimer);

    pendingChanges.current.set(application.id, { nextStatus, originalStatus });
    const timer = setTimeout(() => {
      void persistStatusChange(application, nextStatus, originalStatus);
    }, DRAG_DEBOUNCE_MS);
    timers.current.set(application.id, timer);
  }

  async function persistStatusChange(
    application: ApplicationRecord,
    nextStatus: ApplicationRecord['status'],
    originalStatus: ApplicationRecord['status'],
  ) {
    const result = await statusMutation.mutateAsync({ id: application.id, status: nextStatus });
    const pending = pendingChanges.current.get(application.id);
    if (!pending || pending.nextStatus !== nextStatus) return;

    pendingChanges.current.delete(application.id);
    timers.current.delete(application.id);
    setStatusOverrides((current) => {
      const next = { ...current };
      delete next[application.id];
      return next;
    });

    if (!result.success) {
      toast.error('Application status was not saved.', {
        description: `Application remains ${formatStatus(originalStatus)}.`,
      });
      return;
    }

    toast.success('Application moved.', {
      description: `Application changed from ${formatStatus(originalStatus)} to ${formatStatus(nextStatus)}.`,
    });
  }

  function handleStatusChange(application: ApplicationRecord, nextStatus: ApplicationRecord['status']) {
    if (application.status === nextStatus) return;
    setStatusOverrides((current) => ({ ...current, [application.id]: nextStatus }));
    scheduleStatusChange(application, nextStatus);
  }

  return { handleStatusChange, statusOverrides };
}
