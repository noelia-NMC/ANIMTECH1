// src/styles/EventosStyles.js

import styled from 'styled-components/native';

// --- PALETA DE COLORES (YA EXISTENTE) ---
const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  secondary: '#5dc1b9',
  accent: '#8ae0db',
  accentLight: '#b5ffff',
  background: '#f8fafa',
  surface: '#ffffff',
  surfaceElevated: '#fdfdfd',
  black: '#000000',
  textPrimary: '#1a202c',
  textSecondary: '#4a5568',
  textTertiary: '#718096',
  lightGray: '#e2e8f0',
  border: '#edf2f7',
  success: '#48bb78',
  warning: '#ed8936',
  error: '#e53e3e',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',
};
// Re-exportamos los colores por si se usan en el componente
export { colors };

// --- ESTILOS PARA EL HEADER ---
export const Header = styled.View`
  padding: 20px;
  padding-top: 30px;
  flex-direction: row;
  align-items: center;
  background-color: ${colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 20px;
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${colors.textPrimary};
`;

// --- NUEVOS ESTILOS PARA RECORDATORIOS ---
export const ReminderContainer = styled.View`
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const ReminderLabel = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.textSecondary};
  margin-bottom: 12px;
  letter-spacing: -0.1px;
  text-transform: uppercase;
`;

export const ReminderOptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ReminderOption = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${props => props.selected ? colors.primary : colors.border};
  background-color: ${props => props.selected ? colors.primary : colors.surfaceElevated};
  margin-bottom: 6px;
`;

export const ReminderOptionText = styled.Text`
  font-size: 11px;
  font-weight: ${props => props.selected ? '600' : '400'};
  color: ${props => props.selected ? colors.surface : colors.textSecondary};
  text-align: center;
`;

// --- RESTO DE LOS ESTILOS (SIN CAMBIOS) ---
export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
  padding-top: 10px;
`;

export const calendarTheme = {
  backgroundColor: colors.surface,
  calendarBackground: colors.surface,
  textSectionTitleColor: colors.textSecondary,
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.surface,
  todayTextColor: colors.primaryDark,
  dayTextColor: colors.textPrimary,
  textDisabledColor: colors.textTertiary,
  dotColor: colors.secondary,
  selectedDotColor: colors.surface,
  arrowColor: colors.primary,
  disabledArrowColor: colors.textTertiary,
  monthTextColor: colors.textPrimary,
  indicatorColor: colors.primary,
  textDayFontWeight: '400',
  textMonthFontWeight: '600',
  textDayHeaderFontWeight: '500',
  textDayFontSize: 13,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 11,
};

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(26, 32, 44, 0.7);
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

export const ModalContent = styled.View`
  background-color: ${colors.surface};
  border-radius: 28px;
  padding: 24px;
  width: 100%;
  max-width: 380px;
  max-height: 90%;
  elevation: 20;
  shadow-color: ${colors.primary};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.3;
  shadow-radius: 20px;
  border: 1px solid ${colors.border};
`;

export const ModalScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 16,
  },
  showsVerticalScrollIndicator: false,
})``;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  color: ${colors.textPrimary};
  letter-spacing: -0.3px;
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.textSecondary};
  margin-top: 16px;
  margin-bottom: 6px;
  letter-spacing: -0.1px;
  text-transform: uppercase;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: colors.textTertiary,
})`
  border-width: 1.5px;
  border-color: ${colors.border};
  border-radius: 20px;
  padding: 14px 18px;
  font-size: 14px;
  background-color: ${colors.surfaceElevated};
  color: ${colors.textPrimary};
  font-weight: 400;
  elevation: 1;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const NotasInput = styled(Input)`
  height: 80px;
  text-align-vertical: top;
  padding-top: 14px;
  line-height: 20px;
