// src/screens/ClinicasMapScreen.jsx

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  View, Text, ActivityIndicator, TouchableOpacity, FlatList,
  Linking, Alert, AppState, Dimensions, PanResponder, Animated 
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Callout, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import { getOSMNearbyClinicas, preloadClinicas, clearClinicasCache } from '../../services/clinicaService';
import styles from '../../styles/ClinicasMapScreenStyles';
import { mapStyle } from '../../styles/mapStyle';

const FILTROS = {
  CERCANOS: 2000,
  NORMALES: 5000,
  LEJANOS: 10000,
};

const TRANSPORT_MODES = {
  'driving': { 
    icon: 'car', 
    label: 'Auto', 
    color: '#3b82f6', 
    osrmUrl: 'https://router.project-osrm.org/route/v1/driving',
    lineDashPattern: null
  },
  'walking': { 
    icon: 'walk', 
    label: 'Caminar', 
    color: '#10b981', 
    osrmUrl: 'https://router.project-osrm.org/route/v1/foot',
    lineDashPattern: [10, 10]
  },
  'cycling': { 
    icon: 'bicycle', 
    label: 'Bicicleta', 
    color: '#f59e0b', 
    osrmUrl: 'https://router.project-osrm.org/route/v1/bike',
    lineDashPattern: null
  },
  'motorcycle': { 
    icon: 'flash', 
    label: 'Moto', 
    color: '#8b5cf6', 
    osrmUrl: 'https://router.project-osrm.org/route/v1/driving',
    lineDashPattern: null
  }
};

const { height: screenHeight } = Dimensions.get('window');

