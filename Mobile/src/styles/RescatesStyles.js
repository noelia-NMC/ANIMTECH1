import styled from 'styled-components/native';
import MapView from 'react-native-maps';
import { Platform, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ============ CONFIGURACIÓN INICIAL ============
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 24;
  }
  return screenHeight > 800 ? 44 : 20;
};

const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  secondary: '#5dc1b9',
  accent: '#8ae0db',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceSecondary: '#f8fafc',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  shadowLight: '#ffffff',
};

// ============ HEADER ============
export const Header = styled(LinearGradient).attrs({
  colors: [colors.primary, colors.secondary],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 }
})`
  padding-horizontal: 16px;
  padding-bottom: 16px;
  padding-top: ${getStatusBarHeight() + 12}px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  min-height: ${getStatusBarHeight() + 80}px;
`;

export const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

export const HeaderTitleContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
  line-height: 32px;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  line-height: 18px;
`;

// ============ MINI NAVEGACIÓN ============
export const MiniNavContainer = styled.View`
  flex-direction: row;
  background-color: ${colors.surface};
  margin: 15px;
  margin-bottom: 1px;
  border-radius: 16px;
  padding: 4px;
  border-width: 0.5px;
  border-color: ${colors.borderLight};
  elevation: 3;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 8px;
`;

export const MiniNavButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px 4px;
  border-radius: 12px;
  background-color: ${props => props.active ? colors.primary : 'transparent'};
  position: relative;
  min-height: 50px;
`;

export const MiniNavText = styled.Text`
  font-size: ${props => props.small ? '8px' : '10px'};
  font-weight: ${props => props.active ? '700' : '600'};
  color: ${props => props.active ? '#ffffff' : colors.textPrimary};
  margin-top: 3px;
  text-align: center;
  line-height: 12px;
`;

export const MiniNavIndicator = styled.View`
  background-color: ${colors.error};
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 4px;
  position: absolute;
  top: 6px;
  right: 6px;
`;

// ============ CONTENEDORES PRINCIPALES ============
export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
`;

export const ContentContainer = styled.View`
  flex: 1;
  padding: 14px;
`;

// ============ MAPA ELEGANTE ============
export const MapContainer = styled.View`
  flex: 2;
  margin: 10px;
  margin-bottom: 8px;
  border-radius: 20px;
  overflow: hidden;
  border-width: 0.5px;
  border-color: ${colors.borderLight};
  min-height: 320px;
  max-height: 500px;
  elevation: 8;
  shadow-color: rgba(0, 0, 0, 0.12);
  shadow-offset: 0px 6px;
  shadow-opacity: 1;
  shadow-radius: 16px;
`;

export const StyledMap = styled(MapView)`
  flex: 1;
`;

// ============ MODAL SOFISTICADO - CORREGIDO ============
export const ModalOverlay = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

export const FloatingCard = styled.View`
  background-color: ${colors.surface};
  border-radius: 24px;
  padding: 20px;
  width: 100%;
  max-width: 380px;
  max-height: 85%;
  min-height: 500px;
  align-self: center;
  position: relative;
  border-width: 0.5px;
  border-color: ${colors.borderLight};
  elevation: 15;
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 0px 12px;
  shadow-opacity: 1;
  shadow-radius: 20px;
`;

export const CloseModalButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${colors.background};
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-width: 0.5px;
  border-color: ${colors.border};
  elevation: 6;
  shadow-color: rgba(0, 0, 0, 0.15);
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 8px;
`;

// ============ AVATARES PREMIUM ============
export const AnimalAvatar = styled.View`
  width: ${props => props.small ? '40px' : '72px'};
  height: ${props => props.small ? '40px' : '72px'};
  background-color: ${colors.accent};
  border-radius: ${props => props.small ? '20px' : '36px'};
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.small ? '0' : '20px'};
  margin-right: ${props => props.small ? '14px' : '0'};
  align-self: ${props => props.small ? 'flex-start' : 'center'};
  border-width: 3px;
  border-color: ${colors.surface};
  elevation: 6;
  shadow-color: ${colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 10px;
`;

export const AnimalInitial = styled.Text`
  font-size: ${props => props.small ? '20px' : '36px'};
  font-weight: bold;
`;

export const CardContent = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
`;

export const AnimalName = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.textPrimary};
  margin-bottom: 16px;
  text-align: center;
  line-height: 24px;
`;

// ============ STATUS CHIPS REFINADOS ============
export const StatusChip = styled.View`
  background-color: ${props => {
    switch (props.estado) {
      case 'pendiente': return colors.error;
      case 'en_proceso': return colors.warning;
      case 'finalizado': return colors.success;
      default: return colors.primary;
    }
  }};
  padding: 5px 12px;
  border-radius: 24px;
  align-self: ${props => props.small ? 'flex-end' : 'center'};
  opacity: 0.95;
  elevation: 4;
  shadow-color: ${props => {
    switch (props.estado) {
      case 'pendiente': return colors.error;
      case 'en_proceso': return colors.warning;
      case 'finalizado': return colors.success;
      default: return colors.primary;
    }
  }};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
`;

