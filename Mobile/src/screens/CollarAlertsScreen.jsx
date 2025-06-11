
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { getCollarAlerts } from '../services/colarService';

const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
`;

const ContentContainer = styled.View`
  padding: 15px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const AlertCard = styled.View`
  background-color: ${({ severity }) => (severity === 'alta' ? '#ffeaea' : '#fff9e6')};
  border-left-width: 5px;
  border-left-color: ${({ severity }) => (severity === 'alta' ? '#d32f2f' : '#ffb300')};
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  elevation: 2;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-color: #000;
  shadow-offset: { height: 1, width: 0 };
`;

const AlertText = styled.Text`
  color: ${({ severity }) => (severity === 'alta' ? '#d32f2f' : '#c67100')};
  font-weight: bold;
  font-size: 14px;
`;

const AlertInfo = styled.Text`
  font-size: 13px;
  color: #555;
  margin-top: 5px;
`;

const NoAlertsContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const NoAlertsText = styled.Text`
  text-align: center;
  color: #777;
  font-size: 16px;
`;

const NoAlertsEmoji = styled.Text`
  font-size: 40px;
  margin-bottom: 10px;
`;

const CollarAlertsScreen = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlertas = async () => {
    try {
      const data = await getCollarAlerts();
      setAlertas(data);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
      if (Platform.OS === 'web') {
        window.alert('Error al cargar alertas');
      } else {
        import('react-native').then(({ Alert }) => {
          Alert.alert('Error', 'No se pudieron cargar las alertas.');
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlertas();
  };

  const renderEmptyComponent = () => (
    <NoAlertsContainer>
      <NoAlertsEmoji>🐶🎉</NoAlertsEmoji>
      <NoAlertsText>No hay alertas registradas. Tu mascota está bien.</NoAlertsText>
    </NoAlertsContainer>
  );

  const renderAlerta = ({ item }) => (
    <AlertCard severity={item.severity}>
      <AlertText severity={item.severity}>{item.mensaje}</AlertText>
      <AlertInfo>🌡️ {item.temperatura} °C | 💓 {item.pulso} bpm</AlertInfo>
      <AlertInfo>📅 {item.timestamp}</AlertInfo>
    </AlertCard>
  );

  if (loading) {
    return (
      <Container>
        <ContentContainer>
          <ActivityIndicator size="large" color="#42a8a1" />
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ContentContainer>
        <Title>Alertas del Collar</Title>

        {alertas.length === 0 ? (
          renderEmptyComponent()
        ) : (
          <FlatList
            data={alertas}
            keyExtractor={item => item.id}
            renderItem={renderAlerta}
            scrollEnabled={false}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default CollarAlertsScreen;
