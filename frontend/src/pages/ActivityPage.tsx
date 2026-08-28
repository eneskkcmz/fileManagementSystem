import { useActivities } from '../hooks/queries';
import { ErrorBox, Loading, formatDateTime } from '../components/ui';

export function ActivityPage() {
  const { data, isLoading, error } = useActivities();
  if (isLoading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const items = data?.items ?? [];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Aktiviteler</h1>
          <div className="page-sub">Sistemdeki önemli işlemlerin kaydı</div>
        </div>
      </div>
      <div className="card">
        {items.length === 0 ? (
          <div className="empty">Aktivite yok.</div>
        ) : (
          <div className="feed">
            {items.map((a) => (
              <div key={a.id} className="feed-row">
                <div className="feed-dot">{a.action.includes('deleted') ? '−' : a.action.includes('created') ? '+' : '•'}</div>
                <div className="feed-body">
                  <div className="feed-text">
                    <span className="badge gray plain" style={{ marginRight: 8, fontSize: 11 }}>{a.action}</span>
                    {a.description}
                  </div>
                  <div className="feed-time">{formatDateTime(a.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
