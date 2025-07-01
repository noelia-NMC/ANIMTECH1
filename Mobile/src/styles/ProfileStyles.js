import styled from 'styled-components/native';

// Paleta de colores definida para consistencia
const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  background: '#f8fafa',
  surface: '#ffffff',
  textPrimary: '#1a202c',
  textSecondary: '#4a5568',
  textTertiary: '#718096',
  lightGray: '#e2e8f0',
  border: '#edf2f7',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

// --- Contenedores y Layout ---
export const ScreenContainer = styled.ScrollView`
  flex: 1;
  background-color: ${colors.background};
`;

export const FormContainer = styled.View`
  padding: 24px;
`;

// --- Tarjetas y Secciones ---
export const Section = styled.View`
  margin-bottom: 24px;
`;

export const Card = styled.View`
  background-color: ${colors.surface};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0px 4px 12px ${colors.shadow};
  elevation: 5;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
`;

// --- Textos ---
export const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;

export const PetName = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.primary};
`;

export const Label = styled.Text`
  font-size: 13px;
  color: ${colors.textTertiary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Value = styled.Text`
  font-size: 15px;
  color: ${colors.textSecondary};
  margin-top: 4px;
`;

// --- Componentes Específicos de Perfil ---
export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;

export const InfoTextContainer = styled.View`
  margin-left: 16px;
`;

// --- Formularios ---
export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding-horizontal: 16px;
  margin-bottom: 16px;
`;

export const Input = styled.TextInput`
  flex: 1;
  padding-vertical: 14px;
  font-size: 16px;
  color: ${colors.textPrimary};
  margin-left: 12px;
`;

export const TextArea = styled(Input)`
  height: 120px;
  text-align-vertical: top;
  padding-top: 14px; /* Alineación para multiline */
`;

// --- Botones ---
export const StyledButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 24px;
  flex-direction: row;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin-left: 8px;
`;

export const EditLink = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8px;
`;

export const EditLinkText = styled.Text`
  font-size: 16px;
  color: ${colors.primary};
  font-weight: 600;
  margin-right: 4px;
`;

// --- Avatar / Imagen ---
export const AvatarContainer = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: 24px;
  position: relative;
`;

export const AvatarImage = styled.Image`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  border-width: 4px;
  border-color: ${colors.primary};
`;

export const AvatarPlaceholder = styled.View`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-color: ${colors.lightGray};
  justify-content: center;
  align-items: center;
  border-width: 4px;
  border-color: #d1d5db;
`;

export const EditIconCircle = styled.View`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: ${colors.surface};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  elevation: 4;
  box-shadow: 0px 2px 4px ${colors.shadow};
`;