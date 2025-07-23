import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StatusBar, 
  Platform, 
  Keyboard, 
  Alert, 
  BackHandler 
} from 'react-native';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { ref, push } from 'firebase/database';
import { db } from '../../config/firebaseConfig';
import { getMiPerfilUsuario } from '../../services/userService';
import {
  Container,
  Header,
  HeaderContent,
  BackButton,
  HeaderTitleContainer,
  HeaderTitle,
  HeaderSubtitle,
  ContentContainer,
  MapContainer,
  StyledMap,
  FormContainer,
  InputContainer,
  InputLabel,
  Input,
  CharacterCount,
  ButtonContainer,
  Button,
  ButtonText,
  LoadingContainer,
  LoadingText
} from '../../styles/YoRescatoStyles';
import { Ionicons } from '@expo/vector-icons';

const fallbackRegion = {
  latitude: -17.3935,     
  longitude: -66.1570,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const YoRescatoScreen = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const [description, setDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  // Referencias
  const mapRef = useRef(null);
  const descriptionInputRef = useRef(null);

  // Configurar StatusBar al montar el componente
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

  // Manejar botón atrás de Android
  useEffect(() => {
    const backAction = () => {
      if (description.trim().length > 0) {
        Alert.alert(
          'Descartar reporte',
          '¿Estás seguro de que quieres salir? Se perderá la descripción que has escrito.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', onPress: () => navigation.goBack() }
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [description, navigation]);

  // Manejar el teclado
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
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
        // Usar perfil demo si hay error
        setUserProfile({ 
          id: 'demo_user', 
          nombre: 'Usuario Demo',
          email: 'demo@animtech.com'
        });
      }
    };
    obtenerPerfil();
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        setIsLocationLoading(true);
        setLocationError(null);
        
        console.log('📍 Solicitando permisos de ubicación...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.warn('⚠️ Permisos de ubicación denegados');
          setLocationError('Permisos de ubicación denegados');
          Alert.alert(
            'Permiso denegado', 
            'Para reportar un rescate necesitamos acceso a tu ubicación. Se mostrará el mapa general de Cochabamba.',
            [{ text: 'Entendido' }]
          );
          setRegion(fallbackRegion); 
          setIsLocationLoading(false);
          return;
        }

        console.log('✅ Permisos concedidos, obteniendo ubicación...');
        
        // Obtener ubicación con timeout más largo
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 20000,
          maximumAge: 10000,
        });

        console.log('📍 Ubicación obtenida:', location.coords);
        
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setRegion(newRegion);
        setIsLocationLoading(false);
        
      } catch (error) {
        console.error('❌ Error al obtener ubicación:', error);
        setLocationError(error.message || 'Error al obtener ubicación');
        
        Alert.alert(
          'Ubicación no disponible', 
          'No se pudo obtener tu ubicación actual. Mostrando mapa general de Cochabamba. Puedes mover el marcador a la ubicación correcta.',
          [{ text: 'Entendido' }]
        );
        
        setRegion(fallbackRegion);
        setIsLocationLoading(false);
      }
    };

    obtenerUbicacion();
  }, []);

  // Validar datos antes de publicar
  const validarDatos = useCallback(() => {
    // Validar descripción
    if (!description.trim()) {
      Alert.alert(
        'Falta descripción', 
        'Por favor escribe una descripción del animal que necesita ayuda.',
        [{ text: 'Entendido' }]
      );
      descriptionInputRef.current?.focus();
      return false;
    }

    if (description.trim().length < 10) {
      Alert.alert(
        'Descripción muy corta', 
        'Por favor proporciona más detalles sobre la situación del animal (mínimo 10 caracteres).',
        [{ text: 'Entendido' }]
      );
      descriptionInputRef.current?.focus();
      return false;
    }

    // Validar ubicación
    if (!region || !region.latitude || !region.longitude) {
      Alert.alert(
        'Ubicación no disponible', 
        'No se puede publicar el rescate sin una ubicación válida. Por favor espera a que se cargue el mapa.',
        [{ text: 'Entendido' }]
      );
      return false;
    }

    // Validar que la ubicación esté en un rango razonable (Bolivia)
    if (region.latitude < -23 || region.latitude > -9 || 
        region.longitude < -70 || region.longitude > -57) {
      Alert.alert(
        'Ubicación fuera de rango',
        '¿Estás seguro de que la ubicación es correcta? Parece estar fuera de Bolivia.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar de todos modos', onPress: () => true }
        ]
      );
      return false;
    }

    return true;
  }, [description, region]);

  // Publicar rescate
  const handlePublicar = async () => {
    if (!validarDatos()) {
      return;
    }

    try {
      setIsPublishing(true);
      console.log('📝 Publicando rescate...');
      
      const rescateData = {
        descripcion: description.trim(),
        ubicacion: {
          lat: region.latitude,
          lng: region.longitude,
        },
        fecha: Date.now(), // Timestamp en milisegundos
        estado: 'pendiente',
        ayudante: null,
        ayudanteId: null,
        fechaCreacion: new Date().toISOString(),
        activo: true,
        creadorId: userProfile?.id || 'demo_user',
        creador: userProfile?.nombre || userProfile?.email || 'Usuario Demo',
        // Metadatos adicionales
        plataforma: Platform.OS,
        version: '1.0.0',
        coordenadasPrecision: locationError ? 'baja' : 'alta'
      };

      console.log('💾 Datos a guardar:', rescateData);
      
      const rescateRef = await push(ref(db, 'rescates'), rescateData);
      console.log('✅ Rescate guardado con ID:', rescateRef.key);

      // Limpiar formulario
      setDescription('');
      
      Alert.alert(
        '🎉 ¡Rescate publicado exitosamente!', 
        'Gracias por reportar. Tu publicación ya está disponible para que voluntarios puedan ayudar.',
        [
          {
            text: '👀 Ver rescates activos',
            onPress: () => {
              navigation.navigate('RescatesMain');
            }
          },
          {
            text: '📝 Publicar otro',
            onPress: () => {
              // Ya limpiamos el formulario arriba
              console.log('📝 Preparando nuevo reporte...');
            }
          },
          {
            text: '🏠 Volver al inicio',
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error al publicar rescate:', error);
      Alert.alert(
        'Error al publicar', 
        'No se pudo guardar el rescate. Verifica tu conexión a internet e intenta nuevamente.\n\nDetalle del error: ' + (error.message || 'Error desconocido'),
        [
          { text: 'Reintentar', onPress: handlePublicar },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setIsPublishing(false);
    }
  };

  // Manejar cambio de región del mapa
  const handleRegionChange = useCallback((newRegion) => {
    if (newRegion && 
        newRegion.latitude && 
        newRegion.longitude && 
        !isNaN(newRegion.latitude) && 
        !isNaN(newRegion.longitude)) {
      setRegion(newRegion);
      console.log('📍 Ubicación actualizada:', {
        lat: newRegion.latitude.toFixed(6),
        lng: newRegion.longitude.toFixed(6)
      });
    }
  }, []);

  // Enfocar mapa en ubicación actual
  const enfocarUbicacionActual = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });
      
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setRegion(newRegion);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error('❌ Error enfocando ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
    }
  };

  // Pantalla de carga mientras se obtiene la ubicación
  if (isLocationLoading) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <BackButton onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </BackButton>
            <HeaderTitleContainer>
              <HeaderTitle>Reportar rescate</HeaderTitle>
              <HeaderSubtitle>Obteniendo tu ubicación...</HeaderSubtitle>
            </HeaderTitleContainer>
          </HeaderContent>
        </Header>
        <LoadingContainer>
          <Ionicons name="location-outline" size={48} color="#42a8a1" />
          <LoadingText>📍 Obteniendo tu ubicación...</LoadingText>
          <LoadingText style={{ fontSize: 14, marginTop: 8, opacity: 0.7 }}>
            Esto puede tomar unos segundos
          </LoadingText>
          {locationError && (
            <LoadingText style={{ fontSize: 12, marginTop: 4, color: '#ef4444' }}>
              Error: {locationError}
            </LoadingText>
          )}
        </LoadingContainer>
      </Container>
    );
  }

  // Verificar que tenemos región válida
  if (!region) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <BackButton onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </BackButton>
            <HeaderTitleContainer>
              <HeaderTitle>Error de ubicación</HeaderTitle>
              <HeaderSubtitle>No se pudo cargar el mapa</HeaderSubtitle>
            </HeaderTitleContainer>
          </HeaderContent>
        </Header>
        <LoadingContainer>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <LoadingText style={{ color: '#ef4444' }}>
            ❌ No se pudo cargar el mapa
          </LoadingText>
          <LoadingText style={{ fontSize: 14, marginTop: 8, opacity: 0.7 }}>
            {locationError || 'Error desconocido'}
          </LoadingText>
          <Button 
            style={{ marginTop: 20, backgroundColor: '#42a8a1' }}
            onPress={() => {
              setIsLocationLoading(true);
              setRegion(fallbackRegion);
              setIsLocationLoading(false);
            }}
          >
            <ButtonText>🗺️ Usar mapa general</ButtonText>
          </Button>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <BackButton onPress={() => {
            if (description.trim().length > 0) {
              Alert.alert(
                'Descartar reporte',
                '¿Estás seguro de que quieres salir? Se perderá la descripción que has escrito.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Salir', onPress: () => navigation.goBack() }
                ]
              );
            } else {
              navigation.goBack();
            }
          }}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </BackButton>
          <HeaderTitleContainer>
            <HeaderTitle>Reportar rescate</HeaderTitle>
            <HeaderSubtitle>
              {locationError 
                ? 'Ubicación aproximada - ajusta el marcador' 
                : 'Ubica y describe la situación del animal'}
            </HeaderSubtitle>
          </HeaderTitleContainer>
          
          {/* Botón para re-enfocar ubicación */}
          <BackButton onPress={enfocarUbicacionActual}>
            <Ionicons name="locate" size={20} color="#ffffff" />
          </BackButton>
        </HeaderContent>
      </Header>

      <ContentContainer keyboardHeight={keyboardHeight}>
        <MapContainer isKeyboardVisible={keyboardHeight > 0}>
          <StyledMap 
            ref={mapRef}
            region={region} 
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation={!locationError}
            showsMyLocationButton={!locationError}
            mapType="standard"
            loadingEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            <Marker 
              coordinate={region} 
              title="📍 Ubicación del rescate"
              description="Arrastra el mapa para ajustar la ubicación exacta"
              pinColor="#ef4444"
              draggable={false}
            />
          </StyledMap>
          
          {/* Indicador de precisión */}
          {locationError && (
            <LoadingText style={{ 
              position: 'absolute', 
              bottom: 10, 
              left: 10, 
              right: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: 8,
              borderRadius: 8,
              fontSize: 12,
              textAlign: 'center',
              color: '#ef4444'
            }}>
              ⚠️ Ubicación aproximada. Arrastra el mapa para posicionar correctamente.
            </LoadingText>
          )}
        </MapContainer>

        <FormContainer isKeyboardVisible={keyboardHeight > 0}>
          <InputContainer>
            <InputLabel>
              <Ionicons name="create-outline" size={18} color="#42a8a1" />
              {' '}Describe la situación del animal *
            </InputLabel>
            <Input
              ref={descriptionInputRef}
              placeholder="Ejemplo: Perro callejero herido en la pata trasera, parece tener hambre y sed."
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={300}
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
              autoCorrect={true}
              spellCheck={true}
              editable={!isPublishing}
            />
            <CharacterCount isNearLimit={description.length > 250}>
              {description.length}/300 caracteres
              {description.length < 10 && ' (mínimo 10)'}
            </CharacterCount>
          </InputContainer>

          <ButtonContainer>
            <Button 
              onPress={handlePublicar} 
              disabled={isPublishing || !description.trim() || description.trim().length < 10}
            >
              <Ionicons 
                name={isPublishing ? "hourglass-outline" : "heart-outline"} 
                size={20} 
                color="#ffffff" 
              />
              <ButtonText>
                {isPublishing ? '📤 Publicando...' : '💙 Publicar rescate'}
              </ButtonText>
            </Button>
            
            {/* Botón secundario para limpiar */}
            {description.length > 0 && !isPublishing && (
              <Button 
                style={{ 
                  backgroundColor: 'transparent', 
                  borderWidth: 1, 
                  borderColor: '#42a8a1',
                  marginTop: 10
                }}
                onPress={() => {
                  Alert.alert(
                    'Limpiar descripción',
                    '¿Estás seguro de que quieres borrar toda la descripción?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Limpiar', onPress: () => setDescription('') }
                    ]
                  );
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#42a8a1" />
                <ButtonText style={{ color: '#42a8a1' }}>
                  Limpiar descripción
                </ButtonText>
              </Button>
            )}
          </ButtonContainer>
        </FormContainer>
      </ContentContainer>
    </Container>
  );
};

export default YoRescatoScreen;