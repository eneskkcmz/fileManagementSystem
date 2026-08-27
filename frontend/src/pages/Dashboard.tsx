import { Link } from 'react-router-dom';
import { useActivities, useFactories, useProjects } from '../hooks/queries';
import { ErrorBox, Loading, ProgressBar, StatCard, formatDateTime } from '../components/ui';

export function Dashboard() {
  const factories = useFactories();
  const projects = useProjects();
  const activities = useActivities();

  if (factories.isLoading || projects.isLoading) return <Loading />;
  if (factories.error) return <ErrorBox error={factories.error} />;
  if (projects.error) return <ErrorBox error={projects.error} />;

  const projectList = projects.data?.items ?? [];
  const totalWorkItems = projectList.reduce((s, p) => s + p.stats.totalWorkItems, 0);
  const overdue = projectList.reduce((s, p) => s + p.stats.overdue, 0);

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
      </div>

      <div className="grid cols-4">
        <StatCard label="Fabrika" value={factories.data?.totalCount ?? 0} />
        <StatCard label="Proje" value={projects.data?.totalCount ?? 0} />
        <StatCard label="Is Kalemi" value={totalWorkItems} />
        <StatCard label="Gecikmis" value={overdue} />
      </div>

      <div className="grid cols-2" style={{ marginTop: 20 }}>
        <div className="card">
          <h3>Projeler</h3>
          {projectList.length === 0 ? (
            <div className="empty">Henuz proje yok</div>
          ) : (
            projectList.slice(0, 6).map((p) => (
              <div key={p.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="row between" style={{ marginBottom: 6 }}>
                  <Link className="link" to={`/projects/${p.id}`}>{p.name}</Link>
                  <span className="muted">{p.factoryName}</span>
                </div>
                <ProgressBar value={p.stats.overallProgress} />
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3>Son Aktiviteler</h3>
          {activities.isLoading ? (
            <Loading />
          ) : (activities.data?.items ?? []).length === 0 ? (
            <div className="empty">Aktivite yok</div>
          ) : (
            (activities.data?.items ?? []).map((a) => (
              <div key={a.id} className="activity-item">
                <div>{a.description}</div>
                <div className="time">{formatDateTime(a.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
