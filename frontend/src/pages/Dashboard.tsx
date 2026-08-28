import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useActivities, useProjects } from '../hooks/queries';
import { ErrorBox, Loading, ProgressBar, formatDateTime } from '../components/ui';
import { Icon } from '../components/icons';

function StatTile({ icon, tone, value, label }: { icon: ReactNode; tone?: string; value: ReactNode; label: string }) {
  return (
    <div className={`card stat ${tone ?? ''}`}>
      <div className="top">
        <div className="ic">{icon}</div>
      </div>
      <span className="value">{value}</span>
      <span className="label">{label}</span>
    </div>
  );
}

export function Dashboard() {
  const projects = useProjects();
  const activities = useActivities();

  if (projects.isLoading) return <Loading />;
  if (projects.error) return <ErrorBox error={projects.error} />;

  const list = projects.data?.items ?? [];
  const totalWork = list.reduce((s, p) => s + p.stats.totalWorkItems, 0);
  const completed = list.reduce((s, p) => s + p.stats.completed, 0);
  const overdue = list.reduce((s, p) => s + p.stats.overdue, 0);
  const openWork = totalWork - completed;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Gösterge Paneli</h1>
          <div className="page-sub">Borçelik iş & ister takibi — genel görünüm</div>
        </div>
      </div>

      <div className="grid g4">
        <StatTile icon={<Icon.list />} value={totalWork} label="Toplam İş" />
        <StatTile icon={<Icon.spark />} tone="green" value={completed} label="Tamamlanan" />
        <StatTile icon={<Icon.activity />} value={openWork} label="Açık İş" />
        <StatTile icon={<Icon.week />} tone={overdue > 0 ? 'red' : undefined} value={overdue} label="Gecikmiş" />
      </div>

      <div className="grid g2 mt20">
        <div className="card">
          <div className="card-head">
            <span className="card-title">Projeler</span>
            <span className="muted" style={{ fontSize: 12.5 }}>{list.length} proje</span>
          </div>
          {list.length === 0 ? (
            <div className="empty">Henüz kayıt yok</div>
          ) : (
            list.slice(0, 8).map((p) => (
              <div key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="row between" style={{ marginBottom: 8 }}>
                  <Link className="link" to={`/projects/${p.id}`}>{p.name}</Link>
                  <span className="muted" style={{ fontSize: 12.5 }}>
                    {p.stats.completed}/{p.stats.totalWorkItems} iş
                  </span>
                </div>
                <ProgressBar value={p.stats.overallProgress} />
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <span className="card-title">Son Aktiviteler</span>
            <Link className="link" to="/aktiviteler" style={{ fontSize: 12.5 }}>Tümü →</Link>
          </div>
          {activities.isLoading ? (
            <Loading />
          ) : (activities.data?.items ?? []).length === 0 ? (
            <div className="empty">Aktivite yok</div>
          ) : (
            <div className="feed">
              {(activities.data?.items ?? []).slice(0, 8).map((a) => (
                <div key={a.id} className="feed-row">
                  <div className={`feed-dot ${feedTone(a.action)}`}>{feedGlyph(a.action)}</div>
                  <div className="feed-body">
                    <div className="feed-text">{a.description}</div>
                    <div className="feed-time">{formatDateTime(a.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function feedTone(action: string): string {
  if (action.includes('deleted')) return 'amber';
  if (action.includes('completed') || action.includes('created')) return 'green';
  return '';
}
function feedGlyph(action: string): string {
  if (action.includes('deleted')) return '−';
  if (action.includes('status')) return '⇄';
  if (action.includes('created')) return '+';
  return '•';
}
