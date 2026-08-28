import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from './icons';
import type { ReactNode } from 'react';

interface NavDef {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
  soon?: boolean;
}

// Ürünün asıl ekseni (Uzman Sistem'in Borçelik iş takibi).
const product: NavDef[] = [
  { to: '/', label: 'Gösterge Paneli', icon: <Icon.dashboard />, end: true },
  { to: '/bu-hafta', label: 'Bu Hafta', icon: <Icon.week />, soon: true },
  { to: '/isler', label: 'İşler', icon: <Icon.list />, soon: true },
  { to: '/kisiler', label: 'Kişiler', icon: <Icon.people />, soon: true },
  { to: '/dokumanlar', label: 'Dokümanlar', icon: <Icon.docs />, soon: true },
  { to: '/analitik', label: 'Analitik', icon: <Icon.chart />, soon: true },
  { to: '/aktiviteler', label: 'Aktiviteler', icon: <Icon.activity /> },
];

// Geçici: tek-müşteri (Borçelik) modeline geçilince sadeleşecek.
const admin: NavDef[] = [
  { to: '/fabrikalar', label: 'Yönetim (geçici)', icon: <Icon.building /> },
];

function NavGroup({ label, items }: { label: string; items: NavDef[] }) {
  return (
    <div className="nav-section">
      <div className="nav-label">{label}</div>
      {items.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {n.icon}
          <span>{n.label}</span>
          {n.soon && <span className="soon">YAKINDA</span>}
        </NavLink>
      ))}
    </div>
  );
}

export function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">US</div>
          <div>
            <div className="brand-name">Uzman Sistem</div>
            <div className="brand-sub">Borçelik · İş &amp; İster Takip</div>
          </div>
        </div>

        <NavGroup label="Çalışma" items={product} />
        <div className="nav-spacer" />
        <NavGroup label="Sistem" items={admin} />
        <div className="side-foot">MVP · v0.1</div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
