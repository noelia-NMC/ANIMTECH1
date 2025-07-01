// src/screens/TeleconsultaScreen.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Alert, Linking, ActivityIndicator, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { crearTeleconsulta, getTeleconsultasDelPropietario } from '../services/teleconsultaService';
import { getMisPerfiles } from '../services/perfilMascotaService';
import {
  Container, ScrollContainer, Header, BackButton, HeaderTitle, FormCard, FormTitle, Label,
  PickerContainer, Input, SubmitButton, SubmitButtonGradient, SubmitButtonText, SectionTitle,
  Card, CardTitle, InfoRow, InfoLabel, InfoText, StatusPill, StatusText,
  JoinButton, JoinButtonText, EmptyText, CenteredView,
} from '../styles/TeleconsultaStyles';

export default function TeleconsultaScreen({ navigation }) {
  // === LÓGICA Y ESTADOS (SIN CAMBIOS) ===
  const [motivo, setMotivo] = useState('');
  const [consultas, setConsultas] = useState([]);
  const [misMascotas, setMisMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      const [resConsultas, resMascotas] = await Promise.all([
        getTeleconsultasDelPropietario(),
        getMisPerfiles(),
      ]);
      setConsultas(resConsultas.data);
      setMisMascotas(resMascotas); 
      if (resMascotas.length > 0 && !mascotaSeleccionada) {
        setMascotaSeleccionada(resMascotas[0].id);
      }
    } catch (error) {
      console.error(error.response?.data || error);
      Alert.alert('Error', 'No se pudieron cargar tus datos. Intenta iniciar sesión de nuevo.');
    }
  }, [mascotaSeleccionada]);

  useEffect(() => {
    setIsLoading(true);
    cargarDatos().finally(() => setIsLoading(false));
  }, [cargarDatos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cargarDatos().finally(() => setRefreshing(false));
  }, [cargarDatos]);

  const handleEnviar = async () => {
    if (!mascotaSeleccionada) {
      Alert.alert('Atención', 'Debes registrar una mascota antes de solicitar una consulta.');
      return;
    }
    if (!motivo.trim()) {
      Alert.alert('Atención', 'Por favor, describe el motivo de la consulta.');
      return;
    }
    try {
      setIsSubmitting(true);
      await crearTeleconsulta({ mascota_id: mascotaSeleccionada, motivo });
      setMotivo('');
      Alert.alert('Éxito', 'Tu solicitud ha sido enviada.');
      onRefresh(); 
    } catch (error) {
      console.error(error.response?.data || error);
      Alert.alert('Error', 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card>
      <CardTitle>Consulta para: {item.nombre_mascota}</CardTitle>
      <InfoRow>
        <InfoLabel>Motivo:</InfoLabel>
        <InfoText>{item.motivo}</InfoText>
      </InfoRow>
      <InfoRow>
        <InfoLabel>Fecha:</InfoLabel>
        <InfoText>{new Date(item.fecha).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</InfoText>
      </InfoRow>
      <InfoRow>
        <InfoLabel>Estado:</InfoLabel>
        <StatusPill estado={item.estado}>
          <StatusText>{item.estado}</StatusText>
        </StatusPill>
      </InfoRow>
      {item.estado === 'aceptada' && item.meet_link && (
        <JoinButton onPress={() => Linking.openURL(item.meet_link)}>
            <Ionicons name="videocam-outline" size={20} color="#fff" />
            <JoinButtonText>Unirse a la Videollamada</JoinButtonText>
        </JoinButton>
      )}
    </Card>
  );

  if (isLoading) {
    return <CenteredView><ActivityIndicator size="large" color="#42a8a1" /></CenteredView>;
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
        </BackButton>
        <HeaderTitle>Teleconsulta</HeaderTitle>
      </Header>
      <ScrollContainer 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <FormCard>
          <FormTitle>Nueva Solicitud</FormTitle>
          {misMascotas.length > 0 ? (
            <>
              <Label>Selecciona tu mascota:</Label>
              <PickerContainer>
                <Picker
                  selectedValue={mascotaSeleccionada}
                  onValueChange={(itemValue) => setMascotaSeleccionada(itemValue)}
                >
                  {misMascotas.map(mascota => (
                    <Picker.Item key={mascota.id} label={mascota.nombre} value={mascota.id} />
                  ))}
                </Picker>
              </PickerContainer>
              <Label>Describe el motivo de la consulta:</Label>
              <Input 
                placeholder="Ej: Mi perro no quiere comer, tiene vómitos..." 
                value={motivo} 
                onChangeText={setMotivo} 
                multiline
              />
              <SubmitButton onPress={handleEnviar} disabled={isSubmitting}>
                <SubmitButtonGradient colors={['#42a8a1', '#5dc1b9']}>
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="send-outline" size={18} color="#fff" />
                      <SubmitButtonText>Enviar Solicitud</SubmitButtonText>
                    </>
                  )}
                </SubmitButtonGradient>
              </SubmitButton>
            </>
          ) : (
            <EmptyText>Debes registrar al menos una mascota para poder solicitar una teleconsulta.</EmptyText>
          )}
        </FormCard>

        <SectionTitle>Mis Solicitudes</SectionTitle>
        {consultas.length === 0 ? (
          <EmptyText>No tienes solicitudes de teleconsulta activas o pasadas.</EmptyText>
        ) : (
          <FlatList
            data={consultas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false} 
          />
        )}
      </ScrollContainer>
    </Container>
  );
}