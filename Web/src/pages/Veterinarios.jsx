// src/pages/Veterinarios.js
import { useEffect, useState, useCallback } from 'react';
import { obtenerVeterinarios, registrarVeterinario, actualizarVeterinario, eliminarVeterinario } from '../services/veterinarios';
import {
  PageGridContainer, PageTitle, FormCard, ListCard, FormGrid, FormGroup, FormActions,
  Input, Select, SubmitButton, CancelButton, RightColumn, SearchSection,
  SectionTitle, SearchInput, CrudList, CrudCard, CardHeader, CardTitle,
  CardInfo, InfoGrid, InfoRow, Label, Value, ButtonGroup, EditButton,
  DeleteButton, EmptyState, ErrorMessage
} from '../styles/crudStyles';

export default function Veterinarios() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', especialidad: '', telefono: '', email: '', password: '', rol: 'veterinario' });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [veterinarioId, setVeterinarioId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const cargarVeterinarios = useCallback(async () => {
    try { const res = await obtenerVeterinarios(); setVeterinarios(res.data); } 
    catch (err) { console.error('Error al obtener veterinarios:', err); }
  }, []);

  useEffect(() => { cargarVeterinarios(); }, [cargarVeterinarios]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{7,15}$/;
    if (!formData.nombre.trim() || formData.nombre.trim().length < 3) newErrors.nombre = 'El nombre es obligatorio (mín. 3 caracteres).';
    if (!formData.especialidad.trim() || formData.especialidad.trim().length < 3) newErrors.especialidad = 'La especialidad es obligatoria (mín. 3 caracteres).';
    if (!formData.telefono.trim()) { newErrors.telefono = 'El teléfono es obligatorio.'; } 
    else if (!phoneRegex.test(formData.telefono.trim())) { newErrors.telefono = 'Formato de teléfono inválido.'; }
    if (!formData.email.trim()) { newErrors.email = 'El correo es obligatorio.'; } 
    else if (!emailRegex.test(formData.email.trim())) { newErrors.email = 'El formato del correo es inválido.'; }
    if (!modoEdicion && (!formData.password || formData.password.length < 8)) { newErrors.password = 'La contraseña es obligatoria (mín. 8 caracteres).'; }
    if (modoEdicion && formData.password && formData.password.length < 8) { newErrors.password = 'La nueva contraseña debe tener al menos 8 caracteres.'; }
    if (!formData.rol) newErrors.rol = 'Debe seleccionar un rol.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => ({ ...prev, [name]: null })); }
  };

  const cancelarEdicion = () => {
    setModoEdicion(false); setVeterinarioId(null);
    setFormData({ nombre: '', especialidad: '', telefono: '', email: '', password: '', rol: 'veterinario' });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    const dataToSend = { ...formData };
    if (modoEdicion && !dataToSend.password) { delete dataToSend.password; }
    try {
      if (modoEdicion && veterinarioId) {
        await actualizarVeterinario(veterinarioId, dataToSend);
        alert('Veterinario actualizado correctamente.');
      } else {
        await registrarVeterinario(dataToSend);
        alert('Veterinario registrado correctamente.');
      }
      cancelarEdicion();
      cargarVeterinarios();
    } catch (err) { console.error('Error al guardar veterinario:', err); alert(err.response?.data?.error || 'Error al guardar el veterinario.'); }
  };

  const eliminar = async (id) => {
    if (window.confirm('¿Desea eliminar este veterinario de forma permanente?')) {
      try {
        await eliminarVeterinario(id);
        cargarVeterinarios();
        alert('Veterinario eliminado correctamente.');
      } catch (err) { console.error('Error al eliminar veterinario:', err); alert(err.response?.data?.error || 'Error al eliminar el veterinario.'); }
    }
  };

  const editar = (vet) => {
    setModoEdicion(true); setVeterinarioId(vet.id);
    setFormData({ nombre: vet.nombre, especialidad: vet.especialidad, telefono: vet.telefono, email: vet.email, password: '', rol: vet.rol || 'veterinario' });
    setErrors({});
  };

  const veterinariosFiltrados = veterinarios.filter(v =>
    v.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <PageGridContainer>
      <PageTitle>Gestión de veterinarios</PageTitle>
      <FormCard>
        <SectionTitle>{modoEdicion ? 'Editar veterinario' : 'Registrar nuevo veterinario'}</SectionTitle>
        <FormGrid onSubmit={handleSubmit} noValidate>
          <FormGroup><Input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} /><ErrorMessage>{errors.nombre}</ErrorMessage></FormGroup>
          <FormGroup><Input name="especialidad" placeholder="Especialidad" value={formData.especialidad} onChange={handleChange} /><ErrorMessage>{errors.especialidad}</ErrorMessage></FormGroup>
          <FormGroup><Input name="telefono" type="tel" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} /><ErrorMessage>{errors.telefono}</ErrorMessage></FormGroup>
          <FormGroup><Input name="email" type="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} /><ErrorMessage>{errors.email}</ErrorMessage></FormGroup>
          <FormGroup><Input name="password" type="password" placeholder={modoEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'} value={formData.password} onChange={handleChange} /><ErrorMessage>{errors.password}</ErrorMessage></FormGroup>
          <FormGroup><Select name="rol" value={formData.rol} onChange={handleChange}><option value="veterinario">Veterinario</option><option value="admin">Administrador</option></Select><ErrorMessage>{errors.rol}</ErrorMessage></FormGroup>
          <FormActions>
            {modoEdicion && <CancelButton type="button" onClick={cancelarEdicion}>Cancelar</CancelButton>}
            <SubmitButton type="submit">{modoEdicion ? 'Actualizar' : 'Registrar'}</SubmitButton>
          </FormActions>
        </FormGrid>
      </FormCard>
      <RightColumn>
        <SearchSection><SearchInput type="text" placeholder="Buscar por nombre, especialidad, email..." value={busqueda} onChange={e => setBusqueda(e.target.value)} /></SearchSection>
        <ListCard>
          <SectionTitle>Listado de veterinarios</SectionTitle>
          <CrudList>
            {veterinariosFiltrados.length > 0 ? (
              veterinariosFiltrados.map(v => (
                <CrudCard key={v.id}>
                  <CardHeader><CardTitle>👨‍⚕️ {v.nombre}</CardTitle><CardInfo>{v.especialidad}</CardInfo></CardHeader>
                  <InfoGrid>
                    <InfoRow><Label>Teléfono</Label><Value>{v.telefono}</Value></InfoRow>
                    <InfoRow><Label>Email</Label><Value style={{textTransform: 'none'}}>{v.email}</Value></InfoRow>
                    <InfoRow><Label>Rol</Label><Value>{v.rol}</Value></InfoRow>
                  </InfoGrid>
                  <ButtonGroup>
                    <EditButton onClick={() => editar(v)}>Editar</EditButton>
                    <DeleteButton onClick={() => eliminar(v.id)}>Eliminar</DeleteButton>
                  </ButtonGroup>
                </CrudCard>
              ))
            ) : (<EmptyState icon="👨‍⚕️">No se encontraron veterinarios.</EmptyState>)}
          </CrudList>
        </ListCard>
      </RightColumn>
    </PageGridContainer>
  );
}