import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { obtenerTurnos, registrarTurno, eliminarTurno, actualizarTurno } from '../services/turnos';
import {
  Container,
  Content,
  PageTitle,
  FormCard,
  ListCard,
  Form,
  FormGroup,
  FormActions,
  Input,
  Select,
  SubmitButton,
  RightColumn,
  SectionTitle,
  TurnosList,
  TurnoCard,
  CardHeader,
  PetName,
  VetInfo,
  InfoGrid,
  InfoRow,
  Label,
  Value,
  ButtonGroup,
  EditButton,
  DeleteButton,
  EmptyState,
  ErrorMessage // <-- Importa el nuevo componente de error
} from '../styles/turnosStyles';

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [formData, setFormData] = useState({
    mascota_id: '',
    veterinario_id: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [turnoId, setTurnoId] = useState(null);

  const cargarTurnos = useCallback(async () => {
    try {
      const res = await obtenerTurnos();
      setTurnos(res.data);
    } catch (err) {
      console.error('Error al obtener turnos:', err);
      alert(err.response?.data?.error || 'Error al obtener turnos');
    }
  }, []);

  const cargarMascotas = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/mascotas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'clinica-id': JSON.parse(localStorage.getItem('user'))?.clinica_id
        }
      });
      setMascotas(res.data);
    } catch (err) {
      console.error('Error al obtener mascotas:', err);
      alert(err.response?.data?.error || 'Error al obtener mascotas');
    }
  }, []);

  const cargarVeterinarios = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/veterinarios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'clinica-id': JSON.parse(localStorage.getItem('user'))?.clinica_id
        }
      });
      setVeterinarios(res.data);
    } catch (err) {
      console.error('Error al obtener veterinarios:', err);
    }
  }, []);

  useEffect(() => {
    cargarTurnos();
    cargarMascotas();
    cargarVeterinarios();
  }, [cargarTurnos, cargarMascotas, cargarVeterinarios]);
  
  const validate = () => {
      const newErrors = {};
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Establecer la hora a medianoche para comparar solo la fecha

      if (!formData.mascota_id) newErrors.mascota_id = 'Debe seleccionar una mascota.';
      if (!formData.veterinario_id) newErrors.veterinario_id = 'Debe seleccionar un veterinario.';
      if (!formData.fecha) {
          newErrors.fecha = 'La fecha es obligatoria.';
      } else if (new Date(formData.fecha) < hoy) {
          newErrors.fecha = 'La fecha no puede ser anterior al día de hoy.';
      }
      if (!formData.hora) newErrors.hora = 'La hora es obligatoria.';
      if (!formData.motivo.trim() || formData.motivo.trim().length < 10) newErrors.motivo = 'El motivo es obligatorio (mín. 10 caracteres).';
      
      return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    try {
      if (modoEdicion && turnoId) {
        await actualizarTurno(turnoId, formData);
        alert('Turno actualizado');
      } else {
        await registrarTurno(formData);
        alert('Turno registrado');
      }

      setFormData({ mascota_id: '', veterinario_id: '', fecha: '', hora: '', motivo: '' });
      setModoEdicion(false);
      setTurnoId(null);
      setErrors({});
      cargarTurnos();
    } catch (err) {
      console.error('Error al guardar turno:', err);
      alert(err.response?.data?.error || 'Error al guardar turno');
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Deseas eliminar este turno?')) {
      try {
        await eliminarTurno(id);
        cargarTurnos();
      } catch (err) {
        console.error('Error al eliminar turno:', err);
        alert(err.response?.data?.error || 'Error al eliminar turno');
      }
    }
  };

  const handleEditar = (turno) => {
    setModoEdicion(true);
    setTurnoId(turno.id);
    setFormData({
      mascota_id: turno.mascota_id,
      veterinario_id: turno.veterinario_id,
      fecha: new Date(turno.fecha).toISOString().split('T')[0], // Formato para input date
      hora: turno.hora,
      motivo: turno.motivo
    });
    setErrors({});
  };
  
  return (
    <Container>
      <Navbar />
      <Content>
        <PageTitle>Gestión de Turnos</PageTitle>

        <FormCard>
          <SectionTitle>{modoEdicion ? 'Editar Turno' : 'Agendar Nuevo Turno'}</SectionTitle>
          <Form onSubmit={handleSubmit} noValidate>
            <FormGroup>
              <Select name="mascota_id" value={formData.mascota_id} onChange={handleChange}>
                <option value="">Seleccionar Mascota</option>
                {mascotas.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
              </Select>
              <ErrorMessage>{errors.mascota_id}</ErrorMessage>
            </FormGroup>
            <FormGroup>
              <Select name="veterinario_id" value={formData.veterinario_id} onChange={handleChange}>
                <option value="">Seleccionar Veterinario</option>
                {veterinarios.map(v => (<option key={v.id} value={v.id}>{v.nombre}</option>))}
              </Select>
              <ErrorMessage>{errors.veterinario_id}</ErrorMessage>
            </FormGroup>
            <FormGroup>
              <Input name="fecha" type="date" value={formData.fecha} onChange={handleChange} />
              <ErrorMessage>{errors.fecha}</ErrorMessage>
            </FormGroup>
            <FormGroup>
              <Input name="hora" type="time" value={formData.hora} onChange={handleChange} />
              <ErrorMessage>{errors.hora}</ErrorMessage>
            </FormGroup>
            <FormGroup className="full-width">
              <Input name="motivo" placeholder="Motivo de la consulta" value={formData.motivo} onChange={handleChange} />
              <ErrorMessage>{errors.motivo}</ErrorMessage>
            </FormGroup>
            <FormActions>
              <SubmitButton type="submit">{modoEdicion ? 'Actualizar' : 'Agendar'}</SubmitButton>
            </FormActions>
          </Form>
        </FormCard>

        <RightColumn>
          <ListCard>
            <SectionTitle>Turnos Agendados</SectionTitle>
            <TurnosList>
              {turnos.length > 0 ? (
                turnos.map(t => (
                  <TurnoCard key={t.id}>
                    <CardHeader>
                      <PetName>{t.nombre_mascota}</PetName>
                      <VetInfo>{t.nombre_veterinario || 'Sin asignar'}</VetInfo>
                    </CardHeader>
                    <InfoGrid>
                      <InfoRow><Label>Fecha</Label><Value>{new Date(t.fecha).toLocaleDateString()}</Value></InfoRow>
                      <InfoRow><Label>Hora</Label><Value>{t.hora}</Value></InfoRow>
                      <InfoRow className="full-width"><Label>Motivo</Label><Value>{t.motivo}</Value></InfoRow>
                    </InfoGrid>
                    <ButtonGroup>
                      <EditButton onClick={() => handleEditar(t)}>Editar</EditButton>
                      <DeleteButton onClick={() => handleEliminar(t.id)}>Eliminar</DeleteButton>
                    </ButtonGroup>
                  </TurnoCard>
                ))
              ) : (
                <EmptyState>No se encontraron turnos.</EmptyState>
              )}
            </TurnosList>
          </ListCard>
        </RightColumn>
      </Content>
    </Container>
  );
}