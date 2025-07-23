// Mobile/src/screens/CollarHistorialScreen.js - PALETA DE COLORES PROFESIONAL Y SOBRIA
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from 'styled-components/native';
import HistorialService from '../../services/historialCollar';
import { generarYCompartirReporte } from '../../services/reporteCollar';
import { useFocusEffect } from '@react-navigation/native';

// --- PALETA DE COLORES REFINADA Y SOBRIA ---
const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  success: '#59c271ff', // Verde profesional para acciones positivas
  infoBackground: '#e0f2f1', // Un fondo muy claro y desaturado para info
  background: '#eef2f5',
  surface: '#f8fafc',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  error: '#ef4444',
};

// --- COMPONENTES DE ESTILO CON LA NUEVA PALETA ---
const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
  padding: 0 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: 20px;
  padding-top: 45px;
`;

const Card = styled.View`
  background-color: ${colors.surface};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${colors.border};
`;

const FilterCard = styled(Card)`
  padding: 15px 20px;
`;

const CardTitle = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 15px;
  text-align: center;
`;

const DateButton = styled.TouchableOpacity`
  background-color: ${colors.background};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  align-items: center;
  border: 1px solid ${colors.border};
`;

const DateButtonText = styled.Text`
  color: ${colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
`;

const MainButton = styled.TouchableOpacity`
  background-color: ${props => props.disabled ? colors.textTertiary : colors.primary};
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-top: 5px;
`;

const MainButtonText = styled.Text`
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
`;

const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.border};
`;

const StatLabel = styled.Text`
  color: ${colors.textSecondary};
  font-size: 14px;
`;

const StatValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 14px;
  font-weight: 600;
`;

const DataCard = styled.View`
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  border-left-width: 5px;
  border-left-color: ${colors.primary};
`;

const DataTime = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  margin-bottom: 10px;
`;

const DataRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DataValueContainer = styled.View`
  align-items: center;
`;

const DataValue = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const DataLabel = styled.Text`
  font-size: 11px;
  color: ${colors.textTertiary};
  margin-top: 2px;
`;

const NoDataContainer = styled.View`
  background-color: ${colors.surface};
  border-radius: 16px;
  padding: 40px 20px;
  align-items: center;
  margin: 20px 0;
  border: 1px dashed ${colors.border};
`;

const NoDataText = styled.Text`
  color: ${colors.textSecondary};
  font-size: 16px;
  text-align: center;
  margin-top: 15px;
  line-height: 24px;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 8px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${props => props.disabled ? colors.textTertiary : (props.color || colors.textSecondary)};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  flex: 1;
`;

const ActionButtonText = styled.Text`
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
`;

const MascotaInfo = styled.View`
  background-color: ${colors.infoBackground};
  border-radius: 12px;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-left-width: 5px;
  border-left-color: ${colors.primary};
`;

const MascotaInfoText = styled.Text`
  color: ${colors.primaryDark};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`;

const FooterText = styled.Text`
  text-align: center;
  color: ${colors.textSecondary};
  margin-top: 15px;
  padding-bottom: 30px;
  font-style: italic;
