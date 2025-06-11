import { useEffect, useState } from 'react';
import {
  obtenerHistorial, registrarHistorial,
  actualizarHistorial, eliminarHistorial,
  obtenerMascotas
} from '../services/historial'; 
import Navbar from '../components/Navbar'; 
import {
  Container,
  Content,
  PageTitle,
  FormCard,
  ListCard,
  Form,
  FormGroup,
  FormActions,
  Select,
  Input,
  TextArea,
  SubmitButton,
  RightColumn,
  SearchSection,
  SectionTitle,
  SearchInput,
  HistorialList,
  HistorialCard,
  CardHeader,
  PetName,
  DateInfo,
  InfoGrid,
  InfoRow,
  Label,
  Value,
  ButtonGroup,
  EditButton,
  DeleteButton,
  EmptyState,
  ErrorMessage // <-- Importa el nuevo componente de error
} from '../styles/historialStyles';

export default function HistorialClinico() {
  const [historiales, setHistoriales] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    mascota_id: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  });
  const [errors, setErrors] = useState({});
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarHistorial();
    cargarMascotas();
  }, []);

  const cargarHistorial = async () => {
    try {
      const res = await obtenerHistorial();
      setHistoriales(res.data);
    } catch (error) {
      console.error("Error al cargar el historial:", error);
    }
  };

  const cargarMascotas = async () => {
    try {
      const res = await obtenerMascotas();
      setMascotas(res.data);
    } catch (error) {
      console.error("Error al cargar las mascotas:", error);
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.mascota_id) newErrors.mascota_id = 'Debe seleccionar una mascota.';
    if (!formData.diagnostico.trim() || formData.diagnostico.trim().length < 5) newErrors.diagnostico = 'El diagnóstico es obligatorio (mín. 5 caracteres).';
    if (!formData.tratamiento.trim() || formData.tratamiento.trim().length < 5) newErrors.tratamiento = 'El tratamiento es obligatorio (mín. 5 caracteres).';
    // Observaciones es opcional, no requiere validación de obligatoriedad
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpia el error del campo que se está editando
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Detiene el envío si hay errores
    }

    try {
      if (formData.id) {
        await actualizarHistorial(formData.id, formData);
        alert('Historial actualizado correctamente');
      } else {
        await registrarHistorial(formData);
        alert('Historial registrado correctamente');
      }
      setFormData({ id: null, mascota_id: '', diagnostico: '', tratamiento: '', observaciones: '' });
      setErrors({});
      cargarHistorial();
    } catch (error) {
      console.error("Error al guardar el historial:", error);
      alert('Hubo un error al guardar el historial.');
    }
  };

  const handleEdit = (h) => {
    setFormData({
      id: h.id,
      mascota_id: h.mascota_id,
      diagnostico: h.diagnostico,
      tratamiento: h.tratamiento,
      observaciones: h.observaciones
    });
    setErrors({}); // Limpia errores al cargar para editar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este historial?')) {
      try {
        await eliminarHistorial(id);
        cargarHistorial();
        alert('Historial eliminado.');
      } catch (error) {
        console.error("Error al eliminar el historial:", error);
        alert('Hubo un error al eliminar el historial.');
      }
    }
  };

  const filtrados = historiales.filter(h =>
    (h.nombre_mascota && h.nombre_mascota.toLowerCase().includes(busqueda.toLowerCase())) ||
    (h.diagnostico && h.diagnostico.toLowerCase().includes(busqueda.toLowerCase())) ||
    (h.tratamiento && h.tratamiento.toLowerCase().includes(busqueda.toLowerCase()))
  );
 
  return (
    <Container>
      <Navbar />
      <Content>
        <PageTitle>Gestión de Historial Clínico</PageTitle>

        <FormCard>
          <SectionTitle>{formData.id ? 'Editando Historial' : 'Registrar Nuevo Historial'}</SectionTitle>
          <Form onSubmit={handleSubmit} noValidate>
            <FormGroup className="full-width">
              <Select name="mascota_id" value={formData.mascota_id} onChange={handleChange}>
                <option value="">Selecciona una mascota</option>
                {mascotas.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </Select>
              <ErrorMessage>{errors.mascota_id}</ErrorMessage>
            </FormGroup>

            <FormGroup>
              <Input name="diagnostico" placeholder="Diagnóstico" value={formData.diagnostico} onChange={handleChange} />
              <ErrorMessage>{errors.diagnostico}</ErrorMessage>
            </FormGroup>

            <FormGroup>
              <Input name="tratamiento" placeholder="Tratamiento" value={formData.tratamiento} onChange={handleChange} />
              <ErrorMessage>{errors.tratamiento}</ErrorMessage>
            </FormGroup>

            <FormGroup className="full-width">
              <TextArea name="observaciones" placeholder="Observaciones adicionales (opcional)" value={formData.observaciones} onChange={handleChange} />
              <ErrorMessage>{errors.observaciones}</ErrorMessage>
            </FormGroup>
            
            <FormActions>
              <SubmitButton type="submit">
                {formData.id ? 'Actualizar' : 'Registrar'}
              </SubmitButton>
            </FormActions>
          </Form>
        </FormCard>

        <RightColumn>
          <SearchSection>
            <SectionTitle>Buscar en el Historial</SectionTitle>
            <SearchInput
              type="text"
              placeholder="Buscar por nombre, diagnóstico..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </SearchSection>

          <ListCard>
            <SectionTitle>Registros del Historial</SectionTitle>
            <HistorialList>
              {filtrados.length > 0 ? (
                filtrados.map(h => (
                  <HistorialCard key={h.id}>
                    <CardHeader>
                      <PetName>{h.nombre_mascota || 'Mascota'}</PetName>
                      <DateInfo>{new Date(h.fecha).toLocaleDateString()}</DateInfo>
                    </CardHeader>

                    <InfoGrid>
                      <InfoRow>
                        <Label>Diagnóstico</Label>
                        <Value>{h.diagnostico}</Value>
                      </InfoRow>
                      <InfoRow>
                        <Label>Tratamiento</Label>
                        <Value>{h.tratamiento}</Value>
                      </InfoRow>
                      {h.observaciones && (
                         <InfoRow className="full-width">
                           <Label>Observaciones</Label>
                           <Value>{h.observaciones}</Value>
                         </InfoRow>
                      )}
                    </InfoGrid>

                    <ButtonGroup>
                      <EditButton onClick={() => handleEdit(h)}>Editar</EditButton>
                      <DeleteButton onClick={() => handleDelete(h.id)}>Eliminar</DeleteButton>
                    </ButtonGroup>
                  </HistorialCard>
                ))
              ) : (
                <EmptyState>No se encontraron registros.</EmptyState>
              )}
            </HistorialList>
          </ListCard>
        </RightColumn>
      </Content>
    </Container>
  );
}