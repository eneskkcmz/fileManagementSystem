import type { ReactNode } from 'react';
import type { Priority, ProjectStatus, WorkItemStatus } from '@fms/shared';
import { projectStatusLabelsTr, workItemStatusLabelsTr } from '@fms/shared';

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="card stat">
      <span className="value">{value}</span>
      <span className="label">{label}</span>
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="row" style={{ gap: 8 }}>
      <div className="progress" style={{ flex: 1 }}>
        <span style={{ width: `${v}%` }} />
      </div>
      <span className="muted" style={{ minWidth: 34, textAlign: 'right' }}>{v}%</span>
    </div>
  );
}

const projectTone: Record<ProjectStatus, string> = {
  planning: 'gray', active: '', on_hold: 'amber', completed: 'green', cancelled: 'red',
};
export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`badge ${projectTone[status]}`}>{projectStatusLabelsTr[status]}</span>;
}

const workTone: Record<WorkItemStatus, string> = {
  backlog: 'gray', planned: 'gray', in_progress: '', testing: 'amber',
  waiting_approval: 'amber', completed: 'green', cancelled: 'red',
};
export function WorkStatusBadge({ status }: { status: WorkItemStatus }) {
  return <span className={`badge ${workTone[status]}`}>{workItemStatusLabelsTr[status]}</span>;
}

const priorityTone: Record<Priority, string> = { low: 'gray', medium: '', high: 'amber', critical: 'red' };
const priorityLabel: Record<Priority, string> = { low: 'Dusuk', medium: 'Orta', high: 'Yuksek', critical: 'Kritik' };
export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`badge ${priorityTone[priority]}`}>{priorityLabel[priority]}</span>;
}

export function Loading() {
  return <div className="empty">Yukleniyor...</div>;
}

export function ErrorBox({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : 'Bir hata olustu';
  return <div className="card" style={{ color: 'var(--danger)' }}>Hata: {msg}</div>;
}

export function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
