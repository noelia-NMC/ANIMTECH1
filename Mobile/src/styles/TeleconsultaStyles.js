// src/styles/TeleconsultaStyles.js

import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';

const colors = {
  primary: '#42a8a1',
  primaryLight: '#5dc1b9', 
  primaryDark: '#2d6e68',
  secondary: '#60a5fa',
  accent: '#f59e0b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#fafbfc',
  backgroundDark: '#f1f5f9',
  surface: '#ffffff',
  surfaceHover: '#f8fafc',
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textTertiary: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  inputBg: '#f8fafc',
  shadowLight: 'rgba(0, 0, 0, 0.04)',
  shadowMedium: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',
  status: {
    pendiente: '#f59e0b',
    aceptada: '#10b981',
    finalizada: '#6366f1',
    rechazada: '#ef4444',
    cancelada: '#64748b',
  },
};

// ============ CONTENEDORES PRINCIPALES ============
export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
`;

export const Header = styled(LinearGradient).attrs({
  colors: ['#42a8a1', '#5dc1b9'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
})`
  padding: 20px;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '50px'};
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.primary};
      shadow-offset: 0px 4px;
      shadow-opacity: 0.2;
      shadow-radius: 12px;
    `,
    android: `
      elevation: 8;
    `
  })}
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const BackButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.15);
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

export const HeaderTitleContainer = styled.View`
  flex: 1;
`;

export const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 40,
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

// ============ SECCIÓN DE FORMULARIO ============
export const FormSection = styled.View`
  padding: 24px 20px 0;
`;

export const FormCard = styled.View`
  background-color: ${colors.surface};
  border-radius: 24px;
  padding: 28px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowMedium};
      shadow-offset: 0px 6px;
      shadow-opacity: 1;
      shadow-radius: 16px;
    `,
    android: `
      elevation: 6;
    `
  })}
  border-width: 1px;
  border-color: ${colors.borderLight};
  position: relative;
  overflow: hidden;
`;

export const FormCardBackground = styled.View`
  position: absolute;
  top: -50px;
  right: -50px;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${colors.primaryLight};
  opacity: 0.05;
`;

export const FormHeader = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

export const FormIconContainer = styled(LinearGradient).attrs({
  colors: ['#42a8a1', '#5dc1b9'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
})`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.primary};
      shadow-offset: 0px 4px;
      shadow-opacity: 0.3;
      shadow-radius: 8px;
    `,
    android: `
      elevation: 4;
    `
  })}
`;

export const FormTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: 8px;
`;

export const FormSubtitle = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  text-align: center;
  line-height: 22px;
`;

// ============ INPUTS Y FORMULARIO ============
export const InputGroup = styled.View`
  margin-bottom: 24px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 12px;
`;

export const PickerContainer = styled.View`
  background-color: ${colors.inputBg};
  border-radius: 16px;
  border-width: 2px;
  border-color: ${colors.border};
  overflow: hidden;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowLight};
      shadow-offset: 0px 2px;
      shadow-opacity: 1;
      shadow-radius: 6px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const Input = styled.TextInput`
  background-color: ${colors.inputBg};
  border-radius: 16px;
  border-width: 2px;
  border-color: ${colors.border};
  padding: 20px;
  min-height: 10px;
  text-align-vertical: top;
  font-size: 14px;
  color: ${colors.textPrimary};
  line-height: 20px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowLight};
      shadow-offset: 0px 2px;
      shadow-opacity: 1;
      shadow-radius: 6px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const SubmitButton = styled.TouchableOpacity`
  margin-top: 16px;
  border-radius: 20px;
  overflow: hidden;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.primary};
      shadow-offset: 0px 6px;
      shadow-opacity: 0.4;
      shadow-radius: 12px;
    `,
    android: `
      elevation: 6;
    `
  })}
`;

export const SubmitButtonGradient = styled(LinearGradient)`
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const SubmitButtonText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

// ============ BUSCADOR Y FILTROS ============
export const SearchContainer = styled.View`
  padding: 0 20px;
  margin-top: 20px;
`;

export const SearchCard = styled.View`
  background-color: ${colors.surface};
  border-radius: 20px;
  padding: 20px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowLight};
      shadow-offset: 0px 4px;
      shadow-opacity: 1;
      shadow-radius: 8px;
    `,
    android: `
      elevation: 4;
    `
  })}
  border-width: 1px;
  border-color: ${colors.borderLight};
`;

export const SearchInput = styled.TextInput`
  background-color: ${colors.inputBg};
  border-radius: 16px;
  border-width: 2px;
  border-color: ${colors.border};
  padding: 16px 20px;
  font-size: 14px;
  color: ${colors.textPrimary};
  margin-bottom: 16px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowLight};
      shadow-offset: 0px 2px;
      shadow-opacity: 1;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const FiltersContainer = styled.View`
  gap: 12px;
`;

export const FilterRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 13px;
  border-radius: 20px;
  border-width: 2px;
  border-color: ${props => props.isActive ? colors.primary : colors.border};
  background-color: ${props => props.isActive ? colors.primary : colors.surface};
  gap: 1px;
  position: relative;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowLight};
      shadow-offset: 0px 2px;
      shadow-opacity: 1;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const FilterButtonText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.isActive ? '#ffffff' : colors.primary};
`;

