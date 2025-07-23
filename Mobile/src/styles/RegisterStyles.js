import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const isTablet = width >= 768;
const isSmallScreen = height < 700;

// 🎨 PALETA DE COLORES UNIFICADA (Misma que Login pero con variaciones)
const COLORS = {
  primary: '#239089',
  primaryLight: '#42a8a1',
  primaryLighter: '#5dc1b9',
  accent: '#7bd5d0',
  white: '#ffffff',
  background: 'rgba(255, 255, 255, 0.97)',
  cardBackground: 'rgba(255, 255, 255, 0.98)',
  inputBackground: '#f8fdfd',
  inputBorder: '#e6f7f7',
  inputBorderFocus: '#b3e5e5',
  text: '#2c3e3e',
  textSecondary: '#4a6b6b',
  textLight: '#6b8e8e',
  noteBackground: 'rgba(93, 193, 185, 0.08)',
  shadow: 'rgba(35, 144, 137, 0.25)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  overlay: 'rgba(255, 255, 255, 0.12)',
  success: '#4caf50',
  error: '#ff5252'
};

// 📏 MÉTRICAS RESPONSIVAS OPTIMIZADAS
const METRICS = {
  padding: isTablet ? 28 : isSmallScreen ? 14 : 16,
  maxWidth: isTablet ? 500 : 420, // 🎯 MÁS ANCHO
  borderRadius: {
    small: 8,
    medium: 14,
    large: 22,
    extraLarge: 28
  },
  fontSize: {
    title: isTablet ? 26 : isSmallScreen ? 20 : 22,
    label: isTablet ? 14 : 12,
    input: isTablet ? 16 : 14,
    button: isTablet ? 17 : 15,
    link: isTablet ? 15 : 13,
    small: isTablet ? 12 : 11,
    note: isTablet ? 12 : 11
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 10,
    lg: 14,
    xl: 18,
    xxl: 24
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
  padding: ${METRICS.spacing.sm}px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: ${METRICS.spacing.lg}px;
  position: relative;
  height: 48px;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  padding: ${METRICS.spacing.md}px;
  z-index: 1;
  border-radius: ${METRICS.borderRadius.small}px;
  background-color: ${COLORS.overlay};
  shadow-color: ${COLORS.shadowLight};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  elevation: 3;
`;

export const PageTitle = styled.Text`
  font-size: ${METRICS.fontSize.title}px;
  font-weight: 700;
  color: ${COLORS.text};
  text-align: center;
  flex: 1;
  text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.4);
  letter-spacing: 0.8px;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const StepsIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${METRICS.spacing.xl}px;
`;

export const StepDot = styled.View`
  width: ${props => {
    if (props.size === 'small') return '8px';
    return props.active ? '32px' : '12px';
  }};
  height: ${props => props.size === 'small' ? '8px' : '12px'};
  border-radius: ${props => props.size === 'small' ? '4px' : '6px'};
  background-color: ${props => props.color || (props.active ? COLORS.primary : 'rgba(35, 144, 137, 0.3)')};
  margin: 0 ${METRICS.spacing.xs}px;
  shadow-color: ${props => props.active ? COLORS.shadow : 'transparent'};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.35;
  shadow-radius: 6px;
  elevation: ${props => props.active ? 4 : 0};
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
  width: 100%;
  margin-top: ${METRICS.spacing.lg}px;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 10px;
  shadow-opacity: 0.45;
  shadow-radius: 18px;
  elevation: 12;
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

export const PasswordStrengthContainer = styled.View`
  margin-bottom: ${METRICS.spacing.md}px;
  align-items: center;
  padding: ${METRICS.spacing.md}px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: ${METRICS.borderRadius.medium}px;
  shadow-color: ${COLORS.shadowLight};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const PasswordStrengthText = styled.Text`
  font-size: ${METRICS.fontSize.small}px;
  color: ${props => props.color || COLORS.textSecondary};
  font-weight: 600;
  margin-top: ${METRICS.spacing.xs}px;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const SecurityNote = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: ${METRICS.spacing.md}px;
  background-color: ${COLORS.noteBackground};
  border-radius: ${METRICS.borderRadius.medium}px;
  margin-bottom: ${METRICS.spacing.lg}px;
  border-left-width: 4px;
  border-left-color: ${COLORS.primaryLighter};
  shadow-color: ${COLORS.shadowLight};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.12;
  shadow-radius: 6px;
  elevation: 3;
`;

export const SecurityNoteText = styled.Text`
  font-size: ${METRICS.fontSize.note}px;
  color: ${COLORS.textLight};
  margin-left: ${METRICS.spacing.sm}px;
  flex: 1;
  line-height: ${METRICS.fontSize.note * 1.5}px;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const LinkText = styled.Text`
  margin-top: ${METRICS.spacing.lg}px;
  color: ${COLORS.textSecondary};
  font-size: ${METRICS.fontSize.link}px;
  text-align: center;
  font-weight: ${props => props.bold ? '700' : '500'};
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
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
  opacity: 0.7;
  transform: rotate(12deg);
`;