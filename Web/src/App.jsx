import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Mascotas from './pages/Mascotas';
import HistorialClinico from './pages/HistorialClinico';
import Turnos from './pages/Turnos';
import Veterinarios from './pages/Veterinarios';
import PrivateRoute from './components/PrivateRoute'; 
import Teleconsultas from './pages/Teleconsultas';
import Roles from './pages/Roles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['admin', 'veterinario']}>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/mascotas" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Mascotas />
          </PrivateRoute>
        } />

        <Route path="/historial" element={
          <PrivateRoute allowedRoles={['admin', 'veterinario']}>
            <HistorialClinico />
          </PrivateRoute>
        } />

        <Route path="/turnos" element={
          <PrivateRoute allowedRoles={['admin', 'veterinario']}>
            <Turnos />
          </PrivateRoute>
        } />

        <Route path="/veterinarios" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Veterinarios />
          </PrivateRoute>
        } />

        <Route path="/teleconsultas" element={
          <PrivateRoute allowedRoles={['admin', 'veterinario']}>
            <Teleconsultas />
          </PrivateRoute>
        } />

        <Route path="/roles" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Roles />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
