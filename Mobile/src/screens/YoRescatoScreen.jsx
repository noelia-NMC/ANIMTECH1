import React, { useEffect, useState } from 'react';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import {
  Container, StyledMap, Input, Button, ButtonText, LoadingText
} from '../styles/YoRescatoStyles';
import { Alert } from 'react-native';

const fallbackRegion = {
  latitude: -17.3935,     
  longitude: -66.1570,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const YoRescatoScreen = () => {
  const [region, setRegion] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
          setRegion(fallbackRegion); 
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 8000,
        });

        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.warn('Error al obtener ubicación:', error);
        Alert.alert('Ubicación no disponible', 'Mostrando mapa general por defecto.');
        setRegion(fallbackRegion);
      }
    })();
  }, []);

  const handlePublicar = async () => {
    if (!description.trim()) {
      Alert.alert('Falta descripción', 'Por favor escribe una descripción.');
      return;
    }

    try {
      await push(ref(db, 'rescates'), {
        descripcion: description,
        ubicacion: {
          lat: region.latitude,
          lng: region.longitude,
        },
        fecha: serverTimestamp(),
        estado: 'pendiente',
        ayudante: null,
      });

      Alert.alert('¡Rescate publicado!', 'Gracias por reportar. Esperemos que alguien pueda ayudar.');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el rescate.');
      console.error(error);
    }
  };

  if (!region) {
    return (
      <Container>
        <LoadingText>Cargando mapa...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <StyledMap region={region} onRegionChangeComplete={setRegion}>
        <Marker coordinate={region} />
      </StyledMap>

      <Input
        placeholder="Describe la situación del animal..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button onPress={handlePublicar}>
        <ButtonText>📍 Publicar Rescate</ButtonText>
      </Button>
    </Container>
  );
};

export default YoRescatoScreen;
