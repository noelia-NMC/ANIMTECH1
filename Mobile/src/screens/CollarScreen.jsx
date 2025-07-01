import React, { useState, useEffect } from 'react';
import { ScrollView, Dimensions, Text, View, ActivityIndicator } from 'react-native';
import { ref, onValue } from 'firebase/database';
import MapView, { Marker } from 'react-native-maps';

import { db } from '../config/firebaseConfig';
import {
  Container, Header, Title, Subtitle,
  MetricCard, MetricTitle, MetricValue, MetricUnit, MetricsGrid,
  StatusCard, StatusTitle, StatusDescription, StatusIcon,
  MapContainer, NoGpsCard, NoGpsText
} from '../styles/CollarStyles';

const screenWidth = Dimensions.get('window').width;

const CollarScreen = () => {
  const [datosCollar, setDatosCollar] = useState({
    temperatura: { valor: 0, estado: 'Cargando...' },
    sonido: { promedio: 0, estado: 'Cargando...' },
    localizacion: { estado_gps: 'Cargando...', latitud: 0, longitud: 0, satelites: 0 },
    actividad: 'Cargando...',
    ultima_actualizacion: null,
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const collarRef = ref(db, 'datos_perro');

    const unsubscribe = onValue(collarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDatosCollar({
          temperatura: {
            valor: typeof data.temperatura?.valor === 'number' ? data.temperatura.valor : parseFloat(data.temperatura?.valor) || 0,
            estado: data.temperatura?.estado || 'SIN DATOS',
          },
          sonido: {
            promedio: typeof data.sonido?.promedio === 'number' ? data.sonido.promedio : parseFloat(data.sonido?.promedio) || 0,
            estado: data.sonido?.estado || 'SIN DATOS',
          },
          localizacion: data.localizacion || { estado_gps: 'SIN DATOS', latitud: 0, longitud: 0, satelites: 0 },
          actividad: data.actividad || 'SIN DATOS',
          ultima_actualizacion: data.ultima_actualizacion || null
        });
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const getTempStatusColor = (estado) => {
    if (estado.includes('PELIGRO') || estado.includes('HIPO')) return '#d32f2f';
    if (estado.includes('PRECAUCION')) return '#ffa726';
    return '#4caf50';
  };

  const getSoundStatusColor = (estado) => {
    if (estado.includes('angustia') || estado.includes('dolor')) return '#d32f2f';
    if (estado.includes('estrés') || estado.includes('alerta')) return '#ffa726';
    return '#4caf50';
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text>Conectando con el collar...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
      <Container>
        <Header>
          <Title>Panel de control de AnimTech</Title>
          <Subtitle>Monitorizando a tu mejor amigo</Subtitle>
        </Header>

        {/* ESTADO GENERAL */}
        <StatusCard statusColor={getTempStatusColor(datosCollar.temperatura.estado)}>
          <StatusIcon>❤️</StatusIcon>
          <View>
            <StatusTitle>Estado general: {datosCollar.temperatura.estado}</StatusTitle>
            <StatusDescription>
              {datosCollar.temperatura.estado === 'NORMAL'
                ? 'Los signos vitales están en rangos seguros.'
                : 'Se recomienda revisar el estado de la mascota.'}
            </StatusDescription>
          </View>
        </StatusCard>

        {/* ESTADO DE SONIDO */}
        <StatusCard statusColor={getSoundStatusColor(datosCollar.sonido.estado)}>
          <StatusIcon>🔊</StatusIcon>
          <View>
            <StatusTitle>Sonido: {datosCollar.sonido.estado}</StatusTitle>
            <StatusDescription>
              Promedio de volumen: {typeof datosCollar.sonido.promedio === 'number'
                ? datosCollar.sonido.promedio.toFixed(1)
                : '---'}
            </StatusDescription>
          </View>
        </StatusCard>

        {/* MÉTRICAS */}
        <MetricsGrid>
          <MetricCard>
            <MetricTitle>Temperatura corporal</MetricTitle>
            <MetricValue color={getTempStatusColor(datosCollar.temperatura.estado)}>
              {typeof datosCollar.temperatura.valor === 'number'
                ? datosCollar.temperatura.valor.toFixed(1)
                : '---'}
              <MetricUnit> °C</MetricUnit>
            </MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricTitle>Nivel de actividad</MetricTitle>
            <MetricValue color="#3f51b5">
              {datosCollar.actividad}
            </MetricValue>
            <MetricUnit>{datosCollar.actividad === 'EN MOVIMIENTO' ? '🏃‍♂️' : '😴'}</MetricUnit>
          </MetricCard>
        </MetricsGrid>

        {/* MAPA */}
        <Title style={{ color: '#333', marginTop: 20, marginLeft: 15 }}>Ubicación Actual</Title>
        {datosCollar.localizacion.estado_gps === 'VÁLIDO' ? (
          <MapContainer>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: datosCollar.localizacion.latitud,
                longitude: datosCollar.localizacion.longitud,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              key={`${datosCollar.localizacion.latitud}-${datosCollar.localizacion.longitud}`}
            >
              <Marker
                coordinate={{
                  latitude: datosCollar.localizacion.latitud,
                  longitude: datosCollar.localizacion.longitud,
                }}
                title="Aquí está tu mascota"
                description={`Satélites: ${datosCollar.localizacion.satelites}`}
              />
            </MapView>
          </MapContainer>
        ) : (
          <NoGpsCard>
            <StatusIcon>🛰️</StatusIcon>
            <View>
              <NoGpsText>Buscando señal GPS...</NoGpsText>
              <StatusDescription>
                Esto es normal en interiores. La señal se obtendrá cuando esté al aire libre.
              </StatusDescription>
            </View>
          </NoGpsCard>
        )}
      </Container>
    </ScrollView>
  );
};

export default CollarScreen;
