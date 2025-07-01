// src/styles/ReportesStyles.js

import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient'; // Aunque no se use aquí, es bueno mantenerlo si lo necesitas en otros estilos del mismo dominio.

const colors = {
  primary: '#42a8a1',
  background: '#f4f7f9',
  surface: '#ffffff',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  shadow: 'rgba(0, 0, 0, 0.05)',
  link: '#3b82f6',
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
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  padding-top: 30px;
  background-color: ${colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 16px;
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${colors.textPrimary};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 20,
    gap: 20,
  }
})`
  flex: 1;
`;

export const InfoCard = styled.View`
  background-color: ${colors.surface};
  border-radius: 16px;
  elevation: 3;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 10px;
  overflow: hidden;
`;

export const CardHeader = styled.View`
  padding: 20px;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 4px;
`;

export const CardSubtitle = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  flex-shrink: 1;
`;

export const CardContent = styled.View`
  padding: 10px;
  padding-top: 0;
`;

// --- NUEVOS ESTILOS PARA EL SELECTOR DE FECHAS ---
export const DateSelectorRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 15px;
  border-top-width: 1px;
  border-top-color: ${colors.border};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

export const DateContainer = styled.View`
  flex: 1;
  align-items: center;
`;

export const DateLabel = styled.Text`
  font-size: 12px;
  color: ${colors.textTertiary};
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
`;

export const DateButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.background};
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
`;

export const DateText = styled.Text`
  font-size: 14px;
  color: ${colors.textPrimary};
  margin-left: 8px;
  font-weight: 500;
`;

// --------------------------------------------------

export const OptionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
`;

export const OptionIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f3f4f6;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

export const OptionText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.textPrimary};
`;

export const Separator = styled.View`
  height: 1px;
  background-color: ${colors.border};
  margin: 0 10px;
`;