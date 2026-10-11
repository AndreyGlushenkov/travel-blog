import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Status from '../Status/Status';
export default function ProtectedRoute() {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (auth.isChecking) return <Status loading />;
  return <Outlet />;
}
