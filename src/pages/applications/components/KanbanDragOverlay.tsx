import { KanbanCard } from '@/pages/applications/components/KanbanCard';
import type { ApplicationRecord } from '@/pages/applications/application-model';

interface KanbanDragOverlayProps {
  application: ApplicationRecord | null;
  userId: string;
}

export function KanbanDragOverlay({ application, userId }: KanbanDragOverlayProps) {
  if (!application) return null;
  return <KanbanCard application={application} userId={userId} isOverlay />;
}
