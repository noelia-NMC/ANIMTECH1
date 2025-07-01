// src/styles/TeleconsultaStyles.js

import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  background: '#f4f7f9',
  surface: '#ffffff',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  shadow: 'rgba(0, 0, 0, 0.05)',
  status: {
    pendiente: '#f59e0b',
    aceptada: '#10b981',
    finalizada: '#6b7280',
    rechazada: '#ef4444',
  },
};

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
    contentContainerStyle: {
        paddingBottom: 40,
    }
})``;

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

export const FormCard = styled.View`
  background-color: ${colors.surface};
  margin: 20px;
  border-radius: 16px;
  padding: 24px;
  elevation: 5;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 15px;
`;

export const FormTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 20px;
  text-align: center;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.textSecondary};
  margin-bottom: 8px;
`;

export const PickerContainer = styled.View`
  background-color: #f9fafb;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${colors.border};
  margin-bottom: 16px;
  overflow: hidden; /* Necesario para que el borde redondeado funcione en Android */
`;

export const Input = styled.TextInput`
  background-color: #f9fafb;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${colors.border};
  padding: 12px;
  min-height: 100px;
  text-align-vertical: top;
  font-size: 15px;
  color: ${colors.textPrimary};
  margin-bottom: 20px;
`;

export const SubmitButton = styled.TouchableOpacity`
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
`;

export const SubmitButtonGradient = styled(LinearGradient)`
  padding: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const SubmitButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 20px 20px 10px;
`;

export const Card = styled.View`
  background-color: ${colors.surface};
  margin: 0 20px 15px;
  border-radius: 12px;
  padding: 20px;
  elevation: 3;
  shadow-color: ${colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 10px;
`;

export const CardTitle = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 12px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

export const InfoLabel = styled.Text`
  font-weight: 600;
  color: ${colors.textSecondary};
  width: 70px; /* Ancho fijo para alineación */
`;

export const InfoText = styled.Text`
  font-size: 15px;
  color: ${colors.textSecondary};
  flex: 1;
`;

export const StatusPill = styled.View`
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${props => colors.status[props.estado] || colors.textTertiary};
  align-self: flex-start;
`;

export const StatusText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  text-transform: capitalize;
`;

export const JoinButton = styled.TouchableOpacity`
  background-color: ${colors.status.aceptada};
  margin-top: 15px;
  border-radius: 10px;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const JoinButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
`;

export const EmptyText = styled.Text`
  text-align: center;
  margin-top: 30px;
  font-size: 16px;
  color: ${colors.textTertiary};
  padding-horizontal: 30px;
  line-height: 24px;
`;

export const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.background};
`;