`;

export const PickerContainer = styled.View`
  border-width: 1.5px;
  border-color: ${colors.border};
  border-radius: 20px;
  background-color: ${colors.surfaceElevated};
  overflow: hidden;
  elevation: 1;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const HoraSelector = styled.TouchableOpacity`
  border-width: 1.5px;
  border-color: ${colors.border};
  border-radius: 20px;
  padding: 14px 18px;
  background-color: ${colors.surfaceElevated};
  flex-direction: row;
  align-items: center;
  elevation: 1;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const HoraText = styled.Text`
  font-size: 14px;
  color: ${colors.textPrimary};
  margin-left: 10px;
  font-weight: 500;
`;

export const BtnContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 20px;
  border-top-width: 1px;
  border-top-color: ${colors.border};
  gap: 12px;
`;

const BaseButton = styled.TouchableOpacity`
  padding: 12px 20px;
  border-radius: 24px;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 44px;
`;

export const CancelarBtn = styled(BaseButton)`
  background-color: ${colors.lightGray};
  border-width: 1px;
  border-color: ${colors.border};
`;

export const CancelarText = styled.Text`
  color: ${colors.textSecondary};
  font-weight: 500;
  font-size: 13px;
  letter-spacing: -0.1px;
`;

export const GuardarBtn = styled(BaseButton)`
  background-color: ${colors.primary};
  elevation: 4;
  shadow-color: ${colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.4;
  shadow-radius: 8px;
`;

export const GuardarText = styled.Text`
  color: ${colors.surface};
  font-weight: 600;
  font-size: 13px;
  letter-spacing: -0.1px;
`;

export const AppointmentsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  background-color: ${colors.surface};
  margin: 8px 12px;
  border-radius: 24px;
  elevation: 3;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  border: 1px solid ${colors.border};
`;

export const AppointmentsTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textPrimary};
  letter-spacing: -0.3px;
  flex: 1;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: 8px 16px;
  border-radius: 20px;
  elevation: 3;
  shadow-color: ${colors.primary};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.4;
  shadow-radius: 6px;
`;

export const AddButtonText = styled.Text`
  color: ${colors.surface};
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.2px;
`;

export const EventosContainer = styled.FlatList`
  flex: 1;
  padding-top: 4px;
`;

export const EventoItem = styled.View`
  background-color: ${colors.surface};
  padding: 18px;
  margin: 6px 12px;
  border-radius: 24px;
  border-left-width: 4px;
  border-left-color: ${props => props.borderColor || colors.secondary};
  elevation: 2;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  border: 1px solid ${colors.border};
`;

export const EventoHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const EventoTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.textPrimary};
  flex: 1;
  margin-right: 12px;
  letter-spacing: -0.2px;
  line-height: 20px;
`;

export const EliminarBtn = styled.TouchableOpacity`
  padding: 6px;
  border-radius: 16px;
  background-color: ${colors.lightGray};
  elevation: 1;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
`;

export const EliminarText = styled.Text`
  font-size: 14px;
`;

export const EventoMascota = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  font-weight: 500;
  margin-bottom: 8px;
  letter-spacing: -0.1px;
`;

export const EventoNotas = styled.Text`
  font-size: 11px;
  color: ${colors.textSecondary};
  margin-top: 12px;
  font-style: italic;
  line-height: 16px;
  background-color: ${colors.background};
  padding: 8px 12px;
  border-radius: 16px;
  border-left-width: 2px;
  border-left-color: ${colors.accent};
`;

export const TipoBadge = styled.View`
  background-color: ${props => props.bgColor || colors.secondary};
  padding: 4px 12px;
  border-radius: 16px;
  align-self: flex-start;
  elevation: 1;
  shadow-color: ${props => props.bgColor || colors.secondary};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
`;

export const TipoText = styled.Text`
  color: ${colors.surface};
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  margin-top: 20px;
`;

export const EmptyText = styled.Text`
  font-size: 13px;
  color: ${colors.textTertiary};
  text-align: center;
  margin-top: 12px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: -0.1px;
`;

export const EmptyIcon = styled.Text`
  font-size: 48px;
  color: ${colors.textTertiary};
  opacity: 0.5;
`;