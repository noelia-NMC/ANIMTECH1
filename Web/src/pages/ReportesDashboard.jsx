// ARCHIVO COMPLETO Y LISTO: Frontend/src/components/ReportesDashboard.jsx
// (Con nuevos estilos de colores suaves)

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';
import * as reportesService from '../services/reportes';

// --- ESTILOS CON NUEVA PALETA DE COLORES SUAVES ---
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = keyframes`from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;

const colors = {
  background: '#f8f9fa', // Fondo general muy claro
  surface: '#ffffff', // Superficie de las tarjetas
  primary: '#5eaaa8', // Un verde azulado suave
  primaryDark: '#4a8784',
  secondary: '#a3d2ca', // Un verde menta más claro
  accent: '#f7a440', // Acento naranja/amarillo
  text: '#343a40', // Texto principal oscuro, no negro puro
  textMuted: '#6c757d', // Texto secundario
  border: '#dee2e6', // Borde sutil
  success: '#2a9d8f',
  info: '#457b9d',
};

const ReportesOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(33, 37, 41, 0.6); // Fondo semitransparente
  z-index: 1000; display: flex; align-items: center; justify-content: center;
  animation: ${fadeIn} 0.3s ease-out; padding: 1.5rem;
`;

const ReportesModal = styled.div`
  background: ${colors.background}; border-radius: 16px; width: 100%;
  max-width: 1100px; height: 90vh; display: flex; flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); animation: ${slideIn} 0.4s ease-out;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  background: ${colors.primary}; color: white; padding: 1.25rem 2rem;
  display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
  border-bottom: 1px solid ${colors.primaryDark};
`;

const ModalTitle = styled.h2` margin: 0; font-size: 1.3rem; font-weight: 600; display: flex; align-items: center; gap: 0.75rem;`;
const CloseButton = styled.button` background: transparent; border: none; color: white; opacity: 0.8; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.8rem; line-height: 1; display: flex; align-items: center; justify-content: center; transition: all 0.2s; &:hover { opacity: 1; background: rgba(255, 255, 255, 0.1); transform: rotate(90deg); }`;
const ModalContent = styled.div` padding: 2rem; overflow-y: auto; flex-grow: 1; &::-webkit-scrollbar { width: 8px; } &::-webkit-scrollbar-track { background: #e9ecef; } &::-webkit-scrollbar-thumb { background: #ced4da; border-radius: 4px; } &::-webkit-scrollbar-thumb:hover { background: #adb5bd; }`;

const Section = styled.div`
  background: ${colors.surface}; padding: 1.5rem; border-radius: 12px;
  margin-bottom: 1.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid ${colors.border};
`;

const FiltersSection = styled(Section)` display: flex; gap: 1.5rem; align-items: flex-end; flex-wrap: wrap;`;
const FilterGroup = styled.div` display: flex; flex-direction: column; gap: 0.5rem;`;
const Label = styled.label` font-weight: 500; color: ${colors.textMuted}; font-size: 0.8rem;`;
const DateInput = styled.input` padding: 0.6rem 0.8rem; border: 1px solid ${colors.border}; border-radius: 8px; font-size: 0.9rem; transition: border-color 0.2s; &:focus { outline: none; border-color: ${colors.primary}; box-shadow: 0 0 0 2px ${colors.secondary}60; }`;
const ActionButton = styled.button` background: ${props => props.$variant === 'success' ? colors.success : props.$variant === 'info' ? colors.info : colors.primary}; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; &:hover { background: ${props => props.$variant === 'success' ? '#258c80' : props.$variant === 'info' ? '#3a6684' : colors.primaryDark}; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); } &:disabled { background: #ced4da; cursor: not-allowed; transform: none; box-shadow: none; }`;
const ExportSection = styled(Section)``;
const ExportTitle = styled.h3` width: 100%; margin: 0 0 0.5rem 0; font-size: 1.1rem; color: ${colors.text}; display: flex; align-items: center; gap: 0.5rem;`;
const ExportButtons = styled.div` display: flex; gap: 1rem; flex-wrap: wrap;`;
const StatsGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;`;
const StatCard = styled.div` background: ${colors.surface}; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border-left: 5px solid ${props => props.color || colors.primary}; transition: all 0.2s; &:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }`;
const StatValue = styled.div` font-size: 2.2rem; font-weight: 700; color: ${props => props.color || colors.primary}; margin-bottom: 0.25rem;`;
const StatLabel = styled.div` color: ${colors.textMuted}; font-size: 0.9rem; font-weight: 500;`;
const ReportGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;`;
const ReportCard = styled(Section)` padding: 0; margin-bottom: 0; display: flex; flex-direction: column;`;
const CardHeader = styled.div` color: ${colors.text}; padding: 1rem 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; border-bottom: 1px solid ${colors.border};`;
const CardContent = styled.div` padding: 1rem 1.5rem; flex-grow: 1; max-height: 250px; overflow-y: auto; &::-webkit-scrollbar { width: 6px; } &::-webkit-scrollbar-track { background: transparent; } &::-webkit-scrollbar-thumb { background: #ced4da; border-radius: 3px; }`;
const ListItem = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0.25rem; border-bottom: 1px solid #f1f1f1; font-size: 0.9rem; &:last-child { border-bottom: none; }`;
const ItemLabel = styled.span` color: ${colors.textMuted}; flex-basis: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
const ItemValue = styled.span` font-weight: 600; color: ${colors.text}; text-align: right;`;
const LoadingSpinner = styled.div` display: flex; justify-content: center; align-items: center; height: 200px; font-size: 1.2rem; color: ${colors.textMuted};`;
const EmptyState = styled.div` text-align: center; padding: 3rem 1rem; color: ${colors.textMuted}; .icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.4; }`;
const ErrorMessage = styled.div` background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #f5c6cb;`;

