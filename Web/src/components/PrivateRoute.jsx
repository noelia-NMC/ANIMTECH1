// ARCHIVO COMPLETO Y LISTO: src/components/PrivateRoute.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente para proteger el Layout principal (solo verifica si está logueado)
export function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Outlet renderizará las rutas hijas protegidas por rol
}


// Componente para proteger cada página según el rol
export function RoleBasedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Verifica si el rol del usuario está en la lista de roles permitidos
  if (user && allowedRoles && allowedRoles.includes(user.rol)) {
    return <Outlet />; // Si tiene permiso, renderiza la página
  }

  // Si no tiene permiso, muestra un mensaje de acceso denegado
  // O puedes redirigirlo a una página específica de "No autorizado"
  if (user) {
    return <h1>403: Acceso denegado. No tienes permiso para ver esta página.</h1>;
  }
  
  // Si no hay usuario, el AuthLayout ya debería haberlo redirigido, pero como doble seguridad:
  return <Navigate to="/login" replace />;
}