export const StatusText = styled.Text`
  color: ${colors.surface};
  font-size: ${props => props.small ? '8px' : '12px'};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

// ============ TEXTOS ELEGANTES ============
export const DescriptionText = styled.Text`
  font-size: 15px;
  color: ${colors.textSecondary};
  line-height: 22px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 400;
`;

export const CardDescription = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  line-height: 18px;
  margin-bottom: 10px;
  font-weight: 400;
`;

// ============ INFO ROWS REFINADAS ============
export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  align-self: flex-start;
  width: 100%;
`;

export const InfoIcon = styled.Text`
  font-size: 16px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
`;

export const InfoText = styled.Text`
  font-size: 12px;
  color: ${colors.textTertiary};
  font-weight: 500;
  flex: 1;
  line-height: 18px;
`;

// ============ BOTONES PREMIUM ============
export const ActionButtons = styled.View`
  flex-direction: row;
  margin-top: 20px;
  gap: 10px;
  width: 100%;
`;

export const HelpButton = styled.TouchableOpacity`
  flex: 2;
  background-color: ${colors.primary};
  padding: 16px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  elevation: 8;
  shadow-color: ${colors.primary};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.35;
  shadow-radius: 12px;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${colors.background};
  padding: 16px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  border-width: 1px;
  border-color: ${colors.border};
  elevation: 3;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 3px;
  shadow-opacity: 1;
  shadow-radius: 6px;
`;

export const ButtonText = styled.Text`
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  line-height: 18px;
  color: ${props => props.primary ? colors.surface : colors.textPrimary};
`;

// ============ LISTAS Y TARJETAS SOFISTICADAS ============
export const RescatesList = styled.View`
  flex: 1;
  padding: 2px 5px;
`;

export const RescateCard = styled.TouchableOpacity`
  background-color: ${colors.surface};
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 15px;
  width: ${screenWidth - 40}px;
  align-self: center;
  border-width: 0.5px;
  border-color: ${colors.borderLight};
  min-height: 110px;
  max-height: 650px;
  elevation: 6;
  shadow-color: rgba(0, 0, 0, 0.08);
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 12px;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center; 
  margin-bottom: 16px;
  gap: 12px;
`;

export const CardTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.textPrimary};
  flex: 1;
  line-height: 19px;
  margin-right: 8px;
`;

export const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top-width: 0.5px;
  border-top-color: ${colors.borderLight};
  margin-top: 12px;
`;

export const TimeText = styled.Text`
  font-size: 11px;
  color: ${colors.textTertiary};
  font-weight: 600;
`;

export const DistanceText = styled.Text`
  font-size: 11px;
  color: ${colors.primary};
  font-weight: 700;
`;

// ============ FOTOS Y COMENTARIOS PREMIUM ============
export const PhotoContainer = styled.View`
  margin: 12px 0;
  border-radius: 16px;
  overflow: hidden;
`;

export const PhotoPreview = styled.Image`
  width: 100%;
  height: 150px;
  border-radius: 16px;
  margin-bottom: 12px;
`;

export const CommentContainer = styled.View`
  background-color: ${colors.surfaceSecondary};
  padding: 16px;
  border-radius: 16px;
  margin: 12px 0;
  border-left-width: 4px;
  border-left-color: ${colors.primary};
  elevation: 2;
  shadow-color: rgba(0, 0, 0, 0.05);
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;
`;

export const CommentText = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  font-style: italic;
  line-height: 20px;
  margin-top: 6px;
  font-weight: 500;
`;

// ============ ACCIONES MEJORADAS ============
export const ActionContainer = styled.View`
  flex-direction: row;
  margin-top: 3px;
  gap: 12px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${colors.primary};
  padding: 14px;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
  min-height: 48px;
  elevation: 4;
  shadow-color: ${colors.primary};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.25;
  shadow-radius: 6px;
`;

export const ActionButtonText = styled.Text`
  color: ${colors.surface};
  font-weight: 700;
  font-size: 13px;
  margin-left: 8px;
`;

export const FinalizarButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.hasPhoto ? colors.success : colors.textTertiary};
  padding: 14px;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  elevation: 4;
  shadow-color: ${props => props.hasPhoto ? colors.success : colors.textTertiary};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.25;
  shadow-radius: 6px;
`;

export const FinalizarButtonText = styled.Text`
  color: ${colors.surface};
  font-weight: 700;
  font-size: 13px;
  margin-left: 8px;
