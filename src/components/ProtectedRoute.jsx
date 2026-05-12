import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  if (!user) {
    // No está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Está autenticado pero no tiene el rol necesario
    return <Navigate to="/dashboard" replace />; // O a una página de "Acceso Denegado"
  }

  return children;
};

export default ProtectedRoute;
