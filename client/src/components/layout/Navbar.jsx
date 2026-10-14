import { Menu, ShoppingCart, Truck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/constants';
import { formatPrice } from '../../utils/format';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => setIsMenuOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="announcement-bar">
        <Truck size={16} aria-hidden="true" />
        <span>Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
      </div>

      <nav className="navbar container" aria-label="Main navigation">
        <Logo />

        <ul id="primary-navigation" className={`navbar__links ${isMenuOpen ? 'navbar__links--open' : ''}`}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className="navbar__link">
                {label}
              </NavLink>
            </li>
          ))}
          <li className="navbar__mobile-search">
            <SearchBar id="mobile-search" onSearch={() => setIsMenuOpen(false)} />
          </li>
        </ul>

        <div className="navbar__search">
          <SearchBar />
        </div>

        <div className="navbar__actions">
          <Link to="/cart" id="navbar-cart" className="cart-link" aria-label={`Shopping cart, ${itemCount} items`}>
            <ShoppingCart size={22} />
            {itemCount > 0 && <span className="cart-link__badge">{itemCount > 99 ? '99+' : itemCount}</span>}
          </Link>

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="navbar__auth">
              <Link to="/login" id="navbar-login" className="btn btn--ghost btn--sm">
                Log in
              </Link>
              <Link to="/register" id="navbar-register" className="btn btn--primary btn--sm">
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            id="mobile-menu-toggle"
            className="icon-btn navbar__toggle"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
