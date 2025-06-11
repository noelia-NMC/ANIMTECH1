import React, { useRef, useState, useEffect } from 'react';
import { Animated, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import {
  ContenedorBienvenida,
  GradienteContainer,
  Diapositiva,
  ContenedorAnimacion,
  AnimationBackground,
  ContenedorIlustracion,
  ImagenMascota,
  ContenedorTexto,
  Titulo,
  Descripcion,
  BotonInicio,
  TextoBoton,
  PaginacionContenedor,
  PuntoPaginacion,
  BotonIcono,
  HeaderContainer,
  BrandText,
  PawIcon,
  PatternOverlay,
  ContenedorHuella,
  Blob,
  SkipButton,
  SkipText
} from '../styles/WelcomeStyles';

const slides = [
  {
    image: 'https://assets5.lottiefiles.com/packages/lf20_syqnfe7c.json',
    title: 'Bienvenido a AnimTech',
    description: 'La tecnología que cuida la salud y bienestar de tu fiel compañero. Monitoreo avanzado y amigable.',
    color: 'rgba(66, 168, 161, 0.15)',
  },
  {
    image: 'https://assets3.lottiefiles.com/packages/lf20_zw0djhar.json',
    title: 'Monitoreo inteligente',
    description: 'Temperatura, pulso y actividad en tiempo real con alertas inteligentes cuando tu mascota lo necesita.',
    color: 'rgba(66, 168, 161, 0.2)',
  },
  {
    image: 'https://assets1.lottiefiles.com/private_files/lf30_TBKozE.json',
    title: 'Cuidado preventivo',
    description: 'Detecta anomalías antes de que se conviertan en problemas. La tranquilidad que tú y tu mascota merecen.',
    color: 'rgba(66, 168, 161, 0.25)',
  },
];

const DogPaw = () => (
  <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
    <Ionicons name="paw" size={16} color="#ffffff" />
  </View>
);

const WelcomeScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;
  const blobsAnimation = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobsAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(blobsAnimation, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const handleSlideChange = (index) => {
    setActiveIndex(index);
    animation.setValue(0);

    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    if (lottieRef.current) {
      lottieRef.current.play(0, 120);
    }
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  const blobPositions = [
    { top: '10%', right: '15%', size: '40px', opacity: 0.2, scale: 1 },
    { top: '30%', left: '10%', size: '30px', opacity: 0.15, scale: 0.8 },
    { bottom: '40%', right: '20%', size: '25px', opacity: 0.1, scale: 0.7 },
    { bottom: '15%', left: '15%', size: '35px', opacity: 0.2, scale: 0.9 },
  ];

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacityAnim = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const blobTranslateY = blobsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <ContenedorBienvenida>
      <StatusBar style="dark" />
      <LinearGradient colors={['#e4f5f3', '#f0f9f8']} style={{ flex: 1 }}>
        <HeaderContainer>
          <BrandText>ANIMTECH</BrandText>
          <PawIcon>
            <DogPaw />
          </PawIcon>
        </HeaderContainer>

        {blobPositions.map((pos, index) => (
          <Animated.View 
            key={index}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: [{ translateY: Animated.multiply(blobTranslateY, index % 2 === 0 ? 1 : -1) }]
            }}
          >
            <Blob size={pos.size} opacity={pos.opacity} scale={pos.scale} />
          </Animated.View>
        ))}

        <Swiper
          loop={false}
          dot={<PuntoPaginacion />}
          activeDot={<PuntoPaginacion activo />}
          onIndexChanged={handleSlideChange}
          paginationStyle={{ bottom: 20 }}
          showsButtons={false}
        >
          {slides.map((slide, index) => (
            <Diapositiva key={index}>
              <ContenedorAnimacion>
                <AnimationBackground />
                <ContenedorIlustracion>
                  <LottieView
                    ref={lottieRef}
                    source={{ uri: slide.image }}
                    autoPlay
                    loop
                    style={{ width: 240, height: 240 }}
                  />
                </ContenedorIlustracion>
              </ContenedorAnimacion>

              <Animated.View
                style={{
                  width: '100%',
                  opacity: opacityAnim,
                  transform: [{ translateY }]
                }}
              >
                <ContenedorTexto>
                  <Titulo>{slide.title}</Titulo>
                  <Descripcion>{slide.description}</Descripcion>
                  
                  {index === slides.length - 1 && (
                    <BotonInicio onPress={() => navigation.replace('Login')} activeOpacity={0.8}>
                      <TextoBoton>Comenzar</TextoBoton>
                      <BotonIcono>
                        <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                      </BotonIcono>
                    </BotonInicio>
                  )}
                </ContenedorTexto>
              </Animated.View>
            </Diapositiva>
          ))}
        </Swiper>

        {activeIndex !== slides.length - 1 && (
          <SkipButton onPress={() => navigation.replace('Login')}>
            <SkipText>Omitir</SkipText>
          </SkipButton>
        )}
      </LinearGradient>
    </ContenedorBienvenida>
  );
};

export default WelcomeScreen;