export default function ReportesDashboard({ isOpen, onClose }) {
    // ... (TODA LA LÓGICA DE REACT (useState, useEffect, funciones) SE QUEDA EXACTAMENTE IGUAL)
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [exporting, setExporting] = useState({ pdf: false, excel: false });
    const [dashboardData, setDashboardData] = useState({});
    const [turnosPorPeriodo, setTurnosPorPeriodo] = useState([]);
    const [mascotasConsultadas, setMascotasConsultadas] = useState([]);
    const [tiposConsultas, setTiposConsultas] = useState([]);
    const [razasAtendidas, setRazasAtendidas] = useState([]);
    const [actividadVeterinarios, setActividadVeterinarios] = useState([]);
    useEffect(() => { const hoy = new Date(); const hace30Dias = new Date(new Date().setDate(hoy.getDate() - 30)); setFechaFin(hoy.toISOString().split('T')[0]); setFechaInicio(hace30Dias.toISOString().split('T')[0]); }, []);
    const cargarReportes = async () => { if (!fechaInicio || !fechaFin) return; setLoading(true); setError(''); try { const promises = [ reportesService.getDashboardResumen(), reportesService.getTurnosPorPeriodo(fechaInicio, fechaFin), reportesService.getMascotasMasConsultadas(), reportesService.getTiposConsultasFrecuentes(), reportesService.getRazasMasAtendidas(), ]; if (user?.rol === 'admin') { promises.push(reportesService.getActividadVeterinarios(fechaInicio, fechaFin)); } const results = await Promise.all(promises); setDashboardData(results[0] || {}); setTurnosPorPeriodo(results[1] || []); setMascotasConsultadas(results[2] || []); setTiposConsultas(results[3] || []); setRazasAtendidas(results[4] || []); if (user?.rol === 'admin' && results[5]) { setActividadVeterinarios(results[5]); } else { setActividadVeterinarios([]); } } catch (err) { console.error('Error al cargar reportes desde el componente:', err); setError(err.message.includes('JSON') ? 'Error de comunicación con el servidor. Verifique la ruta de la API y reinicie el backend.' : err.message); } finally { setLoading(false); } };
    useEffect(() => { if (isOpen) { cargarReportes(); } }, [isOpen]);
    const handleExport = async (tipo) => { setExporting(prev => ({ ...prev, [tipo]: true })); setError(''); try { await reportesService.exportarReporte(tipo); } catch (err) { setError(`Error al exportar a ${tipo.toUpperCase()}: ${err.message}`); } finally { setExporting(prev => ({ ...prev, [tipo]: false })); } };
    const formatearFecha = (fecha) => { if (!fecha) return 'Fecha no disponible'; return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }); };
    if (!isOpen) return null;

    return (
        <ReportesOverlay onClick={onClose}>
            <ReportesModal onClick={(e) => e.stopPropagation()}>
                <ModalHeader><ModalTitle>📊 Reportes generales de la clínica</ModalTitle><CloseButton onClick={onClose}>×</CloseButton></ModalHeader>
                <ModalContent>
                    <FiltersSection>
                        <FilterGroup><Label>Fecha de inicio:</Label><DateInput type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} /></FilterGroup>
                        <FilterGroup><Label>Fecha de fin:</Label><DateInput type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} /></FilterGroup>
                        <ActionButton onClick={cargarReportes} disabled={loading}>{loading ? '🔄 Cargando...' : '📊 Actualizar reportes'}</ActionButton>
                    </FiltersSection>
                    <ExportSection>
                        <ExportTitle>📥 Exportar reportes completos</ExportTitle>
                        <ExportButtons>
                            <ActionButton $variant="success" onClick={() => handleExport('pdf')} disabled={exporting.pdf}>{exporting.pdf ? '⏳ Generando...' : '📄 Descargar PDF'}</ActionButton>
                            <ActionButton $variant="info" onClick={() => handleExport('excel')} disabled={exporting.excel}>{exporting.excel ? '⏳ Generando...' : '📊 Descargar Excel'}</ActionButton>
                        </ExportButtons>
                    </ExportSection>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {loading ? (<LoadingSpinner>📊 Cargando reportes...</LoadingSpinner>) : (
                        <>
                            <StatsGrid>
                                <StatCard color={colors.primary}><StatValue color={colors.primary}>{dashboardData.totalMascotas || 0}</StatValue><StatLabel>Mascotas registradas</StatLabel></StatCard>
                                <StatCard color={colors.success}><StatValue color={colors.success}>{dashboardData.turnosEsteMes || 0}</StatValue><StatLabel>Turnos de este mes</StatLabel></StatCard>
                                <StatCard color={colors.info}><StatValue color={colors.info}>{dashboardData.veterinariosActivos || 0}</StatValue><StatLabel>Veterinarios activos</StatLabel></StatCard>
                                <StatCard color={colors.accent}><StatValue color={colors.accent}>{dashboardData.turnosPendientes || 0}</StatValue><StatLabel>Turnos pendientes</StatLabel></StatCard>
                            </StatsGrid>
                            <ReportGrid>
                                <ReportCard><CardHeader>🐾 Mascotas más consultadas</CardHeader><CardContent>{mascotasConsultadas.length > 0 ? (mascotasConsultadas.map((m, i) => (<ListItem key={i}><ItemLabel>{m.mascota} ({m.raza})</ItemLabel><ItemValue>{m.total_consultas} consultas</ItemValue></ListItem>))) : <EmptyState><div className="icon">🐾</div><div>No hay datos disponibles</div></EmptyState>}</CardContent></ReportCard>
                                <ReportCard><CardHeader>📊 Tipos de consulta</CardHeader><CardContent>{tiposConsultas.length > 0 ? (tiposConsultas.map((t, i) => (<ListItem key={i}><ItemLabel>{t.motivo}</ItemLabel><ItemValue>{t.cantidad} ({t.porcentaje || 0}%)</ItemValue></ListItem>))) : <EmptyState><div className="icon">📊</div><div>No hay datos disponibles</div></EmptyState>}</CardContent></ReportCard>
                                <ReportCard><CardHeader>🐕 Razas más atendidas</CardHeader><CardContent>{razasAtendidas.length > 0 ? (razasAtendidas.map((r, i) => (<ListItem key={i}><ItemLabel>{r.raza}</ItemLabel><ItemValue>{r.total_consultas} consultas</ItemValue></ListItem>))) : <EmptyState><div className="icon">🐕</div><div>No hay datos disponibles</div></EmptyState>}</CardContent></ReportCard>
                                {user?.rol === 'admin' && (<ReportCard><CardHeader>👨‍⚕️ Actividad de veterinarios</CardHeader><CardContent>{actividadVeterinarios.length > 0 ? (actividadVeterinarios.map((v, i) => (<ListItem key={i}><ItemLabel>{v.veterinario}</ItemLabel><ItemValue>{v.total_consultas} consultas</ItemValue></ListItem>))) : <EmptyState><div className="icon">👨‍⚕️</div><div>No hay datos para este período</div></EmptyState>}</CardContent></ReportCard>)}
                            </ReportGrid>
                            {turnosPorPeriodo.length > 0 && (<ReportCard style={{ gridColumn: '1 / -1' }}><CardHeader>📅 Turnos por período</CardHeader><CardContent>{turnosPorPeriodo.map((d, i) => (<ListItem key={i}><ItemLabel>{formatearFecha(d.fecha)}</ItemLabel><ItemValue>{d.total_turnos} turnos</ItemValue></ListItem>))}</CardContent></ReportCard>)}
                        </>
                    )}
                </ModalContent>
            </ReportesModal>
        </ReportesOverlay>
    );
}