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
import { registrarUsuario } from '../../services/loginServices';
import { Ionicons } from '@expo/vector-icons';

import {
  Container,
  GradientBackground,
  ContentContainer,
  HeaderContainer,
  BackButton,
  PageTitle,
  FormContainer,
  InputContainer,
  Input,
  IconContainer,
  Button,
  ButtonText,
  InputLabel,
  StepsIndicator,
  StepDot,
  SecurityNote,
  SecurityNoteText,
  LinkText,
  LoadingSpinner,
  PasswordStrengthContainer,
  PasswordStrengthText,
  FloatingShape,
  PawPattern
} from '../../styles/RegisterStyles';

const STRENGTH_CONFIG = {
  colors: ['#e0e0e0', '#ff5252', '#ffa000', '#8bc34a', '#4caf50'],
  texts: ['', 'Débil', 'Regular', 'Buena', 'Fuerte']
};

const { height: screenHeight } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  // 🎯 SEPARAR ANIMACIONES - SOLO useNativeDriver: true
  const stepsOpacity = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current; // 🎯 NUEVA ANIMACIÓN PARA HEADER
  const formTranslateY = useRef(new Animated.Value(0)).current;
  
  // 📱 REF PARA EL SCROLL VIEW
  const scrollViewRef = useRef(null);
  
  useEffect(() => {
    // 🎯 MANEJAR BOTÓN ATRÁS FÍSICO EN REGISTER - SIEMPRE IR A LOGIN
    const backAction = () => {
      navigation.replace('Login');
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
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3500,
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
          // Ocultar header (flecha + título)
          Animated.timing(headerOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          // Ocultar steps indicator
          Animated.timing(stepsOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          // Mover formulario menos ahora que no hay header
          Animated.timing(formTranslateY, {
            toValue: -30, // 🎯 MENOS MOVIMIENTO PORQUE YA NO HAY HEADER
            duration: 250,
            useNativeDriver: true,
          })
        ]).start();
        
        // 📱 SCROLL MÁS SUAVE
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: 60, // 🎯 MENOS SCROLL PORQUE NO HAY HEADER
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
          // Mostrar header
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          // Mostrar steps
          Animated.timing(stepsOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          // Bajar formulario
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

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const calculatePasswordStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length > 7) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await registrarUsuario(email, password);
      Alert.alert('Éxito', 'Usuario registrado exitosamente');
      
      // 🎯 IR AL LOGIN LIMPIANDO EL STACK
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Fallo en el servidor');
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => {
    // 🎯 VOLVER AL LOGIN LIMPIANDO EL STACK
    navigation.replace('Login');
  };
  
  const navigateToLogin = () => {
    // 🎯 IR AL LOGIN LIMPIANDO EL STACK
    navigation.replace('Login');
  };

  const passwordStrength = calculatePasswordStrength();

  const getFloatingTransform = (multiplier = 1) => ({
    transform: [{
      translateY: floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10 * multiplier]
      })
    }]
  });

  const renderPasswordStrength = () => {
    if (!password) return null;

    return (
      <PasswordStrengthContainer>
        <StepsIndicator>
          {[0, 1, 2, 3].map((index) => (
            <StepDot 
              key={`strength-${index}`}
              active={index < passwordStrength} 
              color={index < passwordStrength ? STRENGTH_CONFIG.colors[passwordStrength] : '#e0e0e0'}
              size="small"
            />
          ))}
        </StepsIndicator>
        {passwordStrength > 0 && (
          <PasswordStrengthText color={STRENGTH_CONFIG.colors[passwordStrength]}>
            {STRENGTH_CONFIG.texts[passwordStrength]}
          </PasswordStrengthText>
        )}
      </PasswordStrengthContainer>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <GradientBackground
          colors={['#a8e6cf', '#7bd5d0', '#5dc1b9', '#42a8a1', '#239089']}
          locations={[0, 0.3, 0.6, 0.8, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* 🎨 ELEMENTOS DECORATIVOS - Solo cuando NO hay teclado */}
          {!keyboardVisible && (
            <>
              <Animated.View style={[{ position: 'absolute', top: '12%', right: '8%' }, getFloatingTransform(0.7)]}>
                <FloatingShape size={50} color="rgba(255, 255, 255, 0.12)" />
              </Animated.View>
              
              <Animated.View style={[{ position: 'absolute', bottom: '25%', right: '12%' }, getFloatingTransform(1.1)]}>
                <FloatingShape size={40} color="rgba(255, 255, 255, 0.1)" />
              </Animated.View>

              <PawPattern style={{ top: '60%', right: '20%' }}>
                <Ionicons name="paw" size={10} color="rgba(255, 255, 255, 0.04)" />
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
              paddingVertical: keyboardVisible ? 25 : 20, // 🎯 PADDING OPTIMIZADO
              paddingBottom: keyboardVisible ? 30 : 20, // 🎯 ESPACIO PARA EL BOTÓN
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
              marginTop: keyboardVisible ? 50 : 0, // 🎯 MÁS MARGEN PORQUE NO HAY HEADER
            }}>
              <View style={{ 
                width: '100%', 
                maxWidth: 420,
                alignSelf: 'center' 
              }}>
                {/* 🎯 HEADER CON VISIBILIDAD CONDICIONAL */}
                <Animated.View style={{ 
                  opacity: headerOpacity,
                  height: keyboardVisible ? 0 : 'auto', // 🎯 COLAPSAR ALTURA CUANDO HAY TECLADO
                  overflow: 'hidden'
                }}>
                  <HeaderContainer>
                    <BackButton onPress={navigateBack} activeOpacity={0.7}>
                      <Ionicons name="arrow-back" size={22} color="#239089" />
                    </BackButton>
                    <PageTitle>Crear cuenta</PageTitle>
                  </HeaderContainer>
                </Animated.View>
                
                {/* 🎯 STEPS INDICATOR CON VISIBILIDAD CONDICIONAL */}
                <Animated.View style={{ 
                  opacity: stepsOpacity,
                  height: keyboardVisible ? 0 : 'auto', // 🎯 COLAPSAR ALTURA CUANDO HAY TECLADO
                  overflow: 'hidden'
                }}>
                  <StepsIndicator>
                    <StepDot active={true} />
                    <StepDot active={false} />
                    <StepDot active={false} />
                  </StepsIndicator>
                </Animated.View>
                
                {/* 🎯 FORMULARIO CON ANIMACIÓN MEJORADA */}
                <Animated.View style={{
                  transform: [{ translateY: formTranslateY }]
                }}>
                  <FormContainer style={{
                    width: '100%',
                    paddingHorizontal: 24,
                    marginTop: keyboardVisible ? 10 : 0, // 🎯 MARGEN MÍNIMO PORQUE YA NO HAY HEADER
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
                          // 🎯 SCROLL MÍNIMO AL ENFOCAR (MENOS PORQUE NO HAY HEADER)
                          if (keyboardVisible) {
                            setTimeout(() => {
                              scrollViewRef.current?.scrollTo({
                                y: 70,
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
                        placeholder="Crea una contraseña"
                        placeholderTextColor="rgba(93, 193, 185, 0.6)"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        returnKeyType="next"
                        onFocus={() => {
                          // 🎯 SCROLL AL SEGUNDO INPUT (AJUSTADO)
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

                    {/* 🎯 PASSWORD STRENGTH - Solo cuando NO hay teclado */}
                    {!keyboardVisible && renderPasswordStrength()}
                    
                    <InputLabel>Confirmar contraseña</InputLabel>
                    <InputContainer focused={confirmPassword.length > 0}>
                      <IconContainer>
                        <Ionicons name="lock-closed-outline" size={18} color="#5dc1b9" />
                      </IconContainer>
                      <Input
                        placeholder="Repite tu contraseña"
                        placeholderTextColor="rgba(93, 193, 185, 0.6)"
                        secureTextEntry={!showPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                        onFocus={() => {
                          // 🎯 SCROLL AL TERCER INPUT (AJUSTADO)
                          if (keyboardVisible) {
                            setTimeout(() => {
                              scrollViewRef.current?.scrollTo({
                                y: 130,
                                animated: true
                              });
                            }, 100);
                          }
                        }}
                      />
                      {confirmPassword && password && (
                        <IconContainer>
                          <Ionicons
                            name={password === confirmPassword ? "checkmark-circle" : "close-circle"}
                            size={18}
                            color={password === confirmPassword ? "#4caf50" : "#ff5252"}
                          />
                        </IconContainer>
                      )}
                    </InputContainer>
                    
                    {/* 🎯 SECURITY NOTE - Solo cuando NO hay teclado */}
                    {!keyboardVisible && (
                      <SecurityNote>
                        <Ionicons name="information-circle-outline" size={16} color="#5dc1b9" />
                        <SecurityNoteText>
                          Para mayor seguridad, usa al menos 8 caracteres con números y símbolos.
                        </SecurityNoteText>
                      </SecurityNote>
                    )}
                    
                    <Button onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
                      {loading ? (
                        <LoadingSpinner>
                          <Ionicons name="sync" size={20} color="#ffffff" />
                        </LoadingSpinner>
                      ) : (
                        <>
                          <ButtonText>Crear cuenta</ButtonText>
                          <Ionicons name="checkmark" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
                        </>
                      )}
                    </Button>

                    <LinkText onPress={navigateToLogin}>
                      ¿Ya tienes cuenta? <LinkText bold>Inicia sesión</LinkText>
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

export default RegisterScreen;