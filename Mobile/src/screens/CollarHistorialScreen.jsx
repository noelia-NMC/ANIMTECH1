
import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, ActivityIndicator, RefreshControl, View } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import styled from 'styled-components/native';
import { getLatestReadings } from '../services/colarService';

const screenWidth = Dimensions.get('window').width - 30;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(66, 168, 161, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#42a8a1' },
  decimalPlaces: 1,
  strokeWidth: 2
};

const pulseChartConfig = {
  ...chartConfig,
  color: (opacity = 1) => `rgba(208, 84, 113, ${opacity})`,
};

// =================== ESTILOS ===================
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 15px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const NoData = styled.Text`
  text-align: center;
  color: #888;
  padding: 20px;
`;

const ChartBox = styled.View`
  margin-bottom: 30px;
  border-radius: 12px;
  padding: 10px;
  background-color: #f9f9f9;
`;

const DataRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const DataLabel = styled.Text`
  font-size: 14px;
  color: #555;
`;

const DataValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

const DateText = styled.Text`
  font-size: 12px;
  color: #888;
  text-align: right;
`;
// =================================================

const CollarHistorialScreen = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    const lecturas = await getLatestReadings(15);
    setDatos(lecturas.sort((a, b) => a.fecha - b.fecha));
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  if (loading) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#42a8a1" style={{ marginTop: 40 }} />
      </Container>
    );
  }

  if (datos.length === 0) {
    return (
      <Container>
        <NoData>No hay datos de historial disponibles 📉</NoData>
      </Container>
    );
  }

  const labels = datos.map((_, i) => `#${i + 1}`);
  const temps = datos.map(d => d.temperatura);
  const pulses = datos.map(d => d.pulso);
  const visibleLabels = labels.slice(-7);
  const visibleTemps = temps.slice(-7);
  const visiblePulses = pulses.slice(-7);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Container>
        <Title>Historial del Collar</Title>

        <ChartBox>
          <Title>🌡 Temperatura (°C)</Title>
          <LineChart
            data={{
              labels: visibleLabels,
              datasets: [{ data: visibleTemps }],
              legend: ['Temperatura °C']
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 12 }}
          />
        </ChartBox>

        <ChartBox>
          <Title>💓 Ritmo Cardíaco (bpm)</Title>
          <BarChart
            data={{
              labels: visibleLabels,
              datasets: [{ data: visiblePulses }]
            }}
            width={screenWidth}
            height={220}
            chartConfig={pulseChartConfig}
            style={{ borderRadius: 12 }}
          />
        </ChartBox>

        <Title>Registro Detallado</Title>
        {datos.map((item, index) => (
          <DataRow key={index}>
            <View style={{ flex: 1 }}>
              <DataLabel>Lectura #{index + 1}</DataLabel>
              <DateText>{item.timestamp}</DateText>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <DataValue style={{ marginRight: 15, color: '#42a8a1' }}>
                🌡️ {item.temperatura}°C
              </DataValue>
              <DataValue style={{ color: '#d05471' }}>
                💓 {item.pulso} bpm
              </DataValue>
            </View>
          </DataRow>
        ))}
      </Container>
    </ScrollView>
  );
};

export default CollarHistorialScreen;
