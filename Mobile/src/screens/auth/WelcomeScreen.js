import React, { useRef, useState, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ContenedorBienvenida,
  Diapositiva,
  ContenedorAnimacion,
  AnimationBackground,
  ContenedorIlustracion,
  ContenedorTexto,
  Titulo,
  Descripcion,
  BotonInicio,
  TextoBoton,
  PuntoPaginacion,
  BotonIcono,
  HeaderContainer,
  BrandText,
  PawIcon,
  Blob,
  SkipButton,
  SkipText
} from '../../styles/WelcomeStyles';

const { width } = Dimensions.get('window');

const SLIDES_DATA = [
  {
    lottieUrl: 'https://assets5.lottiefiles.com/packages/lf20_syqnfe7c.json',
    title: 'Bienvenido a AnimTech',
    description: 'La tecnología que cuida la salud y bienestar de tu fiel compañero. Monitoreo avanzado y amigable.'
  },
  {
    lottieUrl: 'https://assets3.lottiefiles.com/packages/lf20_zw0djhar.json',
    title: 'Monitoreo inteligente',
    description: 'Temperatura, pulso y actividad en tiempo real con alertas inteligentes cuando tu mascota lo necesita.'
  },
  {
    lottieUrl: 'https://assets1.lottiefiles.com/private_files/lf30_TBKozE.json',
    title: 'Cuidado preventivo',
    description: 'Detecta anomalías antes de que se conviertan en problemas. La tranquilidad que tú y tu mascota merecen.'
  }
];

const BLOB_POSITIONS = [
  { top: '15%', right: '10%', size: 42, opacity: 0.12 },
  { top: '30%', left: '8%', size: 35, opacity: 0.08 },
  { bottom: '40%', right: '12%', size: 28, opacity: 0.06 },
  { bottom: '25%', left: '15%', size: 38, opacity: 0.1 },
  { top: '50%', right: '5%', size: 25, opacity: 0.05 }
];

const ANIMATION_CONFIG = {
  slideTransition: { duration: 800, useNativeDriver: true },
  blobFloat: { duration: 5000, useNativeDriver: true },
  initialFade: { duration: 1000, useNativeDriver: true }
};

const PawIconComponent = () => (
  <PawIcon>
    <Ionicons name="paw" size={18} color="#ffffff" />
  </PawIcon>
);

const WelcomeScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const blobAnimation = useRef(new Animated.Value(0)).current;
  const lottieRefs = useRef([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    initializeAnimations();
    startBlobAnimation();
  }, []);

  const initializeAnimations = () => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      ...ANIMATION_CONFIG.initialFade
    }).start();

    if (lottieRefs.current[0]) {
      lottieRefs.current[0].play();
    }
  };

  const startBlobAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobAnimation, {
          toValue: 1,
          ...ANIMATION_CONFIG.blobFloat
        }),
        Animated.timing(blobAnimation, {
          toValue: 0,
          ...ANIMATION_CONFIG.blobFloat
        })
      ])
    ).start();
  };

  const handleSlideChange = (index) => {
    setActiveIndex(index);
    slideAnimation.setValue(0);

    Animated.timing(slideAnimation, {
      toValue: 1,
      ...ANIMATION_CONFIG.slideTransition
    }).start();

    if (lottieRefs.current[index]) {
      lottieRefs.current[index].play(0, 120);
    }
  };

  const navigateToLogin = () => navigation.replace('Login');

  const slideTransform = {
    opacity: slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    }),
    transform: [{
      translateY: slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0]
      })
    }]
  };

  const getBlobTransform = (index) => ({
    transform: [{
      translateY: blobAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, index % 2 === 0 ? 6 : -6]
      })
    }, {
      scale: blobAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.05, 1]
      })
    }]
  });

  const renderBlobs = () => (
    BLOB_POSITIONS.map((position, index) => (
      <Animated.View
        key={`blob-${index}`}
        style={[
          {
            position: 'absolute',
            ...position
          },
          getBlobTransform(index)
        ]}
      >
        <Blob size={position.size} opacity={position.opacity} />
      </Animated.View>
    ))
  );

  const renderSlide = (slide, index) => (
    <Diapositiva key={`slide-${index}`}>
      <ContenedorAnimacion>
        <AnimationBackground />
        <ContenedorIlustracion>
          <LottieView
            ref={ref => lottieRefs.current[index] = ref}
            source={{ uri: slide.lottieUrl }}
            autoPlay
            loop
            style={{ 
              width: Math.min(width * 0.55, 260), 
              height: Math.min(width * 0.55, 260) 
            }}
            resizeMode="contain"
          />
        </ContenedorIlustracion>
      </ContenedorAnimacion>

      <Animated.View style={[{ width: '100%' }, slideTransform]}>
        <ContenedorTexto>
          <Titulo>{slide.title}</Titulo>
          <Descripcion>{slide.description}</Descripcion>
          
          {index === SLIDES_DATA.length - 1 && (
            <BotonInicio onPress={navigateToLogin} activeOpacity={0.85}>
              <TextoBoton>Comenzar</TextoBoton>
              <BotonIcono>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </BotonIcono>
            </BotonInicio>
          )}
        </ContenedorTexto>
      </Animated.View>
    </Diapositiva>
  );

  return (
    <ContenedorBienvenida>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      
      <LinearGradient 
        colors={['#e4f5f3', '#f0f9f8']} 
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <HeaderContainer safeTop={insets.top}>
          <BrandText>ANIMTECH</BrandText>
          <PawIconComponent />
        </HeaderContainer>

        {renderBlobs()}

        <Swiper
          loop={false}
          dot={<PuntoPaginacion />}
          activeDot={<PuntoPaginacion activo />}
          onIndexChanged={handleSlideChange}
          paginationStyle={{ 
            bottom: Math.max(insets.bottom + 10, 25),
            paddingHorizontal: 20
          }}
          showsButtons={false}
          removeClippedSubviews={false}
          loadMinimal={true}
          loadMinimalSize={1}
        >
          {SLIDES_DATA.map(renderSlide)}
        </Swiper>

        {activeIndex !== SLIDES_DATA.length - 1 && (
          <SkipButton 
            onPress={navigateToLogin} 
            activeOpacity={0.7}
            safeBottom={insets.bottom}
          >
            <SkipText>Omitir</SkipText>
          </SkipButton>
        )}
      </LinearGradient>
    </ContenedorBienvenida>
  );
};

export default WelcomeScreen;