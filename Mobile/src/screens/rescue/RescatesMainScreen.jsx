import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StatusBar, 
  Platform, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Alert, 
  ActivityIndicator, 
  Linking, 
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../config/firebaseConfig';
import { getMiPerfilUsuario } from '../../services/userService';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

// Importar solo los sub-componentes que SÍ funcionan
import RescatesEnProcesoTab from './mini/RescatesEnProcesoTab';
import RescatesFinalizadosTab from './mini/RescatesFinalizadosTab';
import MisRescatesTab from './mini/MisRescatesTab';
import {
  Container,
  Header,
  HeaderContent,
  BackButton,
  HeaderTitleContainer,
  HeaderTitle,
  HeaderSubtitle,
  MiniNavContainer,
  MiniNavButton,
  MiniNavText,
  MiniNavIndicator,
  ContentContainer,
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
  NavigationButton
} from '../../styles/RescatesStyles';

// Configuración de modos de transporte
const TRANSPORT_MODES = {
  'driving': { 
    icon: 'car', 
    label: 'Auto', 
    color: '#3b82f6', 
    osrmUrl: 'https://router.project-osrm.org/route/v1/driving'
  },
  'walking': { 
    icon: 'walk', 
    label: 'Caminar', 
    color: '#10b981', 
    osrmUrl: 'https://router.project-osrm.org/route/v1/foot'
  },
  'cycling': { 
    icon: 'bicycle', 
    label: 'Bicicleta', 
    color: '#f59e0b', 
    osrmUrl: 'https://router.project-osrm.org/route/v1/bike'
  },
  'motorcycle': { 
    icon: 'flash', 
    label: 'Moto', 
    color: '#8b5cf6', 
    osrmUrl: 'https://router.project-osrm.org/route/v1/driving'
  }
};

