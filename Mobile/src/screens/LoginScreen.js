import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../services/loginServices';
import { Ionicons } from '@expo/vector-icons'; 

import {
  Container,
  GradientBackground,
  ContentContainer,
  LogoContainer,
  Logo,
  Title,
  FormContainer,
  InputContainer,
  Input,
  IconContainer,
  Button,
  ButtonText,
  LinkText,
  ButtonContainer,
  InputLabel,
  ForgotPasswordText
} from '../styles/LoginStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
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
      setLoading(false);
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
      navigation.replace('MainDrawer');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.response?.data?.message || 'Fallo en el servidor');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <GradientBackground
          colors={['#9cecee', '#8ae0db', '#6bcbc5']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        >
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            width: '100%'
          }}>
            <ContentContainer>
              <LogoContainer>
                <Logo source={{ uri: 'https://cdn-icons-png.flaticon.com/512/616/616554.png' }} />
                <Title>AnimTech</Title>
              </LogoContainer>
              
              <FormContainer>
                <InputLabel>Correo Electrónico</InputLabel>
                <InputContainer>
                  <IconContainer>
                    <Ionicons name="mail-outline" size={20} color="#5dc1b9" />
                  </IconContainer>
                  <Input
                    placeholder="tu@correo.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </InputContainer>
                
                <InputLabel>Contraseña</InputLabel>
                <InputContainer>
                  <IconContainer>
                    <Ionicons name="lock-closed-outline" size={20} color="#5dc1b9" />
                  </IconContainer>
                  <Input
                    placeholder="Tu contraseña"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                  <TouchableWithoutFeedback onPress={toggleShowPassword}>
                    <IconContainer>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#5dc1b9"
                      />
                    </IconContainer>
                  </TouchableWithoutFeedback>
                </InputContainer>
                
                <ForgotPasswordText onPress={() => Alert.alert('Recuperar', '¡Función en desarrollo!')}>
                  ¿Olvidaste tu contraseña?
                </ForgotPasswordText>
                
                <ButtonContainer>
                  <Button onPress={handleLogin} disabled={loading}>
                    {loading ? (
                      <Ionicons name="sync" size={24} color="#ffffff" />
                    ) : (
                      <ButtonText>Iniciar Sesión</ButtonText>
                    )}
                  </Button>
                </ButtonContainer>
                
                <LinkText onPress={() => navigation.navigate('Register')}>
                  ¿No tienes cuenta? <LinkText bold>Regístrate aquí</LinkText>
                </LinkText>
              </FormContainer>
            </ContentContainer>
          </Animated.View>
        </GradientBackground>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;