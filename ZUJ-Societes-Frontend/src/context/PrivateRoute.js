import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { PageLoading } from '../shared/components/LoadingSpinner';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoading text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
