import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isTablet = width >= 768;
const isLandscape = width > height;

// Design system colors
const COLORS = {
  primary: '#239089',
  primaryLight: '#42a8a1',
  primaryLighter: '#7fd1cc',
  primaryGlow: 'rgba(35, 144, 137, 0.3)',
  accent: '#f5a623',
  background: '#f0f9f8',
  backgroundStart: '#e4f5f3',
  backgroundEnd: '#f0f9f8',
  white: '#ffffff',
  text: '#2c3e50',
  textSecondary: '#5a6c7d',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowStrong: 'rgba(0, 0, 0, 0.15)'
};

// Responsive measurements
const METRICS = {
  screenWidth: width,
  screenHeight: height,
  isTablet,
  isLandscape,
  padding: isTablet ? 32 : 20,
  paddingHorizontal: isTablet ? 40 : 20,
  borderRadius: {
    small: 12,
    medium: 20,
    large: 28,
    extraLarge: isTablet ? 40 : 32
  },
  fontSize: {
    brand: isTablet ? 22 : 18,
    title: isTablet ? 32 : 28,
    subtitle: isTablet ? 20 : 16,
    button: isTablet ? 20 : 18,
    caption: isTablet ? 16 : 14
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  }
};

export const ContenedorBienvenida = styled.View`
  flex: 1;
  background-color: ${COLORS.backgroundStart};
`;

export const Diapositiva = styled.View`
  flex: 1;
  justify-content: ${isLandscape ? 'center' : 'space-between'};
  align-items: center;
  padding: ${METRICS.padding}px;
  ${isLandscape && `
    flex-direction: row;
    padding-horizontal: ${METRICS.paddingHorizontal}px;
  `}
`;

export const HeaderContainer = styled.View`
  position: absolute;
  top: ${Platform.OS === 'ios' ? 60 : 50}px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${METRICS.paddingHorizontal}px;
  z-index: 10;
`;

export const BrandText = styled.Text`
  font-size: ${METRICS.fontSize.brand}px;
  font-weight: 800;
  color: ${COLORS.primary};
  letter-spacing: 2px;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const PawIcon = styled.View`
  width: ${isTablet ? 48 : 40}px;
  height: ${isTablet ? 48 : 40}px;
  border-radius: ${isTablet ? 24 : 20}px;
  background-color: ${COLORS.primaryLight};
  align-items: center;
  justify-content: center;
  shadow-color: ${COLORS.primaryGlow};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.4;
  shadow-radius: 8px;
  elevation: 6;
`;

export const ContenedorAnimacion = styled.View`
  width: 100%;
  height: ${isLandscape ? '100%' : '50%'};
  align-items: center;
  justify-content: center;
  margin-top: ${isLandscape ? 0 : 60}px;
  ${isLandscape && `
    flex: 1;
    margin-top: 0;
    margin-right: ${METRICS.spacing.xl}px;
  `}
`;

export const AnimationBackground = styled.View`
  position: absolute;
  width: ${isTablet ? 350 : 280}px;
  height: ${isTablet ? 350 : 280}px;
  border-radius: ${isTablet ? 175 : 140}px;
  background-color: ${COLORS.white};
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.1;
  shadow-radius: 20px;
  elevation: 8;
`;

export const ContenedorIlustracion = styled.View`
  align-items: center;
  justify-content: center;
  width: ${isTablet ? 320 : 260}px;
  height: ${isTablet ? 320 : 260}px;
`;

export const Blob = styled.View`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border-radius: ${props => (props.size || 40) / 2}px;
  background-color: ${COLORS.primaryLighter};
  opacity: ${props => props.opacity || 0.1};
`;

export const ContenedorTexto = styled.View`
  width: 100%;
  padding: ${METRICS.spacing.xl}px ${METRICS.spacing.lg}px;
  background-color: ${COLORS.white};
  border-top-left-radius: ${METRICS.borderRadius.extraLarge}px;
  border-top-right-radius: ${METRICS.borderRadius.extraLarge}px;
  shadow-color: ${COLORS.shadowStrong};
  shadow-offset: 0px -4px;
  shadow-opacity: 0.1;
  shadow-radius: 16px;
  elevation: 12;
  ${isLandscape && `
    flex: 1;
    border-radius: ${METRICS.borderRadius.extraLarge}px;
    margin-left: ${METRICS.spacing.xl}px;
    justify-content: center;
  `}
`;

export const Titulo = styled.Text`
  font-size: ${METRICS.fontSize.title}px;
  font-weight: 700;
  color: ${COLORS.text};
  margin-bottom: ${METRICS.spacing.md}px;
  letter-spacing: 0.5px;
  line-height: ${METRICS.fontSize.title * 1.2}px;
  text-align: ${isLandscape ? 'left' : 'center'};
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const Descripcion = styled.Text`
  font-size: ${METRICS.fontSize.subtitle}px;
  color: ${COLORS.textSecondary};
  line-height: ${METRICS.fontSize.subtitle * 1.5}px;
  margin-bottom: ${METRICS.spacing.xl}px;
  text-align: ${isLandscape ? 'left' : 'center'};
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const BotonInicio = styled.TouchableOpacity`
  background-color: ${COLORS.primary};
  padding-vertical: ${isTablet ? 20 : 18}px;
  padding-horizontal: ${METRICS.spacing.xl}px;
  border-radius: ${METRICS.borderRadius.large}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  shadow-color: ${COLORS.primaryGlow};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.4;
  shadow-radius: 12px;
  elevation: 8;
  margin-top: ${METRICS.spacing.md}px;
`;

export const TextoBoton = styled.Text`
  color: ${COLORS.white};
  font-size: ${METRICS.fontSize.button}px;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;

export const BotonIcono = styled.View`
  margin-left: ${METRICS.spacing.sm}px;
`;

export const PuntoPaginacion = styled.View`
  width: ${props => (props.activo ? isTablet ? 36 : 28 : 10)}px;
  height: ${isTablet ? 12 : 10}px;
  border-radius: ${isTablet ? 6 : 5}px;
  background-color: ${props => (props.activo ? COLORS.primary : COLORS.primaryLighter)};
  margin: 0 ${METRICS.spacing.xs}px;
  opacity: ${props => (props.activo ? 1 : 0.4)};
`;

export const SkipButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${isTablet ? 40 : 30}px;
  right: ${METRICS.paddingHorizontal}px;
  padding: ${METRICS.spacing.md}px;
  border-radius: ${METRICS.borderRadius.medium}px;
  background-color: rgba(255, 255, 255, 0.9);
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const SkipText = styled.Text`
  color: ${COLORS.textSecondary};
  font-size: ${METRICS.fontSize.caption}px;
  font-weight: 600;
  font-family: ${Platform.OS === 'ios' ? 'System' : 'Roboto'};
`;