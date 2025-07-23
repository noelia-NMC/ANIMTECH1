// ARCHIVO COMPLETO Y CORREGIDO: src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { obtenerMascotas } from '../services/mascotas';
import { obtenerTurnos } from '../services/turnos';
import { obtenerVeterinarios } from '../services/veterinarios';
import { obtenerTeleconsultasDelVeterinario } from '../services/teleconsultas';
import { obtenerHistorial } from '../services/historial';
import ReportesDashboard from './ReportesDashboard'; 

// --- Estilos (sin cambios, los omito por brevedad) ---
const colors = { primary: '#42a8a1', secondary: '#5dc1b9', white: '#ffffff', textPrimary: '#2c3e50', textSecondary: '#7f8c8d', background: '#f4f7f6', border: '#eef2f1', success: '#27ae60', warning: '#f39c12', danger: '#e74c3c', info: '#3498db' };
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const pulse = keyframes`0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); }`;
const WelcomeBar = styled.div` display: flex; justify-content: space-between; align-items: center; background: ${colors.white}; padding: 1.5rem 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(44, 62, 80, 0.08); margin-bottom: 2rem; border: 1px solid ${colors.border}; animation: ${fadeIn} 0.6s ease-out; @media (max-width: 768px) { flex-direction: column; gap: 1rem; padding: 1rem; text-align: center; }`;
const WelcomeDetails = styled.div``;
const WelcomeTitle = styled.h2` margin: 0; color: ${colors.textPrimary}; font-size: 1.3rem; font-weight: 600;`;
const WelcomeSubtitle = styled.p` margin: 0; color: ${colors.textSecondary}; font-size: 0.9rem; text-transform: capitalize;`;
const WelcomeActions = styled.div` display: flex; gap: 1rem; align-items: center;`;
const TimeInfo = styled.div` text-align: right; @media (max-width: 768px) { text-align: center; }`;
const CurrentTime = styled.div` font-size: 1.1rem; font-weight: 600; color: ${colors.textPrimary};`;
const CurrentDate = styled.div` font-size: 0.9rem; color: ${colors.textSecondary};`;
const ReportesButton = styled.button` background: linear-gradient(135deg, #8e44ad, #9b59b6); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3); &:hover { background: linear-gradient(135deg, #7d3c98, #8e44ad); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(142, 68, 173, 0.4); } &:active { transform: translateY(0); }`;
const StatsGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;`;
const StatCard = styled.div` background: ${colors.white}; padding: 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(44, 62, 80, 0.06); border: 1px solid ${colors.border}; position: relative; overflow: hidden; transition: all 0.3s ease; cursor: pointer; &:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(44, 62, 80, 0.12); .stat-icon { animation: ${pulse} 0.6s ease-in-out; } } &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: ${props => props.color}; }`;
const StatHeader = styled.div` display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;`;
const StatIcon = styled.div` width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2rem; background: ${props => props.color}15; color: ${props => props.color}; transition: all 0.3s ease;`;
const StatTrend = styled.div` display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: ${props => props.$positive ? colors.success : colors.danger}; font-weight: 500;`;
const StatValue = styled.div` font-size: 2.2rem; font-weight: 700; color: ${colors.textPrimary}; margin-bottom: 0.5rem;`;
const StatLabel = styled.div` font-size: 1rem; color: ${colors.textSecondary}; font-weight: 500;`;
const MainContent = styled.div` display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2rem; @media (max-width: 1024px) { grid-template-columns: 1fr; }`;
const PrimaryPanel = styled.div` display: flex; flex-direction: column; gap: 1.5rem;`;
const SecondaryPanel = styled.div` display: flex; flex-direction: column; gap: 1.5rem;`;
const PanelCard = styled.div` background: ${colors.white}; border-radius: 16px; box-shadow: 0 8px 32px rgba(44, 62, 80, 0.06); border: 1px solid ${colors.border}; overflow: hidden;`;
const PanelHeader = styled.div` background: ${props => props.color || colors.primary}; color: ${colors.white}; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;`;
const PanelTitle = styled.h3` margin: 0; font-size: 1.2rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;`;
const PanelActions = styled.div` display: flex; gap: 0.5rem;`;
const ActionBtn = styled.button` background: rgba(255, 255, 255, 0.2); border: none; color: ${colors.white}; padding: 0.5rem; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; font-size: 0.9rem; &:hover { background: rgba(255, 255, 255, 0.3); }`;
const PanelContent = styled.div` padding: 2rem; max-height: 400px; overflow-y: auto; &::-webkit-scrollbar { width: 6px; } &::-webkit-scrollbar-track { background: ${colors.background}; } &::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }`;
const ListItem = styled.div` display: flex; align-items: center; padding: 1rem; border-radius: 12px; margin-bottom: 0.75rem; background: ${colors.background}; border: 1px solid ${colors.border}; transition: all 0.2s ease; cursor: pointer; &:hover { background: ${colors.white}; border-color: ${colors.primary}; transform: translateX(4px); } &:last-child { margin-bottom: 0; }`;
const ItemIcon = styled.div` width: 40px; height: 40px; border-radius: 12px; background: ${props => props.color}15; color: ${props => props.color}; display: flex; align-items: center; justify-content: center; margin-right: 1rem; font-size: 1.2rem;`;
const ItemInfo = styled.div` flex: 1;`;
const ItemTitle = styled.div` font-weight: 600; color: ${colors.textPrimary}; margin-bottom: 0.25rem;`;
const ItemSubtitle = styled.div` font-size: 0.85rem; color: ${colors.textSecondary};`;
const ItemMeta = styled.div` display: flex; align-items: center; gap: 0.5rem;`;
const StatusBadge = styled.span` padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; ${props => props.status === 'pendiente' && `background: ${colors.warning}20; color: ${colors.warning};`} ${props => props.status === 'completado' && `background: ${colors.success}20; color: ${colors.success};`} ${props => props.status === 'aceptada' && `background: ${colors.info}20; color: ${colors.info};`}`;
const UrgentItem = styled(ListItem)` border-left: 4px solid ${colors.danger}; background: ${colors.danger}05; &:hover { background: ${colors.danger}10; }`;
const EmptyState = styled.div` text-align: center; padding: 3rem 2rem; color: ${colors.textSecondary}; .icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }`;
const LoadingSpinner = styled.div` width: 40px; height: 40px; border: 3px solid ${colors.border}; border-top: 3px solid ${colors.primary}; border-radius: 50%; animation: spin 1s linear infinite; margin: 5rem auto; @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;