`;


const CollarHistorialScreen = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFin, setShowDatePickerFin] = useState(false);
  
  const [datos, setDatos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generandoReporte, setGenerandoReporte] = useState(false);
  const [nombreMascota, setNombreMascota] = useState('Mi mascota');
  const [mascotaInfo, setMascotaInfo] = useState(null);

  useEffect(() => {
    HistorialService.limpiarCache();
    obtenerInfoMascota();
    buscarDatos(true);
  }, []);

  const obtenerInfoMascota = async () => {
    try {
      const mascotaConCollar = await HistorialService.obtenerMascotaConCollar();
      if (mascotaConCollar) {
        setNombreMascota(mascotaConCollar.nombre);
        setMascotaInfo(mascotaConCollar);
      }
    } catch (error) {
      console.error('Error obteniendo información de mascota:', error);
    }
  };

  const buscarDatos = async (mostrarLoader = false) => {
    if (mostrarLoader) setCargando(true);
    try {
      const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
      const fechaFinStr = fechaFin.toISOString().split('T')[0];
      
      const [registros, stats] = await Promise.all([
        HistorialService.obtenerHistorialPorFechas(fechaInicioStr, fechaFinStr),
        HistorialService.obtenerEstadisticas(fechaInicioStr, fechaFinStr)
      ]);
      
      setDatos(registros);
      setEstadisticas(stats);
      
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos del historial');
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    obtenerInfoMascota();
    buscarDatos(false);
  }, [fechaInicio, fechaFin]);

  const cambiarFecha = (event, selectedDate, tipo) => {
    Platform.OS === 'android' && (tipo === 'inicio' ? setShowDatePickerInicio(false) : setShowDatePickerFin(false));
    if (selectedDate) {
      if (tipo === 'inicio') {
        setFechaInicio(selectedDate);
        if (selectedDate > fechaFin) setFechaFin(selectedDate);
      } else {
        setFechaFin(selectedDate);
      }
    }
  };

  const formatearFecha = (fecha) => fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  
  const generarReporte = async (tipo = 'completo') => {
    if (datos.length === 0) {
      Alert.alert('Sin datos', 'No hay datos para generar el reporte');
      return;
    }
    setGenerandoReporte(true);
    try {
      const resultado = await generarYCompartirReporte({
        mascotaId: mascotaInfo?.id || 'device01', tipo, formato: 'pdf',
        rango: { inicio: fechaInicio, fin: fechaFin }, nombreMascota
      });
      if (resultado.success) Alert.alert('✅ Éxito', resultado.message);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo generar el reporte');
    } finally {
      setGenerandoReporte(false);
    }
  };

  const seleccionarFechaRapida = (tipo) => {
    const hoy = new Date(); let inicio = new Date();
    hoy.setHours(23, 59, 59, 999); inicio.setHours(0, 0, 0, 0);
    switch (tipo) {
      case 'hoy': setFechaInicio(inicio); setFechaFin(hoy); break;
      case 'ayer':
        inicio.setDate(hoy.getDate() - 1);
        let finAyer = new Date(inicio); finAyer.setHours(23, 59, 59, 999);
        setFechaInicio(inicio); setFechaFin(finAyer); break;
      case 'semana': inicio.setDate(hoy.getDate() - 6); setFechaInicio(inicio); setFechaFin(hoy); break;
      case 'mes': inicio.setMonth(hoy.getMonth() - 1); setFechaInicio(inicio); setFechaFin(hoy); break;
    }
  };

  const renderRegistroItem = ({ item }) => (
    <DataCard>
      <DataTime>{item.fecha} a las {item.hora}</DataTime>
      <DataRow>
        <DataValueContainer><DataValue>🌡️ {item.temperatura.mascota.toFixed(1)}°C</DataValue><DataLabel>Mascota</DataLabel></DataValueContainer>
        <DataValueContainer><DataValue>🔊 {item.sonido}%</DataValue><DataLabel>Sonido</DataLabel></DataValueContainer>
        <DataValueContainer><DataValue>📍 GPS</DataValue><DataLabel>Ubicación</DataLabel></DataValueContainer>
      </DataRow>
    </DataCard>
  );

  const renderHeader = () => (
    <>
      <Title>Historial de {nombreMascota}</Title>
      {mascotaInfo && (
        <MascotaInfo>
          <MascotaInfoText>
            🐕 Mascota: {mascotaInfo.nombre} ({mascotaInfo.raza || 'Sin raza'}){'\n'}
            📟 Collar ID: {mascotaInfo.collar_id || 'No asignado'}
          </MascotaInfoText>
        </MascotaInfo>
      )}
      <FilterCard>
        <CardTitle>🗓️ Filtrar por fecha</CardTitle>
        <ButtonsRow>
          <ActionButton color={colors.textSecondary} onPress={() => seleccionarFechaRapida('hoy')}><ActionButtonText>Hoy</ActionButtonText></ActionButton>
          <ActionButton color={colors.textSecondary} onPress={() => seleccionarFechaRapida('ayer')}><ActionButtonText>Ayer</ActionButtonText></ActionButton>
          <ActionButton color={colors.textSecondary} onPress={() => seleccionarFechaRapida('semana')}><ActionButtonText>7 Días</ActionButtonText></ActionButton>
          <ActionButton color={colors.textSecondary} onPress={() => seleccionarFechaRapida('mes')}><ActionButtonText>30 Días</ActionButtonText></ActionButton>
        </ButtonsRow>
        <DateButton onPress={() => setShowDatePickerInicio(true)}><DateButtonText>Desde: {formatearFecha(fechaInicio)}</DateButtonText></DateButton>
        <DateButton onPress={() => setShowDatePickerFin(true)}><DateButtonText>Hasta: {formatearFecha(fechaFin)}</DateButtonText></DateButton>
        <MainButton onPress={() => buscarDatos(true)} disabled={cargando}><MainButtonText>{cargando ? 'Buscando...' : '🔍 Buscar'}</MainButtonText></MainButton>
      </FilterCard>
      
      {datos.length > 0 && (
        <>
          {estadisticas && estadisticas.totalRegistros > 0 && (
            <Card>
              <CardTitle>📈 Resumen del período</CardTitle>
              <StatRow><StatLabel>Total de registros</StatLabel><StatValue>{estadisticas.totalRegistros}</StatValue></StatRow>
              <StatRow><StatLabel>🌡️ Temp. Promedio</StatLabel><StatValue>{estadisticas.temperatura.promedio.toFixed(1)}°C</StatValue></StatRow>
              <StatRow><StatLabel>🔺 Temp. Máxima</StatLabel><StatValue>{estadisticas.temperatura.maxima.toFixed(1)}°C</StatValue></StatRow>
              <StatRow><StatLabel>🔻 Temp. Mínima</StatLabel><StatValue>{estadisticas.temperatura.minima.toFixed(1)}°C</StatValue></StatRow>
              <StatRow style={{ borderBottomWidth: 0 }}><StatLabel>🔊 Sonido promedio</StatLabel><StatValue>{Math.round(estadisticas.sonido.promedio)}%</StatValue></StatRow>
            </Card>
          )}
          <ButtonsRow style={{marginBottom: 20}}>
              <ActionButton color={colors.error} onPress={() => generarReporte('completo')} disabled={generandoReporte}><ActionButtonText>{generandoReporte ? '...' : '📄 Reporte PDF'}</ActionButtonText></ActionButton>
              <ActionButton color={colors.success} onPress={() => generarReporte('estadisticas')} disabled={generandoReporte}><ActionButtonText>{generandoReporte ? '...' : '📊 Stats PDF'}</ActionButtonText></ActionButton>
          </ButtonsRow>
          <CardTitle>📋 Registros encontrados ({datos.length})</CardTitle>
        </>
      )}
    </>
  );

  if (cargando) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background}}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 15, color: colors.textSecondary, fontSize: 16 }}>Cargando historial...</Text>
        </View>
    );
  }

  return (
    <Container>
      <FlatList
        data={datos.slice(0, 50)}
        renderItem={renderRegistroItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={(
            <NoDataContainer>
                <Text style={{ fontSize: 48 }}>📭</Text>
                <NoDataText>No se encontraron registros para el período seleccionado.</NoDataText>
            </NoDataContainer>
        )}
        ListFooterComponent={datos.length > 50 && (
          <FooterText>Mostrando los primeros 50 de {datos.length} registros.</FooterText>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      {showDatePickerInicio && <DateTimePicker value={fechaInicio} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={new Date()} onChange={(e,d) => cambiarFecha(e,d,'inicio')}/>}
      {showDatePickerFin && <DateTimePicker value={fechaFin} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={new Date()} minimumDate={fechaInicio} onChange={(e,d) => cambiarFecha(e,d,'fin')}/>}
    </Container>
  );
};

export default CollarHistorialScreen;