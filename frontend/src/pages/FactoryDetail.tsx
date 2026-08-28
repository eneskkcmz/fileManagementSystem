import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ProjectInput } from '@fms/shared';
import { projectStatuses, projectStatusLabelsTr } from '@fms/shared';
import { useCreateProject, useDeleteProject, useFactories, useProjects } from '../hooks/queries';
import { ErrorBox, Loading, ProgressBar, ProjectStatusBadge } from '../components/ui';
import { Modal } from '../components/Modal';
import { ApiRequestError } from '../api/client';

export function FactoryDetail() {
  const { factoryId = '' } = useParams();
  const factories = useFactories();
  const projects = useProjects(factoryId);
  const del = useDeleteProject();
  const [open, setOpen] = useState(false);

  if (projects.isLoading || factories.isLoading) return <Loading />;
  if (projects.error) return <ErrorBox error={projects.error} />;

  const factory = factories.data?.items.find((f) => f.id === factoryId);
  const list = projects.data?.items ?? [];

  return (
    <>
      <div className="crumb"><Link to="/fabrikalar">Yönetim</Link> / {factory?.name ?? '...'}</div>
      <div className="page-head">
        <h1>{factory?.name ?? 'Fabrika'}</h1>
        <button className="primary" onClick={() => setOpen(true)}>+ Yeni Proje</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {list.length === 0 ? (
          <div className="empty">Bu fabrikada henuz proje yok.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Proje</th><th>Durum</th><th style={{ width: 200 }}>Ilerleme</th><th>Is Kalemi</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><Link className="link" to={`/projects/${p.id}`}>{p.name}</Link></td>
                  <td><ProjectStatusBadge status={p.status} /></td>
                  <td><ProgressBar value={p.stats.overallProgress} /></td>
                  <td>{p.stats.completed}/{p.stats.totalWorkItems}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="ghost danger" onClick={() => confirm(`"${p.name}" silinsin mi?`) && del.mutate(p.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && <ProjectFormModal factoryId={factoryId} onClose={() => setOpen(false)} />}
    </>
  );
}

function ProjectFormModal({ factoryId, onClose }: { factoryId: string; onClose: () => void }) {
  const create = useCreateProject();
  const [form, setForm] = useState<ProjectInput>({
    factoryId, name: '', description: null, status: 'planning', startDate: null, targetEndDate: null,
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
    <Modal title="Yeni Proje" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="field">
          <label>Proje Adi *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
          {fieldErrors.name && <div className="form-err">{fieldErrors.name}</div>}
        </div>
        <div className="field">
          <label>Aciklama</label>
          <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value || null })} />
        </div>
        <div className="field">
          <label>Durum</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectInput['status'] })}>
            {projectStatuses.map((s) => <option key={s} value={s}>{projectStatusLabelsTr[s]}</option>)}
          </select>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Baslangic</label>
            <input type="date" value={form.startDate ?? ''} onChange={(e) => setForm({ ...form, startDate: e.target.value || null })} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Hedef Bitis</label>
            <input type="date" value={form.targetEndDate ?? ''} onChange={(e) => setForm({ ...form, targetEndDate: e.target.value || null })} />
          </div>
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