export default function ClinicasMapScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const appState = useRef(AppState.currentState);
  const loadingTimeoutRef = useRef(null);
  const mapRef = useRef(null);
  
  // ✅ REF SIMPLIFICADO - solo lo necesario
  const lastPressTime = useRef(0);
  const isProcessingSelection = useRef(false);

  // Estados principales
  const [location, setLocation] = useState(null);
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radioSeleccionado, setRadioSeleccionado] = useState(FILTROS.NORMALES);
  const [clinicaSeleccionada, setClinicaSeleccionada] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [showDirections, setShowDirections] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState('driving');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  
  // ✅ Panel heights FIJOS para evitar bugs
  const collapsedHeight = 80;
  const normalHeight = screenHeight * 0.4;
  const expandedHeight = screenHeight * 0.75;

  const [panelHeight] = useState(new Animated.Value(normalHeight));
  const [panelState, setPanelState] = useState('normal');
  // ✅ REMOVIDO: isPanelAnimating - simplificado

  // ✅ GESTOS SIMPLIFICADOS Y RÁPIDOS
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // ✅ MÁS SIMPLE para que funcione mejor
      return Math.abs(gestureState.dy) > 15 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    },
    onPanResponderGrant: () => {
      panelHeight.setOffset(panelHeight._value);
      panelHeight.setValue(0);
    },
    onPanResponderMove: (evt, gestureState) => {
      // ✅ SIN RESTRICCIONES - más fluido
      panelHeight.setValue(-gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      panelHeight.flattenOffset();
      const velocity = gestureState.vy;
      const displacement = gestureState.dy;
      
      // ✅ LÓGICA SIMPLE Y RÁPIDA
      if (velocity > 0.5 || displacement > 60) {
        // Contraer
        animateToHeight(collapsedHeight, 'collapsed');
      } else if (velocity < -0.5 || displacement < -60) {
        // Expandir
        animateToHeight(expandedHeight, 'expanded');
      } else {
        // Normal
        animateToHeight(normalHeight, 'normal');
      }
    },
  });

  // ✅ ANIMACIÓN RÁPIDA Y FLUIDA
  const animateToHeight = (height, state) => {
    Animated.spring(panelHeight, {
      toValue: height,
      useNativeDriver: false,
      tension: 120,  // ✅ MÁS RÁPIDO
      friction: 8,   // ✅ MENOS FRICCIÓN
    }).start();
    setPanelState(state);
  };

  // ✅ FUNCIÓN DE RUTAS COMPLETAMENTE CORREGIDA
  const getRoute = async (destinationLat, destinationLng, transportMode = 'driving') => {
    if (!location || loadingRoute) {
      return;
    }

    // ✅ Prevenir múltiples llamadas
    if (isProcessingSelection.current) {
      return;
    }

    setLoadingRoute(true);
    console.log(`🗺️ Calculando ruta ${transportMode}...`);
    
    try {
      const modeConfig = TRANSPORT_MODES[transportMode];
      if (!modeConfig) {
        throw new Error('Modo de transporte no válido');
      }

      // ✅ COORDENADAS CORREGIDAS - usar ubicación ACTUAL
      const currentLat = location.latitude;
      const currentLng = location.longitude;
      
      const url = `${modeConfig.osrmUrl}/${currentLng},${currentLat};${destinationLng},${destinationLat}`;
      
      const response = await axios.get(url, {
        params: {
          overview: 'full',
          geometries: 'geojson',
          steps: 'true'
        },
        timeout: 20000
      });

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        
        if (!route.geometry || !route.geometry.coordinates) {
          throw new Error('Ruta sin coordenadas válidas');
        }

        const coordinates = route.geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0]
        }));

        if (coordinates.length === 0) {
          throw new Error('No se pudieron procesar las coordenadas de la ruta');
        }

        // ✅ VERIFICAR que la ruta empiece desde mi ubicación
        const firstPoint = coordinates[0];
        const distanceFromStart = calcularDistancia(
          currentLat, currentLng, 
          firstPoint.latitude, firstPoint.longitude
        );
        
        // Si la ruta no empieza cerca de mi ubicación, agregar punto inicial
        if (distanceFromStart > 100) { // 100 metros de tolerancia
          coordinates.unshift({
            latitude: currentLat,
            longitude: currentLng
          });
        }

        const distance = (route.distance / 1000).toFixed(1);
        
        setRouteCoordinates(coordinates);
        setRouteInfo({
          distance: `${distance} km`,
          mode: transportMode
        });
        setShowDirections(true);

        // ✅ Ajustar vista del mapa CORRECTAMENTE
        const allCoords = [
          { latitude: currentLat, longitude: currentLng },
          { latitude: destinationLat, longitude: destinationLng },
          ...coordinates
        ];
        
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(allCoords, {
              edgePadding: { 
                top: 160, 
                right: 80, 
                bottom: panelState === 'collapsed' ? 180 : 450, 
                left: 80 
              },
              animated: true
            });
          }
        }, 800);

        console.log(`✅ Ruta ${transportMode}: ${distance} km`);
      } else {
        throw new Error('No se encontró una ruta disponible');
      }

    } catch (error) {
      console.error('Error obteniendo ruta:', error);
      const modeLabel = TRANSPORT_MODES[transportMode]?.label || transportMode;
      Alert.alert(
        'Error de ruta', 
        `No se pudo calcular la ruta para ${modeLabel.toLowerCase()}.\n\nVerifica tu conexión e intenta nuevamente.`
      );
    } finally {
      setLoadingRoute(false);
    }
  };

  // ✅ UBICACIÓN con mejor precisión
  useEffect(() => {
    let isMounted = true;

    const getLocationWithTimeout = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setNetworkError(false);

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'AnimTech necesita acceso a tu ubicación para mostrarte clínicas cercanas.');
          setLoading(false);
          return;
        }

        // ✅ Obtener ubicación MÁS PRECISA
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          maximumAge: 10000,
          timeout: 15000,
        });

        if (isMounted) {
          setLocation(currentLocation.coords);
          console.log('📍 Ubicación obtenida:', currentLocation.coords.latitude, currentLocation.coords.longitude);
        }

      } catch (error) {
        if (isMounted) {
          console.error('Error obteniendo ubicación:', error);
          
          // ✅ Fallback con menor precisión
          try {
            const fallbackLocation = await Location.getLastKnownPositionAsync({
              maxAge: 60000,
              requiredAccuracy: 1000,
            });
            
            if (fallbackLocation && isMounted) {
              setLocation(fallbackLocation.coords);
              console.log('📍 Ubicación fallback:', fallbackLocation.coords.latitude, fallbackLocation.coords.longitude);
            }
          } catch (fallbackError) {
            Alert.alert('Error', 'No se pudo obtener la ubicación.');
            setLoading(false);
            setNetworkError(true);
          }
        }
      }
    };

    getLocationWithTimeout();

    return () => {
      isMounted = false;
    };
  }, []); 

  // Carga de clínicas
  const cargarClinicas = useCallback(async (coords) => {
    if (!coords) return;

    setLoading(true);
    setNetworkError(false);

    try {
      console.log('🏥 Cargando clínicas...');
      const data = await getOSMNearbyClinicas(coords.latitude, coords.longitude);
      
      const filtradas = data.filter(c => 
        calcularDistancia(coords.latitude, coords.longitude, c.latitude, c.longitude) <= radioSeleccionado
      );
      
      setClinicas(filtradas);
      setInitialLoad(false);
      console.log(`✅ ${filtradas.length} clínicas cargadas`);

    } catch (err) {
      console.error('Error cargando clínicas:', err);
      setNetworkError(true);
      
      if (!initialLoad) {
        Alert.alert('Error de conexión', 'Verifica tu conexión a internet e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  }, [radioSeleccionado, initialLoad]);

  useEffect(() => {
    if (location) {
      cargarClinicas(location);
    }
  }, [location, cargarClinicas]);

  // ✅ LIMPIEZA SIMPLIFICADA
  useFocusEffect(
    useCallback(() => {
      if (location && !initialLoad) {
        preloadClinicas(location.latitude, location.longitude);
      }
      
      // Limpiar al salir
      return () => {
        console.log('🧹 Limpiando estado');
        setClinicaSeleccionada(null);
        setShowDirections(false);
        setRouteCoordinates([]);
        setRouteInfo(null);
        setSelectedTransport('driving');
        setPanelState('normal');
        panelHeight.setValue(normalHeight);
      };
    }, [location, initialLoad])
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (location && !loading) {
          console.log('📱 App volvió al primer plano');
          cargarClinicas(location);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [location, loading, cargarClinicas]);

  // Funciones auxiliares
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1); 
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  
  const abrirTelefono = (numero) => {
    // ✅ Prevenir múltiples llamadas
    const now = Date.now();
    if (now - lastPressTime.current < 2000) return;
    lastPressTime.current = now;
    
    Linking.openURL(`tel:${numero}`);
  };

  const toggleMapType = () => {
    // ✅ Prevenir múltiples cambios
    const now = Date.now();
    if (now - lastPressTime.current < 1000) return;
    lastPressTime.current = now;
    
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const togglePanel = () => {
    // ✅ SIMPLE Y RÁPIDO
    if (panelState === 'collapsed') {
      animateToHeight(normalHeight, 'normal');
    } else {
      animateToHeight(collapsedHeight, 'collapsed');
    }
  };

  const clearRoute = () => {
    setShowDirections(false);
    setRouteCoordinates([]);
    setRouteInfo(null);
  };

  // ✅ FUNCIÓN SIMPLIFICADA Y RÁPIDA
  const onMarkerPress = (clinica) => {
    console.log('📍 Pin presionado:', clinica.nombre);
    
    // ✅ SIMPLE - solo prevenir spam
    const now = Date.now();
    if (now - lastPressTime.current < 500) return;
    lastPressTime.current = now;
    
    // ✅ Seleccionar clínica
    setClinicaSeleccionada(clinica);
    
    // ✅ Expandir panel si está colapsado
    if (panelState === 'collapsed') {
      animateToHeight(normalHeight, 'normal');
    }
    
    // ✅ Limpiar ruta anterior
    if (showDirections) {
      clearRoute();
    }
  };

  const renderFiltro = (label, valor) => (
    <TouchableOpacity
      key={valor}
      onPress={() => {
        setRadioSeleccionado(valor);
        setClinicaSeleccionada(null);
        clearRoute();
      }}
      style={[styles.filtroBtn, radioSeleccionado === valor && styles.filtroActivo]}
      activeOpacity={0.7}
    >
      <Text style={[styles.filtroTxt, radioSeleccionado === valor && styles.filtroTxtActivo]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTransportMode = (mode, config) => (
    <TouchableOpacity
      key={mode}
      onPress={() => {
        // ✅ Prevenir múltiples presiones
        const now = Date.now();
        if (now - lastPressTime.current < 1000) return;
        lastPressTime.current = now;
        
        if (loadingRoute) return;
        
        setSelectedTransport(mode);
        if (clinicaSeleccionada) {
          getRoute(clinicaSeleccionada.latitude, clinicaSeleccionada.longitude, mode);
        }
      }}
      style={[
        styles.transportBtn, 
        selectedTransport === mode && { 
          backgroundColor: config.color,
          borderColor: config.color 
        }
      ]}
      disabled={loadingRoute}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={config.icon} 
        size={18} 
        color={selectedTransport === mode ? '#ffffff' : config.color} 
      />
      <Text style={[
        styles.transportText,
        selectedTransport === mode && { color: '#ffffff' }
      ]}>
        {config.label}
      </Text>
    </TouchableOpacity>
  );

  const reintentar = () => {
    // ✅ Prevenir múltiples intentos
    const now = Date.now();
    if (now - lastPressTime.current < 2000) return;
    lastPressTime.current = now;
    
    setNetworkError(false);
    if (location) {
      cargarClinicas(location);
    }
  };

  if (!location || (loading && initialLoad)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={styles.loadingText}>
          {!location ? 'Obteniendo tu ubicación...' : 'Cargando clínicas cercanas...'}
        </Text>
        {networkError && (
          <TouchableOpacity style={styles.retryButton} onPress={reintentar}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        mapType={mapType}
        customMapStyle={mapType === 'standard' ? mapStyle : undefined}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        showsCompass={false}
        loadingEnabled={true}
        loadingIndicatorColor="#42a8a1"
        loadingBackgroundColor="#f4f7f9"
        onPress={() => {
          // ✅ SIMPLE - limpiar selección
          if (clinicaSeleccionada && !showDirections) {
            setClinicaSeleccionada(null);
          }
        }}
      >
        {/* ✅ Marcadores optimizados */}
        {clinicas.map((clinica) => (
          <Marker
            key={clinica.id}
            coordinate={{ latitude: clinica.latitude, longitude: clinica.longitude }}
            pinColor={clinicaSeleccionada?.id === clinica.id ? "#f59e0b" : "#2d6e68"}
            onPress={() => onMarkerPress(clinica)}
          >
            <Callout 
              style={styles.callout}
              onPress={() => onMarkerPress(clinica)}
            >
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle} numberOfLines={1}>
                  {clinica.nombre}
                </Text>
                <Text style={styles.calloutDescription} numberOfLines={1}>
                  {clinica.direccion || 'Sin dirección'}
                </Text>
                {clinica.telefono && (
                  <Text style={styles.calloutPhone}>
                    📞 {clinica.telefono}
                  </Text>
                )}
                <Text style={styles.calloutActionText}>Ver en listado ↓</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* ✅ Ruta CORREGIDA que empieza desde ubicación real */}
        {showDirections && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={TRANSPORT_MODES[selectedTransport]?.color || '#3b82f6'}
            strokeWidth={6}
            strokeOpacity={0.9}
            lineDashPattern={TRANSPORT_MODES[selectedTransport]?.lineDashPattern || null}
          />
        )}
      </MapView>
      
      {/* ✅ Controles superiores */}
      <View style={[styles.headerControls, { top: insets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.rightControls}>
          <TouchableOpacity 
            onPress={toggleMapType} 
            style={styles.mapTypeButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={mapType === 'standard' ? 'globe' : 'map'} 
              size={20} 
              color="#333" 
            />
            <Text style={styles.mapTypeText}>
              {mapType === 'standard' ? 'Satélite' : 'Mapa'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.filtros}>
            {renderFiltro('Cerca', FILTROS.CERCANOS)}
            {renderFiltro('Normal', FILTROS.NORMALES)}
            {renderFiltro('Lejos', FILTROS.LEJANOS)}
          </View>
        </View>
      </View>

      {/* ✅ Panel IMPECABLE */}
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { 
            height: panelHeight,
            paddingBottom: Math.max(insets.bottom, 10)
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandle} />
        
        <View style={styles.headerRow}>
          <Text style={styles.listHeader}>
            {loading ? 'Buscando...' : 
             clinicaSeleccionada ? 
             clinicaSeleccionada.nombre : 
             `${clinicas.length} clínicas encontradas`}
          </Text>
          
          <TouchableOpacity 
            style={styles.togglePanelButton}
            onPress={togglePanel}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={panelState === 'collapsed' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#42a8a1" 
            />
          </TouchableOpacity>
          
          {networkError && (
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={reintentar}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={20} color="#42a8a1" />
            </TouchableOpacity>
          )}
          
          {showDirections && (
            <TouchableOpacity 
              style={styles.clearRouteButton} 
              onPress={clearRoute}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>

        {/* ✅ Información de clínica seleccionada */}
        {clinicaSeleccionada && panelState !== 'collapsed' && (
          <View style={styles.selectedClinicaContainer}>
            <View style={styles.selectedClinicaInfo}>
              <Text style={styles.selectedClinicaName}>
                📍 {clinicaSeleccionada.nombre}
              </Text>
              <Text style={styles.selectedClinicaAddress}>
                {clinicaSeleccionada.direccion || 'Sin dirección especificada'}
              </Text>
              {clinicaSeleccionada.telefono && (
                <TouchableOpacity 
                  onPress={() => abrirTelefono(clinicaSeleccionada.telefono)}
                  style={styles.phoneContainer}
                  activeOpacity={0.7}
                >
                  <Ionicons name="call" size={16} color="#10b981" />
                  <Text style={styles.phoneText}>{clinicaSeleccionada.telefono}</Text>
                </TouchableOpacity>
              )}
              {routeInfo && (
                <View style={styles.routeInfoContainer}>
                  <Text style={styles.routeInfoText}>
                    📍 {routeInfo.distance}
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={styles.transportLabel}>¿Cómo quieres llegar?</Text>
            <View style={styles.transportModes}>
              {Object.entries(TRANSPORT_MODES).map(([mode, config]) => 
                renderTransportMode(mode, config)
              )}
            </View>
            
            {loadingRoute && (
              <View style={styles.loadingRouteContainer}>
                <ActivityIndicator size="small" color="#42a8a1" />
                <Text style={styles.loadingRouteText}>
                  Calculando ruta {TRANSPORT_MODES[selectedTransport]?.label.toLowerCase()}...
                </Text>
              </View>
            )}
          </View>
        )}
        
        {/* ✅ Lista PERFECTA sin duplicaciones */}
        {panelState !== 'collapsed' && (
          <>
            {loading ? (
              <ActivityIndicator size="small" color="#42a8a1" style={styles.loadingIndicator} />
            ) : networkError && clinicas.length === 0 ? (
              <View style={styles.errorContainer}>
                <Ionicons name="wifi-off" size={32} color="#9ca3af" />
                <Text style={styles.errorText}>Error de conexión</Text>
                <TouchableOpacity 
                  style={styles.retryButton} 
                  onPress={reintentar}
                  activeOpacity={0.7}
                >
                  <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={clinicas}
                keyExtractor={item => item.id.toString()}
                style={styles.lista}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                // ✅ REMOVIDO: getItemLayout para más velocidad
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[
                      styles.card,
                      clinicaSeleccionada?.id === item.id && styles.cardSelected
                    ]} 
                    onPress={() => onMarkerPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons 
                        name={clinicaSeleccionada?.id === item.id ? "location" : "storefront-outline"} 
                        size={22} 
                        color="#42a8a1"
                      />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.nombre} numberOfLines={1}>
                        {item.nombre}
                      </Text>
                      <Text style={styles.dato} numberOfLines={1}>
                        {item.direccion || 'Sin dirección'}
                      </Text>
                      {item.telefono && (
                        <TouchableOpacity 
                          onPress={() => abrirTelefono(item.telefono)}
                          style={styles.telefonoContainer}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="call" size={12} color="#10b981" />
                          <Text style={styles.telefono}>{item.telefono}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.routeIconButton}
                      onPress={() => {
                        if (clinicaSeleccionada?.id !== item.id) {
                          onMarkerPress(item);
                        }
                        setTimeout(() => {
                          getRoute(item.latitude, item.longitude, selectedTransport);
                        }, 200);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="navigate" size={20} color="#42a8a1" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
}