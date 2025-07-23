// ARCHIVO COMPLETO Y LISTO: src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { AuthLayout, RoleBasedRoute } from './components/PrivateRoute';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Mascotas from './pages/Mascotas';
import HistorialClinico from './pages/HistorialClinico';
import Turnos from './pages/Turnos';
import Veterinarios from './pages/Veterinarios';
import Teleconsultas from './pages/Teleconsultas';
import Roles from './pages/Roles';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas Privadas envueltas en el Layout */}
          <Route element={<Layout />}>
            {/* Primero, un nivel que verifica si el usuario está autenticado */}
            <Route element={<AuthLayout />}>
              
              {/* Segundo, un nivel para cada ruta que verifica el rol específico */}
              <Route element={<RoleBasedRoute allowedRoles={['admin', 'veterinario']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/historial" element={<HistorialClinico />} />
                <Route path="/turnos" element={<Turnos />} />
                <Route path="/teleconsultas" element={<Teleconsultas />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              
              <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                <Route path="/mascotas" element={<Mascotas />} />
                <Route path="/veterinarios" element={<Veterinarios />} />
                <Route path="/roles" element={<Roles />} />
              </Route>

            </Route>
          </Route>
          
          <Route path="*" element={<h1>404: Página no encontrada</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;