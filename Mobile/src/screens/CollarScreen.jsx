import React, { useState, useEffect } from 'react';
import { ScrollView, Dimensions, RefreshControl, Text } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import {
  Container, Header, Title, Subtitle, StatusContainer, StatusTitle,
  StatusDescription, MetricsContainer, MetricCard, MetricTitle, MetricValue,
  MetricUnit, AlertContainer, AlertIcon, AlertText, TabContainer, Tab,
  TabText, ReportContainer, ReportRow, ReportLabel, ReportValue,
  HistoryContainer, HistoryTitle, HistoryItem, HistoryText, HistoryValue,
  NoDataText
} from '../styles/CollarStyles';
import { LineChart, BarChart } from 'react-native-chart-kit';
import {
  getLatestReadings,
  getStatsByPeriod,
  checkVitalSigns
} from '../services/colarService';

const screenWidth = Dimensions.get('window').width - 30;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(66, 168, 161, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#42a8a1' },
  decimalPlaces: 1,
};

const pulseChartConfig = {
  ...chartConfig,
  color: (opacity = 1) => `rgba(208, 84, 113, ${opacity})`,
};

const CollarScreen = () => {
  const [estado, setEstado] = useState({
    temperatura: null,
    pulso: null,
    timestamp: '',
    tempAlert: null,
    pulseAlert: null
  });
  const [activeTab, setActiveTab] = useState('actual');
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);

  const loadData = async () => {
    try {
      const historialData = await getLatestReadings(10);
      setHistory(historialData);

      const statsData = await getStatsByPeriod('day');
      setStats(statsData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const collarRef = ref(db, 'collares/collar_001');

    const unsubscribe = onValue(collarRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const { temperatura, pulso, timestamp } = data;
        const vitalSigns = checkVitalSigns(temperatura, pulso);
        setEstado({
          temperatura,
          pulso,
          timestamp: timestamp || new Date().toLocaleString(),
          tempAlert: vitalSigns.temperature.message,
          pulseAlert: vitalSigns.pulse.message
        });
      }
    });

    loadData();

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderActualContent = () => (
    <>
      {(estado.tempAlert || estado.pulseAlert) && (
        <AlertContainer>
          <AlertIcon>⚠️</AlertIcon>
          <AlertText>{estado.tempAlert || estado.pulseAlert}</AlertText>
        </AlertContainer>
      )}

      <StatusContainer alert={!!(estado.tempAlert || estado.pulseAlert)}>
        <StatusTitle>Estado de Salud</StatusTitle>
        <StatusDescription>
          {estado.tempAlert === null && estado.pulseAlert === null
            ? 'Todo está dentro de los valores normales.'
            : `${estado.tempAlert || ''} ${estado.pulseAlert || ''}`.trim()}
        </StatusDescription>
      </StatusContainer>

      <MetricsContainer>
        <MetricCard color="#42a8a1" alert={!!estado.tempAlert}>
          <MetricTitle>Temperatura</MetricTitle>
          <MetricValue alert={!!estado.tempAlert}>
            {estado.temperatura !== null ? estado.temperatura.toFixed(1) : '---'}
          </MetricValue>
          <MetricUnit>°C</MetricUnit>
        </MetricCard>

        <MetricCard color="#d05471" alert={!!estado.pulseAlert}>
          <MetricTitle>Ritmo Cardíaco</MetricTitle>
          <MetricValue alert={!!estado.pulseAlert}>
            {estado.pulso !== null ? estado.pulso : '---'}
          </MetricValue>
          <MetricUnit>bpm</MetricUnit>
        </MetricCard>
      </MetricsContainer>

      {history.length > 0 && (
        <>
          <Text style={{ textAlign: 'center', marginTop: 20, marginBottom: 10, fontWeight: 'bold' }}>
            Temperatura en Tiempo Real (°C)
          </Text>

          <LineChart
            data={{
              labels: history.slice(-5).map((_, i) => `#${i + 1}`),
              datasets: [{ data: history.slice(-5).map(d => d.temperatura) }]
            }}
            width={screenWidth}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 12 }}
          />

          <Text style={{ textAlign: 'center', marginTop: 15, marginBottom: 5, fontWeight: 'bold' }}>
            Ritmo Cardíaco en Tiempo Real (bpm)
          </Text>

          <BarChart
            data={{
              labels: history.slice(-5).map((_, i) => `#${i + 1}`),
              datasets: [{ data: history.slice(-5).map(d => d.pulso) }]
            }}
            width={screenWidth}
            height={180}
            chartConfig={pulseChartConfig}
            style={{ borderRadius: 12 }}
          />
        </>
      )}
    </>
  );

  const renderHistoryContent = () => {
    if (!history.length) return <NoDataText>No hay datos para mostrar.</NoDataText>;

    return (
      <>
        <HistoryTitle>Historial de Lecturas</HistoryTitle>

        <LineChart
          data={{
            labels: history.map((_, i) => `#${i + 1}`),
            datasets: [{ data: history.map(d => d.temperatura) }],
            legend: ['Temperatura °C']
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 12 }}
        />

        <BarChart
          data={{
            labels: history.map((_, i) => `#${i + 1}`),
            datasets: [{ data: history.map(d => d.pulso) }],
            legend: ['Pulso bpm']
          }}
          width={screenWidth}
          height={220}
          chartConfig={pulseChartConfig}
          style={{ borderRadius: 12 }}
        />

        <HistoryContainer>
          {history.map((item, index) => (
            <HistoryItem key={index}>
              <HistoryText>Lectura #{index + 1}</HistoryText>
              <HistoryValue>🌡️ {item.temperatura}°C | 💓 {item.pulso} bpm</HistoryValue>
              <HistoryText>{item.timestamp || new Date(item.fecha).toLocaleString()}</HistoryText>
            </HistoryItem>
          ))}
        </HistoryContainer>
      </>
    );
  };

  const renderReportContent = () => {
    if (!stats) return <NoDataText>No hay estadísticas disponibles.</NoDataText>;

    const getStatus = (temp, pulse) => {
      if (temp < 37.5 || temp > 39.9 || pulse < 60 || pulse > 140) return 'danger';
      if (temp > 39.2 || pulse > 100) return 'warning';
      return 'normal';
    };

    return (
      <ReportContainer>
        <HistoryTitle>Reporte Diario</HistoryTitle>

        <ReportRow>
          <ReportLabel>Temperatura Promedio</ReportLabel>
          <ReportValue status={getStatus(stats.tempAvg, stats.pulseAvg)}>{stats.tempAvg}°C</ReportValue>
        </ReportRow>

        <ReportRow>
          <ReportLabel>Pulso Promedio</ReportLabel>
          <ReportValue status={getStatus(stats.tempAvg, stats.pulseAvg)}>{stats.pulseAvg} bpm</ReportValue>
        </ReportRow>

        <ReportRow>
          <ReportLabel>Temperatura Máxima</ReportLabel>
          <ReportValue>{stats.tempMax}°C</ReportValue>
        </ReportRow>

        <ReportRow>
          <ReportLabel>Temperatura Mínima</ReportLabel>
          <ReportValue>{stats.tempMin}°C</ReportValue>
        </ReportRow>

        <ReportRow>
          <ReportLabel>Pulso Máximo</ReportLabel>
          <ReportValue>{stats.pulseMax} bpm</ReportValue>
        </ReportRow>

        <ReportRow>
          <ReportLabel>Pulso Mínimo</ReportLabel>
        <ReportRow>
          <ReportValue>{stats.pulseMin} bpm</ReportValue>
        </ReportRow>

          <ReportLabel>Lecturas Registradas</ReportLabel>
          <ReportValue>{stats.readingsCount}</ReportValue>
        </ReportRow>

        <ReportRow>
          <ReportLabel>Estado General</ReportLabel>
          <ReportValue status={getStatus(stats.tempAvg, stats.pulseAvg)}>
            {getStatus(stats.tempAvg, stats.pulseAvg) === 'danger'
              ? 'Requiere Atención'
              : getStatus(stats.tempAvg, stats.pulseAvg) === 'warning'
              ? 'Vigilancia'
              : 'Normal'}
          </ReportValue>
        </ReportRow>
      </ReportContainer>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'actual':
        return renderActualContent();
      case 'historial':
        return renderHistoryContent();
      case 'reporte':
        return renderReportContent();
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ paddingBottom: 30 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Container>
        <Header>
          <Title>Collar Inteligente</Title>
          <Subtitle>Datos en Tiempo Real</Subtitle>
        </Header>

        <TabContainer>
          <Tab active={activeTab === 'actual'} onPress={() => setActiveTab('actual')}>
            <TabText active={activeTab === 'actual'}>Actual</TabText>
          </Tab>

          <Tab active={activeTab === 'historial'} onPress={() => setActiveTab('historial')}>
            <TabText active={activeTab === 'historial'}>Historial</TabText>
          </Tab>

          <Tab active={activeTab === 'reporte'} onPress={() => setActiveTab('reporte')}>
            <TabText active={activeTab === 'reporte'}>Reporte</TabText>
          </Tab>
        </TabContainer>

        {renderContent()}
      </Container>
    </ScrollView>
  );
};

export default CollarScreen;
