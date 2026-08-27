import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">Fabrika Proje &amp;<br />Dokuman Yonetimi</div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/factories">Fabrikalar</NavLink>
            <NavLink to="/activity">Aktiviteler</NavLink>
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
