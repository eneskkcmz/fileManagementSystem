import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FactoryInput } from '@fms/shared';
import { useCreateFactory, useDeleteFactory, useFactories } from '../hooks/queries';
import { ErrorBox, Loading } from '../components/ui';
import { Modal } from '../components/Modal';
import { ApiRequestError } from '../api/client';

export function Factories() {
  const { data, isLoading, error } = useFactories();
  const del = useDeleteFactory();
  const [open, setOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox error={error} />;

  const factories = data?.items ?? [];

  return (
    <>
      <div className="page-head">
        <h1>Fabrikalar</h1>
        <button className="primary" onClick={() => setOpen(true)}>+ Yeni Fabrika</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {factories.length === 0 ? (
          <div className="empty">Henuz fabrika yok. Ilk fabrikayi ekleyin.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Ad</th><th>Kod</th><th>Aciklama</th><th></th></tr>
            </thead>
            <tbody>
              {factories.map((f) => (
                <tr key={f.id}>
                  <td><Link className="link" to={`/factories/${f.id}`}>{f.name}</Link></td>
                  <td><span className="badge gray">{f.code}</span></td>
                  <td className="muted">{f.description ?? '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="ghost danger"
                      onClick={() => {
                        if (confirm(`"${f.name}" silinsin mi?`)) del.mutate(f.id);
                      }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && <FactoryFormModal onClose={() => setOpen(false)} />}
    </>
  );
}

function FactoryFormModal({ onClose }: { onClose: () => void }) {
  const create = useCreateFactory();
  const [form, setForm] = useState<FactoryInput>({ name: '', code: '', description: null });

  const fieldErrors =
    create.error instanceof ApiRequestError
      ? Object.fromEntries(create.error.errors.map((e) => [e.field, e.message]))
      : {};

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(form, { onSuccess: onClose });
  };

  return (
    <Modal title="Yeni Fabrika" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="field">
          <label>Ad *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
          {fieldErrors.name && <div className="form-err">{fieldErrors.name}</div>}
        </div>
        <div className="field">
          <label>Kod *</label>
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          {fieldErrors.code && <div className="form-err">{fieldErrors.code}</div>}
        </div>
        <div className="field">
          <label>Aciklama</label>
          <textarea
            rows={3}
            value={form.description ?? ''}
            onChange={(e) => setForm({ ...form, description: e.target.value || null })}
          />
        </div>
        {create.error instanceof ApiRequestError && create.error.errors.length === 0 && (
          <div className="form-err">{create.error.message}</div>
        )}
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
