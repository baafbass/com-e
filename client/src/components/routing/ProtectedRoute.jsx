import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

/** Renders child routes only for signed-in users (and only admins when `adminOnly`). */
export function ProtectedRoute({ adminOnly = false }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner fullPage />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
}

/** Renders child routes only for guests; signed-in users go back where they came from. */
export function GuestRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner fullPage />;
  if (user) return <Navigate to={location.state?.from?.pathname ?? '/'} replace />;

  return <Outlet />;
}
