import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <h2>Acceso denegado</h2>;
  }

  return children;
}
