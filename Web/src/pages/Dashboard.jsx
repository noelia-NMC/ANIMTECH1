import styled from 'styled-components';
import Navbar from '../components/Navbar';

const colors = {
  primary: '#42a8a1',
  white: '#ffffff',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f4f7f6',
  border: '#eef2f1',
};

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${colors.background};
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const WelcomeCard = styled.div`
  background: ${colors.white};
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.05);
  border: 1px solid ${colors.border};
  text-align: center;
  max-width: 550px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Icon = styled.span`
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: ${colors.textPrimary};
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const WelcomeText = styled.p`
  font-size: 1.1rem;
  color: ${colors.textSecondary};
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

const InfoText = styled.p`
  font-size: 0.95rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
`;

const AccessDeniedMessage = styled.h2`
  color: ${colors.textPrimary};
  text-align: center;
  font-weight: 500;
`;

///////////////////////////////////////////////////////////////////
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');


  if (!token) {
    return (
      <DashboardContainer>
        <Navbar />
        <Content>
          <AccessDeniedMessage>Acceso denegado. Por favor, inicia sesión.</AccessDeniedMessage>
        </Content>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Navbar />
      <Content>
        <WelcomeCard>
          <Icon>👋</Icon>
          <Title>Bienvenido al Panel</Title>
          <WelcomeText>
            Hola, <strong>{user?.nombre || user?.email}</strong>
          </WelcomeText>
          <InfoText>
            Desde aquí puedes gestionar todos los aspectos de la clínica.
            Selecciona una opción del menú de navegación para comenzar.
          </InfoText>
        </WelcomeCard>
      </Content>
    </DashboardContainer>
  );
}