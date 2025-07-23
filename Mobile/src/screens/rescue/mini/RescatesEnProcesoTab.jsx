import React, { useEffect, useState, useCallback } from 'react';
import { Alert, ScrollView, RefreshControl, Platform, Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  RescatesList,
  RescateCard,
  CardHeader,
  AnimalAvatar,
  AnimalInitial,
  CardContent,
  CardTitle,
  StatusChip,
  StatusText,
  CardDescription,
  InfoRow,
  InfoIcon,
  InfoText,
  ActionContainer,
  ActionButton,
  ActionButtonText,
  PhotoPreview,
  PhotoContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptySubtitle,
  LoadingContainer,
  LoadingText,
  ProgressContainer,
  ProgressText,
  FinalizarButton,
  FinalizarButtonText
} from '../../../styles/RescatesStyles';

// Configuración de Cloudinary
const CLOUDINARY_CONFIG = {
  cloudName: 'ddhc9nbli',
  uploadPreset: 'animtech_rescates',
  url: 'https://api.cloudinary.com/v1_1/ddhc9nbli/image/upload'
};

const RescatesEnProcesoTab = ({ navigation, userProfile }) => {
  const [rescatesEnProceso, setRescatesEnProceso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  
  // Estados para el modal de comentarios
  const [modalVisible, setModalVisible] = useState(false);
  const [comentarioInput, setComentarioInput] = useState('');
  const [rescateActual, setRescateActual] = useState(null);

  // Verificar permisos
  useEffect(() => {
    verificarPermisos();
  }, []);

  const verificarPermisos = async () => {
    try {
      const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');

      console.log('📷 Permisos de cámara:', cameraStatus.status);
      console.log('🖼️ Permisos de galería:', galleryStatus.status);
    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
    }
  };

  // Funciones auxiliares
  const getAnimalInitial = useCallback((descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('perro') || desc.includes('cachorro')) return '🐕';
    if (desc.includes('gato') || desc.includes('gatito')) return '🐱';
    if (desc.includes('ave') || desc.includes('pájaro')) return '🐦';
    return '🐾';
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

  // Listener de Firebase
  useEffect(() => {
    console.log('🔄 [RescatesEnProcesoTab] Iniciando escucha de rescates en proceso...');
    const rescatesRef = ref(db, 'rescates');
    
    const unsubscribe = onValue(rescatesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📊 [RescatesEnProcesoTab] Datos recibidos de Firebase:', data);
      
      if (!data) {
        setRescatesEnProceso([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const lista = Object.entries(data)
        .filter(([id, rescate]) => 
          rescate.estado === 'en_proceso' || rescate.estado === 'asignado'
        )
        .map(([id, rescate]) => ({ 
          id, 
          ...rescate,
          fechaOriginal: rescate.fecha
        }))
        .sort((a, b) => {
          const fechaA = a.fechaAsignacion ? new Date(a.fechaAsignacion) : new Date(0);
          const fechaB = b.fechaAsignacion ? new Date(b.fechaAsignacion) : new Date(0);
          return fechaB - fechaA;
        });

      console.log(`✅ ${lista.length} rescates en proceso encontrados`);
      setRescatesEnProceso(lista);
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('❌ Error escuchando rescates:', error);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('🔄 [RescatesEnProcesoTab] Refrescando rescates en proceso...');
  }, []);

  // Subir foto a Cloudinary
  const subirFotoCloudinary = async (imageUri, rescateId) => {
    try {
      console.log('📤 [RescatesEnProcesoTab] Subiendo foto a Cloudinary...');
      
      setUploadProgress(prev => ({ ...prev, [rescateId]: 0 }));
      
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `rescate_${rescateId}_${Date.now()}.jpg`,
      });
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', 'animtech/rescates');
      formData.append('public_id', `rescate_${rescateId}_${Date.now()}`);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [rescateId]: Math.min((prev[rescateId] || 0) + 20, 80)
        }));
      }, 500);

      const response = await fetch(CLOUDINARY_CONFIG.url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      
      const responseData = await response.json();
      
      if (response.ok && responseData.secure_url) {
        console.log('✅ Foto subida exitosamente:', responseData.secure_url);
        
        setUploadProgress(prev => ({ ...prev, [rescateId]: 100 }));
        
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[rescateId];
            return newProgress;
          });
        }, 2000);
        
        return responseData.secure_url;
      } else {
        throw new Error(responseData.error?.message || 'Error subiendo imagen');
      }
    } catch (error) {
      console.error('❌ Error subiendo foto:', error);
      
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[rescateId];
        return newProgress;
      });
      
      throw error;
    }
  };

  // Solicitar permisos
  const solicitarPermisosCamara = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado', 
          'Necesitamos acceso a la cámara para tomar fotos del rescate.',
          [{ text: 'Entendido' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error solicitando permisos de cámara:', error);
      return false;
    }
  };

  const solicitarPermisosGaleria = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado', 
          'Necesitamos acceso a la galería para seleccionar fotos.',
          [{ text: 'Entendido' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error solicitando permisos de galería:', error);
      return false;
    }
  };

  // Tomar foto
  const tomarFoto = async (rescateId) => {
    try {
      console.log('📷 [RescatesEnProcesoTab] Preparando cámara...');
      
      const hasPermission = cameraPermission || await solicitarPermisosCamara();
      if (!hasPermission) return;

      console.log('✅ Permisos de cámara confirmados, abriendo cámara...');
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingPhoto(rescateId);
        
        try {
          const photoUrl = await subirFotoCloudinary(result.assets[0].uri, rescateId);
          
          await update(ref(db, `rescates/${rescateId}`), {
            fotoProgreso: photoUrl,
            fechaFoto: Date.now(),
            metadata: {
              ...result.assets[0],
              fuente: 'camara',
              plataforma: Platform.OS
            }
          });

          Alert.alert('✅ Foto guardada', 'La foto del rescate se ha guardado correctamente.');
        } catch (error) {
          Alert.alert('❌ Error', `No se pudo subir la foto: ${error.message}`);
          console.error('Error subiendo foto:', error);
        } finally {
          setUploadingPhoto(null);
        }
      }
    } catch (error) {
      console.error('❌ Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto. Intenta nuevamente.');
      setUploadingPhoto(null);
    }
  };

  // Seleccionar foto
  const seleccionarFoto = async (rescateId) => {
    try {
      console.log('🖼️ [RescatesEnProcesoTab] Preparando galería...');
      
      const hasPermission = galleryPermission || await solicitarPermisosGaleria();
      if (!hasPermission) return;

      console.log('✅ Permisos de galería confirmados, abriendo galería...');
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingPhoto(rescateId);
        
        try {
          const photoUrl = await subirFotoCloudinary(result.assets[0].uri, rescateId);
          
          await update(ref(db, `rescates/${rescateId}`), {
            fotoProgreso: photoUrl,
            fechaFoto: Date.now(),
            metadata: {
              ...result.assets[0],
              fuente: 'galeria',
              plataforma: Platform.OS
            }
          });

          Alert.alert('✅ Foto guardada', 'La foto del rescate se ha guardado correctamente.');
        } catch (error) {
          Alert.alert('❌ Error', `No se pudo subir la foto: ${error.message}`);
          console.error('Error subiendo foto:', error);
        } finally {
          setUploadingPhoto(null);
        }
      }
    } catch (error) {
      console.error('❌ Error seleccionando foto:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto. Intenta nuevamente.');
      setUploadingPhoto(null);
    }
  };

  // Opciones de foto
  const mostrarOpcionesFoto = (rescateId) => {
    const rescate = rescatesEnProceso.find(r => r.id === rescateId);
    
    Alert.alert(
      '📷 Documentar progreso del rescate',
      rescate?.fotoProgreso 
        ? 'Ya tienes una foto. ¿Quieres reemplazarla con una nueva?'
        : 'Agrega una foto para documentar el progreso del rescate',
      [
        {
          text: '📸 Tomar foto',
          onPress: () => tomarFoto(rescateId)
        },
        {
          text: '🖼️ Seleccionar de galería',
          onPress: () => seleccionarFoto(rescateId)
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  // Finalizar rescate
  const finalizarRescate = (rescate) => {
    // Validación de foto obligatoria
    if (!rescate.fotoProgreso) {
      Alert.alert(
        '📷 Foto requerida',
        'Es obligatorio subir una foto del rescate antes de finalizarlo. Esto ayuda a:\n\n• Documentar que el animal está bien\n• Generar confianza en la comunidad\n• Crear un historial del rescate',
        [
          { 
            text: '📸 Agregar foto ahora', 
            onPress: () => mostrarOpcionesFoto(rescate.id) 
          },
          { 
            text: 'Entendido', 
            style: 'cancel' 
          }
        ]
      );
      return;
    }

    // Confirmación de finalización
    Alert.alert(
      '✅ Finalizar rescate',
      `¿Confirmas que el rescate de "${rescate.descripcion.substring(0, 50)}..." ha sido completado exitosamente?`,
      [
        {
          text: 'Finalizar sin comentario',
          onPress: () => completarRescate(rescate, null)
        },
        {
          text: 'Agregar comentario final',
          onPress: () => abrirModalComentario(rescate)
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  // Funciones del modal de comentarios
  const abrirModalComentario = (rescate) => {
    setRescateActual(rescate);
    setComentarioInput('');
    setModalVisible(true);
  };

  const cerrarModalComentario = () => {
    setModalVisible(false);
    setRescateActual(null);
    setComentarioInput('');
  };

  const finalizarConComentario = () => {
    if (rescateActual) {
      completarRescate(rescateActual, comentarioInput.trim() || null);
      cerrarModalComentario();
    }
  };

  // Completar rescate
  const completarRescate = async (rescate, comentario) => {
    try {
      console.log('✅ [RescatesEnProcesoTab] Finalizando rescate:', rescate.id);
      
      const updateData = {
        estado: 'finalizado',
        fechaFinalizacion: Date.now(),
        estadoAnterior: rescate.estado,
        finalizadoPor: userProfile?.id || 'usuario_anonimo'
      };
      
      if (comentario && comentario.trim()) {
        updateData.comentarioFinal = comentario.trim();
      }
      
      await update(ref(db, `rescates/${rescate.id}`), updateData);
      console.log('✅ Rescate finalizado en Firebase');

      const tiempoTranscurrido = rescate.fechaAsignacion 
        ? Math.round((Date.now() - rescate.fechaAsignacion) / (1000 * 60 * 60))
        : 0;
      
      Alert.alert(
        '🎉 ¡Rescate completado exitosamente!', 
        `Gracias por ayudar a este animalito. Tu dedicación hace la diferencia.\n\n⏱️ Tiempo total: ${tiempoTranscurrido} horas\n📷 Documentado con foto: ✅\n💬 Comentario: ${comentario ? '✅' : '❌'}`,
        [
          { 
            text: 'Ver mis rescates', 
            onPress: () => console.log('Navegar a mis rescates') 
          },
          { 
            text: 'De nada 💙',
            style: 'default'
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error finalizando rescate:', error);
      Alert.alert(
        '❌ Error', 
        `No se pudo finalizar el rescate: ${error.message}\n\nIntenta nuevamente.`
      );
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>🔄 Cargando rescates en proceso...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <RescatesList>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={8}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#42a8a1']}
            />
          }
        >
          {rescatesEnProceso.length > 0 ? (
            rescatesEnProceso.map((rescate, index) => (
              <RescateCard key={rescate.id}>
                <CardHeader>
                  <AnimalAvatar small>
                    <AnimalInitial small>
                      {getAnimalInitial(rescate.descripcion)}
                    </AnimalInitial>
                  </AnimalAvatar>
                  
                  <CardContent>
                    <CardTitle>
                      ⏳ Rescate #{index + 1} 
                    </CardTitle>
                    
                    <StatusChip estado="en_proceso" small>
                      <StatusText small>En proceso</StatusText>
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
                  <InfoText>
                    Iniciado: {getTimeAgo(rescate.fechaAsignacion || rescate.fechaOriginal)}
                  </InfoText>
                </InfoRow>

                <InfoRow>
                  <InfoIcon>👤</InfoIcon>
                  <InfoText>Rescatista: {rescate.ayudante || 'Usuario voluntario'}</InfoText>
                </InfoRow>

                {rescate.creador && (
                  <InfoRow>
                    <InfoIcon>📝</InfoIcon>
                    <InfoText>Reportado por: {rescate.creador}</InfoText>
                  </InfoRow>
                )}

                {rescate.fotoProgreso && (
                  <PhotoContainer>
                    <PhotoPreview 
                      source={{ uri: rescate.fotoProgreso }} 
  
                    />
                    <InfoRow>
                      <InfoIcon>📷</InfoIcon>
                      <InfoText>
                        Foto agregada: {getTimeAgo(rescate.fechaFoto)}
                      </InfoText>
                    </InfoRow>
                  </PhotoContainer>
                )}

                <ActionContainer>
                  <ActionButton 
                    onPress={() => mostrarOpcionesFoto(rescate.id)}
                    disabled={uploadingPhoto === rescate.id}
                  >
                    <Ionicons 
                      name={uploadingPhoto === rescate.id ? "hourglass-outline" : "camera-outline"} 
                      size={16} 
                      color="#ffffff" 
                    />
                    <ActionButtonText>
                      {uploadingPhoto === rescate.id ? 'Subiendo...' : 
                       rescate.fotoProgreso ? 'Cambiar foto' : 'Agregar foto'}
                    </ActionButtonText>
                  </ActionButton>

                  <FinalizarButton 
                    onPress={() => finalizarRescate(rescate)}
                    hasPhoto={!!rescate.fotoProgreso}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#ffffff" />
                    <FinalizarButtonText>Finalizar rescate</FinalizarButtonText>
                  </FinalizarButton>
                </ActionContainer>

                {uploadingPhoto === rescate.id && (
                  <ProgressContainer>
                    <ProgressText>
                      📤 Subiendo foto del rescate... {uploadProgress[rescate.id] || 0}%
                    </ProgressText>
                  </ProgressContainer>
                )}

                {!rescate.fotoProgreso && (
                  <InfoRow style={{ backgroundColor: '#fff3cd', padding: 8, borderRadius: 8, marginTop: 8 }}>
                    <InfoIcon>⚠️</InfoIcon>
                    <InfoText style={{ color: '#856404', fontSize: 11 }}>
                      Se requiere una foto para finalizar el rescate
                    </InfoText>
                  </InfoRow>
                )}
              </RescateCard>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>⏳</EmptyIcon>
              <EmptyTitle>
                No hay rescates en proceso
              </EmptyTitle>
              <EmptySubtitle>
                Los rescates aparecerán aquí cuando los voluntarios los acepten y comiencen a trabajar en ellos.
              </EmptySubtitle>
            </EmptyState>
          )}
        </ScrollView>
      </RescatesList>

      {/* MODAL SIMPLE PARA COMENTARIOS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModalComentario}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            margin: 20,
            width: '90%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333',
                flex: 1
              }}>
                💬 Comentario final (opcional)
              </Text>
              <TouchableOpacity onPress={cerrarModalComentario}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 15,
              lineHeight: 20
            }}>
              Describe brevemente cómo se resolvió la situación del rescate:
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                padding: 12,
                height: 100,
                textAlignVertical: 'top',
                fontSize: 16,
                marginBottom: 20
              }}
              multiline={true}
              numberOfLines={4}
              placeholder="Ej: El perrito fue llevado al veterinario y está bien. Se encontró a su dueño..."
              value={comentarioInput}
              onChangeText={setComentarioInput}
              maxLength={200}
            />

            <Text style={{
              fontSize: 12,
              color: '#999',
              textAlign: 'right',
              marginBottom: 20
            }}>
              {comentarioInput.length}/200 caracteres
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#f1f1f1',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  flex: 1,
                  marginRight: 10
                }}
                onPress={cerrarModalComentario}
              >
                <Text style={{
                  color: '#666',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#42a8a1',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  flex: 1,
                  marginLeft: 10
                }}
                onPress={finalizarConComentario}
              >
                <Text style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  ✅ Finalizar rescate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default RescatesEnProcesoTab;