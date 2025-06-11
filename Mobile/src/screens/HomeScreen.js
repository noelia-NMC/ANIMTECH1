import React, { useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, TouchableOpacity, View, Alert, ActivityIndicator, Text } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getMisPerfiles } from '../services/perfilMascotaService'; 
import {
  Container, GradientHeader, HeaderContent, HeaderRow, HeaderTitle, HeaderSubtitle,
  MenuButton, Content, WelcomeSection, WelcomeMessage, WelcomeName, PetAvatarContainer,
  PetAvatar, CardsGrid, Card, CardGradient, CardIcon, CardContent, CardTitle,
  CardDescription, LastCheckedSection, LastCheckedTitle, LastCheckedTime,
  StatusContainer, StatusItem, StatusValue, StatusLabel, BottomNavigation,
  NavButton, NavButtonText, FooterContainer, QuickActionButton, ButtonNotch,
  NotificationBadge, NotificationText, CenteredContainer
} from '../styles/HomeStyles';

const HomeScreen = ({ navigation }) => {
  const animateScale = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  const [perfilMascota, setPerfilMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfilMascota = async () => {
      try {
        setLoading(true);
        setError(null);
        const misPerfiles = await getMisPerfiles();
        
        if (misPerfiles && misPerfiles.length > 0) {
          const primerPerfil = misPerfiles[0];
          setPerfilMascota(primerPerfil);
          startAnimations();
        } else {
          Alert.alert("No tienes mascotas", "Vamos a registrar tu primera mascota.", [
            { text: 'OK', onPress: () => navigation.replace('RegistroMascota') }
          ]);
        }
      } catch (err) {
        console.error('Error al cargar perfil de mascota:', err);
        setError('No se pudo obtener la información de tu mascota. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      cargarPerfilMascota();
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

  if (loading || !perfilMascota) {
    return (
      <CenteredContainer>
        {loading ? (
            <>
                <ActivityIndicator size="large" color="#42a8a1" />
                <Text style={{ marginTop: 10, color: '#888' }}>Cargando perfil...</Text>
            </>
        ) : (
            <Text>No se encontró información de la mascota.</Text>
        )}
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      </CenteredContainer>
    );
  }
  
  const especieLimpia = perfilMascota.especie ? perfilMascota.especie.toLowerCase().trim() : '';
  const esPerro = especieLimpia === 'canino' || especieLimpia === 'perro';
  const tieneCollar = !!perfilMascota.collar_id;
  
  const notifications = 2;

  const cardsData = [
    ...(esPerro && tieneCollar ? [{
      icon: 'thermometer-half',
      title: 'Ver Collar',
      description: 'Monitoreo en tiempo real',
      color: ['#42a8a1', '#5dc1b9'],
      screen: 'Collar',
    }] : []),
    {
      icon: 'user-alt',
      title: 'Mi Perfil',
      description: 'Tu información y la de tu mascota',
      color: ['#5dc1b9', '#8ae0db'],
      screen: 'Profile',
    },
    {
      icon: 'notes-medical',
      title: 'Historial Clínico',
      description: 'Visitas y vacunas',
      color: ['#8ae0db', '#b5ffff'],
      screen: 'HistorialClinico',
    },
    {
      icon: 'cog',
      title: 'Ajustes',
      description: 'Configurar app',
      color: ['#239089', '#42a8a1'],
      screen: 'Ajustes',
    },
  ];

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#42a8a1" translucent={true} />
      <GradientHeader colors={["#42a8a1", "#5dc1b9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <HeaderContent>
          <HeaderRow>
            <MenuButton onPress={() => navigation.openDrawer()}><Ionicons name="menu" size={28} color="#fff" /></MenuButton>
            <HeaderTitle>AnimTech</HeaderTitle>
            <TouchableOpacity onPress={() => { /* Navegar a notificaciones */ }}>
              <Ionicons name="notifications" size={26} color="#fff" />
              {notifications > 0 && <NotificationBadge><NotificationText>{notifications}</NotificationText></NotificationBadge>}
            </TouchableOpacity>
          </HeaderRow>
          <HeaderSubtitle>Cuidamos a tu mejor amigo</HeaderSubtitle>
        </HeaderContent>
      </GradientHeader>

      <Content showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }}>
          <WelcomeSection>
            <View>
              <WelcomeMessage>¡Hola, {perfilMascota.nombre}!</WelcomeMessage>
              <WelcomeName>¿Cómo te sientes hoy?</WelcomeName>
            </View>
            <PetAvatarContainer>
              <PetAvatar source={{ uri: perfilMascota.foto_url || 'https://cdn-icons-png.flaticon.com/512/616/616554.png' }} />
            </PetAvatarContainer>
          </WelcomeSection>

          {esPerro && tieneCollar && (
            <>
              <LastCheckedSection>
                <LastCheckedTitle>Último chequeo del collar:</LastCheckedTitle>
                <LastCheckedTime>Hace 10 minutos</LastCheckedTime>
              </LastCheckedSection>
              <StatusContainer>
                <StatusItem><StatusValue>38.2°C</StatusValue><StatusLabel>Temperatura</StatusLabel></StatusItem>
                <StatusItem><StatusValue>78</StatusValue><StatusLabel>Pulso</StatusLabel></StatusItem>
                <StatusItem><StatusValue>Normal</StatusValue><StatusLabel>Estado</StatusLabel></StatusItem>
              </StatusContainer>
            </>
          )}

          <CardsGrid>
            {cardsData.map((card, index) => (
              <Animated.View key={index} style={{ opacity: fadeAnim, transform: [{ scale: animateScale }] }}>
                <Card onPress={() => navigation.navigate(card.screen)} activeOpacity={0.9}>
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
            <NavButton active={true}><Ionicons name="home" size={24} color="#42a8a1" /><NavButtonText active={true}>Inicio</NavButtonText></NavButton>
            <NavButton><Ionicons name="stats-chart" size={24} color="#999" /><NavButtonText>Datos</NavButtonText></NavButton>
            <NavButton style={{ opacity: 0 }}><Ionicons name="add" size={24} color="#999" /></NavButton>
            
            <NavButton onPress={() => navigation.navigate('Eventos')}>
                <Ionicons name="calendar" size={24} color="#999" />
                <NavButtonText>Eventos</NavButtonText>
            </NavButton>

            <NavButton><Ionicons name="paw" size={24} color="#999" /><NavButtonText>Mascota</NavButtonText></NavButton>
        </BottomNavigation>
        <QuickActionButton>
            <ButtonNotch><Ionicons name="add" size={32} color="#fff" /></ButtonNotch>
        </QuickActionButton>
      </FooterContainer>
    </Container>
  );
};

export default HomeScreen;