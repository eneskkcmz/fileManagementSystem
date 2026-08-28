import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { WorkItemInput, WorkItemStatus } from '@fms/shared';
import {
  priorities, workItemStatuses, workItemTypes, workItemStatusLabelsTr,
} from '@fms/shared';
import {
  useCreateWorkItem, useDeleteWorkItem, useProject, useProjectActivities,
  useUpdateWorkItemStatus, useWorkItems,
} from '../hooks/queries';
import {
  ErrorBox, Loading, PriorityBadge, ProgressBar, ProjectStatusBadge, StatCard,
  formatDate, formatDateTime,
} from '../components/ui';
import { Modal } from '../components/Modal';
import { ApiRequestError } from '../api/client';

type Tab = 'overview' | 'work' | 'activity';

export function ProjectDetail() {
  const { projectId = '' } = useParams();
  const project = useProject(projectId);
  const [tab, setTab] = useState<Tab>('overview');

  if (project.isLoading) return <Loading />;
  if (project.error) return <ErrorBox error={project.error} />;
  if (!project.data) return <ErrorBox error={new Error('Proje bulunamadi')} />;

  const p = project.data;

  return (
    <>
      <div className="crumb">
        <Link to="/fabrikalar">Yönetim</Link> /{' '}
        <Link to={`/factories/${p.factoryId}`}>{p.factoryName}</Link> / {p.name}
      </div>
      <div className="page-head">
        <div className="row" style={{ gap: 12 }}>
          <h1>{p.name}</h1>
          <ProjectStatusBadge status={p.status} />
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Ozet</button>
        <button className={tab === 'work' ? 'active' : ''} onClick={() => setTab('work')}>Is Kalemleri</button>
        <button className={tab === 'activity' ? 'active' : ''} onClick={() => setTab('activity')}>Aktivite</button>
      </div>

      {tab === 'overview' && <Overview stats={p.stats} description={p.description} />}
      {tab === 'work' && <WorkItemsTab projectId={projectId} />}
      {tab === 'activity' && <ActivityTab projectId={projectId} />}
    </>
  );
}

function Overview({ stats, description }: { stats: import('@fms/shared').ProjectStats; description: string | null }) {
  return (
    <>
      <div className="grid cols-4">
        <StatCard label="Toplam Is" value={stats.totalWorkItems} />
        <StatCard label="Tamamlandi" value={stats.completed} />
        <StatCard label="Devam Ediyor" value={stats.inProgress} />
        <StatCard label="Gecikmis" value={stats.overdue} />
      </div>
      <div className="grid cols-4" style={{ marginTop: 16 }}>
        <StatCard label="Testte" value={stats.testing} />
        <StatCard label="Onay Bekliyor" value={stats.waitingApproval} />
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Genel Ilerleme</h3>
        <ProgressBar value={stats.overallProgress} />
      </div>
      {description && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Aciklama</h3>
          <p className="muted" style={{ margin: 0 }}>{description}</p>
        </div>
      )}
    </>
  );
}

function WorkItemsTab({ projectId }: { projectId: string }) {
  const { data, isLoading, error } = useWorkItems({ projectId });
  const changeStatus = useUpdateWorkItemStatus();
  const del = useDeleteWorkItem();
  const [open, setOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const items = data?.items ?? [];

  return (
    <>
      <div className="row between" style={{ marginBottom: 14 }}>
        <span className="muted">{items.length} is kalemi</span>
        <button className="primary" onClick={() => setOpen(true)}>+ Yeni Is Kalemi</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {items.length === 0 ? (
          <div className="empty">Henuz is kalemi yok.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Baslik</th><th>Oncelik</th><th style={{ width: 160 }}>Ilerleme</th><th>Bitis</th><th>Durum</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((w) => (
                <tr key={w.id}>
                  <td>
                    <div>{w.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{w.type}</div>
                  </td>
                  <td><PriorityBadge priority={w.priority} /></td>
                  <td><ProgressBar value={w.progress} /></td>
                  <td className="muted">{formatDate(w.dueDate)}</td>
                  <td>
                    <select
                      value={w.status}
                      onChange={(e) => changeStatus.mutate({ id: w.id, status: e.target.value as WorkItemStatus })}
                      style={{ width: 150 }}
                    >
                      {workItemStatuses.map((s) => <option key={s} value={s}>{workItemStatusLabelsTr[s]}</option>)}
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="ghost danger" onClick={() => confirm(`"${w.title}" silinsin mi?`) && del.mutate(w.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {open && <WorkItemFormModal projectId={projectId} onClose={() => setOpen(false)} />}
    </>
  );
}

function ActivityTab({ projectId }: { projectId: string }) {
  const { data, isLoading, error } = useProjectActivities(projectId);
  if (isLoading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const items = data?.items ?? [];
  return (
    <div className="card">
      {items.length === 0 ? (
        <div className="empty">Aktivite yok.</div>
      ) : (
        items.map((a) => (
          <div key={a.id} className="activity-item">
            <div><span className="badge gray" style={{ marginRight: 8 }}>{a.action}</span>{a.description}</div>
            <div className="time">{formatDateTime(a.createdAt)}</div>
          </div>
        ))
      )}
    </div>
  );
}

function WorkItemFormModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const create = useCreateWorkItem();
  const [form, setForm] = useState<WorkItemInput>({
    projectId, title: '', description: null, type: 'task', status: 'backlog',
    priority: 'medium', progress: 0, startDate: null, dueDate: null,
  });

  const fieldErrors =
    create.error instanceof ApiRequestError
      ? Object.fromEntries(create.error.errors.map((e) => [e.field, e.message]))
      : {};

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(form, { onSuccess: onClose });
  };

  return (
    <Modal title="Yeni Is Kalemi" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="field">
          <label>Baslik *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus />
          {fieldErrors.title && <div className="form-err">{fieldErrors.title}</div>}
        </div>
        <div className="field">
          <label>Aciklama</label>
          <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value || null })} />
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Tip</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as WorkItemInput['type'] })}>
              {workItemTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Oncelik</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as WorkItemInput['priority'] })}>
              {priorities.map((pr) => <option key={pr} value={pr}>{pr}</option>)}
            </select>
          </div>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Durum</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as WorkItemInput['status'] })}>
              {workItemStatuses.map((s) => <option key={s} value={s}>{workItemStatusLabelsTr[s]}</option>)}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Bitis Tarihi</label>
            <input type="date" value={form.dueDate ?? ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value || null })} />
          </div>
        </div>
        <div className="field">
          <label>Ilerleme: {form.progress}%</label>
          <input type="range" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
        </div>
        <div className="row between" style={{ marginTop: 8 }}>
          <button type="button" onClick={onClose}>Vazgec</button>
          <button type="submit" className="primary" disabled={create.isPending}>
            {create.isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
