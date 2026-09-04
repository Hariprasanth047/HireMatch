import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role }) {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && userRole !== role) {
    return <Navigate to={userRole === 'RECRUITER' ? '/recruiter/dashboard' : '/seeker/dashboard'} replace />;
  }
  return <Outlet />;
}