const RescatesMainScreen = ({ navigation }) => {
  // Estados principales
  const [activeTab, setActiveTab] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [rescatesCounts, setRescatesCounts] = useState({
    activos: 0,
    enProceso: 0,
    finalizados: 0,
    misRescates: 0
  });

  // Estados para mapa y navegación
  const [showMapView, setShowMapView] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRescate, setSelectedRescate] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState('driving');
  const [showDirections, setShowDirections] = useState(false);
  
  // Estados para datos
  const [rescatesData, setRescatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rejectedRescates, setRejectedRescates] = useState(new Set());

  // Referencias
  const mapRef = useRef(null);

  // ✅ COMPUTED: Lista filtrada de rescates activos
  const filteredRescates = rescatesData.filter(rescate => 
    rescate.estado === 'pendiente' && 
    rescate.activo !== false &&
    !rejectedRescates.has(rescate.id)
  );

  // Configurar StatusBar
  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#42a8a1', true);
    }
    
    return () => {
      StatusBar.setBarStyle('default', true);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#ffffff', true);
      }
    };
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        console.log('📍 Solicitando permisos de ubicación...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          console.log('✅ Permisos concedidos, obteniendo ubicación...');
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 10000,
          });
          
          console.log('📍 Ubicación obtenida:', location.coords);
          setUserLocation(location.coords);
        } else {
          console.warn('⚠️ Permisos de ubicación denegados, usando ubicación por defecto');
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

  // Obtener perfil del usuario
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        console.log('👤 Obteniendo perfil de usuario...');
        const perfil = await getMiPerfilUsuario();
        console.log('✅ Perfil obtenido:', perfil);
        setUserProfile(perfil);
      } catch (error) {
        console.error('❌ Error obteniendo perfil:', error);
        setUserProfile({ 
          id: 'demo_user', 
          nombre: 'Usuario Demo',
          email: 'demo@animtech.com'
        });
      }
    };
    obtenerPerfil();
  }, []);

  // Escuchar cambios en Firebase y obtener datos de rescates
  useEffect(() => {
    console.log('🔄 Iniciando escucha de rescates en Firebase...');
    const rescatesRef = ref(db, 'rescates');
    
    const unsubscribe = onValue(rescatesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📊 Datos recibidos de Firebase:', data);
      
      const counts = { activos: 0, enProceso: 0, finalizados: 0, misRescates: 0 };

      if (data) {
        // Filtrar rescates activos/pendientes
        const rescatesActivos = Object.entries(data)
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

        setRescatesData(rescatesActivos);

        // Contar rescates por estado
        Object.entries(data).forEach(([id, rescate]) => {
          if (rescate.activo === false) return;
          
          switch (rescate.estado) {
            case 'pendiente':
              counts.activos++;
              break;
            case 'asignado':
            case 'en_proceso':
              counts.enProceso++;
              if (rescate.ayudanteId === userProfile?.id) {
                counts.misRescates++;
              }
              break;
            case 'finalizado':
            case 'resuelto':
              counts.finalizados++;
              if (rescate.ayudanteId === userProfile?.id) {
                counts.misRescates++;
              }
              break;
          }
        });

        console.log('📊 Conteos actualizados:', counts);
      } else {
        console.log('📭 No hay datos de rescates en Firebase');
        setRescatesData([]);
      }

      setRescatesCounts(counts);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('❌ Error escuchando rescates:', error);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [userProfile, rejectedRescates]);

  // Funciones auxiliares
  const calcularDistancia = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d;
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
    
    if (isNaN(then.getTime())) {
      return 'Fecha no válida';
    }
    
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

  // ✅ FUNCIÓN CORREGIDA: Obtener ruta con tiempos reales
  const getRoute = async (destinationLat, destinationLng, transportMode = 'driving') => {
    if (!userLocation || loadingRoute) {
      return;
    }

    setLoadingRoute(true);
    console.log(`🗺️ Calculando ruta ${transportMode}...`);
    
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
          geometries: 'geojson'
        },
        timeout: 10000
      });

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        
        const coordinates = route.geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0]
        }));

        const distance = (route.distance / 1000).toFixed(1);
        let duration = Math.round(route.duration / 60);
        
        // ✅ CORREGIR TIEMPOS SEGÚN MODO DE TRANSPORTE
        if (transportMode === 'motorcycle') {
          // Moto: 30% más rápido que auto
          duration = Math.max(1, Math.round(duration * 0.7));
        } else if (transportMode === 'walking') {
          // Caminar: usar tiempo real de OSRM (ya está correcto)
          duration = Math.round(route.duration / 60);
        } else if (transportMode === 'cycling') {
          // Bicicleta: usar tiempo real de OSRM (ya está correcto)
          duration = Math.round(route.duration / 60);
        }
        // Auto: usar tiempo original
        
        setRouteCoordinates(coordinates);
        setRouteInfo({
          distance: `${distance} km`,
          duration: `${duration} min`,
          mode: transportMode
        });
        setShowDirections(true);

        console.log(`✅ Ruta ${transportMode}: ${distance} km, ${duration} min`);
      }

    } catch (error) {
      console.error('❌ Error obteniendo ruta:', error);
    } finally {
      setLoadingRoute(false);
    }
  };

  // ✅ MANEJAR SELECCIÓN DE RESCATE - CON CÁLCULO AUTOMÁTICO EN AUTO
  const handleSelectRescate = (rescate) => {
    console.log('🎯 PIN PRESIONADO - Rescate seleccionado:', rescate.id);
    console.log('📋 Datos del rescate:', rescate);
    
    // Establecer el rescate seleccionado
    setSelectedRescate(rescate);
    
    console.log('✅ selectedRescate establecido, modal debería aparecer');
    
    // Calcular ruta automáticamente en AUTO (por defecto)
    if (userLocation) {
      console.log('🗺️ Calculando ruta automáticamente en AUTO...');
      setSelectedTransport('driving'); // Establecer AUTO por defecto
      getRoute(rescate.ubicacion.lat, rescate.ubicacion.lng, 'driving');
    }
  };

  // ✅ CERRAR MODAL
  const closeModal = () => {
    console.log('❌ Cerrando modal de rescate');
    setSelectedRescate(null);
    setRouteCoordinates([]);
    setShowDirections(false);
    setRouteInfo(null);
  };

  // ✅ ACEPTAR RESCATE
  const handleAceptarRescate = async (rescateId) => {
    if (!userProfile || !rescateId) {
      Alert.alert('❌ Error', 'No se puede aceptar el rescate en este momento.');
      return;
    }

    try {
      console.log('✅ Aceptando rescate:', rescateId);
      
      const ayudante = userProfile.nombre || userProfile.email || 'Usuario voluntario';
      const updateData = {
        estado: 'en_proceso',
        ayudante: ayudante,
        ayudanteId: userProfile.id,
        fechaAsignacion: Date.now()
      };

      await update(ref(db, `rescates/${rescateId}`), updateData);
      console.log('✅ Rescate actualizado en Firebase');
      
      // PREGUNTA SIMPLE: Google Maps o continuar en la app
      Alert.alert(
        '🎉 ¡Rescate aceptado exitosamente!',
        `Gracias por ayudar. ¿Cómo deseas navegar al lugar del rescate?`,
        [
          {
            text: '🗺️ Abrir Google Maps',
            onPress: () => {
              abrirEnGoogleMaps(selectedRescate);
              closeModal();
            }
          },
          {
            text: '📱 Continuar en la app',
            onPress: () => {
              // Cerrar modal y calcular ruta automáticamente en AUTO
              closeModal();
              
              // Calcular ruta automáticamente en modo AUTO
              if (selectedRescate && userLocation) {
                setSelectedTransport('driving');
                getRoute(selectedRescate.ubicacion.lat, selectedRescate.ubicacion.lng, 'driving');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error aceptando rescate:', error);
      Alert.alert('❌ Error', 'No se pudo aceptar el rescate. Intenta nuevamente.');
    }
  };

  // ✅ ABRIR GOOGLE MAPS
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
      const tiempoEstimado = Math.ceil(distancia * 3);
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

  // Rechazar rescate (ocultarlo de la lista)
  const handleRechazarRescate = () => {
    if (selectedRescate) {
      console.log('💔 Rechazando rescate:', selectedRescate.id);
      setRejectedRescates(prev => new Set([...prev, selectedRescate.id]));
    }
    Alert.alert('💙 Entendido', 'Este rescate ya no aparecerá en tu lista.');
    closeModal();
  };

  // Refrescar datos
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('🔄 Refrescando datos...');
  }, []);

  // ✅ RENDERIZAR BOTONES DE TRANSPORTE
  const renderTransportMode = (mode, config) => (
    <TransportBtn
      key={mode}
      onPress={() => {
        console.log(`🚗 Cambiando a modo ${config.label}`);
        setSelectedTransport(mode);
        
        // Calcular ruta inmediatamente cuando se selecciona el transporte
        if (selectedRescate && userLocation) {
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
      <TransportText selected={selectedTransport === mode} color={config.color}>
        {config.label}
      </TransportText>
    </TransportBtn>
  );

  // ✅ RENDERIZAR VISTA DE RESCATES ACTIVOS (LISTA)
  const renderRescatesActivosList = () => {
    return (
      <RescatesList style={{ marginTop: 0 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#42a8a1']}
            />
          }
        >
          {filteredRescates.length > 0 ? (
            filteredRescates.map((rescate, index) => (
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
                    <ButtonText primary>🚀 Ayudar ahora</ButtonText>
                  </HelpButton>
                  
                  <CancelButton onPress={() => {
                    setRejectedRescates(prev => new Set([...prev, rescate.id]));
                    Alert.alert('💙 Entendido', 'Este rescate ya no aparecerá en tu lista.');
                  }}>
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
    );
  };

  // ✅ RENDERIZAR VISTA DE MAPA CON PINS CORREGIDOS
  const renderRescatesActivosMap = () => {
    console.log('🗺️ Renderizando mapa con', filteredRescates.length, 'rescates');
    console.log('📍 selectedRescate actual:', selectedRescate?.id || 'ninguno');
    
    if (!userLocation) {
      return (
        <LoadingContainer>
          <ActivityIndicator size="large" color="#42a8a1" />
          <LoadingText>📍 Obteniendo ubicación...</LoadingText>
        </LoadingContainer>
      );
    }

    return (
      <>
        <MapContainer style={{ flex: 1, margin: 0, marginBottom: 0 }}>
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
            mapType="standard"
            onPress={() => {
              console.log('🗺️ Mapa presionado - cerrando modal si existe');
              if (selectedRescate) {
                closeModal();
              }
            }}
          >
            {/* ✅ MARCADORES DE RESCATES - SIEMPRE VISIBLES */}
            {filteredRescates.map((rescate, index) => {
              console.log(`🔴 Renderizando pin #${index + 1}:`, rescate.id);
              return (
                <Marker
                  key={rescate.id}
                  coordinate={{
                    latitude: rescate.ubicacion.lat,
                    longitude: rescate.ubicacion.lng,
                  }}
                  pinColor={selectedRescate?.id === rescate.id ? "#f59e0b" : "#ef4444"}
                  onPress={(e) => {
                    console.log('📍 MARKER PRESIONADO - ID:', rescate.id);
                    e.stopPropagation();
                    handleSelectRescate(rescate);
                  }}
                  title={`🆘 Rescate #${index + 1}`}
                  description={rescate.descripcion.substring(0, 50) + '...'}
                  tracksViewChanges={false}
                />
              );
            })}

            {/* ✅ RUTA DE NAVEGACIÓN */}
            {routeCoordinates.length > 0 && showDirections && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={6}
                strokeColor={TRANSPORT_MODES[selectedTransport]?.color || '#3b82f6'}
                strokeOpacity={0.9}
              />
            )}
          </StyledMap>
        </MapContainer>

        {/* ✅ BOTONES DE TRANSPORTE */}
        <Container style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          zIndex: 999
        }}>
          <Container style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 16,
            elevation: 8,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 8,
            marginBottom: 16
          }}>
            <InfoRow style={{ marginBottom: 12, justifyContent: 'center' }}>
              <InfoText style={{ 
                color: '#1f2937', 
                fontWeight: '700',
                fontSize: 14,
                textAlign: 'center' 
              }}>
                Medio de transporte
              </InfoText>
            </InfoRow>

            <TransportModes style={{ marginBottom: 8 }}>
              {Object.entries(TRANSPORT_MODES).map(([mode, config]) => 
                renderTransportMode(mode, config)
              )}
            </TransportModes>

            {loadingRoute && (
              <LoadingRouteContainer style={{ marginTop: 8 }}>
                <ActivityIndicator size="small" color="#42a8a1" />
                <LoadingText style={{ fontSize: 12, marginTop: 4 }}>
                  Calculando ruta {TRANSPORT_MODES[selectedTransport]?.label.toLowerCase()}...
                </LoadingText>
              </LoadingRouteContainer>
            )}

            {routeInfo && !loadingRoute && (
              <RouteInfoContainer style={{ marginTop: 8 }}>
                <RouteInfoText style={{ fontSize: 12 }}>
                  🗺️ {routeInfo.distance} • {TRANSPORT_MODES[selectedTransport]?.label}
                </RouteInfoText>
              </RouteInfoContainer>
            )}
          </Container>
        </Container>

        {/* ✅ MODAL SIMPLIFICADO */}
        {selectedRescate && (
          <ModalOverlay onPress={closeModal}>
            <TouchableWithoutFeedback>
              <FloatingCard style={{ maxHeight: '70%', minHeight: 400 }}>
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

                  <ActionButtons>
                    <HelpButton onPress={() => handleAceptarRescate(selectedRescate.id)}>
                      <ButtonText primary>🚀 Ayudar ahora</ButtonText>
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
      </>
    );
  };

  // Configuración de pestañas
  const tabs = [
    { 
      title: 'Activos', 
      icon: 'alert-circle-outline', 
      count: rescatesCounts.activos 
    },
    { 
      title: 'En proceso', 
      icon: 'time-outline', 
      count: rescatesCounts.enProceso 
    },
    { 
      title: 'Finalizados', 
      icon: 'checkmark-circle-outline', 
      count: rescatesCounts.finalizados 
    },
    { 
      title: 'Mis rescates', 
      icon: 'person-outline', 
      count: rescatesCounts.misRescates 
    }
  ];

  // Renderizar contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Activos
        if (showMapView) {
          return renderRescatesActivosMap();
        } else {
          return renderRescatesActivosList();
        }
        
      case 1: // En proceso
        return (
          <RescatesEnProcesoTab 
            navigation={navigation} 
            userProfile={userProfile}
          />
        );
        
      case 2: // Finalizados
        return (
          <RescatesFinalizadosTab 
            navigation={navigation}
            userProfile={userProfile}
          />
        );
        
      case 3: // Mis rescates
        return (
          <MisRescatesTab 
            navigation={navigation}
            userProfile={userProfile}
          />
        );
        
      default:
        return renderRescatesActivosList();
    }
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </BackButton>
          <HeaderTitleContainer>
            <HeaderTitle>Centro de Rescates</HeaderTitle>
            <HeaderSubtitle>
              {rescatesCounts.activos + rescatesCounts.enProceso + rescatesCounts.finalizados} rescates registrados
            </HeaderSubtitle>
          </HeaderTitleContainer>
          
          {/* Botón para alternar vista en pestaña Activos */}
          {activeTab === 0 && (
            <NavigationButton 
              onPress={() => setShowMapView(!showMapView)}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 12,
                minWidth: 100
              }}
            >
              <Ionicons 
                name={showMapView ? "list" : "map"} 
                size={20} 
                color="#ffffff" 
                style={{ marginRight: 6 }}
              />
              <HeaderSubtitle style={{ 
                margin: 0, 
                fontSize: 11, 
                fontWeight: '700',
                color: '#ffffff'
              }}>
                {showMapView ? "Ver Lista" : "Ver Mapa"}
              </HeaderSubtitle>
            </NavigationButton>
          )}
        </HeaderContent>
      </Header>

      {/* Navegación por pestañas */}
      <MiniNavContainer>
        {tabs.map((tab, index) => (
          <MiniNavButton
            key={index}
            active={activeTab === index}
            onPress={() => {
              console.log(`📋 Cambiando a pestaña: ${tab.title}`);
              setActiveTab(index);
              // Limpiar estado del mapa al cambiar de pestaña
              if (index !== 0) {
                setSelectedRescate(null);
                setShowDirections(false);
                setRouteCoordinates([]);
                setRouteInfo(null);
              }
            }}
          >
            <Ionicons 
              name={tab.icon} 
              size={18} 
              color={activeTab === index ? '#ffffff' : '#42a8a1'} 
            />
            <MiniNavText active={activeTab === index}>
              {tab.title}
            </MiniNavText>
            {tab.count > 0 && (
              <MiniNavIndicator>
                <MiniNavText small active={false} style={{ color: '#ffffff' }}>
                  {tab.count}
                </MiniNavText>
              </MiniNavIndicator>
            )}
          </MiniNavButton>
        ))}
      </MiniNavContainer>

      {/* Contenido principal */}
      {activeTab === 0 && showMapView ? (
        // Vista de mapa para rescates activos (sin ScrollView)
        renderTabContent()
      ) : (
        // Vista de lista para otras pestañas (con ScrollView)
        <ScrollView showsVerticalScrollIndicator={false}>
          <ContentContainer>
            {renderTabContent()}
          </ContentContainer>
        </ScrollView>
      )}
    </Container>
  );
};

export default RescatesMainScreen;