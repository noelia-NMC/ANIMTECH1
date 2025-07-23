import React, { useState, useEffect, useRef } from 'react';
import { 
  Alert, 
  Animated, 
  Keyboard, 
  TouchableWithoutFeedback, 
  ScrollView,
  Dimensions,
  View,
  BackHandler
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../../services/loginServices';
import { Ionicons } from '@expo/vector-icons'; 

import {
  Container,
  GradientBackground,
  ContentContainer,
  LogoContainer,
  Logo,
  Title,
  Subtitle,
  FormContainer,
  InputContainer,
  Input,
  IconContainer,
  Button,
  ButtonText,
  LinkText,
  InputLabel,
  ForgotPasswordText,
  LoadingSpinner,
  DecorativeElement,
  FloatingShape,
  PawPattern
} from '../../styles/LoginStyles';

const { height: screenHeight } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  // 🎯 SEPARAR ANIMACIONES - SOLO useNativeDriver: true
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const formTranslateY = useRef(new Animated.Value(0)).current;
  
  // 📱 REF PARA EL SCROLL VIEW
  const scrollViewRef = useRef(null);
  
  useEffect(() => {
    // 🎯 MANEJAR BOTÓN ATRÁS FÍSICO EN LOGIN
    const backAction = () => {
      Alert.alert(
        'Salir de AnimTech',
        '¿Estás seguro que quieres salir de la aplicación?',
        [
          { text: 'Cancelar', onPress: () => null, style: 'cancel' },
          { text: 'Salir', onPress: () => BackHandler.exitApp() }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    const animationSequence = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      })
    ]);
    
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    );
    
    // 🎯 LISTENERS MEJORADOS PARA EL TECLADO
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        const newKeyboardHeight = e.endCoordinates.height;
        setKeyboardVisible(true);
        setKeyboardHeight(newKeyboardHeight);
        
        // 🎨 ANIMACIONES MÁS SUAVES Y NATURALES
        Animated.parallel([
          // Ocultar logo completamente
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          // Mover formulario a posición centrada y cómoda
          Animated.timing(formTranslateY, {
            toValue: -30, // 🎯 MENOS MOVIMIENTO, MÁS NATURAL
            duration: 250,
            useNativeDriver: true,
          })
        ]).start();
        
        // 📱 SCROLL MÁS SUAVE Y MODERADO
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: 50, // 🎯 MENOS SCROLL PARA QUE SE VEA MEJOR
            animated: true
          });
        }, 150);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
        
        // 🎨 RESTAURAR TODO CON SCROLL AL INICIO
        Animated.parallel([
          // Mostrar logo gradualmente
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          // Bajar formulario a posición original
          Animated.timing(formTranslateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          })
        ]).start();
        
        // 📱 VOLVER AL INICIO DEL SCROLL
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: 0,
            animated: true
          });
        }, 100);
      }
    );
    
    animationSequence.start();
    floatingAnimation.start();
    
    // Cleanup
    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      backHandler.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await loginUsuario(email, password);
      await AsyncStorage.setItem('userToken', response.data.token);
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
      
      // 🎯 RESET NAVIGATION STACK - LIMPIAR HISTORIAL
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainDrawer' }],
      });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Fallo en el servidor');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  
  // 🎯 NAVEGACIÓN CORREGIDA - REEMPLAZAR EN LUGAR DE APILAR
  const navigateToRegister = () => {
    navigation.replace('Register');
  };
  
  const handleForgotPassword = () => Alert.alert('Recuperar', '¡Función en desarrollo!');

  const getFloatingTransform = (multiplier = 1) => ({
    transform: [{
      translateY: floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 8 * multiplier]
      })
    }]
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <GradientBackground
          colors={['#a8e6cf', '#88d8c0', '#7fcdcd', '#42a8a1', '#239089']}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* 🎨 ELEMENTOS DECORATIVOS FLOTANTES - Solo cuando NO hay teclado */}
          {!keyboardVisible && (
            <>
              <Animated.View style={[{ position: 'absolute', top: '15%', right: '10%' }, getFloatingTransform(0.5)]}>
                <FloatingShape size={60} color="rgba(255, 255, 255, 0.1)" />
              </Animated.View>
              
              <Animated.View style={[{ position: 'absolute', top: '25%', left: '8%' }, getFloatingTransform(-0.8)]}>
                <FloatingShape size={40} color="rgba(255, 255, 255, 0.08)" />
              </Animated.View>
              
              <Animated.View style={[{ position: 'absolute', bottom: '30%', right: '15%' }, getFloatingTransform(1.2)]}>
                <FloatingShape size={35} color="rgba(255, 255, 255, 0.06)" />
              </Animated.View>
              
              <Animated.View style={[{ position: 'absolute', bottom: '20%', left: '12%' }, getFloatingTransform(-0.6)]}>
                <FloatingShape size={45} color="rgba(255, 255, 255, 0.12)" />
              </Animated.View>

              {/* Patrón de huellas */}
              <PawPattern>
                <Ionicons name="paw" size={12} color="rgba(255, 255, 255, 0.05)" />
              </PawPattern>
            </>
          )}

          {/* 🚀 SCROLL VIEW OPTIMIZADO PARA TECLADO */}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ 
              flexGrow: 1,
              justifyContent: keyboardVisible ? 'flex-start' : 'center',
              paddingHorizontal: 15,
              paddingVertical: keyboardVisible ? 30 : 40, // 🎯 MÁS PADDING CUANDO HAY TECLADO
              paddingBottom: keyboardVisible ? 20 : 40, // 🎯 MENOS PADDING BOTTOM
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={true}
            overScrollMode="auto"
            keyboardDismissMode="interactive" // 🎯 OCULTAR TECLADO AL HACER SCROLL
          >
            <Animated.View style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
              width: '100%',
              marginTop: keyboardVisible ? 60 : 0, // 🎯 MARGEN MÁS EQUILIBRADO
            }}>
              <View style={{ 
                width: '100%', 
                maxWidth: 420,
                alignSelf: 'center' 
              }}>
                {/* 🎯 LOGO CONTAINER CON VISIBILIDAD CONDICIONAL */}
                <Animated.View style={{ 
                  opacity: logoOpacity,
                  height: keyboardVisible ? 0 : 'auto', // 🎯 COLAPSAR ALTURA CUANDO HAY TECLADO
                  overflow: 'hidden'
                }}>
                  <LogoContainer>
                    <DecorativeElement />
                    <Logo 
                      source={{ 
                        uri: 'https://www.shutterstock.com/image-vector/cat-dog-logo-line-art-260nw-2493421035.jpg'
                      }} 
                      resizeMode="contain"
                    />
                    <Title>AnimTech</Title>
                    <Subtitle>Cuidando a tus compañeros peludos</Subtitle>
                  </LogoContainer>
                </Animated.View>
                
                {/* 🎯 FORMULARIO CON ANIMACIÓN MEJORADA */}
                <Animated.View style={{
                  transform: [{ translateY: formTranslateY }]
                }}>
                  <FormContainer style={{
                    width: '100%',
                    paddingHorizontal: 24,
                    marginTop: keyboardVisible ? 10 : 0, // 🎯 MARGEN MÍNIMO
                  }}>
                    <InputLabel>Correo electrónico</InputLabel>
                    <InputContainer focused={email.length > 0}>
                      <IconContainer>
                        <Ionicons name="mail-outline" size={18} color="#5dc1b9" />
                      </IconContainer>
                      <Input
                        placeholder="tu@correo.com"
                        placeholderTextColor="rgba(93, 193, 185, 0.6)"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        returnKeyType="next"
                        onFocus={() => {
                          // 🎯 SCROLL MÍNIMO AL ENFOCAR INPUT
                          if (keyboardVisible) {
                            setTimeout(() => {
                              scrollViewRef.current?.scrollTo({
                                y: 80,
                                animated: true
                              });
                            }, 100);
                          }
                        }}
                      />
                    </InputContainer>
                    
                    <InputLabel>Contraseña</InputLabel>
                    <InputContainer focused={password.length > 0}>
                      <IconContainer>
                        <Ionicons name="lock-closed-outline" size={18} color="#5dc1b9" />
                      </IconContainer>
                      <Input
                        placeholder="Tu contraseña"
                        placeholderTextColor="rgba(93, 193, 185, 0.6)"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                        onFocus={() => {
                          // 🎯 SCROLL MÍNIMO AL ENFOCAR SEGUNDO INPUT
                          if (keyboardVisible) {
                            setTimeout(() => {
                              scrollViewRef.current?.scrollTo({
                                y: 100,
                                animated: true
                              });
                            }, 100);
                          }
                        }}
                      />
                      <TouchableWithoutFeedback onPress={toggleShowPassword}>
                        <IconContainer>
                          <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={18}
                            color="#5dc1b9"
                          />
                        </IconContainer>
                      </TouchableWithoutFeedback>
                    </InputContainer>
                    
                    <ForgotPasswordText onPress={handleForgotPassword}>
                      ¿Olvidaste tu contraseña?
                    </ForgotPasswordText>
                    
                    <Button onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                      {loading ? (
                        <LoadingSpinner>
                          <Ionicons name="sync" size={20} color="#ffffff" />
                        </LoadingSpinner>
                      ) : (
                        <>
                          <ButtonText>Iniciar sesión</ButtonText>
                          <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
                        </>
                      )}
                    </Button>
                    
                    <LinkText onPress={navigateToRegister}>
                      ¿No tienes cuenta? <LinkText bold>Regístrate aquí</LinkText>
                    </LinkText>
                  </FormContainer>
                </Animated.View>
              </View>
            </Animated.View>
          </ScrollView>
        </GradientBackground>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;