// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';

// --- Estilos para la página de perfil ---
const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
const Card = styled.div`
  background: white; border-radius: 12px; padding: 2rem;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.07);
`;
const CardTitle = styled.h2`
  font-size: 1.2rem; margin: 0 0 1.5rem 0; padding-bottom: 1rem;
  border-bottom: 1px solid #eef2f1;
`;
const Form = styled.form`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const FormGroup = styled.div`
  &.full-width { grid-column: 1 / -1; }
`;
const Label = styled.label`
  display: block; font-weight: 600; font-size: 0.8rem;
  margin-bottom: 0.5rem; color: #2c3e50;
`;
const Input = styled.input`
  width: 100%; padding: 10px 14px; border-radius: 8px;
  border: 1px solid #e0e0e0; font-size: 0.9rem;
  &:focus { outline: none; border-color: #42a8a1; }
`;
const Button = styled.button`
  padding: 10px 22px; border: none; border-radius: 8px; font-size: 0.9rem;
  font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  background-color: #42a8a1; color: white;
  &:hover { background-color: #358a82; }
`;
const FormActions = styled.div`
  grid-column: 1 / -1; display: flex; justify-content: flex-end;
`;
const ErrorMessage = styled.p`color: #e74c3c; font-size: 0.8rem; margin-top: 5px;`;

// --- Componente principal ---
export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({ nombre: '', email: '', telefono: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.updateProfile(profileData);
      updateUser(res.data.user); // Actualizar el contexto
      alert('Perfil actualizado correctamente.');
      setProfileErrors({});
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setProfileErrors(err.response?.data?.errors || {});
      alert(err.response?.data?.message || 'Error al actualizar el perfil.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordErrors({ confirm_password: 'Las contraseñas no coinciden.' });
      return;
    }
    try {
      await userService.changePassword(passwordData);
      alert('Contraseña cambiada correctamente.');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setPasswordErrors({});
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setPasswordErrors(err.response?.data?.errors || {});
      alert(err.response?.data?.message || 'Error al cambiar la contraseña.');
    }
  };

  return (
    <ProfileContainer>
      <Card>
        <CardTitle>Editar perfil</CardTitle>
        <Form onSubmit={handleProfileSubmit}>
          <FormGroup>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input id="nombre" name="nombre" value={profileData.nombre} onChange={handleProfileChange} />
            {profileErrors.nombre && <ErrorMessage>{profileErrors.nombre}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} />
            {profileErrors.email && <ErrorMessage>{profileErrors.email}</ErrorMessage>}
          </FormGroup>
          <FormGroup className="full-width">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" name="telefono" type="tel" value={profileData.telefono} onChange={handleProfileChange} />
            {profileErrors.telefono && <ErrorMessage>{profileErrors.telefono}</ErrorMessage>}
          </FormGroup>
          <FormActions>
            <Button type="submit">Guardar cambios</Button>
          </FormActions>
        </Form>
      </Card>
      <Card>
        <CardTitle>Cambiar contraseña</CardTitle>
        <Form onSubmit={handlePasswordSubmit}>
          <FormGroup className="full-width">
            <Label htmlFor="current_password">Contraseña actual</Label>
            <Input id="current_password" name="current_password" type="password" value={passwordData.current_password} onChange={handlePasswordChange} />
            {passwordErrors.current_password && <ErrorMessage>{passwordErrors.current_password}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="new_password">Nueva contraseña</Label>
            <Input id="new_password" name="new_password" type="password" value={passwordData.new_password} onChange={handlePasswordChange} />
            {passwordErrors.new_password && <ErrorMessage>{passwordErrors.new_password}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirm_password">Confirmar nueva contraseña</Label>
            <Input id="confirm_password" name="confirm_password" type="password" value={passwordData.confirm_password} onChange={handlePasswordChange} />
            {passwordErrors.confirm_password && <ErrorMessage>{passwordErrors.confirm_password}</ErrorMessage>}
          </FormGroup>
          <FormActions>
            <Button type="submit">Cambiar contraseña</Button>
          </FormActions>
        </Form>
      </Card>
    </ProfileContainer>
  );
}