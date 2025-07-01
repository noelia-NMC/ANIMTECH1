//RegistroMascotastyles.js
// src/styles/RegistroMascotaStyles.js

import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  background: '#f8fafa',
  surface: '#ffffff',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  shadow: 'rgba(0, 0, 0, 0.05)',
};

export const ScreenContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background-color: ${colors.background};
`;

export const HeaderContainer = styled.View`
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
`;

export const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: ${colors.textPrimary};
  text-align: center;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${colors.textSecondary};
  text-align: center;
  margin-top: 8px;
`;

export const FormSection = styled.View`
  margin-bottom: 24px;
`;

export const Label = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.textSecondary};
  margin-bottom: 10px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.surface};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  padding-horizontal: 15px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: colors.textTertiary,
})`
  flex: 1;
  height: 52px;
  font-size: 16px;
  color: ${colors.textPrimary};
`;

export const PickerContainer = styled.View`
  background-color: ${colors.surface};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

// Selector de especie mejorado
export const SpeciesSelector = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const SpeciesButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${props => (props.isActive ? colors.primary : colors.border)};
  background-color: ${props => (props.isActive ? `${colors.primary}1A` : colors.surface)};
`;

export const SpeciesText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => (props.isActive ? colors.primaryDark : colors.textSecondary)};
`;

// Sección del collar
export const CollarSection = styled.View`
  background-color: ${colors.surface};
  border-radius: 16px;
  padding: 20px;
  margin-top: 10px;
  border: 1px solid ${colors.border};
`;

export const CollarTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.primaryDark};
  margin-bottom: 12px;
`;

export const CollarInfo = styled.Text`
  font-size: 13px;
  color: ${colors.textSecondary};
  line-height: 18px;
  text-align: center;
  margin-top: 10px;
`;

// Botón de acción
export const SubmitButton = styled.TouchableOpacity`
  border-radius: 12px;
  margin-top: 20px;
  overflow: hidden;
`;

export const SubmitButtonGradient = styled(LinearGradient)`
  padding: 16px;
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