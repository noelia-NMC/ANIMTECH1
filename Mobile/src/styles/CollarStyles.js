import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  background-color: #42a8a1;
  padding: 20px;
  align-items: center;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: white;
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: #ddf6f5;
`;

// Estado general
export const StatusContainer = styled.View`
  background-color: ${({ alert }) => (alert ? '#ffeaea' : '#e0f7f7')};
  margin: 15px;
  border-radius: 12px;
  padding: 15px;
  elevation: 2;
`;

export const StatusTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const StatusDescription = styled.Text`
  font-size: 14px;
  color: #555;
`;

// Métricas
export const MetricsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 10px 15px;
`;

export const MetricCard = styled.View`
  background-color: white;
  width: 48%;
  border-radius: 12px;
  padding: 15px;
  elevation: 2;
  border-left-width: 5px;
  border-left-color: ${({ alert, color }) => (alert ? '#d05471' : color)};
`;

export const MetricTitle = styled.Text`
  font-size: 13px;
  color: #888;
`;

export const MetricValue = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ alert }) => (alert ? '#d05471' : '#333')};
`;

export const MetricUnit = styled.Text`
  font-size: 12px;
  color: #999;
`;

export const AlertContainer = styled.View`
  background-color: #ffeaea;
  padding: 10px;
  margin: 10px 15px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

export const AlertIcon = styled.Text`
  font-size: 18px;
  margin-right: 10px;
`;

export const AlertText = styled.Text`
  color: #d32f2f;
  flex: 1;
`;

// Historial
export const HistoryContainer = styled.View`
  background-color: white;
  margin: 15px;
  padding: 15px;
  border-radius: 12px;
  elevation: 2;
`;

export const HistoryTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #444;
  margin-bottom: 10px;
`;

export const HistoryItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom-width: ${({ isLast }) => (isLast ? '0' : '1px')};
  border-bottom-color: #eee;
`;

export const HistoryText = styled.Text`
  font-size: 14px;
  color: #555;
`;

export const HistoryValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ alert }) => (alert ? '#d05471' : '#333')};
`;

export const ReportContainer = styled.View`
  background-color: white;
  margin: 15px;
  padding: 15px;
  border-radius: 12px;
  elevation: 2;
`;

export const ReportRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 0;
`;

export const ReportLabel = styled.Text`
  font-size: 14px;
  color: #666;
`;

export const ReportValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ status }) =>
    status === 'danger' ? '#d05471' :
    status === 'warning' ? '#ffa726' :
    '#42a8a1'};
`;

// Pestañas de navegación
export const TabContainer = styled.View`
  flex-direction: row;
  margin: 10px 15px 0 15px;
  background-color: #f4f4f4;
  border-radius: 10px;
  overflow: hidden;
`;

export const Tab = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  background-color: ${({ active }) => (active ? '#42a8a1' : 'transparent')};
`;

export const TabText = styled.Text`
  text-align: center;
  color: ${({ active }) => (active ? '#fff' : '#555')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
`;

export const NoDataText = styled.Text`
  text-align: center;
  color: #999;
  padding: 20px;
`;
