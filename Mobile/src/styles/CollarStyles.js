import styled from 'styled-components/native';

// Paleta base para elementos neutros y de la aplicación
const neutralColors = {
  background: '#f8f9fa', // Un gris muy claro para el fondo
  surface: '#ffffff',    // Blanco para las tarjetas
  textPrimary: '#212529', // Negro suave para títulos principales
  textSecondary: '#6c757d', // Gris para texto secundario y descripciones
  textTertiary: '#9ca3af', // Gris más claro para detalles
  border: '#e5e7eb',      // Borde sutil para las tarjetas
  primaryAction: '#42a8a1', // Color principal para botones
};

// --- CONTENEDORES PRINCIPALES Y DE ESTADO ---
export const Container = styled.View`
  flex: 1;
  background-color: ${neutralColors.background};
  padding: 20px;
  padding-bottom: 40px;
`;

export const FullScreenContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${neutralColors.background};
  padding: 20px;
`;

export const LoadingText = styled.Text`
  margin-top: 15px;
  font-size: 16px;
  color: ${neutralColors.textSecondary};
  font-weight: 500;
`;

export const ErrorTitle = styled.Text`
  font-size: 18px;
  color: #dc3545; /* Rojo para errores */
  margin-bottom: 10px;
  font-weight: 600;
`;

export const ErrorMessage = styled.Text`
  font-size: 14px;
  color: ${neutralColors.textSecondary};
  text-align: center;
`;

// --- TARJETA DE BIENESTAR PRINCIPAL (CollarScreen) ---
export const WellnessCard = styled.View`
  background-color: ${neutralColors.surface};
  margin-bottom: 20px;
  border-radius: 16px;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${neutralColors.border};
  border-left-width: 6px;
  border-left-color: ${({ statusColor }) => statusColor || neutralColors.textTertiary};
  elevation: 2;
`;

export const WellnessIndicator = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ color }) => color || neutralColors.textTertiary};
  justify-content: center;
  align-items: center;
`;

export const WellnessScore = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${neutralColors.surface};
`;

export const WellnessText = styled.Text`
  font-size: 10px;
  color: ${neutralColors.surface};
  opacity: 0.9;
  margin-top: 2px;
`;

// --- GRID Y TARJETAS DE MÉTRICAS (CollarScreen) ---
export const MetricsGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;
`;

export const MetricCard = styled.View`
  background-color: ${neutralColors.surface};
  flex: 1;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${neutralColors.border};
  min-height: 90px;
  elevation: 1;
`;

export const MetricTitle = styled.Text`
  font-size: 12px;
  color: ${neutralColors.textSecondary};
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
`;

export const MetricValue = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${({ color }) => color || neutralColors.textPrimary};
  text-align: center;
`;

export const MetricUnit = styled.Text`
  font-size: 14px;
  color: ${neutralColors.textSecondary};
  font-weight: 500;
`;

// --- TARJETA DE ESTADO (CollarScreen) ---
export const StatusCard = styled.View`
  background-color: ${neutralColors.surface};
  margin-bottom: 16px;
  border-radius: 12px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${neutralColors.border};
  border-left-width: 5px;
  border-left-color: ${({ statusColor }) => statusColor || neutralColors.textTertiary};
  elevation: 1;
`;

export const StatusIcon = styled.Text`
  font-size: ${({ size }) => size || '20px'};
  margin-right: 12px;
`;

export const StatusTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${neutralColors.textPrimary};
  margin-bottom: 4px;
`;

export const StatusDescription = styled.Text`
  font-size: 13px;
  color: ${neutralColors.textSecondary};
  line-height: 18px;
`;

// --- BOTONES DE ACCIÓN (CollarScreen) ---
export const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 12px;
  gap: 12px;
`;

export const ActionButton = styled.TouchableOpacity`
  background-color: ${neutralColors.primaryAction};
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  elevation: 2;
`;

export const ActionButtonText = styled.Text`
  color: ${neutralColors.surface};
  font-size: 14px;
  font-weight: 600;
`;

// --- SECCIONES DE INFORMACIÓN Y TEXTOS GENERALES ---
export const InfoSection = styled.View`
  background-color: ${neutralColors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid ${neutralColors.border};
  elevation: 1;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${neutralColors.textPrimary};
  margin-bottom: 12px;
`;

export const LastUpdate = styled.Text`
  font-size: 11px;
  color: ${neutralColors.textTertiary};
  text-align: center;
  margin-top: 10px;
  font-style: italic;
`;

// --- ESTILOS PARA GRÁFICOS (CollarGraphsScreen) ---

export const ChartContainer = styled(InfoSection)`
  /* Hereda los estilos de InfoSection y se puede extender si es necesario */
  padding-bottom: 20px;
`;

export const ChartTitle = styled(SectionTitle)`
  /* Hereda los estilos de SectionTitle */
`;

export const ChartStatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 0 15px;
`;

export const ChartStatText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ color }) => color || neutralColors.textSecondary};
`;

export const CenteredMessage = styled.Text`
  text-align: center;
  color: ${neutralColors.textSecondary};
  padding: 30px;
  font-size: 14px;
