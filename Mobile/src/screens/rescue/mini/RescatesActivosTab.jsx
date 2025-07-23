import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ScrollView, 
  RefreshControl, 
  Alert, 
  ActivityIndicator,
  Linking,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../../config/firebaseConfig';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import {
  Container,
  MapContainer,
  StyledMap,
  ModalOverlay,
  FloatingCard,
  CloseModalButton,
  AnimalAvatar,
  AnimalInitial,
  CardContent,
  AnimalName,
  StatusChip,
  StatusText,
  DescriptionText,
  InfoRow,
  InfoIcon,
  InfoText,
  ActionButtons,
  HelpButton,
  CancelButton,
  ButtonText,
  BottomSheet,
  SheetHandle,
  SheetTitle,
  RescatesList,
  RescateCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  TimeText,
  DistanceText,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptySubtitle,
  LoadingContainer,
  LoadingText,
  TransportModes,
  TransportBtn,
  TransportText,
  RouteInfoContainer,
  RouteInfoText,
  LoadingRouteContainer,
  NavigationControls,
  NavigationButton
} from '../../../styles/RescatesStyles';

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

const RescatesActivosTab = ({ navigation, userProfile, showMapView = true }) => {
  const [rescatesActivos, setRescatesActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [rejectedRescates, setRejectedRescates] = useState(new Set());
  const [selectedRescate, setSelectedRescate] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState('driving');
  const [showDirections, setShowDirections] = useState(false);

  // Referencias
  const mapRef = useRef(null);
  const lastPressTime = useRef(0);
  const isProcessingSelection = useRef(false);

  // Obtener ubicación del usuario
  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        console.log('📍 [RescatesActivosTab] Solicitando permisos de ubicación...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          console.log('✅ Permisos concedidos, obteniendo ubicación...');
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 15000,
          });
          console.log('📍 Ubicación obtenida:', location.coords);
          setUserLocation(location.coords);
        } else {
          console.warn('⚠️ Permisos de ubicación denegados');
          setUserLocation({
            latitude: -17.3935,
            longitude: -66.1570
          });
        }
      } catch (error) {
        console.error('❌ Error obteniendo ubicación:', error);
        setUserLocation({
          latitude: -17.3935,
          longitude: -66.1570
        });
      }
    };
    obtenerUbicacion();
  }, []);

  // Escuchar rescates activos desde Firebase
  useEffect(() => {
    console.log('🔄 [RescatesActivosTab] Iniciando escucha de rescates activos...');
    const rescatesRef = ref(db, 'rescates');
    
    const unsubscribe = onValue(rescatesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📊 [RescatesActivosTab] Datos recibidos de Firebase:', data);
      
      if (data) {
        const rescatesActivosList = Object.entries(data)
          .filter(([id, rescate]) => 
            rescate.estado === 'pendiente' && 
            rescate.activo !== false &&
            !rejectedRescates.has(id)
          )
          .map(([id, rescate]) => ({ 
            id, 
            ...rescate,
            fechaOriginal: rescate.fecha
          }))
          .sort((a, b) => {
            const fechaA = a.fechaOriginal ? new Date(a.fechaOriginal) : new Date(0);
            const fechaB = b.fechaOriginal ? new Date(b.fechaOriginal) : new Date(0);
            return fechaB - fechaA; // Más recientes primero
          });

        console.log(`✅ ${rescatesActivosList.length} rescates activos encontrados`);
        setRescatesActivos(rescatesActivosList);
      } else {
        console.log('📭 No hay rescates activos en Firebase');
        setRescatesActivos([]);
      }
      
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('❌ Error escuchando rescates:', error);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [rejectedRescates]);

  // Funciones auxiliares para cálculos
  const calcularDistancia = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const getTimeAgo = useCallback((fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    const now = new Date();
    let then;
    
    if (typeof fecha === 'number') {
      then = new Date(fecha);
    } else if (typeof fecha === 'object' && fecha.seconds) {
      then = new Date(fecha.seconds * 1000);
    } else if (typeof fecha === 'string') {
      then = new Date(fecha);
    } else {
      return 'Fecha no válida';
    }
    
    if (isNaN(then.getTime())) return 'Fecha no válida';
    
    const diffInMinutes = Math.floor((now - then) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    
    const diffInDays = Math.floor(diffInMinutes / 1440);
    if (diffInDays === 1) return 'Hace 1 día';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    
    return `Hace ${Math.floor(diffInDays / 30)} meses`;
  }, []);

  const getAnimalInitial = useCallback((descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('perro') || desc.includes('cachorro')) return '🐕';
    if (desc.includes('gato') || desc.includes('gatito')) return '🐱';
    if (desc.includes('ave') || desc.includes('pájaro')) return '🐦';
    return '🐾';
  }, []);

  // Función para obtener ruta usando OSRM
  const getRoute = async (destinationLat, destinationLng, transportMode = 'driving') => {
    if (!userLocation || loadingRoute || isProcessingSelection.current) {
      return;
    }

    setLoadingRoute(true);
    console.log(`🗺️ [RescatesActivosTab] Calculando ruta ${transportMode}...`);
    
    try {
      const modeConfig = TRANSPORT_MODES[transportMode];
      if (!modeConfig) {
        throw new Error('Modo de transporte no válido');
      }

      const currentLat = userLocation.latitude;
      const currentLng = userLocation.longitude;
      
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

        // Asegurar que la ruta incluya el punto de inicio
        const firstPoint = coordinates[0];
        const distanceFromStart = calcularDistancia(
          currentLat, currentLng, 
          firstPoint.latitude, firstPoint.longitude
        );
        
        if (distanceFromStart > 0.1) { // 100 metros de tolerancia
          coordinates.unshift({
            latitude: currentLat,
            longitude: currentLng
          });
        }

        const distance = (route.distance / 1000).toFixed(1);
        const duration = Math.round(route.duration / 60);
        
        setRouteCoordinates(coordinates);
        setRouteInfo({
          distance: `${distance} km`,
          duration: `${duration} min`,
          mode: transportMode
        });
        setShowDirections(true);

        // Ajustar vista del mapa para mostrar toda la ruta
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
                bottom: 450, 
                left: 80 
              },
              animated: true
            });
          }
        }, 800);

        console.log(`✅ Ruta ${transportMode}: ${distance} km, ${duration} min`);
      } else {
        throw new Error('No se encontró una ruta disponible');
      }

    } catch (error) {
      console.error('❌ Error obteniendo ruta:', error);
      const modeLabel = TRANSPORT_MODES[transportMode]?.label || transportMode;
      Alert.alert(
        'Error de ruta', 
        `No se pudo calcular la ruta para ${modeLabel.toLowerCase()}.\n\nVerifica tu conexión e intenta nuevamente.`
      );
    } finally {
      setLoadingRoute(false);
    }
  };

  // Manejar selección de rescate
  const handleSelectRescate = async (rescate) => {
    if (isProcessingSelection.current) return;
    
    isProcessingSelection.current = true;
    console.log('🎯 [RescatesActivosTab] Rescate seleccionado:', rescate.id);
    
    setSelectedRescate(rescate);
    
    // Calcular ruta si hay ubicación del usuario
    if (userLocation && showMapView) {
      await getRoute(
        rescate.ubicacion.lat, 
        rescate.ubicacion.lng, 
        selectedTransport
      );
    }
    
    setTimeout(() => {
      isProcessingSelection.current = false;
    }, 1000);
  };

  // Cerrar modal de rescate seleccionado
  const closeModal = () => {
    console.log('❌ [RescatesActivosTab] Cerrando modal de rescate');
    setSelectedRescate(null);
    setRouteCoordinates([]);
    setShowDirections(false);
    setRouteInfo(null);
    isProcessingSelection.current = false;
  };

  // Aceptar rescate y actualizar estado en Firebase
  const handleAceptarRescate = async (rescateId) => {
    if (!userProfile || !rescateId) {
      Alert.alert('❌ Error', 'No se puede aceptar el rescate en este momento.');
      return;
    }

    try {
      console.log('✅ [RescatesActivosTab] Aceptando rescate:', rescateId);
      
      const ayudante = userProfile.nombre || userProfile.email || 'Usuario voluntario';
      const updateData = {
        estado: 'en_proceso',
        ayudante: ayudante,
        ayudanteId: userProfile.id,
        fechaAsignacion: Date.now()
      };

      await update(ref(db, `rescates/${rescateId}`), updateData);
      console.log('✅ Rescate actualizado en Firebase');
      
      closeModal();
      
      Alert.alert(
        '🎉 ¡Rescate aceptado exitosamente!',
        `Gracias por ayudar. ¿Cómo deseas llegar al lugar del rescate?`,
        [
          {
            text: '🗺️ Abrir Google Maps',
            onPress: () => abrirEnGoogleMaps(selectedRescate)
          },
          {
            text: '📱 Continuar en la app',
            onPress: () => continuarNavegacion()
          },
          {
            text: 'Ir después',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error aceptando rescate:', error);
      Alert.alert('❌ Error', 'No se pudo aceptar el rescate. Intenta nuevamente.');
    }
  };

  // Abrir Google Maps con la ubicación del rescate
  const abrirEnGoogleMaps = (rescate) => {
    if (!rescate || !rescate.ubicacion) {
      Alert.alert('❌ Error', 'No se puede abrir la ubicación en Google Maps.');
      return;
    }

    const { lat, lng } = rescate.ubicacion;
    
    let distanciaInfo = '';
    if (userLocation) {
      const distancia = calcularDistancia(
        userLocation.latitude, 
        userLocation.longitude, 
        lat, 
        lng
      );
      const tiempoEstimado = Math.ceil(distancia * 3); // Estimación simple
      distanciaInfo = `\n📏 Distancia: ~${distancia.toFixed(1)} km\n⏱️ Tiempo estimado: ~${tiempoEstimado} min`;
    }

    Alert.alert(
      '🗺️ Abrir Google Maps',
      `Te llevará directamente al lugar del rescate.${distanciaInfo}`,
      [
        {
          text: '🚗 Ir ahora',
          onPress: () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
            Linking.openURL(url).catch(() => {
              Alert.alert('❌ Error', 'No se pudo abrir Google Maps. Verifica que esté instalado.');
            });
          }
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  // Continuar navegación dentro de la app
  const continuarNavegacion = () => {
    Alert.alert(
      '🧭 Navegando en AnimTech',
      'Sigue la ruta marcada en el mapa. Mantén la app abierta para recibir las indicaciones.',
      [{ text: 'Entendido' }]
    );
  };

  // Rechazar rescate (ocultarlo de la lista)
  const handleRechazarRescate = (rescateId = null) => {
    const idToReject = rescateId || selectedRescate?.id;
    
    if (idToReject) {
      console.log('💔 [RescatesActivosTab] Rechazando rescate:', idToReject);
      setRejectedRescates(prev => new Set([...prev, idToReject]));
      
      if (selectedRescate && selectedRescate.id === idToReject) {
        closeModal();
      }
    }
    
    Alert.alert('💙 Entendido', 'Este rescate ya no aparecerá en tu lista.');
  };

  // Limpiar ruta mostrada
  const clearRoute = () => {
    console.log('🧹 [RescatesActivosTab] Limpiando ruta');
    setShowDirections(false);
    setRouteCoordinates([]);
    setRouteInfo(null);
  };

  // Refrescar datos
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('🔄 [RescatesActivosTab] Refrescando datos...');
    // Los datos se actualizarán automáticamente por el listener de Firebase
  }, []);

  // Renderizar botones de modo de transporte
  const renderTransportMode = (mode, config) => (
    <TransportBtn
      key={mode}
      onPress={() => {
        const now = Date.now();
        if (now - lastPressTime.current < 1000) return; // Prevenir clicks dobles
        lastPressTime.current = now;
        
        if (loadingRoute) return;
        
        console.log(`🚗 Cambiando a modo ${config.label}`);
        setSelectedTransport(mode);
        if (selectedRescate) {
          getRoute(selectedRescate.ubicacion.lat, selectedRescate.ubicacion.lng, mode);
        }
      }}
      selected={selectedTransport === mode}
      color={config.color}
      disabled={loadingRoute}
    >
      <Ionicons 
        name={config.icon} 
        size={18} 
        color={selectedTransport === mode ? '#ffffff' : config.color} 
      />
      <TransportText selected={selectedTransport === mode}>
        {config.label}
      </TransportText>
    </TransportBtn>
  );

  // Estados de carga y error
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#42a8a1" />
          <LoadingText>🔄 Cargando rescates activos...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (!userLocation && showMapView) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#42a8a1" />
          <LoadingText>📍 Obteniendo ubicación...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  // Vista de solo lista (cuando no se muestra mapa)
  if (!showMapView) {
    return (
      <Container>
        <RescatesList style={{ marginTop: 0 }}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#42a8a1']}
              />
            }
          >
            {rescatesActivos.length > 0 ? (
              rescatesActivos.map((rescate, index) => (
                <RescateCard key={rescate.id} onPress={() => handleSelectRescate(rescate)}>
                  <CardHeader>
                    <AnimalAvatar small>
                      <AnimalInitial small>
                        {getAnimalInitial(rescate.descripcion)}
                      </AnimalInitial>
                    </AnimalAvatar>
                    
                    <CardContent>
                      <CardTitle>
                        🆘 Rescate #{index + 1}
                      </CardTitle>
                      
                      <StatusChip estado="pendiente" small>
                        <StatusText small>SOS</StatusText>
                      </StatusChip>
                    </CardContent>
                  </CardHeader>

                  <CardDescription>
                    {rescate.descripcion.length > 80 
                      ? rescate.descripcion.substring(0, 80) + '...' 
                      : rescate.descripcion}
                  </CardDescription>

                  <InfoRow>
                    <InfoIcon>🕒</InfoIcon>
                    <InfoText>Reportado: {getTimeAgo(rescate.fechaOriginal)}</InfoText>
                  </InfoRow>

                  <InfoRow>
                    <InfoIcon>👤</InfoIcon>
                    <InfoText>Reportado por: {rescate.creador || 'Usuario anónimo'}</InfoText>
                  </InfoRow>

                  <CardFooter>
                    <TimeText>
                      {getTimeAgo(rescate.fechaOriginal)}
                    </TimeText>
                    <DistanceText>
                      {userLocation ? (
                        (() => {
                          const distancia = calcularDistancia(
                            userLocation.latitude,
                            userLocation.longitude,
                            rescate.ubicacion.lat,
                            rescate.ubicacion.lng
                          );
                          return `📍 ${distancia.toFixed(1)} km`;
                        })()
                      ) : (
                        '📍 Toca para ver ubicación'
                      )}
                    </DistanceText>
                  </CardFooter>

                  <ActionButtons style={{ marginTop: 12 }}>
                    <HelpButton onPress={() => handleAceptarRescate(rescate.id)}>
                      <ButtonText>🚀 Ayudar ahora</ButtonText>
                    </HelpButton>
                    
                    <CancelButton onPress={() => handleRechazarRescate(rescate.id)}>
                      <ButtonText>💔 No puedo</ButtonText>
                    </CancelButton>
                  </ActionButtons>
                </RescateCard>
              ))
            ) : (
              <EmptyState>
                <EmptyIcon>🎉</EmptyIcon>
                <EmptyTitle>¡No hay rescates pendientes!</EmptyTitle>
                <EmptySubtitle>
                  Todos los animalitos están seguros en este momento. ¡Gracias por ser parte de la comunidad AnimTech!
                </EmptySubtitle>
              </EmptyState>
            )}
          </ScrollView>
        </RescatesList>
      </Container>
    );
  }

  // Vista completa con mapa
  return (
    <Container>
      <MapContainer>
        <StyledMap
          ref={mapRef}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={false}
          loadingIndicatorColor="#42a8a1"
          mapType="standard"
          onPress={() => {
            if (selectedRescate && !showDirections) {
              setSelectedRescate(null);
            }
          }}
        >
          {/* Marcadores de rescates */}
          {rescatesActivos.map((rescate) => (
            <Marker
              key={rescate.id}
              coordinate={{
                latitude: rescate.ubicacion.lat,
                longitude: rescate.ubicacion.lng,
              }}
              pinColor={selectedRescate?.id === rescate.id ? "#f59e0b" : "#ef4444"}
              onPress={() => handleSelectRescate(rescate)}
              title={`🆘 Rescate necesario`}
              description={rescate.descripcion.substring(0, 50) + '...'}
            />
          ))}

          {/* Ruta de navegación */}
          {routeCoordinates.length > 0 && showDirections && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={6}
              strokeColor={TRANSPORT_MODES[selectedTransport]?.color || '#3b82f6'}
              strokeOpacity={0.9}
              lineDashPattern={TRANSPORT_MODES[selectedTransport]?.lineDashPattern || null}
            />
          )}
        </StyledMap>
      </MapContainer>

      {/* Modal de rescate seleccionado */}
      {selectedRescate && (
        <ModalOverlay onPress={closeModal}>
          <TouchableWithoutFeedback>
            <FloatingCard>
              <CloseModalButton onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666" />
              </CloseModalButton>
              
              <AnimalAvatar>
                <AnimalInitial>
                  {getAnimalInitial(selectedRescate.descripcion)}
                </AnimalInitial>
              </AnimalAvatar>
              
              <CardContent>
                <AnimalName>
                  {selectedRescate.descripcion.split(' ').slice(0, 4).join(' ')}
                </AnimalName>
                
                <StatusChip estado="pendiente">
                  <StatusText>🆘 Necesita ayuda urgente</StatusText>
                </StatusChip>

                <DescriptionText>
                  {selectedRescate.descripcion}
                </DescriptionText>

                <InfoRow>
                  <InfoIcon>📍</InfoIcon>
                  <InfoText>
                    {userLocation ? (
                      (() => {
                        const distancia = calcularDistancia(
                          userLocation.latitude,
                          userLocation.longitude,
                          selectedRescate.ubicacion.lat,
                          selectedRescate.ubicacion.lng
                        );
                        const tiempoEstimado = Math.ceil(distancia * 3);
                        return `${distancia.toFixed(1)} km de distancia (~${tiempoEstimado} min)`;
                      })()
                    ) : (
                      'Ubicación registrada'
                    )}
                  </InfoText>
                </InfoRow>

                <InfoRow>
                  <InfoIcon>🕒</InfoIcon>
                  <InfoText>Reportado: {getTimeAgo(selectedRescate.fechaOriginal)}</InfoText>
                </InfoRow>

                <InfoRow>
                  <InfoIcon>👤</InfoIcon>
                  <InfoText>Por: {selectedRescate.creador || 'Usuario anónimo'}</InfoText>
                </InfoRow>

                {routeInfo && (
                  <RouteInfoContainer>
                    <RouteInfoText>
                      📍 {routeInfo.distance} • ⏱️ {routeInfo.duration} • {TRANSPORT_MODES[selectedTransport]?.label}
                    </RouteInfoText>
                  </RouteInfoContainer>
                )}

                <TransportModes>
                  {Object.entries(TRANSPORT_MODES).map(([mode, config]) => 
                    renderTransportMode(mode, config)
                  )}
                </TransportModes>

                {loadingRoute && (
                  <LoadingRouteContainer>
                    <ActivityIndicator size="small" color="#42a8a1" />
                    <LoadingText>
                      Calculando ruta {TRANSPORT_MODES[selectedTransport]?.label.toLowerCase()}...
                    </LoadingText>
                  </LoadingRouteContainer>
                )}

                <ActionButtons>
                  <HelpButton onPress={() => handleAceptarRescate(selectedRescate.id)}>
                    <ButtonText>🚀 Ayudar ahora</ButtonText>
                  </HelpButton>
                  
                  <CancelButton onPress={() => handleRechazarRescate()}>
                    <ButtonText>💔 No puedo ayudar</ButtonText>
                  </CancelButton>
                </ActionButtons>
              </CardContent>
            </FloatingCard>
          </TouchableWithoutFeedback>
        </ModalOverlay>
      )}
      
      <BottomSheet>
        <SheetHandle />
        
        <NavigationControls>
          <SheetTitle>
            🆘 Rescates que necesitan ayuda ({rescatesActivos.length})
          </SheetTitle>
          
          {showDirections && (
            <NavigationButton onPress={clearRoute}>
              <Ionicons name="close" size={20} color="#ef4444" />
            </NavigationButton>
          )}
        </NavigationControls>
        
        <RescatesList>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#42a8a1']}
              />
            }
          >
            {rescatesActivos.length > 0 ? (
              rescatesActivos.map((rescate, index) => (
                <RescateCard key={rescate.id} onPress={() => handleSelectRescate(rescate)}>
                  <CardHeader>
                    <AnimalAvatar small>
                      <AnimalInitial small>
                        {getAnimalInitial(rescate.descripcion)}
                      </AnimalInitial>
                    </AnimalAvatar>
                    
                    <CardTitle>
                      Rescate #{index + 1}
                    </CardTitle>
                    
                    <StatusChip estado="pendiente" small>
                      <StatusText small>🆘 SOS</StatusText>
                    </StatusChip>
                  </CardHeader>

                  <CardDescription>
                    {rescate.descripcion.length > 80 
                      ? rescate.descripcion.substring(0, 80) + '...' 
                      : rescate.descripcion}
                  </CardDescription>

                  <InfoRow>
                    <InfoIcon>🕒</InfoIcon>
                    <InfoText>Reportado: {getTimeAgo(rescate.fechaOriginal)}</InfoText>
                  </InfoRow>

                  <InfoRow>
                    <InfoIcon>👤</InfoIcon>
                    <InfoText>Por: {rescate.creador || 'Usuario anónimo'}</InfoText>
                  </InfoRow>

                  <CardFooter>
                    <TimeText>
                      {getTimeAgo(rescate.fechaOriginal)}
                    </TimeText>
                    <DistanceText>
                      {userLocation ? (
                        (() => {
                          const distancia = calcularDistancia(
                            userLocation.latitude,
                            userLocation.longitude,
                            rescate.ubicacion.lat,
                            rescate.ubicacion.lng
                          );
                          return `📍 ${distancia.toFixed(1)} km`;
                        })()
                      ) : (
                        '📍 Toca para ver ubicación'
                      )}
                    </DistanceText>
                  </CardFooter>

                  <ActionButtons style={{ marginTop: 8 }}>
                    <HelpButton 
                      onPress={() => handleAceptarRescate(rescate.id)}
                      style={{ flex: 1, marginRight: 8 }}
                    >
                      <ButtonText>🚀 Ayudar</ButtonText>
                    </HelpButton>
                    
                    <CancelButton 
                      onPress={() => handleRechazarRescate(rescate.id)}
                      style={{ flex: 1, marginLeft: 8 }}
                    >
                      <ButtonText>💔 No puedo</ButtonText>
                    </CancelButton>
                  </ActionButtons>
                </RescateCard>
              ))
            ) : (
              <EmptyState>
                <EmptyIcon>🎉</EmptyIcon>
                <EmptyTitle>
                  {rescatesActivos.length === 0 ? '¡No hay rescates pendientes!' : 'No se encontraron rescates'}
                </EmptyTitle>
                <EmptySubtitle>
                  {rescatesActivos.length === 0 
                    ? 'Todos los animalitos están seguros en este momento.'
                    : 'Intenta cambiar los términos de búsqueda.'}
                </EmptySubtitle>
              </EmptyState>
            )}
          </ScrollView>
        </RescatesList>
      </BottomSheet>
    </Container>
  );
};

export default RescatesActivosTab;