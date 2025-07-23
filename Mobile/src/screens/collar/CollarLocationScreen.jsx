import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, Alert, Linking } from 'react-native';
import { ref, onValue } from 'firebase/database';
import MapView, { Marker, Circle } from 'react-native-maps';
import { db } from '../../config/firebaseConfig';
import {
  Container, MapContainer, StatusCard, StatusTitle, StatusDescription, StatusIcon,
  MetricCard, MetricTitle, MetricValue, MetricUnit, MetricsGrid,
  ActionButton, ActionButtonText, ActionButtonsContainer,
  SectionTitle, InfoSection, CoordinateCard, CoordinateValue, CoordinateLabel
} from '../../styles/CollarStyles';

const CollarLocationScreen = () => {
  const [ubicacionData, setUbicacionData] = useState({
    latitud: -17.381592,
    longitud: -66.165220,
    coordenadas: '',
    estado: 'Buscando GPS...',
    precision: 0,
    ultima_actualizacion: null
  });
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const cargarUbicacion = () => {
    try {
      const collarRef = ref(db, 'AnimTech/device01/posicion');
      
      const unsubscribe = onValue(collarRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const nuevaUbicacion = {
            latitud: Number(data.latitud) || -17.381592,
            longitud: Number(data.longitud) || -66.165220,
            coordenadas: data.Coordenadas || `${data.latitud || -17.381592}, ${data.longitud || -66.165220}`,
            estado: 'GPS activo',
            precision: 95,
            ultima_actualizacion: new Date().toLocaleString()
          };
          setUbicacionData(nuevaUbicacion);
        }
        setCargando(false);
        setRefreshing(false);
        setError(null);
      }, (error) => {
        console.error('Error cargando ubicación:', error);
        setError('Error al cargar ubicación');
        setCargando(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error conectando:', err);
      setError('Error de conexión');
      setCargando(false);
      setRefreshing(false);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = cargarUbicacion();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarUbicacion();
  }, []);

  const abrirEnGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${ubicacionData.latitud},${ubicacionData.longitud}`;
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'No se pudo abrir Google Maps');
    });
  };

  const copiarCoordenadas = () => {
    Alert.alert(
      'Coordenadas GPS',
      `Latitud: ${ubicacionData.latitud.toFixed(6)}\nLongitud: ${ubicacionData.longitud.toFixed(6)}`,
      [{ text: 'Cerrar', style: 'cancel' }]
    );
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const coordenadasReferencia = { lat: -17.381592, lng: -66.165220 };
  const distanciaDesdeReferencia = calcularDistancia(
    coordenadasReferencia.lat,
    coordenadasReferencia.lng,
    ubicacionData.latitud,
    ubicacionData.longitud
  );

  const getZonaStatus = (distancia) => {
    if (distancia < 0.05) return { texto: 'En casa', color: '#28a745', emoji: '🏠' };
    if (distancia < 0.2) return { texto: 'Cerca de casa', color: '#17a2b8', emoji: '🚶‍♂️' };
    if (distancia < 0.5) return { texto: 'En el vecindario', color: '#ffc107', emoji: '🏘️' };
    if (distancia < 2) return { texto: 'En la ciudad', color: '#fd7e14', emoji: '🏙️' };
    return { texto: 'Lejos de casa', color: '#dc3545', emoji: '⚠️' };
  };

  const zonaActual = getZonaStatus(distanciaDesdeReferencia);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={{ marginTop: 15, fontSize: 16, color: '#6c757d', fontWeight: '500' }}>
          Obteniendo ubicación GPS...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#dc3545', marginBottom: 10, fontWeight: '600' }}>Error</Text>
        <Text style={{ fontSize: 14, color: '#6c757d', textAlign: 'center' }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f8f9fa' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Container>
        {/* ESTADO GPS */}
        <StatusCard statusColor="#28a745">
          <StatusIcon>📡</StatusIcon>
          <View style={{ flex: 1 }}>
            <StatusTitle>Estado GPS</StatusTitle>
            <StatusDescription>
              {ubicacionData.estado} • Precisión: {ubicacionData.precision}%
            </StatusDescription>
            <Text style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>
              Actualizado: {ubicacionData.ultima_actualizacion}
            </Text>
          </View>
        </StatusCard>

        {/* ZONA ACTUAL */}
        <StatusCard statusColor={zonaActual.color}>
          <StatusIcon>{zonaActual.emoji}</StatusIcon>
          <View style={{ flex: 1 }}>
            <StatusTitle>Ubicación Actual</StatusTitle>
            <StatusDescription>
              {zonaActual.texto} • {distanciaDesdeReferencia < 1 ? 
                `${(distanciaDesdeReferencia * 1000).toFixed(0)}m` : 
                `${distanciaDesdeReferencia.toFixed(2)}km`} desde casa
            </StatusDescription>
          </View>
        </StatusCard>

        {/* COORDENADAS PRECISAS */}
        <InfoSection>
          <SectionTitle>📍 Coordenadas GPS</SectionTitle>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
            <CoordinateCard>
              <CoordinateLabel>Latitud</CoordinateLabel>
              <CoordinateValue>{ubicacionData.latitud.toFixed(6)}</CoordinateValue>
            </CoordinateCard>
            
            <CoordinateCard>
              <CoordinateLabel>Longitud</CoordinateLabel>
              <CoordinateValue>{ubicacionData.longitud.toFixed(6)}</CoordinateValue>
            </CoordinateCard>
          </View>
        </InfoSection>

        {/* MÉTRICAS DE DISTANCIA */}
        <MetricsGrid>
          <MetricCard>
            <MetricTitle>Distancia</MetricTitle>
            <MetricValue color={zonaActual.color}>
              {distanciaDesdeReferencia < 1 ? 
                Math.round(distanciaDesdeReferencia * 1000) : 
                distanciaDesdeReferencia.toFixed(2)}
              <MetricUnit>{distanciaDesdeReferencia < 1 ? ' m' : ' km'}</MetricUnit>
            </MetricValue>
            <Text style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>
              Desde casa
            </Text>
          </MetricCard>

          <MetricCard>
            <MetricTitle>Precisión GPS</MetricTitle>
            <MetricValue color="#28a745">
              {ubicacionData.precision}
              <MetricUnit>%</MetricUnit>
            </MetricValue>
            <Text style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>
              Señal satélite
            </Text>
          </MetricCard>
        </MetricsGrid>

        {/* MAPA PRINCIPAL */}
        <InfoSection>
          <SectionTitle>🗺️ Mapa de Ubicación</SectionTitle>
        </InfoSection>
        
        <MapContainer style={{ height: 350, marginBottom: 20 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: ubicacionData.latitud,
              longitude: ubicacionData.longitud,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            region={{
              latitude: ubicacionData.latitud,
              longitude: ubicacionData.longitud,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            mapType="standard"
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
          >
            {/* Marcador de la mascota */}
            <Marker
              coordinate={{
                latitude: ubicacionData.latitud,
                longitude: ubicacionData.longitud,
              }}
              title="🐕 Tu mascota"
              description={`${zonaActual.texto} • ${ubicacionData.estado}`}
              pinColor="#42a8a1"
            />

            {/* Círculo de precisión */}
            <Circle
              center={{
                latitude: ubicacionData.latitud,
                longitude: ubicacionData.longitud,
              }}
              radius={20}
              fillColor="rgba(66, 168, 161, 0.25)"
              strokeColor="rgba(66, 168, 161, 0.8)"
              strokeWidth={2}
            />

            {/* Marcador de referencia (casa) */}
            <Marker
              coordinate={{
                latitude: coordenadasReferencia.lat,
                longitude: coordenadasReferencia.lng,
              }}
              title="🏠 Casa"
              description="Punto de referencia"
              pinColor="#fd7e14"
            />
          </MapView>
        </MapContainer>

        {/* BOTONES DE ACCIÓN */}
        <ActionButtonsContainer>
          <ActionButton onPress={abrirEnGoogleMaps}>
            <StatusIcon style={{ fontSize: 18 }}>🗺️</StatusIcon>
            <ActionButtonText>Google Maps</ActionButtonText>
          </ActionButton>

          <ActionButton onPress={copiarCoordenadas}>
            <StatusIcon style={{ fontSize: 18 }}>📋</StatusIcon>
            <ActionButtonText>Coordenadas</ActionButtonText>
          </ActionButton>
        </ActionButtonsContainer>

        {/* INFORMACIÓN TÉCNICA */}
        <InfoSection>
          <SectionTitle>ℹ️ Información Técnica</SectionTitle>
          <View style={{ 
            backgroundColor: '#fff', 
            padding: 15, 
            borderRadius: 12, 
            marginTop: 15,
            elevation: 1
          }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#212529', marginBottom: 4 }}>
                Actualización GPS
              </Text>
              <Text style={{ fontSize: 13, color: '#6c757d' }}>
                El collar actualiza la ubicación cada 30 segundos cuando está activo
              </Text>
            </View>
            
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#212529', marginBottom: 4 }}>
                Precisión de Señal
              </Text>
              <Text style={{ fontSize: 13, color: '#6c757d' }}>
                La precisión puede variar según la disponibilidad de satélites y obstáculos
              </Text>
            </View>
            
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#212529', marginBottom: 4 }}>
                Radio de Precisión
              </Text>
              <Text style={{ fontSize: 13, color: '#6c757d' }}>
                ±20 metros en condiciones normales
              </Text>
            </View>
          </View>
        </InfoSection>
      </Container>
    </ScrollView>
  );
};

export default CollarLocationScreen;