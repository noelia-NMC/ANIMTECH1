// src/screens/ClinicasMapScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, Modal, Linking, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { getOSMNearbyClinicas } from '../services/clinicaService';
import styles from '../styles/ClinicasMapScreenStyles';
import { mapStyle } from '../styles/mapStyle';

const FILTROS = {
  CERCANOS: 2000,
  NORMALES: 5000,
  LEJANOS: 10000,
};

export default function ClinicasMapScreen({ navigation }) {
  // ============ LÓGICA Y ESTADOS (100% INTACTOS) ============
  const [location, setLocation] = useState(null);
  const [clinicas, setClinicas] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [radioSeleccionado, setRadioSeleccionado] = useState(FILTROS.NORMALES);
  const [clinicaSeleccionada, setClinicaSeleccionada] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        Alert.alert('Permiso Denegado', 'AnimTech necesita acceso a tu ubicación para mostrarte clínicas cercanas.');
        setLoading(false);
        return;
      }
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener la ubicación.');
        setLoading(false);
      }
    })();
  }, []); 

  useEffect(() => {
    if (location) {
      cargarClinicas(location);
    }
  }, [location, radioSeleccionado]);

  const cargarClinicas = async (coords) => {
    setLoading(true);
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
    const R = 6371e3; const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1); const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  
  // ====================================================================

  // ===== RENDERIZADO VISUAL CON LA NUEVA DISPOSICIÓN DE CONTROLES =====

  const abrirTelefono = (numero) => Linking.openURL(`tel:${numero}`);
  const abrirWeb = (url) => Linking.openURL(url.startsWith('http') ? url : `https://${url}`);

  const renderFiltro = (label, valor) => (
    <TouchableOpacity
      onPress={() => setRadioSeleccionado(valor)}
      style={[styles.filtroBtn, radioSeleccionado === valor && styles.filtroActivo]}
    >
      <Text style={[styles.filtroTxt, radioSeleccionado === valor && styles.filtroTxtActivo]}>{label}</Text>
    </TouchableOpacity>
  );
  
  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        customMapStyle={mapStyle}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false} // Desactivamos el botón nativo para tener control total del diseño
      >
        {clinicas.map((clinica) => (
          <Marker
            key={clinica.id}
            coordinate={{ latitude: clinica.latitude, longitude: clinica.longitude }}
            pinColor="#2d6e68"
          >
            <Callout style={styles.callout} tooltip={Platform.OS === 'ios'} onPress={() => setClinicaSeleccionada(clinica)}>
                <View style={{padding: 10, backgroundColor: 'white', borderRadius: 12}}>
                    <Text style={styles.calloutTitle} numberOfLines={1}>{clinica.nombre}</Text>
                    <Text style={styles.calloutDescription} numberOfLines={1}>{clinica.direccion || 'Toca para ver detalles'}</Text>
                    <Text style={styles.calloutActionText}>Ver más</Text>
                </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {/* Controles flotantes en la parte superior */}
      <View style={styles.headerControls}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.filtros}>
            {renderFiltro('Cercanos', FILTROS.CERCANOS)}
            {renderFiltro('Normales', FILTROS.NORMALES)}
            {renderFiltro('Lejanos', FILTROS.LEJANOS)}
          </View>
      </View>

      {/* Panel inferior compacto y con scroll interno */}
      <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.listHeader}>
            {loading ? 'Buscando...' : `${clinicas.length} Clínicas Encontradas`}
          </Text>
          {loading ? (
             <ActivityIndicator size="small" color="#42a8a1" style={{padding: 20}} />
          ) : (
            <FlatList
                data={clinicas}
                keyExtractor={item => item.id.toString()}
                style={styles.lista}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => setClinicaSeleccionada(item)}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="storefront-outline" size={22} color="#42a8a1"/>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
                        <Text style={styles.dato} numberOfLines={1}>{item.direccion}</Text>
                    </View>
                </TouchableOpacity>
                )}
            />
          )}
      </View>

      {/* Modal sin cambios */}
      <Modal visible={!!clinicaSeleccionada} transparent animationType="fade" onRequestClose={() => setClinicaSeleccionada(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{clinicaSeleccionada?.nombre}</Text>
            {clinicaSeleccionada?.direccion && <View style={styles.linkContainer}><Ionicons name="location-outline" size={22} color="#4b5563"/><Text style={[styles.dato, {marginLeft: 8, flex: 1}]}>{clinicaSeleccionada.direccion}</Text></View>}
            {clinicaSeleccionada?.telefono && <TouchableOpacity style={styles.linkContainer} onPress={() => abrirTelefono(clinicaSeleccionada.telefono)}><Ionicons name="call-outline" size={22} color="#4b5563" /><Text style={styles.link}>Llamar a la clínica</Text></TouchableOpacity>}
            {clinicaSeleccionada?.website && <TouchableOpacity style={styles.linkContainer} onPress={() => abrirWeb(clinicaSeleccionada.website)}><Ionicons name="globe-outline" size={22} color="#4b5563" /><Text style={styles.link}>Visitar sitio web</Text></TouchableOpacity>}
            <TouchableOpacity onPress={() => setClinicaSeleccionada(null)} style={styles.cerrarBtn}><Text style={styles.cerrarTxt}>Cerrar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}