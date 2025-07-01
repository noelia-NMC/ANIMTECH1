// src/styles/AdiestramientoStyles.js

import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.8; // Tarjetas un poco más grandes
const CARD_ASPECT_RATIO = 1.4;

export const Container = styled.View`
  flex: 1;
  background-color: #f4f8f7;
`;

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f4f8f7;
`;

export const Header = styled.View`
  padding: 20px;
  padding-top: 30px;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 15px;
`;

// Título de la cabecera un poco más pequeño
export const HeaderTitle = styled.Text`
  font-size: 22px; 
  font-weight: bold;
  color: #333;
`;

export const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 40,
  },
})``;

// Título de sección un poco más pequeño
export const SectionTitle = styled.Text`
  font-size: 19px;
  font-weight: 700;
  color: #3a504f;
  margin-left: 20px;
  margin-top: 30px;
  margin-bottom: 20px;
  align-self: flex-start;
`;

// --- Carousel de Consejos ---
export const CarouselContainer = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  decelerationRate: 'fast',
  snapToInterval: CARD_WIDTH + 15,
  snapToAlignment: 'center',
  contentContainerStyle: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
    alignItems: 'center',
  },
})`
  width: ${screenWidth}px;
  flex-grow: 0;
  margin-bottom: 20px;
  height: ${CARD_WIDTH * CARD_ASPECT_RATIO + 20}px;
`;

export const CardContainer = styled.View`
  width: ${CARD_WIDTH}px;
  height: ${CARD_WIDTH * CARD_ASPECT_RATIO}px;
  border-radius: 20px;
  overflow: hidden;
  margin-horizontal: 7.5px;
  background-color: #fff;
  elevation: 6;
`;

export const CardImageBackground = styled.ImageBackground`
  flex: 1;
  justify-content: flex-end;
`;

export const GradientOverlay = styled(LinearGradient).attrs({
  colors: ['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.8)'],
})`
  position: absolute; left: 0; right: 0; bottom: 0; height: 70%;
`;

export const TextContainer = styled.View`
  padding: 20px;
`;

// Títulos y descripción de tarjetas ajustados
export const CardTitle = styled.Text`
  font-size: 20px; 
  font-weight: bold; color: #fff; margin-bottom: 5px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
`;

export const CardDescription = styled.Text`
  font-size: 14px;
  color: #f0f0f0; line-height: 20px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
`;

export const PaginationContainer = styled.View`
  flex-direction: row; justify-content: center; align-items: center;
`;

export const PaginationDot = styled.View`
  width: 9px; height: 9px; border-radius: 5px;
  background-color: ${({ active }) => (active ? '#42a8a1' : '#ccc')};
  margin: 0 5px;
`;

// --- NUEVOS Y MEJORADOS Estilos para el Acordeón ---
export const AccordionContainer = styled.View`
  margin-horizontal: 20px;
`;

export const AccordionItem = styled.View`
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  elevation: 2;
  border: 1px solid #f0f0f0;
`;

export const AccordionHeader = styled.TouchableOpacity`
  padding: 15px;
  flex-direction: row; justify-content: space-between; align-items: center;
  background-color: #fff;
`;

export const AccordionTitle = styled.Text`
  font-size: 15px; font-weight: 600; color: #333; flex: 1; margin-left: 15px;
`;

export const AccordionBody = styled.View`
  padding: 0px 15px 15px 15px;
`;

// Pro Tip
export const ProTipContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #e8f6f5; /* Un verde muy claro */
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
`;

export const ProTipText = styled.Text`
  flex: 1;
  font-size: 13px;
  color: #2b615d;
  line-height: 18px;
  margin-left: 10px;
`;

// Steps
export const StepContainer = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
  align-items: flex-start;
`;

export const StepNumberCircle = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #42a8a1;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const StepNumberText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 13px;
`;

export const StepText = styled.Text`
  font-size: 14px;
  color: #555;
  line-height: 21px;
  flex: 1;
`;