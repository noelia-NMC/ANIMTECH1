import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LoginCard,
  Title,
  Subtitle,
  Form,
  InputContainer,
  Input,
  SubmitButton,
  SecondaryButton,
  DecorativeElement,
  LoadingSpinner,
  ResponsiveWrapper,
  ButtonContainer
} from '../styles/loginStyled';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login(email, password);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <ResponsiveWrapper>
      <LoginContainer>
        {/* Elementos decorativos flotantes */}
        <DecorativeElement size="150px" top="10%" left="10%" duration="5s" delay="0s" />
        <DecorativeElement size="100px" top="20%" right="15%" duration="7s" delay="1s" />
        <DecorativeElement size="80px" bottom="15%" left="20%" duration="6s" delay="2s" />
        <DecorativeElement size="120px" bottom="25%" right="10%" duration="8s" delay="0.5s" />

        <LoginCard>
          <Title>¡Bienvenido!</Title>
          <Subtitle>Inicia sesión para continuar</Subtitle>

          <Form onSubmit={handleLogin}>
            <InputContainer delay="0.2s">
              <Input
                type="email"
                placeholder="📧 Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </InputContainer>

            <InputContainer delay="0.4s">
              <Input
                type="password"
                placeholder="🔒 Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </InputContainer>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Iniciando sesión...
                </>
              ) : (
                'Entrar'
              )}
            </SubmitButton>

            <ButtonContainer>
              <SecondaryButton type="button" onClick={handleRegister} disabled={isLoading}>
                ¿No tienes cuenta? Regístrate
              </SecondaryButton>
            </ButtonContainer>
          </Form>
        </LoginCard>
      </LoginContainer>
    </ResponsiveWrapper>
  );
}
