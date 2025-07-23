import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, Button, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { getMiPerfilUsuario } from '../../services/userService';
import { getMisPerfiles } from '../../services/perfilMascotaService';

import {
  ScreenContainer, Section, Card, SectionHeader, Title, PetName, Label, Value, EditLink, EditLinkText,
  AvatarImage, AvatarPlaceholder, InfoRow, InfoTextContainer,
} from '../../styles/ProfileStyles';

const ProfileScreen = ({ navigation, route }) => {
  const [usuario, setUsuario] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ padding: 5 }} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const cargarDatosIniciales = async () => {
    try {
      if (loading) return;
      setLoading(true);
      setError(null);
      const [datosUsuario, datosMascotas] = await Promise.all([ getMiPerfilUsuario(), getMisPerfiles() ]);
      setUsuario(datosUsuario);
      setMascotas(datosMascotas);
    } catch (err) {
      setError("No se pudieron cargar los datos. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!usuario) {
        cargarDatosIniciales();
      }
    }, [usuario])
  );
  
  useEffect(() => {
    if (route.params?.updatedUser) {
      setUsuario(route.params.updatedUser);
      navigation.setParams({ updatedUser: null });
    }
  }, [route.params?.updatedUser]);

  if (!usuario && loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#42a8a1" /><Text>Cargando perfil...</Text></View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}><Text style={styles.errorText}>{error}</Text><Button title="Reintentar" onPress={cargarDatosIniciales} color="#42a8a1" /></View>
    );
  }
  
  return (
    <ScreenContainer
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={cargarDatosIniciales} colors={["#42a8a1"]} />}
    >
      <Section style={{ paddingHorizontal: 24, paddingTop: 10 }}>
        <SectionHeader>
          <Title>Mi Perfil</Title>
          {usuario && (
            <EditLink onPress={() => navigation.navigate('EditUserProfile', { usuario })}>
              <EditLinkText>Editar</EditLinkText>
              <Feather name="edit-2" size={16} color="#42a8a1" />
            </EditLink>
          )}
        </SectionHeader>
        <Card>
          <InfoRow style={{marginTop: 0}}>
            <Ionicons name="person-circle-outline" size={26} color="#4a5568" />
            <InfoTextContainer>
              <Label>Nombre Completo</Label>
              <Value>{usuario?.nombre || usuario?.apellido ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() : 'No especificado'}</Value>
            </InfoTextContainer>
          </InfoRow>
          <InfoRow>
            <Ionicons name="mail-outline" size={24} color="#4a5568" />
            <InfoTextContainer>
              <Label>Email</Label>
              <Value>{usuario?.email}</Value>
            </InfoTextContainer>
          </InfoRow>
          <InfoRow>
            <Ionicons name="call-outline" size={24} color="#4a5568" />
            <InfoTextContainer>
              <Label>Teléfono</Label>
              <Value>{usuario?.telefono || 'No especificado'}</Value>
            </InfoTextContainer>
          </InfoRow>
        </Card>
      </Section>
      
      <Section style={{ paddingHorizontal: 24 }}>
        <SectionHeader>
            <Title>Mis Mascotas</Title>
        </SectionHeader>
        {mascotas.length > 0 ? mascotas.map((mascota) => (
          <Card key={mascota.id} style={{ marginTop: 16 }}>
            <View style={styles.petCardHeader}>
                {mascota.foto_url ? (<AvatarImage source={{ uri: mascota.foto_url }} style={styles.petAvatar} />) : (<AvatarPlaceholder style={styles.petAvatar}><MaterialCommunityIcons name="paw" size={30} color="#a0aec0" /></AvatarPlaceholder>)}
                <View style={styles.petInfoContainer}>
                    <SectionHeader style={{ marginBottom: 0 }}>
                        <PetName>{mascota.nombre}</PetName>
                        <EditLink onPress={() => navigation.navigate('EditPetProfile', { mascota })} style={{padding: 4}}>
                           <Feather name="edit-2" size={18} color="#42a8a1" />
                        </EditLink>
                    </SectionHeader>
                    <Text style={styles.petBreed}>{mascota.raza || mascota.especie}</Text>
                </View>
            </View>
            <View style={styles.petDetails}>
              <InfoRow style={{marginTop: 0}}>
                <MaterialCommunityIcons name={mascota.especie === 'canino' ? 'dog' : 'cat'} size={22} color="#4a5568" />
                <InfoTextContainer><Value>{mascota.especie}</Value></InfoTextContainer>
              </InfoRow>
              <InfoRow>
                <Ionicons name="calendar-outline" size={22} color="#4a5568" />
                <InfoTextContainer>
                  <Label>Fecha nacimiento</Label>
                  <Value>{new Date(mascota.fecha_nacimiento).toLocaleDateString()}</Value></InfoTextContainer>
              </InfoRow>
              <InfoRow>
                <MaterialCommunityIcons name={mascota.genero === 'Macho' ? 'gender-male' : 'gender-female'} size={22} color="#4a5568" />
                <InfoTextContainer>
                  <Label>Género</Label>
                  <Value>{mascota.genero}</Value></InfoTextContainer>
              </InfoRow>
              
              <InfoRow>
                <Feather name="clipboard" size={22} color="#4a5568" />
                <InfoTextContainer>
                  <Label>Notas Adicionales</Label>
                  <Value>{mascota.notas_adicionales || 'Sin notas.'}</Value>
                </InfoTextContainer>
              </InfoRow>
              
            </View>
          </Card>
        )) : (<Card style={{ marginTop: 12 }}><Text style={styles.infoText}>Aún no tienes mascotas registradas.</Text></Card>)}
      </Section>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f4f4f8' },
    errorText: { color: 'red', fontSize: 16, marginBottom: 15, textAlign: 'center' },
    infoText: { textAlign: 'center', color: '#888', paddingVertical: 20, fontSize: 16 },
    petCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    petAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16, borderWidth: 2, borderColor: '#42a8a1'},
    petInfoContainer: { flex: 1 },
    petBreed: { fontSize: 14, color: '#718096', textTransform: 'capitalize' },
    petDetails: { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8, marginTop: 12 }
});

export default ProfileScreen;