export const ActiveFilterDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #ffffff;
  position: absolute;
  top: 4px;
  right: 4px;
`;

export const ClearFiltersButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 12px;
  background-color: ${colors.backgroundDark};
  gap: 6px;
  align-self: center;
`;

export const ClearFiltersText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.error};
`;

export const ResultsContainer = styled.View`
  margin: 0 20px 16px;
  padding: 12px 16px;
  background-color: ${colors.surface};
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: ${colors.primary};
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowLight};
      shadow-offset: 0px 2px;
      shadow-opacity: 1;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const ResultsText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.textSecondary};
`;

// ============ SECCIÓN DE CONSULTAS ============
export const SectionContainer = styled.View`
  margin-top: 32px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 0 20px 20px;
  padding: 16px 20px;
  background-color: ${colors.surface};
  border-radius: 16px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowLight};
      shadow-offset: 0px 2px;
      shadow-opacity: 1;
      shadow-radius: 6px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const SectionIconContainer = styled(LinearGradient).attrs({
  colors: ['#60a5fa', '#42a8a1'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
})`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

export const SectionTitleContainer = styled.View`
  flex: 1;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 2px;
`;

export const SectionSubtitle = styled.Text`
  font-size: 13px;
  color: ${colors.textSecondary};
  font-weight: 500;
`;

// ============ TARJETAS DE CONSULTA ============
export const ConsultaCard = styled.TouchableOpacity`
  background-color: ${colors.surface};
  margin: 0 20px 20px;
  border-radius: 20px;
  padding: 24px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowMedium};
      shadow-offset: 0px 4px;
      shadow-opacity: 1;
      shadow-radius: 12px;
    `,
    android: `
      elevation: 4;
    `
  })}
  border-left-width: 6px;
  border-left-color: ${props => colors.status[props.estado] || colors.textMuted};
  position: relative;
  overflow: hidden;
`;

export const ConsultaCardBackground = styled.View`
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${props => colors.status[props.estado] || colors.textMuted};
  opacity: 0.03;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const CardTitleContainer = styled.View`
  flex: 1;
  margin-right: 16px;
`;

export const CardTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 4px;
`;

export const CardDate = styled.Text`
  font-size: 12px;
  color: ${colors.textTertiary};
  font-weight: 500;
`;

export const StatusContainer = styled.View`
  align-items: flex-end;
`;

export const StatusPill = styled.View`
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => colors.status[props.estado] || colors.textMuted};
  ${Platform.select({
    ios: `
      shadow-color: ${props => colors.status[props.estado] || colors.textMuted};
      shadow-offset: 0px 2px;
      shadow-opacity: 0.3;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const StatusText = styled.Text`
  color: #ffffff;
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// ============ INFORMACIÓN DE LA CONSULTA ============
export const InfoContainer = styled.View`
  gap: 16px;
  margin-bottom: 20px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${colors.inputBg};
  padding: 16px;
  border-radius: 12px;
`;

export const InfoIconContainer = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  margin-top: 2px;
`;

export const InfoTextContainer = styled.View`
  flex: 1;
`;

export const InfoLabel = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const InfoText = styled.Text`
  font-size: 12px;
  color: ${colors.textPrimary};
  line-height: 22px;
  font-weight: 500;
`;

// ============ BOTÓN DE VIDEOLLAMADA ============
export const VideoCallButton = styled(LinearGradient).attrs({
  colors: ['#10b981', '#059669'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
})`
  border-radius: 16px;
  padding: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.success};
      shadow-offset: 0px 4px;
      shadow-opacity: 0.4;
      shadow-radius: 8px;
    `,
    android: `
      elevation: 4;
    `
  })}
`;

export const VideoCallButtonText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

// ============ ESTADOS VACÍOS ============
export const EmptyStateContainer = styled.View`
  align-items: center;
  padding: 60px 24px;
  background-color: ${colors.surface};
  margin: 0 20px;
  border-radius: 20px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.shadowLight};
      shadow-offset: 0px 2px;
      shadow-opacity: 1;
      shadow-radius: 8px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const EmptyStateIconContainer = styled(LinearGradient).attrs({
  colors: ['#f8fafc', '#f1f5f9'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
})`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

export const EmptyStateTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: 12px;
`;

export const EmptyStateText = styled.Text`
  font-size: 15px;
  color: ${colors.textSecondary};
  text-align: center;
  line-height: 24px;
  max-width: 300px;
`;

export const EmptyStateButton = styled.TouchableOpacity`
  margin-top: 24px;
  background-color: ${colors.primary};
  padding: 14px 28px;
  border-radius: 12px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.primary};
      shadow-offset: 0px 2px;
      shadow-opacity: 0.3;
      shadow-radius: 6px;
    `,
    android: `
      elevation: 2;
    `
  })}
`;

export const EmptyStateButtonText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

// ============ LOADING ============
export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.background};
  padding: 40px;
`;

export const LoadingIconContainer = styled(LinearGradient).attrs({
  colors: ['#42a8a1', '#5dc1b9'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
})`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  ${Platform.select({
    ios: `
      shadow-color: ${colors.primary};
      shadow-offset: 0px 4px;
      shadow-opacity: 0.3;
      shadow-radius: 8px;
    `,
    android: `
      elevation: 4;
    `
  })}
`;

export const LoadingText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-align: center;
`;