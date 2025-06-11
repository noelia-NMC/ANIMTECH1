import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#239089',
  primaryLight: '#42a8a1',
  primaryLighter: '#7fd1cc',
  secondary: '#3d8883',
  accent: '#f5a623',
  background: '#f0f9f8',
  backgroundGradientStart: '#e4f5f3',
  backgroundGradientEnd: '#f0f9f8',
  white: '#ffffff',
  black: '#333333',
  gray: '#777777',
  lightGray: '#eeeeee',
  shadow: 'rgba(0, 0, 0, 0.12)'
};

const METRICS = {
  screenWidth: width,
  screenHeight: height,
  borderRadius: {
    small: 10,
    medium: 20,
    large: 30,
    extraLarge: 50
  }
};

export const ContenedorBienvenida = styled.View`
  flex: 1;
  background-color: ${COLORS.backgroundGradientStart};
`;

export const GradienteContainer = styled.View`
  flex: 1;
  background-color: ${COLORS.backgroundGradientStart};
`;

export const Diapositiva = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 20px;
`;

export const HeaderContainer = styled.View`
  position: absolute;
  top: 50px;
  width: 90%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: center;
  z-index: 10;
`;

export const BrandText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${COLORS.primary};
  letter-spacing: 1.5px;
`;

export const PawIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${COLORS.primaryLight};
  align-items: center;
  justify-content: center;
`;

export const ContenedorAnimacion = styled.View`
  width: 100%;
  height: 50%;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
`;

export const AnimationBackground = styled.View`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 150px;
  background-color: ${COLORS.backgroundGradientEnd};
`;

export const PatternOverlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.06;
`;

export const ContenedorIlustracion = styled.View`
  height: 240px;
  width: 240px;
  align-items: center;
  justify-content: center;
`;

export const ImagenMascota = styled.Image`
  width: 180px;
  height: 180px;
`;

export const ContenedorHuella = styled.View`
  position: absolute;
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  background-color: ${COLORS.primaryLighter};
  opacity: 0.7;
`;

export const Blob = styled.View`
  position: absolute;
  width: ${props => props.size || '60px'};
  height: ${props => props.size || '60px'};
  border-radius: ${props => parseInt(props.size || '60') / 2}px;
  background-color: ${props => props.color || COLORS.primaryLighter};
  opacity: ${props => props.opacity || 0.3};
  transform: scale(${props => props.scale || 1});
`;

export const ContenedorTexto = styled.View`
  width: 100%;
  padding: 20px;
  background-color: ${COLORS.white};
  border-top-left-radius: ${METRICS.borderRadius.extraLarge}px;
  border-top-right-radius: ${METRICS.borderRadius.extraLarge}px;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px -3px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 8;
`;

export const Titulo = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${COLORS.primary};
  margin-bottom: 12px;
  letter-spacing: 0.5px;
`;

export const Descripcion = styled.Text`
  font-size: 16px;
  color: ${COLORS.gray};
  line-height: 24px;
  margin-bottom: 24px;
`;

export const BotonInicio = styled.TouchableOpacity`
  background-color: ${COLORS.primary};
  padding-vertical: 16px;
  border-radius: ${METRICS.borderRadius.large}px;
  align-items: center;
  justify-content: center;
  shadow-color: ${COLORS.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
  flex-direction: row;
`;

export const TextoBoton = styled.Text`
  color: ${COLORS.white};
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
`;

export const BotonIcono = styled.View`
  margin-left: 10px;
`;

export const PaginacionContenedor = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const PuntoPaginacion = styled.View`
  width: ${props => (props.activo ? '30px' : '8px')};
  height: 8px;
  border-radius: 4px;
  background-color: ${props =>
    props.activo ? COLORS.primaryLight : COLORS.lightGray};
  margin: 0 4px;
`;

export const SkipButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px;
`;

export const SkipText = styled.Text`
  color: ${COLORS.gray};
  font-size: 14px;
  font-weight: 500;
`;

export const TextoIndicador = styled.Text`
  color: ${COLORS.primary};
  font-size: 13px;
  font-weight: bold;
`;