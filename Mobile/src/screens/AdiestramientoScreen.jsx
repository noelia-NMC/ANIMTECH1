// src/screens/AdiestramientoScreen.jsx

import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, Alert, LayoutAnimation, UIManager, Platform, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getMisPerfiles } from '../services/perfilMascotaService';
import {
  Container, Header, BackButton, HeaderTitle, Content, SectionTitle,
  CarouselContainer, CardContainer, CardImageBackground, GradientOverlay, TextContainer,
  CardTitle, CardDescription, PaginationContainer, PaginationDot, CenteredContainer,
  AccordionContainer, AccordionItem, AccordionHeader, AccordionTitle, AccordionBody,
  ProTipContainer, ProTipText,
  StepContainer, StepNumberCircle, StepNumberText, StepText,
} from '../styles/AdiestramientoStyles';
import { dataPerro, dataGato } from './data/adiestramientoData';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth } = Dimensions.get('window');

const AdiestramientoScreen = ({ navigation }) => {
  const [perfilMascota, setPerfilMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const misPerfiles = await getMisPerfiles();
        if (misPerfiles && misPerfiles.length > 0) setPerfilMascota(misPerfiles[0]);
        else {
          setError("No se encontró un perfil de mascota.");
          Alert.alert("Sin Mascota", "Registra una mascota para ver los consejos.", [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        }
      } catch (err) { setError("No se pudo cargar la información."); } 
      finally { setLoading(false); }
    };
    cargarPerfil();
  }, [navigation]);

  const handleScroll = ({ nativeEvent }) => {
    const cardWidth = screenWidth * 0.9 + 15;
    const index = Math.round(nativeEvent.contentOffset.x / cardWidth);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };
  
  if (loading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={{ marginTop: 10, color: '#888' }}>Preparando todo para tu mascota...</Text>
      </CenteredContainer>
    );
  }

  if (error || !perfilMascota) {
    return (
      <CenteredContainer>
        <Ionicons name="alert-circle-outline" size={60} color="#f00" />
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 15, fontSize: 16 }}>
          {error || 'No hay perfil de mascota para mostrar.'}
        </Text>
      </CenteredContainer>
    );
  }

  const especieLimpia = perfilMascota.especie.toLowerCase().trim();
  const esPerro = especieLimpia === 'canino' || especieLimpia === 'perro';
  const data = esPerro ? dataPerro : dataGato;
  const tipoMascota = esPerro ? 'perro' : 'gato';

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </BackButton>
        <HeaderTitle>Guía para tu {tipoMascota}</HeaderTitle>
      </Header>

      <Content>
        {/* --- SECCIÓN 1: CONSEJOS --- */}
        <SectionTitle>Consejos de convivencia</SectionTitle>
        <CarouselContainer onScroll={handleScroll} scrollEventThrottle={16}>
          {data.consejos.map((item) => (
            <CardContainer key={item.id}>
              <CardImageBackground source={{ uri: item.image }} resizeMode="cover">
                <GradientOverlay />
                <TextContainer>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </TextContainer>
              </CardImageBackground>
            </CardContainer>
          ))}
        </CarouselContainer>
        <PaginationContainer>
          {data.consejos.map((_, index) => (
            <PaginationDot key={`dot-${index}`} active={index === activeIndex} />
          ))}
        </PaginationContainer>

        {/* --- SECCIÓN 2: TUTORIALES MEJORADOS --- */}
        <SectionTitle>Tutoriales de adiestramiento</SectionTitle>
        <AccordionContainer>
          {data.tutoriales.map((item) => (
            <AccordionItem key={item.id}>
              <AccordionHeader onPress={() => toggleAccordion(item.id)}>
                <FontAwesome5 name={item.icon} size={20} color="#42a8a1" solid/>
                <AccordionTitle>{item.title}</AccordionTitle>
                <Ionicons 
                  name={expandedId === item.id ? 'chevron-up-outline' : 'chevron-down-outline'} 
                  size={24} color="#555" 
                />
              </AccordionHeader>
              {expandedId === item.id && (
                <AccordionBody>
                  {item.pro_tip && (
                    <ProTipContainer>
                       <FontAwesome5 name="lightbulb" size={18} color="#2b615d" solid/>
                       <ProTipText>{item.pro_tip}</ProTipText>
                    </ProTipContainer>
                  )}
                  {item.steps.map((step, index) => (
                    <StepContainer key={index}>
                      <StepNumberCircle>
                         <StepNumberText>{index + 1}</StepNumberText>
                      </StepNumberCircle>
                      <StepText>{step}</StepText>
                    </StepContainer>
                  ))}
                </AccordionBody>
              )}
            </AccordionItem>
          ))}
        </AccordionContainer>
      </Content>
    </Container>
  );
};

export default AdiestramientoScreen;