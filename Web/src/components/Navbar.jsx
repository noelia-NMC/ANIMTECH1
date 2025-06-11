import { Link, useNavigate } from 'react-router-dom';
import {
  NavbarContainer,
  NavbarContent,
  Brand,
  NavLinks,
  NavLink,
  LogoutButton,
} from './navbarStyles'; 

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <Brand as={Link} to="/dashboard">AnimTech Web</Brand>

        <NavLinks>
          {user?.rol === 'admin' && (
            <>
              <NavLink as={Link} to="/dashboard">Dashboard</NavLink>
              <NavLink as={Link} to="/mascotas">Mascotas</NavLink>
              <NavLink as={Link} to="/historial">Historial</NavLink>
              <NavLink as={Link} to="/turnos">Turnos</NavLink>
              <NavLink as={Link} to="/veterinarios">Veterinarios</NavLink>
              <NavLink as={Link} to="/teleconsultas">Teleconsultas</NavLink>
            </>
          )}

          {user?.rol === 'veterinario' && (
            <>
              <NavLink as={Link} to="/turnos">Mis Turnos</NavLink>
              <NavLink as={Link} to="/historial">Historial</NavLink>
              <NavLink as={Link} to="/teleconsultas">Teleconsultas</NavLink>
            </>
          )}

          <LogoutButton onClick={handleLogout}>Cerrar sesión</LogoutButton>
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
}
