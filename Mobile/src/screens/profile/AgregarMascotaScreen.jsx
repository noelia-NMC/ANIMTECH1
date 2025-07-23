// src/screens/AgregarMascotaScreen.jsx

import React, { useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { registrarPerfilMascota } from '../../services/perfilMascotaService';
// Importamos los mismos estilos que la pantalla de registro
import {
  ScreenContainer, HeaderContainer, Title, Subtitle, FormSection, Label,
  InputContainer, Input, PickerContainer, SpeciesSelector, SpeciesButton, SpeciesText,
  CollarSection, CollarTitle, CollarInfo, SubmitButton, SubmitButtonGradient, SubmitButtonText
} from '../../styles/RegistroMascotaStyles';

const AgregarMascotaScreen = ({ navigation }) => {
    // --- LÓGICA Y ESTADOS (SIN CAMBIOS) ---
    const [nombre, setNombre] = useState('');
    const [especie, setEspecie] = useState('canino');
    const [raza, setRaza] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [collarId, setCollarId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegistro = async () => {
        if (!nombre.trim() || !especie || !fechaNacimiento.trim() || !genero) {
            Alert.alert('Campos Incompletos', 'Por favor, rellena todos los campos obligatorios.');
            return;
        }
        setLoading(true);
        try {
            const datosMascota = {
                nombre: nombre.trim(), especie, raza: raza.trim(),
                fecha_nacimiento: fechaNacimiento.trim(), genero,
                collar_id: especie === 'canino' ? collarId.trim() : null,
            };
            await registrarPerfilMascota(datosMascota);
            Alert.alert('¡Mascota añadida!', `${nombre} ahora es parte de la familia AnimTech.`);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error de registro', error.message || 'No se pudo registrar la mascota.');
        } finally {
            setLoading(false);
        }
    };
    // --- FIN DE LA LÓGICA ---

    return (
        <ScreenContainer>
            <HeaderContainer>
                <Subtitle>Completa el perfil de tu nueva mascota.</Subtitle>
            </HeaderContainer>

            <FormSection>
                <Label>¿Es un perro o un gato?</Label>
                <SpeciesSelector>
                    <SpeciesButton isActive={especie === 'canino'} onPress={() => setEspecie('canino')}>
                        <Ionicons name="logo-octocat" size={24} color={especie === 'canino' ? '#2d6e68' : '#4b5563'} />
                        <SpeciesText isActive={especie === 'canino'}>Perro</SpeciesText>
                    </SpeciesButton>
                    <SpeciesButton isActive={especie === 'felino'} onPress={() => setEspecie('felino')}>
                        <Ionicons name="logo-github" size={24} color={especie === 'felino' ? '#2d6e68' : '#4b5563'} />
                        <SpeciesText isActive={especie === 'felino'}>Gato</SpeciesText>
                    </SpeciesButton>
                </SpeciesSelector>
            </FormSection>

            <FormSection>
                <Label>Nombre de tu mascota</Label>
                <InputContainer>
                    <Ionicons name="paw-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                    <Input placeholder="Ej: Rocky, Luna..." value={nombre} onChangeText={setNombre} />
                </InputContainer>
            </FormSection>

            <FormSection>
                <Label>Raza (opcional)</Label>
                <InputContainer>
                    <Ionicons name="leaf-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                    <Input placeholder="Ej: Pug, Siamés..." value={raza} onChangeText={setRaza} />
                </InputContainer>
            </FormSection>

            <FormSection>
                <Label>Fecha de nacimiento</Label>
                <InputContainer>
                    <Ionicons name="calendar-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                    <Input placeholder="Formato: AAAA-MM-DD" value={fechaNacimiento} onChangeText={setFechaNacimiento} />
                </InputContainer>
            </FormSection>

            <FormSection>
                <Label>Género</Label>
                <PickerContainer>
                    <Picker selectedValue={genero} onValueChange={setGenero} style={{ height: 52, width: '100%' }}>
                        <Picker.Item label="Selecciona su género..." value="" />
                        <Picker.Item label="Macho" value="Macho" />
                        <Picker.Item label="Hembra" value="Hembra" />
                    </Picker>
                </PickerContainer>
            </FormSection>

            {especie === 'canino' && (
                <FormSection>
                    <CollarSection>
                        <CollarTitle>Vincular collar inteligente (opcional)</CollarTitle>
                        <InputContainer>
                            <Ionicons name="hardware-chip-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                            <Input placeholder="Ingresa el ID del collar" value={collarId} onChangeText={setCollarId} />
                        </InputContainer>
                        <CollarInfo>Si no tienes un collar ahora, puedes agregarlo más tarde.</CollarInfo>
                    </CollarSection>
                </FormSection>
            )}

            <SubmitButton onPress={handleRegistro} disabled={loading}>
                <SubmitButtonGradient colors={['#5dc1b9', '#42a8a1']}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="add-circle-outline" size={20} color="#fff" />
                            <SubmitButtonText>Añadir mascota</SubmitButtonText>
                        </>
                    )}
                </SubmitButtonGradient>
            </SubmitButton>
        </ScreenContainer>
    );
};

export default AgregarMascotaScreen;