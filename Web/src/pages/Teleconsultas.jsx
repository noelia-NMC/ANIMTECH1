import { useEffect, useState, useCallback } from 'react';
import {
  obtenerTeleconsultasDelVeterinario,
  aceptarTeleconsulta,
  finalizarTeleconsulta,
} from '../services/teleconsultas';
import Navbar from '../components/Navbar';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import {
  Container, Content, HeaderSection, PageTitle, ControlsContainer, SearchInput,
  Select, ExportButton, ConsultasList, ConsultaCard, CardHeader, PetName,
  InfoGrid, InfoRow, Label, Value, MeetLink, StatusBadge, ButtonGroup,
  AcceptButton, FinishButton, EmptyState,
} from '../styles/teleconsultasStyles';

export default function Teleconsultas() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [consultas, setConsultas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const cargarConsultas = useCallback(async () => {
    if (!user || !token) return;
    try {
      // --- CORRECCIÓN AQUÍ ---
      // Se llama a la función solo con el token.
      const res = await obtenerTeleconsultasDelVeterinario(token);
      setConsultas(res.data);
    } catch (error) {
      console.error('Error al cargar teleconsultas', error);
      alert('No se pudieron cargar las teleconsultas.');
    }
  }, [user, token]); // user se puede quitar de las dependencias, pero no hace daño dejarlo

  useEffect(() => {
    cargarConsultas();
  }, [cargarConsultas]);

const handleAceptar = async (consultaId) => {
    // Pedimos el enlace al usuario
    let meetLink = prompt("Por favor, ingresa el enlace de Google Meet para esta consulta:");

    // --- CORRECCIÓN AQUÍ ---
    // 1. Verificamos si el usuario canceló el prompt (meetLink será null)
    // 2. Usamos .trim() para limpiar espacios en blanco antes y después.
    if (!meetLink || !meetLink.trim().startsWith('https://meet.google.com/')) {
      alert("Enlace de Meet no válido. Debe comenzar con 'https://meet.google.com/'. Por favor, inténtalo de nuevo.");
      return;
    }

    // Limpiamos el enlace una vez más para guardarlo sin espacios
    const finalMeetLink = meetLink.trim();

    try {
      // Enviamos el enlace ya limpio al backend
      await aceptarTeleconsulta(consultaId, { meet_link: finalMeetLink }, token);
      alert('¡Consulta aceptada con éxito!');
      cargarConsultas(); 
    } catch (error) {
      console.error('Error al aceptar la consulta', error);
      alert(error.response?.data?.message || 'Error al aceptar la consulta.');
    }
  };
  
  const handleFinalizar = async (consultaId) => {
    if (window.confirm("¿Estás seguro de que deseas marcar esta consulta como finalizada?")) {
      try {
        await finalizarTeleconsulta(consultaId, token);
        alert('Consulta finalizada.');
        cargarConsultas();
      } catch (error) {
        console.error('Error al finalizar la consulta', error);
        alert(error.response?.data?.message || 'Error al finalizar la consulta.');
      }
    }
  };

  const exportarCSV = () => {
    if (consultas.length === 0) return alert('No hay datos para exportar');
    const csvData = consultas.map(({ id, fecha, motivo, estado, nombre_mascota, propietario_email, meet_link }) => ({
        id, fecha: new Date(fecha).toLocaleString(), motivo, estado, nombre_mascota, propietario_email, meet_link
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'teleconsultas.csv');
  };

  const filtradas = consultas.filter(c =>
    (c.nombre_mascota || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.propietario_email || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.motivo || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const visibles = filtradas.filter(c =>
    filtroEstado === 'todos' ? true : c.estado === filtroEstado
  );

  return (
    <Container>
      <Navbar />
      <Content>
        <PageTitle>Solicitudes de Teleconsulta</PageTitle>
        <HeaderSection>
          <ControlsContainer>
            <SearchInput
              type="text"
              placeholder="Buscar por mascota, dueño o motivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aceptada">Aceptadas</option>
              <option value="finalizada">Finalizadas</option>
            </Select>
            <ExportButton onClick={exportarCSV}>Exportar CSV</ExportButton>
          </ControlsContainer>
        </HeaderSection>
        
        <ConsultasList>
          {visibles.length === 0 ? (
            <EmptyState>No hay solicitudes para mostrar con los filtros actuales.</EmptyState>
          ) : (
            visibles.map(c => (
              <ConsultaCard key={c.id}>
                <CardHeader>
                  <PetName>{c.nombre_mascota}</PetName>
                  <StatusBadge estado={c.estado}>{c.estado}</StatusBadge>
                </CardHeader>
                <InfoGrid>
                  <InfoRow><Label>Dueño:</Label><Value>{c.propietario_email}</Value></InfoRow>
                  <InfoRow><Label>Fecha Solicitud:</Label><Value>{new Date(c.fecha).toLocaleString()}</Value></InfoRow>
                  <InfoRow className="full-width"><Label>Motivo:</Label><Value>{c.motivo}</Value></InfoRow>
                  {c.meet_link && <InfoRow className="full-width"><Label>Enlace Meet:</Label><Value><MeetLink href={c.meet_link} target="_blank" rel="noreferrer">{c.meet_link}</MeetLink></Value></InfoRow>}
                </InfoGrid>
                <ButtonGroup>
                  {c.estado === 'pendiente' && (
                    <AcceptButton onClick={() => handleAceptar(c.id)}>Aceptar</AcceptButton>
                  )}
                  {c.estado === 'aceptada' && (
                    <FinishButton onClick={() => handleFinalizar(c.id)}>Finalizar</FinishButton>
                  )}
                </ButtonGroup>
              </ConsultaCard>
            ))
          )}
        </ConsultasList>
      </Content>
    </Container>
  );
}