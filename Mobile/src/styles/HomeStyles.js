// src/styles/HomeStyles.js

import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Paleta de colores refinada
const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  secondary: '#5dc1b9',
  accent: '#8ae0db',
  accentLight: '#b5ffff',
  background: '#eef2f5', // Un fondo más claro y limpio
  surface: '#f8fafc',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  error: '#ef4444',
  shadowLight: '#ffffff',
  shadowDark: 'rgba(163, 177, 198, 0.6)',
};

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
`;

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.background};
  padding: 24px;
`;

// --- Header con diseño asimétrico ---
export const GradientHeader = styled(LinearGradient)`
  padding-top: 40px; 
  padding-bottom: 50px;
  padding-horizontal: 24px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
`;

export const HeaderContent = styled.View`
  gap: 12px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: #fff;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 16px;
  color: #fff;
  opacity: 0.85;
`;

export const MenuButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const NotificationBadge = styled.View`
  position: absolute;
  right: -5px;
  top: -5px;
  background-color: ${colors.error};
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border: 2px solid ${colors.primary};
`;

export const NotificationText = styled.Text`
  color: #fff;
  font-size: 10px;
  font-weight: 700;
`;

// Contenedor del scroll
export const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 130,
  },
})`
  padding-horizontal: 20px;
  flex: 1;
  margin-top: -30px; /* Traslape sobre el header */
`;

// Tarjeta de bienvenida estilo Neumorphism
export const WelcomeSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background-color: ${colors.background};
  border-radius: 24px;
  shadow-color: ${colors.shadowDark};
  shadow-offset: 6px 6px;
  shadow-opacity: 1;
  shadow-radius: 12px;
  ${Platform.select({
  android: { elevation: 8 },
  ios: `
      box-shadow: -6px -6px 12px ${colors.shadowLight};
    `
})}
`;

export const WelcomeMessage = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const WelcomeName = styled.Text`
  font-size: 15px;
  color: ${colors.textSecondary};
  font-weight: 500;
`;

export const PetAvatarContainer = styled.TouchableOpacity`
   width: 70px;
   height: 70px;
   border-radius: 35px;
   background-color: ${colors.background};
   padding: 4px;
  shadow-color: ${colors.shadowDark};
  shadow-offset: 4px 4px;
  shadow-opacity: 1;
  shadow-radius: 8px;
  ${Platform.select({
  android: { elevation: 6 },
  ios: `
      box-shadow: -4px -4px 8px ${colors.shadowLight};
    `
})}
`;

export const PetAvatar = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 27px;
`;

// --- Grid de tarjetas de acción ---
export const CardsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const Card = styled.TouchableOpacity`
  width: ${(width - 60) / 2}px;
  background-color: ${colors.background};
  border-radius: 20px;
  overflow: visible;
  margin-bottom: 20px;
  shadow-color: ${colors.shadowDark};
  shadow-offset: 8px 8px;
  shadow-opacity: 1;
  shadow-radius: 16px;
  ${Platform.select({
  android: { elevation: 10 },
  ios: `
      box-shadow: -8px -8px 16px ${colors.shadowLight};
    `
})}
`;

export const CardGradient = styled(LinearGradient)`
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  align-items: flex-start;
  min-height: 90px;
`;

export const CardIcon = styled.View`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 16px;
`;

export const CardContent = styled.View`
  padding: 16px;
  background-color: ${colors.background};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  min-height: 90px;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 5px;
`;

export const CardDescription = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  line-height: 16px;
`;

// --- Navegación Inferior Flotante ---
export const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
`;

export const BottomNavigation = styled.View`
  flex-direction: row;
  height: 60px;
  width: 95%;
  margin-bottom: 25px;
  background-color: ${colors.background};
  border-radius: 25px;
  justify-content: space-around;
  align-items: center;
  shadow-color: ${colors.shadowDark};
  shadow-offset: 10px 10px;
  shadow-opacity: 1;
  shadow-radius: 20px;
   ${Platform.select({
  android: { elevation: 12 },
  ios: `
      box-shadow: -10px -10px 20px ${colors.shadowLight};
    `
})}
`;

export const NavButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 10px;
`;

export const NavButtonText = styled.Text`
  font-size: 11px;
  color: ${props => (props.active ? colors.primary : colors.textTertiary)};
  font-weight: ${props => (props.active ? '700' : '500')};
`;

export const QuickActionButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 45px;
  width: 68px;
  height: 68px;
  border-radius: 34px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  shadow-color: ${colors.primary};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.4;
  shadow-radius: 15px;
  elevation: 15;
`;

export const ButtonNotch = styled.View``;





// --- ICONO DE CAMBIO MÁS PEQUEÑO ---
export const ChangePetIcon = styled.View`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: ${colors.primary};
  border-radius: 10px; /* Más pequeño */
  padding: 3px; /* Más pequeño */
  border: 2px solid #fff;
  elevation: 8;
`;

// Contenedor del Modal
export const ModalOverlay = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const ModalContentContainer = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-height: 80%;
  elevation: 10;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-left: 30px; /* Espacio para que el título se centre bien */
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  flex: 1;
`;

export const CloseModalButton = styled.TouchableOpacity`
  padding: 5px;
`;

// Estilos para la lista de mascotas en el modal
export const PetSelectItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  background-color: ${props => props.isActive ? '#eef6ff' : 'transparent'};
  border-radius: 12px;
  margin-bottom: 10px;
`;

export const PetSelectAvatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
`;

export const PetSelectName = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

// Botón para añadir más mascotas
export const AddPetButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-top: 15px;
  border-radius: 12px;
  background-color: #e8f5e9;
`;

export const AddPetButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #388e3c;
  margin-left: 10px;
`;


