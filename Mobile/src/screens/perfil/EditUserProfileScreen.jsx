import React, { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { updateMiPerfilUsuario } from '../../services/userService';
import { ScreenContainer, FormContainer, Input, InputContainer, StyledButton, ButtonText, Title, Label } from '../../styles/ProfileStyles';

const EditUserProfileScreen = ({ route, navigation }) => {
  const { usuario } = route.params;

  const [formData, setFormData] = useState({
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    email: usuario.email || '',
    telefono: usuario.telefono || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.email) {
      Alert.alert('Error', 'El correo electrónico es obligatorio.');
      return;
    }
    setLoading(true);
    try {
      const response = await updateMiPerfilUsuario(formData);
      Alert.alert('Éxito', response.message || 'Tu perfil ha sido actualizado.');
      navigation.navigate('Profile', { updatedUser: response.user });
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo actualizar tu perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
      <FormContainer>
        <Title style={{ marginBottom: 32, alignSelf: 'center' }}>Editar mis datos</Title>

        <Label>Nombre</Label>
        <InputContainer>
          <Ionicons name="person-outline" size={22} color="#718096" />
          <Input value={formData.nombre} onChangeText={(val) => handleChange('nombre', val)} placeholder="Tu nombre" />
        </InputContainer>

        <Label>Apellido</Label>
        <InputContainer>
          <Ionicons name="person-outline" size={22} color="#718096" />
          <Input value={formData.apellido} onChangeText={(val) => handleChange('apellido', val)} placeholder="Tu apellido" />
        </InputContainer>
        
        <Label>Email</Label>
        <InputContainer>
          <Ionicons name="mail-outline" size={22} color="#718096" />
          <Input value={formData.email} onChangeText={(val) => handleChange('email', val)} placeholder="Email" keyboardType="email-address" autoCapitalize="none"/>
        </InputContainer>

        <Label>Teléfono</Label>
        <InputContainer>
          <Ionicons name="call-outline" size={22} color="#718096" />
          <Input value={formData.telefono} onChangeText={(val) => handleChange('telefono', val)} placeholder="Teléfono" keyboardType="phone-pad" />
        </InputContainer>
        
        {loading ? <ActivityIndicator size="large" color="#42a8a1" style={{ marginTop: 24 }}/> : (
            <StyledButton onPress={handleSave}>
              <Feather name="save" size={20} color="#fff" />
              <ButtonText>Guardar Cambios</ButtonText>
            </StyledButton>
        )}
      </FormContainer>
    </ScreenContainer>
  );
};

export default EditUserProfileScreen;