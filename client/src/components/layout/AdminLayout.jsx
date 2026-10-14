import { ArrowLeft, FolderTree, LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Logo id="admin-logo" light />
        <nav>
          <ul className="admin-sidebar__links">
            {ADMIN_LINKS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className="admin-sidebar__link">
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <NavLink to="/" id="back-to-store" className="admin-sidebar__link admin-sidebar__back">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back to store</span>
        </NavLink>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <p>
            Signed in as <strong>{user.name}</strong>
          </p>
        </header>
        <main id="main-content" className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
