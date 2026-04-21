import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();
  const count = getCartCount();

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">LAGWAL</Link>
        <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={() => setOpen(false)}>Home</Link></li>
          <li><Link to="/products" className={isActive('/products')} onClick={() => setOpen(false)}>Products</Link></li>
          <li>
            <Link to="/cart" className={`cart-badge ${isActive('/cart')}`} onClick={() => setOpen(false)}>
              <ShoppingBag size={20} />
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
