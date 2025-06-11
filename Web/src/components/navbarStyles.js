import styled from 'styled-components';

const colors = {
  primary: '#42a8a1',
  secondary: '#5dc1b9',
  white: '#ffffff',
  textPrimary: '#222222',
  textSecondary: '#666666',
  lightGray: '#f0f0f0',
  danger: '#e74c3c',
};

export const NavbarContainer = styled.nav`
  background: ${colors.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
`;

export const NavbarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const Brand = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.primary};
  text-decoration: none;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;

  @media (max-width: 968px) {
    gap: 15px;
  }

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

export const NavLink = styled.a`
  color: ${colors.textPrimary};
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background: ${colors.lightGray};
    color: ${colors.primary};
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 13px;
  }
`;

export const LogoutButton = styled.button`
  background: ${colors.danger};
  color: ${colors.white};
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background: #c0392b;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;