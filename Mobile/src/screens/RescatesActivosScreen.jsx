import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View, ScrollView, Linking } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import getDirections from 'react-native-google-maps-directions';
import {
  Container,
  StyledMap,
  InfoBox,
  DescriptionText,
  AcceptButton,
  DeclineButton,
  ButtonText,
  Title,
  RescatesList,
  RescateItem,
  RescateDescription,
  ButtonsContainer,
  NoRescatesText
} from '../styles/RescatesActivosStyles';

const RescatesActivosScreen = () => {
  const [rescates, setRescates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRescate, setSelectedRescate] = useState(null);
  const [acceptedRescateId, setAcceptedRescateId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const rescatesRef = ref(db, 'rescates');
    const unsubscribe = onValue(rescatesRef, (snapshot) => {
      const data = snapshot.val();
      const lista = [];

      if (data) {
        Object.entries(data).forEach(([id, rescate]) => {
          if (rescate.estado === 'pendiente' || id === acceptedRescateId) {
            lista.push({ 
              id, 
              ...rescate,
              fecha: rescate.fecha ? new Date(
                typeof rescate.fecha === 'object' && rescate.fecha.seconds ? 
                rescate.fecha.seconds * 1000 : 
                rescate.fecha
              ).toLocaleString() : 'Fecha no disponible'
            });
          }
        });
      }

      setRescates(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [acceptedRescateId]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    })();
  }, []);

  const handleAceptarRescate = async (id) => {
    try {
      await update(ref(db, `rescates/${id}`), {
        estado: 'asignado',
        ayudante: 'usuario_demo'
      });
      setAcceptedRescateId(id);
      Alert.alert('✅ Confirmado', 'Has aceptado este rescate.');
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo aceptar el rescate.');
      console.error(error);
    }
  };

  const handleAbrirOpciones = (rescate) => {
    Alert.alert(
      'Opciones de ayuda',
      '¿Cómo deseas proceder?',
      [
        {
          text: 'Ir con Google Maps',
          onPress: () => abrirEnGoogleMaps(rescate)
        },
        {
          text: 'Guiarme desde la app',
          onPress: () => setSelectedRescate(rescate)
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const abrirEnGoogleMaps = (rescate) => {
    const { lat, lng } = rescate.ubicacion;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);

    // Eliminar pin después de salir
    update(ref(db, `rescates/${rescate.id}`), {
      estado: 'resuelto'
    });
    setSelectedRescate(null);
  };

  const handleRechazarRescate = () => {
    Alert.alert('Entendido', 'Gracias por tu sinceridad.');
    setSelectedRescate(null);
  };

  if (loading || !userLocation) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#42a8a1" style={{ marginTop: 100 }} />
      </Container>
    );
  }

  return (
    <Container>
      <Title>Rescates Activos ({rescates.length})</Title>

      <StyledMap
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {rescates.map((rescate) => (
          <Marker
            key={rescate.id}
            coordinate={{
              latitude: rescate.ubicacion.lat,
              longitude: rescate.ubicacion.lng,
            }}
            pinColor={rescates.estado === 'asignado' ? 'blue' : 'orange'}
            onPress={() => {
              if (rescates.estado === 'asignado') handleAbrirOpciones(rescate);
              else setSelectedRescate(rescate);
            }}
          />
        ))}

        {selectedRescate && (
          <Polyline
            coordinates={[
              { latitude: userLocation.latitude, longitude: userLocation.longitude },
              { latitude: selectedRescate.ubicacion.lat, longitude: selectedRescate.ubicacion.lng }
            ]}
            strokeWidth={4}
            strokeColor="#42a8a1"
          />
        )}
      </StyledMap>

      {selectedRescate && (
        <InfoBox>
          <DescriptionText>{selectedRescate.descripcion}</DescriptionText>
          <DescriptionText>Fecha: {selectedRescate.fecha}</DescriptionText>
          <ButtonsContainer>
            <AcceptButton onPress={() => handleAbrirOpciones(selectedRescate)}>
              <ButtonText>Yo puedo ayudar</ButtonText>
            </AcceptButton>
            <DeclineButton onPress={handleRechazarRescate}>
              <ButtonText>No puedo</ButtonText>
            </DeclineButton>
          </ButtonsContainer>
        </InfoBox>
      )}

      <RescatesList>
        <ScrollView>
          {rescates.length > 0 ? (
            rescates.map(rescate => (
              <RescateItem key={rescate.id} onPress={() => setSelectedRescate(rescate)}>
                <RescateDescription>
                  {rescate.descripcion.length > 60 
                    ? rescate.descripcion.substring(0, 60) + '...' 
                    : rescate.descripcion}
                </RescateDescription>
              </RescateItem>
            ))
          ) : (
            <NoRescatesText>No hay rescates activos en este momento</NoRescatesText>
          )}
        </ScrollView>
      </RescatesList>
    </Container>
  );
};

export default RescatesActivosScreen;