export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({ mascotas: [], turnos: [], veterinarios: [], teleconsultas: [], historial: [] });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportes, setShowReportes] = useState(false);

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !user) { setLoading(false); return; }
      try {
        setLoading(true); setError(null);
        const newData = { mascotas: [], turnos: [], veterinarios: [], teleconsultas: [], historial: [] };
        const promises = [];
        if (user.rol === 'admin') {
          promises.push(obtenerMascotas().then(res => { newData.mascotas = res.data || [] }).catch(err => console.error("Error cargando mascotas:", err)));
          promises.push(obtenerVeterinarios().then(res => { newData.veterinarios = res.data || [] }).catch(err => console.error("Error cargando veterinarios:", err)));
        }
        if (user.rol === 'veterinario') {
          promises.push(obtenerTeleconsultasDelVeterinario(token).then(res => { newData.teleconsultas = res.data || [] }).catch(err => console.error("Error cargando teleconsultas:", err)));
        }
        promises.push(obtenerTurnos().then(res => { newData.turnos = res.data || [] }).catch(err => console.error("Error cargando turnos:", err)));
        promises.push(obtenerHistorial().then(res => { newData.historial = res.data || [] }).catch(err => console.error("Error cargando historial:", err)));
        await Promise.allSettled(promises);
        setDashboardData(newData);
      } catch (err) {
        setError('Error al cargar los datos del dashboard.');
        console.error('Error en dashboard:', err);
      } finally { setLoading(false); }
    };
    loadData();
  }, [token, user?.id, user?.rol]);

  // --- CORRECCIÓN CLAVE EN LA COMPARACIÓN DE FECHAS ---
  // Función para obtener la fecha en formato YYYY-MM-DD ignorando la zona horaria
  const getLocalDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  }
  
  const todayString = getLocalDateString(new Date());
  
  const stats = (() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = getLocalDateString(yesterday);

    const turnosHoyCount = dashboardData.turnos.filter(t => t.fecha && getLocalDateString(new Date(t.fecha)) === todayString).length;
    const turnosAyerCount = dashboardData.turnos.filter(t => t.fecha && getLocalDateString(new Date(t.fecha)) === yesterdayString).length;
    const historialHoyCount = dashboardData.historial.filter(h => h.fecha && getLocalDateString(new Date(h.fecha)) === todayString).length;

    return {
      totalMascotas: dashboardData.mascotas.length,
      turnosHoy: turnosHoyCount,
      teleconsultasPendientes: dashboardData.teleconsultas.filter(c => c.estado === 'pendiente').length,
      totalVeterinarios: dashboardData.veterinarios.length,
      historialHoy: historialHoyCount,
      trendTurnos: turnosHoyCount - turnosAyerCount,
    };
  })();
  
  const turnosHoy = dashboardData.turnos
    .filter(t => t.fecha && getLocalDateString(new Date(t.fecha)) === todayString)
    .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));

  const mascotasRecientes = dashboardData.mascotas.slice(0, 4);
  const teleconsultasRecientes = dashboardData.teleconsultas.slice(0, 4);
  const handleCardClick = (path) => navigate(path);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: colors.danger, textAlign: 'center', padding: '2rem' }}>{error}</div>;

  return (
    <>
      <WelcomeBar>
        <WelcomeDetails><WelcomeTitle>Dashboard principal</WelcomeTitle><WelcomeSubtitle>Clínica AnimTech • {user?.rol}</WelcomeSubtitle></WelcomeDetails>
        <WelcomeActions>
          <ReportesButton onClick={() => setShowReportes(true)}>📊 Reportes</ReportesButton>
          <TimeInfo><CurrentTime>{currentTime.toLocaleTimeString()}</CurrentTime><CurrentDate>{currentTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CurrentDate></TimeInfo>
        </WelcomeActions>
      </WelcomeBar>
      <StatsGrid>
        {user.rol === 'admin' && (<StatCard color={colors.primary} onClick={() => handleCardClick('/mascotas')}><StatHeader><StatIcon className="stat-icon" color={colors.primary}>🐾</StatIcon></StatHeader><StatValue>{stats.totalMascotas}</StatValue><StatLabel>Mascotas registradas</StatLabel></StatCard>)}
        <StatCard color={colors.info} onClick={() => handleCardClick('/turnos')}>
          <StatHeader>
            <StatIcon className="stat-icon" color={colors.info}>📅</StatIcon>
            <StatTrend $positive={stats.trendTurnos >= 0}>{stats.trendTurnos >= 0 ? '+' : ''}{stats.trendTurnos} vs ayer</StatTrend>
          </StatHeader>
          <StatValue>{stats.turnosHoy}</StatValue><StatLabel>Turnos para hoy</StatLabel>
        </StatCard>
        <StatCard color={colors.success} onClick={() => handleCardClick('/historial')}><StatHeader><StatIcon className="stat-icon" color={colors.success}>📋</StatIcon></StatHeader><StatValue>{stats.historialHoy}</StatValue><StatLabel>Registros médicos hoy</StatLabel></StatCard>
        {user.rol === 'veterinario' && (<StatCard color={colors.warning} onClick={() => handleCardClick('/teleconsultas')}><StatHeader><StatIcon className="stat-icon" color={colors.warning}>💻</StatIcon></StatHeader><StatValue>{stats.teleconsultasPendientes}</StatValue><StatLabel>Teleconsultas pendientes</StatLabel></StatCard>)}
        {user.rol === 'admin' && (<StatCard color={colors.secondary} onClick={() => handleCardClick('/veterinarios')}><StatHeader><StatIcon className="stat-icon" color={colors.secondary}>👨‍⚕️</StatIcon></StatHeader><StatValue>{stats.totalVeterinarios}</StatValue><StatLabel>Veterinarios activos</StatLabel></StatCard>)}
      </StatsGrid>
      <MainContent>
        <PrimaryPanel><PanelCard><PanelHeader color={colors.info}><PanelTitle>📅 Agenda de hoy</PanelTitle><PanelActions><ActionBtn onClick={() => handleCardClick('/turnos')}>Ver todos</ActionBtn></PanelActions></PanelHeader><PanelContent>{turnosHoy.length > 0 ? (turnosHoy.map((turno, index) => { const isUrgent = turno.motivo?.toLowerCase().includes('urgente'); const ItemComponent = isUrgent ? UrgentItem : ListItem; return (<ItemComponent key={index}><ItemIcon color={isUrgent ? colors.danger : colors.info}>{isUrgent ? '🚨' : '🕐'}</ItemIcon><ItemInfo><ItemTitle>{turno.nombre_mascota || 'Mascota'}</ItemTitle><ItemSubtitle>{turno.motivo}</ItemSubtitle></ItemInfo><ItemMeta><div style={{ textAlign: 'right', fontSize: '0.9rem', color: colors.textSecondary }}><div>{turno.hora}</div><div>{turno.nombre_veterinario}</div></div></ItemMeta></ItemComponent>); })) : (<EmptyState><div className="icon">📅</div><div>No hay turnos programados para hoy.</div></EmptyState>)}</PanelContent></PanelCard></PrimaryPanel>
        <SecondaryPanel>
          {user.rol === 'admin' && (<PanelCard><PanelHeader color={colors.primary}><PanelTitle>🐾 Mascotas recientes</PanelTitle><PanelActions><ActionBtn onClick={() => handleCardClick('/mascotas')}>Ver todas</ActionBtn></PanelActions></PanelHeader><PanelContent>{mascotasRecientes.length > 0 ? (mascotasRecientes.map((mascota, index) => (<ListItem key={index}><ItemIcon color={colors.primary}>🐾</ItemIcon><ItemInfo><ItemTitle>{mascota.nombre}</ItemTitle><ItemSubtitle>{mascota.especie} • {mascota.raza}</ItemSubtitle></ItemInfo><ItemMeta><div style={{ fontSize: '0.8rem', color: colors.textSecondary }}>{mascota.edad} años</div></ItemMeta></ListItem>))) : (<EmptyState><div className="icon">🐾</div><div>No hay mascotas registradas.</div></EmptyState>)}</PanelContent></PanelCard>)}
          {user.rol === 'veterinario' && (<PanelCard><PanelHeader color={colors.warning}><PanelTitle>💻 Mis teleconsultas</PanelTitle><PanelActions><ActionBtn onClick={() => handleCardClick('/teleconsultas')}>Gestionar</ActionBtn></PanelActions></PanelHeader><PanelContent>{teleconsultasRecientes.length > 0 ? (teleconsultasRecientes.map((consulta, index) => (<ListItem key={index}><ItemIcon color={colors.warning}>💻</ItemIcon><ItemInfo><ItemTitle>{consulta.nombre_mascota || 'Consulta'}</ItemTitle><ItemSubtitle>{consulta.motivo}</ItemSubtitle></ItemInfo><ItemMeta><StatusBadge status={consulta.estado}>{consulta.estado}</StatusBadge></ItemMeta></ListItem>))) : (<EmptyState><div className="icon">💻</div><div>No hay teleconsultas disponibles.</div></EmptyState>)}</PanelContent></PanelCard>)}
        </SecondaryPanel>
      </MainContent>
      <ReportesDashboard isOpen={showReportes} onClose={() => setShowReportes(false)} />
    </>
  );
}