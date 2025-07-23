import styled from 'styled-components/native';
import MapView from 'react-native-maps';
import { Platform, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height: screenHeight } = Dimensions.get('window');

// Función para obtener altura segura del StatusBar
const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 24;
  }
  return screenHeight > 800 ? 44 : 20;
};

// 🌊 Paleta de colores consistente
const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  secondary: '#5dc1b9',
  accent: '#8ae0db',
  accentLight: '#b5ffff',
  background: '#eef2f5',
  surface: '#ffffff',
  surfaceSecondary: '#f8fafc',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  shadowLight: '#ffffff',
  shadowDark: 'rgba(163, 177, 198, 0.6)',
};

// ============ CONTENEDOR PRINCIPAL ============
export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
`;

// ============ HEADER SIMPLIFICADO SIN FLECHITA ESPECIAL ============
export const Header = styled(LinearGradient).attrs({
  colors: [colors.primary, colors.secondary],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
})`
  padding-horizontal: 20px;
  padding-bottom: 20px;
  padding-top: ${getStatusBarHeight() + 15}px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  min-height: ${getStatusBarHeight() + 95}px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.primary};
      shadow-offset: 0px 4px;
      shadow-opacity: 0.25;
      shadow-radius: 12px;
    `,
    android: `
      elevation: 8;
    `
  })}
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
`;

// BOTÓN SIMPLE SIN ESTILOS ESPECIALES
export const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

export const HeaderTitleContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
  line-height: 32px;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  line-height: 18px;
`;

// ============ CONTENEDOR ADAPTATIVO PARA TECLADO ============
export const ContentContainer = styled.View`
  flex: 1;
  ${props => props.keyboardHeight > 0 && `
    padding-bottom: ${props.keyboardHeight - 30}px;
  `}
`;

// ============ CONTENEDOR DEL MAPA ADAPTATIVO ============
export const MapContainer = styled.View`
  ${props => props.isKeyboardVisible ? 
    'flex: 1; margin: 8px; margin-bottom: 4px;' : 
    'flex: 2; margin: 16px; margin-bottom: 8px;'
  }
  border-radius: 20px;
  overflow: hidden;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 6px;
      shadow-opacity: 0.15;
      shadow-radius: 12px;
    `,
    android: `
      elevation: 6;
    `
  })}
  border-width: 1px;
  border-color: ${colors.borderLight};
  ${props => props.isKeyboardVisible ? 'min-height: 180px;' : 'min-height: 300px;'}
`;

export const StyledMap = styled(MapView)`
  flex: 1;
  border-radius: 20px;
`;

// ============ FORMULARIO OPTIMIZADO PARA TECLADO ============
export const FormContainer = styled.View`
  background-color: ${colors.surface};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  ${props => props.isKeyboardVisible ? 
    'padding-bottom: 10px;' : 
    'padding-bottom: 24px;'
  }
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px -4px;
      shadow-opacity: 0.1;
      shadow-radius: 12px;
    `,
    android: `
      elevation: 8;
    `
  })}
  border-top-width: 1px;
  border-top-color: ${colors.borderLight};
  min-height: 200px;
`;

export const InputContainer = styled.View`
  margin-bottom: 16px;
`;

export const InputLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 12px;
  line-height: 20px;
`;

export const Input = styled.TextInput`
  background-color: ${colors.surfaceSecondary};
  padding: 16px;
  border-radius: 16px;
  font-size: 15px;
  color: ${colors.textPrimary};
  border-width: 2px;
  border-color: ${colors.borderLight};
  min-height: 10px;
  max-height: 160px;
  text-align-vertical: top;
  line-height: 22px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.05;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 1;
    `
  })}
`;

export const CharacterCount = styled.Text`
  font-size: 12px;
  color: ${colors.textTertiary};
  text-align: right;
  margin-top: 8px;
  font-weight: 500;
`;

// ============ BOTÓN MEJORADO ============
export const ButtonContainer = styled.View`
  margin-top: 8px;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${props => props.disabled ? colors.textTertiary : colors.primary};
  padding: 18px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  min-height: 56px;
  opacity: ${props => props.disabled ? 0.7 : 1};
  ${Platform.select({
    ios: `
      shadow-color: ${colors.primary};
      shadow-offset: 0px 4px;
      shadow-opacity: 0.3;
      shadow-radius: 8px;
    `,
    android: `
      elevation: 6;
    `
  })}
`;

export const ButtonText = styled.Text`
  color: ${colors.surface};
  font-weight: 700;
  font-size: 16px;
  margin-left: 8px;
  line-height: 20px;
`;

// ============ LOADING MEJORADO ============
export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.background};
  padding: 40px 20px;
`;

export const LoadingText = styled.Text`
  font-size: 16px;
  color: ${colors.textSecondary};
  text-align: center;
  font-weight: 500;
  line-height: 20px;
`;