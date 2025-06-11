import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, Modal, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { getOSMNearbyClinicas } from '../services/clinicaService';
import styles from '../styles/ClinicasMapScreenStyles';

const FILTROS = {
  CERCANOS: 2000,
  NORMALES: 5000,
  LEJANOS: 10000,
};

export default function ClinicasMapScreen() {
  const [location, setLocation] = useState(null);
  const [clinicas, setClinicas] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [radioSeleccionado, setRadioSeleccionado] = useState(FILTROS.CERCANOS);
  const [clinicaSeleccionada, setClinicaSeleccionada] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      cargarClinicas(currentLocation.coords);
    })();
  }, [radioSeleccionado]);

  const cargarClinicas = async (coords) => {
    try {
      const data = await getOSMNearbyClinicas(coords.latitude, coords.longitude);
      const filtradas = data.filter(c => calcularDistancia(coords.latitude, coords.longitude, c.latitude, c.longitude) <= radioSeleccionado);
      setClinicas(filtradas);
    } catch (err) {
      setErrorMsg('No se pudo cargar clínicas.');
    } finally {
      setLoading(false);
    }
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const renderFiltro = (label, valor) => (
    <TouchableOpacity
      onPress={() => setRadioSeleccionado(valor)}
      style={[styles.filtroBtn, radioSeleccionado === valor && styles.filtroActivo]}
    >
      <Text style={styles.filtroTxt}>{label}</Text>
    </TouchableOpacity>
  );

  const abrirTelefono = (numero) => {
    Linking.openURL(`tel:${numero}`);
  };

  const abrirWeb = (url) => {
    Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
  };

  if (loading || !location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando mapa y clínicas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {clinicas.map((clinica) => (
          <Marker
            key={clinica.id}
            coordinate={{ latitude: clinica.latitude, longitude: clinica.longitude }}
            title={clinica.nombre}
            description={clinica.direccion || 'Sin dirección'}
            onPress={() => setClinicaSeleccionada(clinica)}
          />
        ))}
      </MapView>

      <View style={styles.filtros}>
        {renderFiltro('Cercanos', FILTROS.CERCANOS)}
        {renderFiltro('Normales', FILTROS.NORMALES)}
        {renderFiltro('Lejanos', FILTROS.LEJANOS)}
      </View>

      <FlatList
        data={clinicas}
        keyExtractor={item => item.id.toString()}
        style={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setClinicaSeleccionada(item)}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            {item.direccion && <Text style={styles.dato}>📍 {item.direccion}</Text>}
            {item.telefono && <Text style={styles.dato}>📞 {item.telefono}</Text>}
          </TouchableOpacity>
        )}
      />

      {/* Modal con detalle */}
      <Modal visible={!!clinicaSeleccionada} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{clinicaSeleccionada?.nombre}</Text>
            {clinicaSeleccionada?.direccion && <Text style={styles.dato}>📍 {clinicaSeleccionada.direccion}</Text>}
            {clinicaSeleccionada?.telefono && (
              <TouchableOpacity onPress={() => abrirTelefono(clinicaSeleccionada.telefono)}>
                <Text style={styles.link}>📞 Llamar</Text>
              </TouchableOpacity>
            )}
            {clinicaSeleccionada?.website && (
              <TouchableOpacity onPress={() => abrirWeb(clinicaSeleccionada.website)}>
                <Text style={styles.link}>🌐 Visitar sitio</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setClinicaSeleccionada(null)} style={styles.cerrarBtn}>
              <Text style={styles.cerrarTxt}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
