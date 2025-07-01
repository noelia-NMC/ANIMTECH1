import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f4f6f8;
  padding-bottom: 30px;
`;

export const Header = styled.View`
  background-color: #42a8a1;
  padding: 40px 20px 20px 20px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  elevation: 5;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-align: center;
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: #ddf6f5;
  text-align: center;
  margin-top: 4px;
`;

// Tarjeta de estado principal
export const StatusCard = styled.View`
  background-color: #fff;
  margin: 20px 15px 10px 15px;
  border-radius: 15px;
  padding: 15px;
  elevation: 4;
  flex-direction: row;
  align-items: center;
  border-left-width: 8px;
  border-left-color: ${({ statusColor }) => statusColor || '#ccc'};
`;

export const StatusIcon = styled.Text`
  font-size: 30px;
  margin-right: 15px;
`;

export const StatusTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

export const StatusDescription = styled.Text`
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;
`;

// Grid para las métricas
export const MetricsGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 15px;
`;

// Tarjeta de métrica individual
export const MetricCard = styled.View`
  background-color: #fff;
  width: 48%;
  border-radius: 15px;
  padding: 20px;
  elevation: 4;
  align-items: center;
`;

export const MetricTitle = styled.Text`
  font-size: 14px;
  color: #888;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const MetricValue = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${({ color }) => color || '#333'};
`;

export const MetricUnit = styled.Text`
  font-size: 16px;
  color: #666;
`;

// Contenedor del Mapa
export const MapContainer = styled.View`
  height: 250px;
  margin: 10px 15px;
  border-radius: 15px;
  overflow: hidden; /* Esto es clave para que el mapa respete el borde redondeado */
  elevation: 4;
`;

// Tarjeta para cuando no hay GPS
export const NoGpsCard = styled.View`
  background-color: #fff;
  margin: 10px 15px;
  border-radius: 15px;
  padding: 15px;
  elevation: 4;
  flex-direction: row;
  align-items: center;
  border-left-width: 8px;
  border-left-color: #546e7a;
`;

export const NoGpsText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;