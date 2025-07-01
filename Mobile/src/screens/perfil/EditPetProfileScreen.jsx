import React, { useState } from 'react';
import { Platform, Alert, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, Feather } from '@expo/vector-icons';
import { actualizarPerfilMascota } from '../../services/perfilMascotaService';
import {
  ScreenContainer, FormContainer, Label, InputContainer, Input, TextArea, StyledButton, ButtonText,
  AvatarContainer, AvatarImage, AvatarPlaceholder, EditIconCircle
} from '../../styles/ProfileStyles';

const EditPetProfileScreen = ({ route, navigation }) => {
  const { mascota } = route.params;

  const [formData, setFormData] = useState({ ...mascota, fecha_nacimiento: new Date(mascota.fecha_nacimiento) });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.fecha_nacimiento;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({ ...formData, fecha_nacimiento: currentDate });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'fecha_nacimiento') data.append(key, formData[key].toISOString().split('T')[0]);
      else if (key !== 'foto_url' && formData[key] !== null) data.append(key, String(formData[key]));
    });
    if (newImage) {
      const uriParts = newImage.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      data.append('foto_file', { uri: newImage.uri, name: `photo.${fileType}`, type: `image/${fileType}` });
    } else {
      data.append('foto_url', formData.foto_url || '');
    }
    try {
      await actualizarPerfilMascota(mascota.id, data);
      Alert.alert('Éxito', 'Perfil actualizado.');
      navigation.goBack(); // Para mascotas, goBack es suficiente ya que la lista se recarga.
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo actualizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
      <FormContainer>
        <AvatarContainer onPress={pickImage}>
          {newImage?.uri || formData.foto_url ? (
            <AvatarImage source={{ uri: newImage?.uri || formData.foto_url }} />
          ) : (
            <AvatarPlaceholder><Ionicons name="image-outline" size={50} color="#a0aec0" /></AvatarPlaceholder>
          )}
          <EditIconCircle><Feather name="camera" size={20} color="#42a8a1" /></EditIconCircle>
        </AvatarContainer>
        <Label>Nombre de tu mascota</Label>
        <InputContainer>
            <Ionicons name="paw-outline" size={22} color="#718096" />
            <Input value={formData.nombre} onChangeText={(val) => handleChange('nombre', val)} />
        </InputContainer>
        <Label>Fecha de Nacimiento</Label>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Ionicons name="calendar-outline" size={22} color="#718096" />
            <Text style={styles.datePickerText}>{formData.fecha_nacimiento.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={formData.fecha_nacimiento} mode="date" display="spinner" onChange={handleDateChange}/>
        )}
        <Label>Notas Adicionales </Label>
        <InputContainer style={{alignItems: 'flex-start', paddingTop: 14}}>
            <Feather name="clipboard" size={22} color="#718096" style={{marginTop: 2}}/>
            <TextArea multiline value={formData.notas_adicionales} onChangeText={(val) => handleChange('notas_adicionales', val)} placeholder="Alergias, comportamiento, etc." />
        </InputContainer>
        {loading ? <ActivityIndicator size="large" color="#42a8a1" /> : (
          <StyledButton onPress={handleSave}>
            <Feather name="save" size={20} color="#fff" />
            <ButtonText>Guardar Cambios</ButtonText>
          </StyledButton>
        )}
      </FormContainer>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#edf2f7',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 8,
        marginBottom: 16,
    },
    datePickerText: {
        fontSize: 16,
        color: '#1a202c',
        marginLeft: 12,
    }
});

export default EditPetProfileScreen;