`;

// Gráfico de Barras
export const SimpleChart = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
  height: 150px;
  padding: 0 10px;
`;

export const ChartBarContainer = styled.View`
  align-items: center;
  flex: 1;
`;

export const ChartBar = styled.View`
  width: 70%;
  max-width: 30px;
  background-color: ${({ color }) => color || neutralColors.primaryAction};
  height: ${({ height }) => height || 10}px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export const ChartLabel = styled.Text`
  font-size: 10px;
  color: ${neutralColors.textSecondary};
  margin-top: 6px;
`;

export const ChartValue = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${neutralColors.textPrimary};
  margin-top: 2px;
`;

// Gráfico de Líneas
export const LineChart = styled.View`
  height: 150px;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-color: ${neutralColors.border};
  margin: 0 15px;
`;

export const LinePoint = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ color }) => color || neutralColors.primaryAction};
  position: absolute;
  transform: translateX(-4px) translateY(4px); /* Centrar el punto */
`;

export const LineChartLabelsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 15px;
  margin-top: 10px;
`;

// --- TARJETAS DE ESTADÍSTICAS (CollarGraphsScreen) ---
export const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 15px;
`;

export const StatCard = styled.View`
  width: 48%;
  background-color: ${neutralColors.surface};
  padding: 15px;
  border-radius: 12px;
  align-items: center;
  margin-bottom: 10px;
  elevation: 2;
  border: 1px solid ${neutralColors.border};
`;

export const StatValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ color }) => color || neutralColors.textPrimary};
`;

export const StatLabel = styled.Text`
  font-size: 12px;
  color: ${neutralColors.textSecondary};
  text-align: center;
  margin-top: 4px;
`;

// --- ESTILOS PARA HISTORIAL (CollarGraphsScreen) ---
export const HistoryContainer = styled(InfoSection)`
  margin-top: 20px;
  max-height: 350px; /* Altura máxima para el contenedor */
`;

export const HistoryScrollView = styled.ScrollView`
  max-height: 280px; /* Altura máxima para el scroll interno */
`;

export const HistoryItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 5px;
  border-bottom-width: 1px;
  border-bottom-color: ${neutralColors.border};
`;

export const HistoryItemSection = styled.View`
  flex: ${({ flex }) => flex || 1};
  justify-content: center;
`;

export const HistoryTime = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${neutralColors.textPrimary};
`;

export const HistoryTimestamp = styled.Text`
  font-size: 11px;
  color: ${neutralColors.textSecondary};
`;

export const HistoryData = styled.Text`
  font-size: 13px;
  color: ${neutralColors.textSecondary};
  line-height: 18px;
`;

// --- TARJETAS DE COORDENADAS (Latitud/Longitud) ---
export const CoordinateGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;
  gap: 16px;
`;

export const CoordinateCard = styled.View`
  flex: 1;
  background-color: ${neutralColors.background};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  border: 1px solid ${neutralColors.border};
`;

export const CoordinateLabel = styled.Text`
  font-size: 12px;
  color: ${neutralColors.textSecondary};
  font-weight: 500;
  margin-bottom: 4px;
`;

export const CoordinateValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${neutralColors.textPrimary};
`;

export const MetricSubText = styled.Text`
  font-size: 11px;
  color: ${neutralColors.textSecondary};
  margin-top: 4px;
  text-align: center;
`;

// --- MAPA ---
export const MapContainer = styled.View`
  height: 350px;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden; /* Muy importante para que el mapa respete los bordes redondeados */
  border: 1px solid ${neutralColors.border};
  elevation: 2;
`;

// --- SECCIÓN DE INFORMACIÓN TÉCNICA ---
export const InfoDetailCard = styled.View`
  background-color: ${neutralColors.background};
  padding: 15px;
  border-radius: 12px;
  margin-top: 5px;
`;

export const InfoDetailItem = styled.View`
  margin-bottom: 12px;
`;

export const InfoDetailTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${neutralColors.textPrimary};
  margin-bottom: 4px;
`;

export const InfoDetailText = styled.Text`
  font-size: 13px;
  color: ${neutralColors.textSecondary};
  line-height: 18px;
`;