`;

// ============ PROGRESS Y SUCCESS REFINADOS ============
export const ProgressContainer = styled.View`
  padding: 12px;
  background-color: ${colors.surfaceSecondary};
  border-radius: 12px;
  margin-top: 12px;
  align-items: center;
  elevation: 2;
  shadow-color: rgba(0, 0, 0, 0.05);
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;
`;

export const ProgressText = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  font-weight: 600;
`;

export const SuccessContainer = styled.View`
  align-items: center;
  margin-top: 12px;
  padding: 12px;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
`;

export const SuccessIcon = styled.Text`
  font-size: 28px;
`;

export const SuccessText = styled.Text`
  font-size: 12px;
  color: ${colors.success};
  font-weight: 700;
  text-align: center;
`;

export const DurationText = styled.Text`
  color: ${colors.primary};
  font-weight: 700;
`;

// ============ ESTADÍSTICAS PREMIUM ============
export const StatsContainer = styled.View`
  flex-direction: row;
  background-color: ${colors.surface};
  margin-bottom: 9px;
  border-radius: 20px;
  padding: 15px;
  border-width: 0.5px;
  border-color: ${colors.borderLight};
  elevation: 8;
  shadow-color: rgba(0, 0, 0, 0.1);
  shadow-offset: 0px 6px;
  shadow-opacity: 1;
  shadow-radius: 16px;
`;

export const StatItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding: 1px;
`;

export const StatNumber = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.primary};
  margin-bottom: 6px;
`;

export const StatLabel = styled.Text`
  font-size: 11px;
  color: ${colors.textTertiary};
  text-align: center;
  font-weight: 600;
  line-height: 14px;
`;

// ============ EMPTY STATE MEJORADO ============
export const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 50px 24px;
  min-height: 200px;
`;

export const EmptyIcon = styled.Text`
  font-size: 56px;
  margin-bottom: 20px;
  opacity: 0.6;
`;

export const EmptyTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: 12px;
  line-height: 26px;
`;

export const EmptySubtitle = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  text-align: center;
  line-height: 20px;
  font-weight: 500;
  max-width: 300px;
  opacity: 0.8;
`;

// ============ LOADING ELEGANTE ============
export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 50px 24px;
`;

export const LoadingText = styled.Text`
  margin-top: 20px;
  font-size: 15px;
  color: ${colors.textSecondary};
  text-align: center;
  font-weight: 600;
  line-height: 20px;
`;

// ============ COMPONENTES DE NAVEGACIÓN PREMIUM - CORREGIDOS ============
export const TransportModes = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 5px 0;
  gap: 5px;
`;

export const TransportBtn = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px 8px;
  border-radius: 15px;
  background-color: ${props => props.selected ? props.color : 'transparent'};
  gap: 6px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  min-height: 52px;
  border-width: 0px;
  elevation: 0;
  shadow-color: transparent;
  shadow-offset: 0px 0px;
  shadow-opacity: 0;
  shadow-radius: 0px;
`;

export const TransportText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.selected ? '#ffffff' : colors.textSecondary};
`;

export const RouteInfoContainer = styled.View`
  background-color: #f0f9ff;
  padding: 16px;
  border-radius: 16px;
  margin: 12px 0;
  border-left-width: 4px;
  border-left-color: ${colors.primary};
  elevation: 3;
  shadow-color: rgba(0, 0, 0, 0.08);
  shadow-offset: 0px 3px;
  shadow-opacity: 1;
  shadow-radius: 6px;
`;

export const RouteInfoText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #2563eb;
  text-align: center;
`;

export const LoadingRouteContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 12px;
`;

export const NavigationControls = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 12px;
`;

export const NavigationButton = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 12px;
  background-color: ${colors.surfaceSecondary};
  border-width: 0.5px;
  border-color: ${colors.border};
  elevation: 3;
  shadow-color: rgba(0, 0, 0, 0.08);
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;
`;

// ============ BOTTOM SHEET PREMIUM ============
export const BottomSheet = styled.View`
  background-color: ${colors.surface};
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  padding: 24px;
  padding-bottom: 16px;
  max-height: 300px;
  min-height: 280px;
  border-top-width: 0.5px;
  border-top-color: ${colors.borderLight};
  elevation: 12;
  shadow-color: rgba(0, 0, 0, 0.2);
  shadow-offset: 0px -6px;
  shadow-opacity: 1;
  shadow-radius: 16px;
`;

export const SheetHandle = styled.View`
  width: 50px;
  height: 5px;
  background-color: ${colors.textTertiary};
  border-radius: 3px;
  align-self: center;
  margin-bottom: 20px;
  opacity: 0.4;
`;

export const SheetTitle = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: 20px;
  line-height: 22px;
`;

// ============ EXPORT COLORS ============
export { colors };