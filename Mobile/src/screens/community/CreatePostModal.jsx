// Mobile/src/screens/community/CreatePostModal.js - CORREGIDO
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { communityStyles } from '../../styles/CommunityStyles'; // CORREGIDO
import { getMisPerfiles } from '../../services/perfilMascotaService'; // TU SERVICIO EXISTENTE

const CreatePostModal = ({ visible, onClose, onSubmit }) => {
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascota, setSelectedMascota] = useState('');
  const [contenido, setContenido] = useState('');
  const [tipoPost, setTipoPost] = useState('normal');
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMascotas, setLoadingMascotas] = useState(false);

  // Cargar mascotas usando TU servicio existente
  useEffect(() => {
    if (visible) {
      loadMascotas();
    }
  }, [visible]);

  const loadMascotas = async () => {
    setLoadingMascotas(true);
    try {
      const mascotas = await getMisPerfiles(); // TU FUNCIÓN EXISTENTE
      setMascotas(mascotas);
      if (mascotas.length > 0) {
        setSelectedMascota(mascotas[0].id.toString());
      }
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
      Alert.alert('Error', 'No se pudieron cargar tus mascotas');
    } finally {
      setLoadingMascotas(false);
    }
  };

  // Limpiar formulario al cerrar
  const handleClose = () => {
    setSelectedMascota('');
    setContenido('');
    setTipoPost('normal');
    setImagen(null);
    onClose();
  };

  // Seleccionar imagen
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Necesitamos acceso a tus fotos para subir imágenes.');
        return;
      }

      Alert.alert('Seleccionar imagen', 'Elige una opción:', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galería', onPress: () => openImagePicker('library') },
        { text: 'Cámara', onPress: () => openImagePicker('camera') },
      ]);
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  };

  const openImagePicker = async (type) => {
    try {
      let result;

      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Error', 'Se necesitan permisos de cámara');
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setImagen(result.assets[0]);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const removeImage = () => setImagen(null);

  // Validar formulario
  const validateForm = () => {
    if (!selectedMascota) {
      Alert.alert('Error', 'Debes seleccionar una mascota');
      return false;
    }

    if (!contenido.trim()) {
      Alert.alert('Error', 'El contenido de la publicación no puede estar vacío');
      return false;
    }

    if (contenido.trim().length < 10) {
      Alert.alert('Error', 'El contenido debe tener al menos 10 caracteres');
      return false;
    }

    return true;
  };

  // Enviar publicación
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const postData = {
        mascota_id: selectedMascota,
        contenido: contenido.trim(),
        tipo_post: tipoPost,
      };

      if (imagen) {
        postData.imagen = imagen;
      }

      await onSubmit(postData);
      handleClose();
    } catch (error) {
      console.error('Error al crear post:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tipos de publicación
  const tiposPost = [
    { value: 'normal', label: '📷 Publicación normal' },
    { value: 'adopcion', label: '💚 En adopción' },
    { value: 'perdido', label: '🔍 Perdido' },
    { value: 'encontrado', label: '✅ Encontrado' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={communityStyles.modalOverlay}>
        <View style={communityStyles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Título */}
            <Text style={communityStyles.modalTitle}>Nueva Publicación</Text>

            {/* Seleccionar mascota */}
            <View style={communityStyles.formGroup}>
              <Text style={communityStyles.label}>Mascota:</Text>
              {loadingMascotas ? (
                <ActivityIndicator size="small" color="#42a8a1" />
              ) : (
                <View style={communityStyles.picker}>
                  <Picker
                    selectedValue={selectedMascota}
                    onValueChange={setSelectedMascota}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Selecciona una mascota..." value="" />
                    {mascotas.map((mascota) => (
                      <Picker.Item
                        key={mascota.id}
                        label={`${mascota.nombre} (${mascota.raza || 'Sin raza'})`}
                        value={mascota.id.toString()}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            {/* Tipo de publicación */}
            <View style={communityStyles.formGroup}>
              <Text style={communityStyles.label}>Tipo de publicación:</Text>
              <View style={communityStyles.picker}>
                <Picker
                  selectedValue={tipoPost}
                  onValueChange={setTipoPost}
                  style={{ height: 50 }}
                >
                  {tiposPost.map((tipo) => (
                    <Picker.Item
                      key={tipo.value}
                      label={tipo.label}
                      value={tipo.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Contenido */}
            <View style={communityStyles.formGroup}>
              <Text style={communityStyles.label}>
                ¿Qué está haciendo tu mascota? *
              </Text>
              <TextInput
                style={[communityStyles.textInput, { height: 100 }]}
                multiline
                numberOfLines={4}
                placeholder="Comparte algo especial sobre tu mascota..."
                value={contenido}
                onChangeText={setContenido}
                maxLength={500}
              />
              <Text style={[communityStyles.secondaryText, { fontSize: 12, marginTop: 5 }]}>
                {contenido.length}/500 caracteres
              </Text>
            </View>

            {/* Imagen */}
            <View style={communityStyles.formGroup}>
              <Text style={communityStyles.label}>Foto (opcional):</Text>
              
              {imagen ? (
                <View style={communityStyles.imagePreviewContainer}>
                  <Image
                    source={{ uri: imagen.uri }}
                    style={communityStyles.imagePreview}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: 15,
                      width: 30,
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={removeImage}
                  >
                    <Ionicons name="close" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={communityStyles.addImageButton}
                  onPress={pickImage}
                >
                  <Ionicons name="camera-outline" size={30} color="#6c757d" />
                  <Text style={communityStyles.addImageText}>
                    Toca para agregar una foto
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Botones */}
            <View style={communityStyles.modalButtons}>
              <TouchableOpacity
                style={[communityStyles.modalButton, communityStyles.cancelButton]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={communityStyles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[communityStyles.modalButton, communityStyles.submitButton]}
                onPress={handleSubmit}
                disabled={loading || !selectedMascota || !contenido.trim()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={communityStyles.modalButtonText}>Publicar</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePostModal;