import { ChevronDown, LayoutDashboard, LogOut, Package, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = (event) => !menuRef.current?.contains(event.target) && setIsOpen(false);
    const closeOnEscape = (event) => event.key === 'Escape' && setIsOpen(false);
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const close = () => setIsOpen(false);
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        id="user-menu-button"
        className="user-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="user-menu-list"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="user-menu__name">{user.name.split(' ')[0]}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul id="user-menu-list" className="user-menu__list" role="menu" aria-labelledby="user-menu-button">
          <li className="user-menu__header" role="none">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </li>
          {isAdmin && (
            <li role="none">
              <Link to="/admin" role="menuitem" className="user-menu__item" onClick={close}>
                <LayoutDashboard size={16} /> Admin dashboard
              </Link>
            </li>
          )}
          <li role="none">
            <Link to="/profile" role="menuitem" className="user-menu__item" onClick={close}>
              <User size={16} /> My profile
            </Link>
          </li>
          <li role="none">
            <Link to="/orders" role="menuitem" className="user-menu__item" onClick={close}>
              <Package size={16} /> My orders
            </Link>
          </li>
          <li role="none">
            <button
              type="button"
              id="logout-button"
              role="menuitem"
              className="user-menu__item user-menu__item--danger"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Log out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
