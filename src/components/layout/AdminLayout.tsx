import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <nav>
          <ul className="admin-sidebar-nav">
            <li>
              <NavLink to="/admin" end>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/products">
                <Package size={18} /> Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders">
                <ShoppingCart size={18} /> Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/settings">
                <Settings size={18} /> Settings
              </NavLink>
            </li>
            <li style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <ArrowLeft size={18} /> Back to Store
              </Link>
            </li>
            <li>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.9rem', width: '100%', cursor: 'pointer' }}>
                <LogOut size={18} /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
