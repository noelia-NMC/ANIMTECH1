import React, { useState, useEffect } from 'react';
import {
  View, Text, Alert, ActivityIndicator, Platform, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// Servicios
import { getMisPerfiles } from '../services/perfilMascotaService';
import { generarYCompartirReporte } from '../services/reportesService';

// Estilos
import {
  Container, Header, BackButton, HeaderTitle, ScrollContainer, InfoCard,
  CardHeader, CardTitle, CardSubtitle, CardContent, OptionButton,
  OptionIcon, OptionText, Separator, CenteredContainer, DateSelectorRow,
  DateContainer, DateLabel, DateButton, DateText,
} from '../styles/ReportesStyles';

// Componente DateSelector (sin cambios)
const DateSelector = ({ label, date, onChange }) => {
  const [visible, setVisible] = useState(false);
  const handleChange = (_, selectedDate) => {
    setVisible(Platform.OS === 'ios');
    if (selectedDate) onChange(selectedDate);
  };
  return (
    <DateContainer>
      <DateLabel>{label}</DateLabel>
      <DateButton onPress={() => setVisible(true)}>
        <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        <DateText>{date.toLocaleDateString('es-ES')}</DateText>
      </DateButton>
      {visible && <DateTimePicker value={date} mode="date" display="default" onChange={handleChange} />}
    </DateContainer>
  );
};

// --- Pantalla Principal: Reportes (Refactorizada) ---
const ReportesScreen = ({ navigation }) => {
  const [perfilActivo, setPerfilActivo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== INICIO DE LA CORRECCIÓN CLAVE #2 =====
  // Usamos un objeto para el estado de carga, para saber qué botón está cargando.
  const [generating, setGenerating] = useState({
    'actividades-pdf': false,
    'actividades-xlsx': false,
    'collar-pdf': false,
    'collar-xlsx': false,
  });
  // ====== FIN DE LA CORRECCIÓN CLAVE #2 ======

  const [rangoActividades, setRangoActividades] = useState({
    inicio: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    fin: new Date(),
  });
  const [rangoCollar, setRangoCollar] = useState({
    inicio: new Date(new Date().setDate(new Date().getDate() - 30)),
    fin: new Date(),
  });

  // Carga de perfil (sin cambios)
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const perfiles = await getMisPerfiles();
        const idGuardado = await AsyncStorage.getItem('perfilActivoId');
        let elegido = perfiles?.[0] ?? null;
        if (idGuardado) {
          const encontrado = perfiles.find((p) => p.id.toString() === idGuardado);
          if (encontrado) elegido = encontrado;
        }
        setPerfilActivo(elegido);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        Alert.alert('Error', 'No se pudo obtener la información de la mascota.');
      } finally {
        setLoading(false);
      }
    };
    const unsubscribe = navigation.addListener('focus', cargarPerfil);
    return unsubscribe;
  }, [navigation]);

  // --- Lógica de generación (actualizada) ---
  const handleGenerarReporte = async (tipo, formato) => {
    const key = `${tipo}-${formato}`; // e.g., 'actividades-pdf'
    if (generating[key]) return;

    // Actualiza el estado de carga solo para este botón
    setGenerating(prev => ({ ...prev, [key]: true }));

    const rango = tipo === 'actividades' ? rangoActividades : rangoCollar;

    if (rango.inicio > rango.fin) {
      Alert.alert("Fechas inválidas", "La fecha 'Desde' no puede ser posterior a la fecha 'Hasta'.");
      setGenerating(prev => ({ ...prev, [key]: false })); // Desactiva el loading
      return;
    }

    try {
      await generarYCompartirReporte({
        mascotaId: perfilActivo.id,
        tipo,
        formato,
        rango,
        nombreMascota: perfilActivo.nombre,
      });
    } catch (error) {
      console.error(`Fallo al generar reporte (${key}):`, error);
      Alert.alert('Error', error.message || 'No se pudo generar el reporte.');
    } finally {
      // Desactiva el loading solo para este botón
      setGenerating(prev => ({ ...prev, [key]: false }));
    }
  };

  /* ---------------------------------------------------
     Renderizado Condicional (Lógica de Protección)
  --------------------------------------------------- */

  // 1. Estado de Carga Inicial
  if (loading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={{ marginTop: 10, color: '#555' }}>Cargando información...</Text>
      </CenteredContainer>
    );
  }

  // 2. Estado sin Mascota Activa
  if (!perfilActivo) {
    return (
      <>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </BackButton>
          <HeaderTitle>Reportes</HeaderTitle>
        </Header>
        <CenteredContainer>
          <Ionicons name="paw-outline" size={60} color="#ccc" />
          <Text style={{ textAlign: 'center', padding: 20, color: '#555', fontSize: 16 }}>
            No se encontró una mascota activa.
          </Text>
          <Text style={{ textAlign: 'center', paddingHorizontal: 40, color: '#777' }}>
            Por favor, selecciona una desde la pantalla de inicio o añade una nueva para poder generar reportes.
          </Text>
        </CenteredContainer>
      </>
    );
  }
  const esPerro = perfilActivo.especie?.toLowerCase().trim().includes('canino');
  const tieneCollar = Boolean(perfilActivo.collar_id);

  // --- Renderizado Principal (con botones actualizados) ---
  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="#333" /></BackButton>
        <HeaderTitle>Generar reportes</HeaderTitle>
      </Header>
      <ScrollContainer>
        {/* --- REPORTE DE ACTIVIDADES --- */}
        <InfoCard>
          <CardHeader>
            <Ionicons name="document-text-outline" size={32} color="#3b82f6" />
            <View><CardTitle>Reporte de actividades</CardTitle><CardSubtitle>Exporta el historial de eventos de {perfilActivo.nombre}.</CardSubtitle></View>
          </CardHeader>
          <DateSelectorRow>
            <DateSelector label="Desde" date={rangoActividades.inicio} onChange={(d) => setRangoActividades((prev) => ({ ...prev, inicio: d }))} />
            <DateSelector label="Hasta" date={rangoActividades.fin} onChange={(d) => setRangoActividades((prev) => ({ ...prev, fin: d }))} />
          </DateSelectorRow>
          <CardContent>
            <OptionButton disabled={generating['actividades-pdf']} onPress={() => handleGenerarReporte('actividades', 'pdf')}>
              {generating['actividades-pdf'] ? <ActivityIndicator color="#d32f2f" /> : <OptionIcon><Ionicons name="document-outline" size={24} color="#d32f2f" /></OptionIcon>}
              <OptionText>Exportar como PDF</OptionText>
            </OptionButton>
            <Separator />
            <OptionButton disabled={generating['actividades-xlsx']} onPress={() => handleGenerarReporte('actividades', 'xlsx')}>
              {generating['actividades-xlsx'] ? <ActivityIndicator color="#16a34a" /> : <OptionIcon><Ionicons name="grid-outline" size={24} color="#16a34a" /></OptionIcon>}
              <OptionText>Exportar como Excel</OptionText>
            </OptionButton>
          </CardContent>
        </InfoCard>

        {/* --- REPORTE DEL COLLAR --- */}
        {esPerro && tieneCollar && (
          <InfoCard>
            <CardHeader>
              <Ionicons name="hardware-chip-outline" size={32} color="#f59e0b" />
              <View><CardTitle>Reporte de datos del collar</CardTitle><CardSubtitle>Exporta datos biométricos y de actividad.</CardSubtitle></View>
            </CardHeader>
            <DateSelectorRow>
              <DateSelector label="Desde" date={rangoCollar.inicio} onChange={(d) => setRangoCollar((prev) => ({ ...prev, inicio: d }))} />
              <DateSelector label="Hasta" date={rangoCollar.fin} onChange={(d) => setRangoCollar((prev) => ({ ...prev, fin: d }))} />
            </DateSelectorRow>
            <CardContent>
              <OptionButton disabled={generating['collar-pdf']} onPress={() => handleGenerarReporte('collar', 'pdf')}>
                {generating['collar-pdf'] ? <ActivityIndicator color="#d32f2f" /> : <OptionIcon><Ionicons name="document-outline" size={24} color="#d32f2f" /></OptionIcon>}
                <OptionText>Exportar como PDF</OptionText>
              </OptionButton>
              <Separator />
              <OptionButton disabled={generating['collar-xlsx']} onPress={() => handleGenerarReporte('collar', 'xlsx')}>
                {generating['collar-xlsx'] ? <ActivityIndicator color="#16a34a" /> : <OptionIcon><Ionicons name="grid-outline" size={24} color="#16a34a" /></OptionIcon>}
                <OptionText>Exportar como Excel</OptionText>
              </OptionButton>
            </CardContent>
          </InfoCard>
        )}
      </ScrollContainer>
    </Container>
  );
};

export default ReportesScreen;