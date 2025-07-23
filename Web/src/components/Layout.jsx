// ARCHIVO COMPLETO Y LISTO: src/components/Layout.jsx

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Chatbot from '../pages/Chatbot';

const colors = {
  primary: '#42a8a1', secondary: '#5dc1b9', white: '#ffffff', textPrimary: '#2c3e50', textSecondary: '#7f8c8d',
  background: '#f4f7f6', border: '#eef2f1', danger: '#e74c3c', sidebarBg: '#2c3e50', sidebarText: '#ecf0f1',
  sidebarHover: '#34495e', sidebarActive: '#42a8a1',
};
const fadeIn = keyframes`from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); }`;

const MainWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.background};
`;
const SidebarContainer = styled.aside`
  width: ${props => (props.isExpanded ? '260px' : '88px')};
  background: ${colors.sidebarBg};
  color: ${colors.sidebarText};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transition: width 0.3s ease-in-out;
  z-index: 1001;
  box-shadow: 4px 0 15px rgba(0,0,0,0.1);
  @media (max-width: 768px) {
    width: ${props => (props.isExpanded ? '260px' : '0')};
    overflow: hidden;
  }
`;
const SidebarHeader = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isExpanded ? 'space-between' : 'center')};
  height: 70px;
  background: #25394b;
`;
const Brand = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.white};
  text-decoration: none;
  display: ${props => (props.isExpanded ? 'block' : 'none')};
`;
const BrandIcon = styled(Link)`
  font-size: 28px;
  font-weight: bold;
  color: ${colors.primary};
  text-decoration: none;
  display: ${props => (props.isExpanded ? 'none' : 'block')};
`;
const NavLinksContainer = styled.nav`
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 20px;
`;
const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 15px 30px;
  color: ${colors.sidebarText};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-left: 4px solid transparent;
  &:hover {
    background: ${colors.sidebarHover};
    color: ${colors.white};
  }
  &.active {
    background: ${colors.sidebarActive};
    color: ${colors.white};
    border-left: 4px solid ${colors.secondary};
    padding-left: 26px;
  }
`;
const NavIcon = styled.span`
  font-size: 22px;
  margin-right: ${props => (props.isExpanded ? '15px' : '0')};
  min-width: 24px;
  text-align: center;
  transition: margin-right 0.3s ease-in-out;
`;
const NavLabel = styled.span`
  opacity: ${props => (props.isExpanded ? 1 : 0)};
  transition: opacity 0.2s ease-in-out;
  display: ${props => (props.isExpanded ? 'inline' : 'none')};
`;
const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isExpanded ? 'flex-start' : 'center')};
  width: 100%;
  background: transparent;
  color: ${colors.danger};
  border: none;
  padding: 20px 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
  font-size: 16px;
  border-top: 1px solid ${colors.sidebarHover};
  &:hover {
    background: #e74c3c20;
  }
`;
const PageWrapper = styled.div`
  flex-grow: 1;
  margin-left: ${props => (props.isExpanded ? '260px' : '88px')};
  transition: margin-left 0.3s ease-in-out;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;
const HeaderContainer = styled.header`
  height: 70px;
  background: ${colors.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
`;
const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${colors.textPrimary};
  transition: color 0.2s ease;
  &:hover {
    color: ${colors.primary};
  }
`;
const HeaderUserInfo = styled.div`
  position: relative;
`;
const UserAvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;
const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${colors.primary};
`;
const UserAvatarInitials = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-weight: 700;
  border: 2px solid ${colors.primary};
`;
const UserName = styled.span`
  font-weight: 600;
  color: ${colors.textPrimary};
  @media (max-width: 500px) {
    display: none;
  }
`;
const ContentContainer = styled.main`
  padding: 2rem;
  width: 100%;
  height: calc(100vh - 70px);
  overflow-y: auto;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
const DropdownMenu = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  background: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
  width: 200px;
  z-index: 1002;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
`;
const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 20px;
  color: ${colors.textPrimary};
  text-decoration: none;
  font-size: 0.9rem;
  &:hover {
    background-color: ${colors.background};
  }
`;
const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  color: ${colors.danger};
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: ${colors.background};
  }
`;

export default function Layout() {
  const [isExpanded, setIsExpanded] = useState(window.innerWidth > 992);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => { function handleClickOutside(event) { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setDropdownOpen(false); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [dropdownRef]);
  useEffect(() => { setDropdownOpen(false); }, [location]);
  useEffect(() => { const handleResize = () => { if (window.innerWidth <= 992) setIsExpanded(false); }; window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const handleLogout = () => { logout(); navigate('/login'); };
  const getUserInitials = () => (user?.nombre || user?.email || 'U').charAt(0).toUpperCase();

  const adminLinks = [ { to: "/dashboard", icon: "📊", label: "Dashboard" }, { to: "/mascotas", icon: "🐾", label: "Mascotas" }, { to: "/turnos", icon: "📅", label: "Turnos" }, { to: "/historial", icon: "📋", label: "Historial" }, { to: "/veterinarios", icon: "👨‍⚕️", label: "Veterinarios" }, { to: "/teleconsultas", icon: "💻", label: "Teleconsultas" }, { to: "/roles", icon: "⚙️", label: "Roles" }, ];
  const vetLinks = [ { to: "/dashboard", icon: "📊", label: "Dashboard" }, { to: "/turnos", icon: "📅", label: "Mis turnos" }, { to: "/historial", icon: "📋", label: "Historial" }, { to: "/teleconsultas", icon: "💻", label: "Teleconsultas" }, ];
  const linksToShow = user?.rol === 'admin' ? adminLinks : vetLinks;

  return (
    <MainWrapper>
      <SidebarContainer isExpanded={isExpanded}>
        <SidebarHeader isExpanded={isExpanded}><Brand to="/dashboard" isExpanded={isExpanded}>AnimTech</Brand><BrandIcon to="/dashboard" isExpanded={isExpanded}>A</BrandIcon></SidebarHeader>
        <NavLinksContainer>
          {linksToShow.map(link => ( <NavLink key={link.to} to={link.to} className={location.pathname === link.to ? 'active' : ''}> <NavIcon isExpanded={isExpanded}>{link.icon}</NavIcon> <NavLabel isExpanded={isExpanded}>{link.label}</NavLabel> </NavLink> ))}
        </NavLinksContainer>
        <LogoutButton onClick={handleLogout} isExpanded={isExpanded}><NavIcon isExpanded={isExpanded}>🚪</NavIcon><NavLabel isExpanded={isExpanded}>Cerrar sesión</NavLabel></LogoutButton>
      </SidebarContainer>

      <PageWrapper isExpanded={isExpanded}>
        <HeaderContainer>
          <ToggleButton onClick={toggleSidebar}>☰</ToggleButton>
          <HeaderUserInfo ref={dropdownRef}>
            <UserAvatarContainer onClick={() => setDropdownOpen(!dropdownOpen)}>
              <UserName>¡Hola, {user?.nombre || user?.email}!</UserName>
              {user?.avatar_url ? (<UserAvatar src={user.avatar_url} alt="Avatar" />) : (<UserAvatarInitials>{getUserInitials()}</UserAvatarInitials>)}
            </UserAvatarContainer>
            {dropdownOpen && ( <DropdownMenu><DropdownItem to="/profile">Editar perfil</DropdownItem><DropdownButton onClick={handleLogout}>Cerrar sesión</DropdownButton></DropdownMenu> )}
          </HeaderUserInfo>
        </HeaderContainer>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </PageWrapper>
      <Chatbot />
    </MainWrapper>
  );
}