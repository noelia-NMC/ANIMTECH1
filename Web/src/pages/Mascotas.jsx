import { useState, useEffect } from 'react';
import { obtenerMascotas, registrarMascota, actualizarMascota, eliminarMascota } from '../services/mascotas';
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
  Input,
  Select, 
  SubmitButton,
  RightColumn,
  SearchSection,
  SectionTitle,
  SearchInput,
  MascotasList, 
  MascotaCard,   
  CardHeader,
  PetName,
  PetInfo,       
  InfoGrid,
  InfoRow,
  Label,
  Value,
  ButtonGroup,
  EditButton,
  DeleteButton,
  EmptyState,
  ErrorMessage
} from '../styles/mascotasStyles'; 

export default function Mascotas() {
    const [mascotas, setMascotas] = useState([]);
    // <-- CAMBIO: Volvemos a la simplicidad. Solo necesitamos el nombre del propietario.
    const [formData, setFormData] = useState({
        nombre: '',
        especie: '',
        raza: '',
        edad: '',
        genero: '',
        propietario: '' 
    });
    const [errors, setErrors] = useState({});
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idActual, setIdActual] = useState(null);
    const [busqueda, setBusqueda] = useState(''); 

    useEffect(() => {
        cargarMascotas();
    }, []);

    const cargarMascotas = async () => {
        try {
            // Asumimos que la API devuelve los datos del propietario junto con la mascota
            const res = await obtenerMascotas(); 
            setMascotas(res.data);
        } catch (err) {
            console.error('Error al obtener mascotas:', err);
            alert(err.response?.data?.error || 'Error al obtener mascotas');
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nombre.trim() || formData.nombre.trim().length < 2) newErrors.nombre = 'El nombre es obligatorio (mín. 2 caracteres).';
        // <-- CAMBIO: La validación es sobre el nombre del propietario, no un ID.
        if (!formData.propietario.trim()) newErrors.propietario = 'El nombre del propietario es obligatorio.';
        if (!formData.especie.trim()) newErrors.especie = 'La especie es obligatoria.';
        if (!formData.raza.trim()) newErrors.raza = 'La raza es obligatoria.';
        if (!formData.edad || isNaN(formData.edad) || Number(formData.edad) <= 0) newErrors.edad = 'La edad debe ser un número positivo.';
        if (!formData.genero) newErrors.genero = 'Debe seleccionar un género.';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
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
            if (modoEdicion) {
                // Para actualizar, pasamos el nombre del propietario. El backend se encargará.
                await actualizarMascota(idActual, formData);
                alert('Mascota actualizada');
            } else {
                // El backend ahora espera 'propietario' como un string (nombre)
                await registrarMascota(formData);
                alert('Mascota registrada');
            }
            // <-- CAMBIO: Limpiamos el estado original
            setFormData({ nombre: '', especie: '', raza: '', edad: '', genero: '', propietario: '' });
            setModoEdicion(false);
            setIdActual(null);
            setErrors({});
            cargarMascotas();
        } catch (err) {
            console.error('Error al guardar mascota:', err);
            alert(err.response?.data?.error || 'Error al guardar mascota');
        }
    };

    const handleEditar = (mascota) => {
        setModoEdicion(true);
        setIdActual(mascota.id);
        setFormData({
            nombre: mascota.nombre,
            especie: mascota.especie,
            raza: mascota.raza,
            edad: mascota.edad,
            genero: mascota.genero,
            // <-- CAMBIO: Usamos el nombre del propietario que viene de la API.
            propietario: mascota.propietario_nombre 
        });
        setErrors({});
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta mascota?')) {
            try {
                await eliminarMascota(id);
                alert('Mascota eliminada');
                cargarMascotas();
            } catch (err) {
                console.error('Error al eliminar mascota:', err);
                alert(err.response?.data?.error || 'Error al eliminar mascota');
            }
        }
    };

    const mascotasFiltradas = mascotas.filter(m =>
        m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (m.propietario_nombre && m.propietario_nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
        m.especie.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Container>
            <Navbar />
            <Content>
                <PageTitle>Gestión de Mascotas</PageTitle>

                <FormCard>
                    <SectionTitle>{modoEdicion ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</SectionTitle>
                    <Form onSubmit={handleSubmit} noValidate>
                        <FormGroup>
                            <Input name="nombre" placeholder="Nombre de la Mascota" value={formData.nombre} onChange={handleChange} />
                            <ErrorMessage>{errors.nombre}</ErrorMessage>
                        </FormGroup>
                        
                        {/* ======================= CAMBIO IMPORTANTE AQUÍ ======================= */}
                        <FormGroup>
                            <Input 
                                name="propietario" // <-- CAMBIO: Vuelve a ser 'propietario'
                                type="text"        // <-- CAMBIO: Es un campo de texto normal
                                placeholder="Nombre del Propietario" // <-- CAMBIO: Texto descriptivo
                                value={formData.propietario} 
                                onChange={handleChange} 
                            />
                            <ErrorMessage>{errors.propietario}</ErrorMessage>
                        </FormGroup>
                        {/* ====================================================================== */}

                        <FormGroup>
                            <Input name="especie" placeholder="Especie" value={formData.especie} onChange={handleChange} />
                            <ErrorMessage>{errors.especie}</ErrorMessage>
                        </FormGroup>
                        <FormGroup>
                            <Input name="raza" placeholder="Raza" value={formData.raza} onChange={handleChange} />
                            <ErrorMessage>{errors.raza}</ErrorMessage>
                        </FormGroup>
                        <FormGroup>
                            <Input name="edad" type="number" placeholder="Edad" value={formData.edad} onChange={handleChange} />
                            <ErrorMessage>{errors.edad}</ErrorMessage>
                        </FormGroup>
                        <FormGroup>
                            <Select name="genero" value={formData.genero} onChange={handleChange}>
                                <option value="">Selecciona género</option>
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </Select>
                            <ErrorMessage>{errors.genero}</ErrorMessage>
                        </FormGroup>
                        <FormActions>
                            <SubmitButton type="submit">{modoEdicion ? 'Actualizar' : 'Registrar'}</SubmitButton>
                        </FormActions>
                    </Form>
                </FormCard>

                <RightColumn>
                    <SearchSection>
                        <SearchInput
                            type="text"
                            placeholder="Buscar por nombre, propietario, especie..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </SearchSection>
                    <ListCard>
                        <SectionTitle>Listado de Mascotas</SectionTitle>
                        <MascotasList>
                            {mascotasFiltradas.length > 0 ? (
                                mascotasFiltradas.map((m) => (
                                    <MascotaCard key={m.id}>
                                        <CardHeader>
                                            <PetName>{m.nombre}</PetName>
                                            <PetInfo>{m.especie} - {m.raza}</PetInfo>
                                        </CardHeader>
                                        <InfoGrid>
                                            <InfoRow><Label>Propietario</Label><Value>{m.propietario_nombre || 'No asignado'}</Value></InfoRow>
                                            <InfoRow><Label>Edad</Label><Value>{m.edad} años</Value></InfoRow>
                                            <InfoRow><Label>Género</Label><Value>{m.genero}</Value></InfoRow>
                                        </InfoGrid>
                                        <ButtonGroup>
                                            <EditButton onClick={() => handleEditar(m)}>Editar</EditButton>
                                            <DeleteButton onClick={() => handleEliminar(m.id)}>Eliminar</DeleteButton>
                                        </ButtonGroup>
                                    </MascotaCard>
                                ))
                            ) : (
                                <EmptyState>No se encontraron mascotas.</EmptyState>
                            )}
                        </MascotasList>
                    </ListCard>
                </RightColumn>
            </Content>
        </Container>
    );
}