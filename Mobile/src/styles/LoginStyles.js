import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const isTablet = width >= 768;
const isSmallScreen = height < 700;

// 🎨 PALETA DE COLORES UNIFICADA
const COLORS = {
  primary: '#239089',
  primaryLight: '#42a8a1',
  primaryLighter: '#5dc1b9',
  accent: '#7fcdcd',
  white: '#ffffff',
  background: 'rgba(255, 255, 255, 0.97)',
  cardBackground: 'rgba(255, 255, 255, 0.98)',
  inputBackground: '#f8fdfd',
  inputBorder: '#e6f7f7',
  inputBorderFocus: '#b3e5e5',
  text: '#2c3e3e',
  textSecondary: '#4a6b6b',
  textLight: '#6b8e8e',
  shadow: 'rgba(35, 144, 137, 0.25)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  overlay: 'rgba(255, 255, 255, 0.12)'
};

// 📏 MÉTRICAS RESPONSIVAS
const METRICS = {
  padding: isTablet ? 28 : 18,
  maxWidth: isTablet ? 500 : 420, // 🎯 MÁS ANCHO
  borderRadius: {
    small: 8,
    medium: 14,
    large: 22,
    extraLarge: 28
  },
  fontSize: {
    title: isTablet ? 28 : isSmallScreen ? 22 : 24,
    subtitle: isTablet ? 16 : 14,
    label: isTablet ? 14 : 12,
    input: isTablet ? 16 : 14,
    button: isTablet ? 17 : 15,
    link: isTablet ? 15 : 13,
    small: isTablet ? 12 : 11
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28
  }
};

export const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.accent};
`;

export const GradientBackground = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${METRICS.padding}px;
  min-height: ${height}px;
  position: relative;
`;

export const ContentContainer = styled.View`
  width: 100%;
  max-width: ${METRICS.maxWidth}px;
  align-items: center;
  padding: ${METRICS.spacing.md}px;
`;

export const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: ${isSmallScreen ? METRICS.spacing.xl : METRICS.spacing.xxl}px;
  position: relative;
`;

export const DecorativeElement = styled.View`
  position: absolute;
  top: -20px;
  width: 160px;
  height: 160px;
  border-radius: 80px;
  background-color: ${COLORS.overlay};
  opacity: 0.4;
`;

export const Logo = styled.Image`
  width: ${isTablet ? 110 : isSmallScreen ? 80 : 95}px;
  height: ${isTablet ? 110 : isSmallScreen ? 80 : 95}px;
  border-radius: ${isTablet ? 55 : isSmallScreen ? 40 : 47}px;
  margin-bottom: ${METRICS.spacing.md}px;
  background-color: ${COLORS.white};
  border-width: 4px;
  border-color: ${COLORS.overlay};
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 12px;
  shadow-opacity: 0.35;
  shadow-radius: 20px;
  elevation: 12;
  z-index: 2;
`;

export const Title = styled.Text`
  font-size: ${METRICS.fontSize.title}px;
  font-weight: 800;
  color: ${COLORS.text};
  text-shadow: 2px 2px 6px rgba(255, 255, 255, 0.4);
  letter-spacing: 1.5px;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
  margin-bottom: ${METRICS.spacing.xs}px;
`;

export const Subtitle = styled.Text`
  font-size: ${METRICS.fontSize.subtitle}px;
  font-weight: 500;
  color: ${COLORS.textLight};
  text-align: center;
  opacity: 0.85;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
  font-style: italic;
  line-height: ${METRICS.fontSize.subtitle * 1.3}px;
`;

export const FormContainer = styled.View`
  width: 100%;
  background-color: ${COLORS.cardBackground};
  border-radius: ${METRICS.borderRadius.large}px;
  padding: ${METRICS.spacing.xl}px;
  shadow-color: ${COLORS.shadowDark};
  shadow-offset: 0px 15px;
  shadow-opacity: 0.25;
  shadow-radius: 25px;
  elevation: 18;
  border-width: 1px;
  border-color: ${COLORS.overlay};
`;

export const InputLabel = styled.Text`
  font-size: ${METRICS.fontSize.label}px;
  color: ${COLORS.textSecondary};
  margin-bottom: ${METRICS.spacing.xs}px;
  font-weight: 600;
  margin-left: ${METRICS.spacing.xs}px;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${COLORS.inputBackground};
  border-radius: ${METRICS.borderRadius.medium}px;
  margin-bottom: ${METRICS.spacing.md}px;
  border-width: 2px;
  border-color: ${props => props.focused ? COLORS.inputBorderFocus : COLORS.inputBorder};
  overflow: hidden;
  min-height: 54px;
  shadow-color: ${COLORS.shadowLight};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.18;
  shadow-radius: 8px;
  elevation: 4;
`;

export const Input = styled.TextInput`
  flex: 1;
  padding: ${METRICS.spacing.md}px ${METRICS.spacing.sm}px;
  font-size: ${METRICS.fontSize.input}px;
  color: ${COLORS.text};
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const IconContainer = styled.View`
  padding: 0 ${METRICS.spacing.md}px;
  justify-content: center;
  align-items: center;
  min-height: 54px;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${COLORS.primaryLight};
  padding: ${isTablet ? 20 : 18}px;
  border-radius: ${METRICS.borderRadius.extraLarge}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 10px;
  shadow-opacity: 0.45;
  shadow-radius: 18px;
  elevation: 12;
  margin-top: ${METRICS.spacing.lg}px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  transform: ${props => props.disabled ? 'scale(0.95)' : 'scale(1)'};
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.3);
`;

export const ButtonText = styled.Text`
  color: ${COLORS.white};
  font-size: ${METRICS.fontSize.button}px;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const LoadingSpinner = styled.View`
  align-items: center;
  justify-content: center;
`;

export const LinkText = styled.Text`
  margin-top: ${METRICS.spacing.lg}px;
  color: ${COLORS.textSecondary};
  font-size: ${METRICS.fontSize.link}px;
  text-align: center;
  font-weight: ${props => props.bold ? '700' : '500'};
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const ForgotPasswordText = styled.Text`
  color: ${COLORS.textLight};
  font-size: ${METRICS.fontSize.small}px;
  text-align: right;
  margin-bottom: ${METRICS.spacing.sm}px;
  align-self: flex-end;
  font-weight: 500;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
  opacity: 0.85;
`;

export const FloatingShape = styled.View`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border-radius: ${props => (props.size || 40) / 2}px;
  background-color: ${props => props.color || COLORS.overlay};
  shadow-color: ${COLORS.shadowLight};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.12;
  shadow-radius: 6px;
  elevation: 3;
`;

export const PawPattern = styled.View`
  position: absolute;
  top: 30%;
  right: 30%;
  opacity: 0.7;
  transform: rotate(15deg);
`;