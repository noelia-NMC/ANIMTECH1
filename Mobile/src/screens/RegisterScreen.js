import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { registrarUsuario } from '../services/loginServices';
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
  LinkText
} from '../styles/RegisterStyles';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
      setLoading(false);
      Alert.alert('Éxito', 'Usuario registrado exitosamente');
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.response?.data?.message || 'Fallo en el servidor');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    
    if (password.length > 7) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  
  const strengthColors = ['#ccc', '#ff5252', '#ffa000', '#8bc34a', '#4caf50'];
  const strengthTexts = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <GradientBackground
          colors={['#9cecee', '#7bd5d0', '#5dc1b9']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        >
          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            width: '100%'
          }}>
            <ContentContainer>
              <HeaderContainer>
                <BackButton onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#239089" />
                </BackButton>
                <PageTitle>Crear Cuenta</PageTitle>
              </HeaderContainer>
              
              <StepsIndicator>
                <StepDot active={true} />
                <StepDot active={false} />
                <StepDot active={false} />
              </StepsIndicator>
              
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
                    placeholder="Crea una contraseña"
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

                {password && (
                  <StepsIndicator style={{ marginBottom: 15 }}>
                    {[0, 1, 2, 3].map((index) => (
                      <StepDot 
                        key={index} 
                        active={index < passwordStrength} 
                        color={index < passwordStrength ? strengthColors[passwordStrength] : '#ccc'}
                      />
                    ))}
                    {passwordStrength > 0 && (
                      <InputLabel style={{ marginLeft: 10, color: strengthColors[passwordStrength] }}>
                        {strengthTexts[passwordStrength]}
                      </InputLabel>
                    )}
                  </StepsIndicator>
                )}
                
                <InputLabel>Confirmar Contraseña</InputLabel>
                <InputContainer>
                  <IconContainer>
                    <Ionicons name="lock-closed-outline" size={20} color="#5dc1b9" />
                  </IconContainer>
                  <Input
                    placeholder="Repite tu contraseña"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                  />
                </InputContainer>
                
                <SecurityNote>
                  <Ionicons name="information-circle-outline" size={16} color="#5dc1b9" />
                  <SecurityNoteText>
                    Para mayor seguridad, usa al menos 8 caracteres con números y símbolos.
                  </SecurityNoteText>
                </SecurityNote>
                
                <Button onPress={handleRegister} disabled={loading}>
                  {loading ? (
                    <Ionicons name="sync" size={24} color="#ffffff" />
                  ) : (
                    <ButtonText>Crear cuenta</ButtonText>
                  )}
                </Button>

                <LinkText onPress={() => navigation.navigate('Login')}>
                  ¿Ya tienes cuenta? <LinkText bold>Inicia sesión</LinkText>
                </LinkText>
              </FormContainer>
            </ContentContainer>
          </Animated.View>
        </GradientBackground>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;