import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Alert, ActivityIndicator, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMisPerfiles } from '../../services/perfilMascotaService';

import {
  Container, GradientHeader, HeaderContent, HeaderRow, HeaderTitle, HeaderSubtitle,
  MenuButton, Content, WelcomeSection, WelcomeMessage, WelcomeName, PetAvatarContainer,
  PetAvatar, CardsGrid, Card, CardGradient, CardIcon, CardContent, CardTitle,
  CardDescription, BottomNavigation, NavButton, NavButtonText, FooterContainer,
  QuickActionButton, ButtonNotch, NotificationBadge, NotificationText, CenteredContainer,
  ChangePetIcon, ModalOverlay, ModalContentContainer, ModalHeader, ModalTitle, CloseModalButton,
  PetSelectItem, PetSelectAvatar, PetSelectName, AddPetButton, AddPetButtonText, ChatbotButton
} from '../../styles/HomeStyles';

const HomeScreen = ({ navigation }) => {
  const animateScale = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  const [perfilesMascotas, setPerfilesMascotas] = useState([]);
  const [perfilActivo, setPerfilActivo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarPerfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const misPerfiles = await getMisPerfiles();
      if (misPerfiles && misPerfiles.length > 0) {
        setPerfilesMascotas(misPerfiles);
        const ultimoIdActivo = await AsyncStorage.getItem('perfilActivoId');
        const perfilGuardado = misPerfiles.find(p => p.id.toString() === ultimoIdActivo);
        
        const perfilAEstablecer = perfilGuardado || misPerfiles[0];
        setPerfilActivo(perfilAEstablecer);
        await AsyncStorage.setItem('perfilActivoId', perfilAEstablecer.id.toString());
        
        startAnimations();
      } else {
        Alert.alert("No tienes mascotas", "Vamos a registrar tu primera mascota.", [
          { text: 'OK', onPress: () => navigation.replace('RegistroMascota') }
        ]);
      }
    } catch (err) {
      console.error('Error al cargar perfiles de mascota:', err);
      setError('No se pudo obtener la información de tus mascotas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarPerfiles();
    });
    return unsubscribe;
  }, [navigation]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.spring(animateScale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideUpAnim, { toValue: 0, duration: 700, useNativeDriver: true })
    ]).start();
  };

  const cambiarPerfilActivo = async (mascota) => {
    setPerfilActivo(mascota);
    await AsyncStorage.setItem('perfilActivoId', mascota.id.toString());
    setModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f7f9' }}>
        <CenteredContainer>
          <ActivityIndicator size="large" color="#42a8a1" />
          <Text style={{ marginTop: 10, color: '#888' }}>Cargando perfiles...</Text>
        </CenteredContainer>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f7f9' }}>
        <CenteredContainer>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        </CenteredContainer>
      </SafeAreaView>
    );
  }

  if (!perfilActivo) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f7f9' }}>
        <CenteredContainer>
          <Text style={{ color: '#888', textAlign: 'center' }}>No hay perfil de mascota para mostrar.</Text>
        </CenteredContainer>
      </SafeAreaView>
    );
  }

  const especieLimpia = perfilActivo.especie ? perfilActivo.especie.toLowerCase().trim() : '';
  const esPerro = especieLimpia === 'canino' || especieLimpia === 'perro';
  const tieneCollar = !!perfilActivo.collar_id;
  const notifications = 2;

  const cardsData = [
    ...(esPerro && tieneCollar ? [{ 
      icon: 'thermometer-half', 
      title: 'Ver collar', 
      description: 'Monitoreo en tiempo real', 
      color: ['#42a8a1', '#5dc1b9'], 
      screen: 'Collar', 
      params: { mascotaId: perfilActivo.id } 
    }] : []),
    { 
      icon: 'user-alt', 
      title: 'Mi perfil', 
      description: 'Tu info y la de tus mascotas', 
      color: ['#5dc1b9', '#8ae0db'], 
      screen: 'Profile' 
    },
    { 
      icon: 'notes-medical', 
      title: 'Historial clínico', 
      description: 'Visitas y vacunas', 
      color: ['#8ae0db', '#b5ffff'], 
      screen: 'HistorialClinico', 
      params: { mascotaId: perfilActivo.id, nombreMascota: perfilActivo.nombre } 
    },
    { 
      icon: 'cog', 
      title: 'Ajustes', 
      description: 'Configurar app', 
      color: ['#239089', '#42a8a1'], 
      screen: 'Ajustes' 
    },
  ];

  return (
    <Container>
      <StatusBar style="light" backgroundColor="#42a8a1" />
      
      <GradientHeader colors={["#42a8a1", "#5dc1b9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <SafeAreaView>
          <HeaderContent>
            <HeaderRow>
              <MenuButton onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" size={28} color="#fff" />
              </MenuButton>
              <HeaderTitle>AnimTech</HeaderTitle>
              <TouchableOpacity onPress={() => { /* Navegar a Notificaciones */ }}>
                <Ionicons name="notifications" size={26} color="#fff" />
                {notifications > 0 && (
                  <NotificationBadge>
                    <NotificationText>{notifications}</NotificationText>
                  </NotificationBadge>
                )}
              </TouchableOpacity>
            </HeaderRow>
            <HeaderSubtitle>Cuidamos a tu mejor amigo</HeaderSubtitle>
          </HeaderContent>
        </SafeAreaView>
      </GradientHeader>

      <Content showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
          <WelcomeSection>
            <View>
              <WelcomeMessage>¡Hola de nuevo!</WelcomeMessage>
              <WelcomeName>{perfilActivo.nombre}, ¿listo para la acción?</WelcomeName>
            </View>
            <PetAvatarContainer onPress={() => setModalVisible(true)}>
              <PetAvatar source={{ uri: perfilActivo.foto_url || 'https://cdn-icons-png.flaticon.com/512/616/616554.png' }} />
              <ChangePetIcon>
                <Ionicons name="swap-horizontal" size={14} color="#fff" />
              </ChangePetIcon>
            </PetAvatarContainer>
          </WelcomeSection>

          <CardsGrid>
            {cardsData.map((card, index) => (
              <Animated.View key={index} style={{ opacity: fadeAnim, transform: [{ scale: animateScale }] }}>
                <Card onPress={() => navigation.navigate(card.screen, card.params || {})} activeOpacity={0.9}>
                  <CardGradient colors={card.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <CardIcon><FontAwesome5 name={card.icon} size={28} color="#fff" /></CardIcon>
                  </CardGradient>
                  <CardContent>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardContent>
                </Card>
              </Animated.View>
            ))}
          </CardsGrid>
        </Animated.View>
      </Content>

      <FooterContainer>
        <BottomNavigation>
          <NavButton active={true}>
            <Ionicons name="home" size={24} color="#42a8a1" />
            <NavButtonText active={true}>Inicio</NavButtonText>
          </NavButton>
          <NavButton onPress={() => navigation.navigate('Reportes')}>
            <Ionicons name="document-text-outline" size={24} color="#999" />
            <NavButtonText>Reportes</NavButtonText>
          </NavButton>
          <NavButton style={{ opacity: 0 }} />
          <NavButton onPress={() => navigation.navigate('Eventos')}>
            <Ionicons name="calendar" size={24} color="#999" />
            <NavButtonText>Eventos</NavButtonText>
          </NavButton>
          <NavButton onPress={() => navigation.navigate('Adiestramiento')}>
            <Ionicons name="paw" size={24} color="#999" />
            <NavButtonText>Adiestrar</NavButtonText>
          </NavButton>
        </BottomNavigation>
        <QuickActionButton onPress={() => navigation.navigate('AgregarMascota')}>
          <ButtonNotch><Ionicons name="add" size={32} color="#fff" /></ButtonNotch>
        </QuickActionButton>
      </FooterContainer>

      {/* BOTÓN FLOTANTE DEL CHATBOT */}
      <ChatbotButton onPress={() => navigation.navigate('Chatbot')}>
        <FontAwesome5 name="robot" size={26} color="#fff" />
      </ChatbotButton>

      {/* Modal de selección de mascota */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <ModalOverlay onPressOut={() => setModalVisible(false)}>
          <ModalContentContainer>
            <ModalHeader>
              <ModalTitle>Selecciona una mascota</ModalTitle>
              <CloseModalButton onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#ccc" />
              </CloseModalButton>
            </ModalHeader>
            <FlatList
              data={perfilesMascotas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <PetSelectItem onPress={() => cambiarPerfilActivo(item)} isActive={item.id === perfilActivo.id}>
                  <PetSelectAvatar source={{ uri: item.foto_url || 'https://cdn-icons-png.flaticon.com/512/616/616554.png' }} />
                  <PetSelectName>{item.nombre}</PetSelectName>
                  {item.id === perfilActivo.id && <Ionicons name="checkmark-circle" size={24} color="#4caf50" style={{ marginLeft: 'auto' }} />}
                </PetSelectItem>
              )}
            />
            <AddPetButton onPress={() => { setModalVisible(false); navigation.navigate('AgregarMascota'); }}>
              <Ionicons name="add-circle-outline" size={24} color="#388e3c" />
              <AddPetButtonText>Añadir otra mascota</AddPetButtonText>
            </AddPetButton>
          </ModalContentContainer>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

export default HomeScreen;