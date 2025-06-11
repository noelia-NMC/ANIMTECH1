import { useState } from 'react';
import { register } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import {
  RegisterContainer,
  RegisterCard,
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
} from '../styles/registerStyles';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await register(email, password);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <ResponsiveWrapper>
      <RegisterContainer>
        {/* Elementos decorativos flotantes */}
        <DecorativeElement size="150px" top="10%" left="10%" duration="5s" delay="0s" />
        <DecorativeElement size="100px" top="20%" right="15%" duration="7s" delay="1s" />
        <DecorativeElement size="80px" bottom="15%" left="20%" duration="6s" delay="2s" />
        <DecorativeElement size="120px" bottom="25%" right="10%" duration="8s" delay="0.5s" />

        <RegisterCard>
          <Title>¡Únete!</Title>
          <Subtitle>Crea tu cuenta para comenzar</Subtitle>

          <Form onSubmit={handleRegister}>
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
                  Creando cuenta...
                </>
              ) : (
                'Registrarse'
              )}
            </SubmitButton>

            <ButtonContainer>
              <SecondaryButton type="button" onClick={handleLogin} disabled={isLoading}>
                ¿Ya tienes cuenta? Inicia sesión
              </SecondaryButton>
            </ButtonContainer>
          </Form>
        </RegisterCard>
      </RegisterContainer>
    </ResponsiveWrapper>
  );
}