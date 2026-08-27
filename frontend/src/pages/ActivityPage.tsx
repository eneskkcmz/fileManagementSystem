import { useActivities } from '../hooks/queries';
import { ErrorBox, Loading, formatDateTime } from '../components/ui';

export function ActivityPage() {
  const { data, isLoading, error } = useActivities();
  if (isLoading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const items = data?.items ?? [];

  return (
    <>
      <div className="page-head"><h1>Aktiviteler</h1></div>
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
    </>
  );
}
