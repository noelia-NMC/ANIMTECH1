// Mobile/src/screens/CollarScreen.js - CÓDIGO ORIGINAL INTACTO
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text,
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebaseConfig'; 
import HistorialService from '../../services/historialCollar';  
// Se importan los estilos mejorados.
// Notar que algunos componentes como NotificationBox no se usan en tu lógica original,
// por lo que no se importan para mantener el código idéntico.
import {
  Container, 
  MetricCard, MetricTitle, MetricValue, MetricUnit, MetricsGrid,
  StatusCard, StatusTitle, StatusDescription, StatusIcon,
  ActionButton, ActionButtonText, ActionButtonsContainer,
  WellnessCard, WellnessIndicator, WellnessScore, WellnessText,
  InfoSection, SectionTitle, LastUpdate
} from '../../styles/CollarStyles';  

const CollarScreen = () => {
  const navigation = useNavigation();
  
  const [datosCollar, setDatosCollar] = useState({
    temperatura: { 
      ambiente: 0, 
      mascota: 0, 
      diferencia: 0,
      estado: 'Evaluando...',
      descripcion: 'Obteniendo datos...',
      color: '#666'
    },
    comportamiento: { 
      nivelSonido: 0, 
      estado: 'Analizando...',
      descripcion: 'Procesando audio...',
      color: '#666',
      emoji: '🐕'
    },
    ubicacion: { 
      latitud: -17.381569, 
      longitud: -66.165263,
      coordenadas: '',
      estado: 'Buscando GPS...'
    },
    bienestar: {
      general: 'Evaluando...',
      recomendacion: 'Obteniendo datos...',
      color: '#666',
      puntuacion: 0
    },
    conectado: false,
    ultima_actualizacion: null
  });

  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [guardadoAutomaticoActivo, setGuardadoAutomaticoActivo] = useState(false);

  // Función para interpretar comportamiento basado en sonido
  const interpretarComportamiento = (nivelSonido) => {
    try {
      const nivel = Number(nivelSonido) || 0;
      
      if (nivel >= 0 && nivel <= 15) {
        return { 
          estado: 'Durmiendo', 
          descripcion: 'Descansando tranquilamente', 
          color: '#4caf50', 
          emoji: '😴',
          consejo: 'Perfecto para el descanso'
        };
      } else if (nivel > 15 && nivel <= 30) {
        return { 
          estado: 'Relajado', 
          descripcion: 'Comportamiento tranquilo', 
          color: '#2196f3', 
          emoji: '😌',
          consejo: 'Estado ideal de calma'
        };
      } else if (nivel > 30 && nivel <= 45) {
        return { 
          estado: 'Activo', 
          descripcion: 'Movimiento normal', 
          color: '#ff9800', 
          emoji: '🎾',
          consejo: 'Actividad saludable'
        };
      } else if (nivel > 45 && nivel <= 60) {
        return { 
          estado: 'Comunicativo', 
          descripcion: 'Ladridos ocasionales', 
          color: '#ff5722', 
          emoji: '🔊',
          consejo: 'Comunicación normal'
        };
      } else if (nivel > 60 && nivel <= 75) {
        return { 
          estado: 'Alerta', 
          descripcion: 'Ladridos frecuentes', 
          color: '#f44336', 
          emoji: '🚨',
          consejo: 'Puede estar alertando'
        };
      } else if (nivel > 75 && nivel <= 90) {
        return { 
          estado: 'Estresado', 
          descripcion: 'Ladridos intensos', 
          color: '#d32f2f', 
          emoji: '😰',
          consejo: 'Revisar posible estrés'
        };
      } else {
        return { 
          estado: 'Muy alterado', 
          descripcion: 'Ladridos extremos', 
          color: '#b71c1c', 
          emoji: '⚠️',
          consejo: 'Revisar inmediatamente'
        };
      }
    } catch (err) {
      console.error('Error interpretando comportamiento:', err);
      return { 
        estado: 'Error', 
        descripcion: 'Error procesando audio', 
        color: '#666', 
        emoji: '❓',
        consejo: 'Verificar conexión'
      };
    }
  };

  // Función para interpretar estado térmico
  const interpretarEstadoTermico = (tempMascota, tempAmbiente) => {
    try {
      const tempM = Number(tempMascota) / 100 || 0;
      const tempA = Number(tempAmbiente) / 100 || 0;
      const diferencia = tempM - tempA;
      
      let estadoSalud = {};
      if (tempM < 37.5) {
        estadoSalud = { 
          estado: 'Hipotermia', 
          descripcion: 'Temperatura corporal baja', 
          color: '#2196f3',
          urgencia: 'alta'
        };
      } else if (tempM >= 37.5 && tempM <= 39.2) {
        estadoSalud = { 
          estado: 'Normal', 
          descripcion: 'Temperatura corporal saludable', 
          color: '#4caf50',
          urgencia: 'ninguna'
        };
      } else if (tempM > 39.2 && tempM <= 40.0) {
        estadoSalud = { 
          estado: 'Febril', 
          descripcion: 'Temperatura ligeramente elevada', 
          color: '#ff9800',
          urgencia: 'media'
        };
      } else if (tempM > 40.0 && tempM <= 41.0) {
        estadoSalud = { 
          estado: 'Fiebre alta', 
          descripcion: 'Temperatura preocupante', 
          color: '#ff5722',
          urgencia: 'alta'
        };
      } else {
        estadoSalud = { 
          estado: 'Crítica', 
          descripcion: 'Temperatura crítica', 
          color: '#d32f2f',
          urgencia: 'crítica'
        };
      }

      let confortTermico = '';
      if (diferencia < 1) {
        confortTermico = 'Muy cómodo';
      } else if (diferencia >= 1 && diferencia <= 2) {
        confortTermico = 'Cómodo';
      } else if (diferencia > 2 && diferencia <= 3) {
        confortTermico = 'Ligeramente caluroso';
      } else if (diferencia > 3 && diferencia <= 4) {
        confortTermico = 'Caluroso';
      } else {
        confortTermico = 'Riesgo sobrecalentamiento';
      }

      return {
        ...estadoSalud,
        diferencia,
        confortTermico,
        tempM,
        tempA
      };
    } catch (err) {
      console.error('Error interpretando temperatura:', err);
      return { 
        estado: 'Error', 
        descripcion: 'Error procesando temperatura', 
        color: '#666',
        diferencia: 0,
        confortTermico: 'No disponible',
        urgencia: 'ninguna',
        tempM: 0,
        tempA: 0
      };
    }
  };

  // Función para evaluar bienestar general
  const evaluarBienestarGeneral = (estadoTermico, comportamiento) => {
    try {
      const urgenciaTermica = estadoTermico.urgencia || 'ninguna';
      const nivelSonido = comportamiento.nivelSonido || 0;
      
      if (urgenciaTermica === 'crítica' || nivelSonido > 90) {
        return {
          general: 'Atención inmediata',
          recomendacion: 'Contactar veterinario urgentemente',
          color: '#d32f2f',
          puntuacion: 15
        };
      } else if (urgenciaTermica === 'alta' || nivelSonido > 75) {
        return {
          general: 'Supervisión necesaria',
          recomendacion: 'Monitorear de cerca',
          color: '#ff5722',
          puntuacion: 35
        };
      } else if (urgenciaTermica === 'media' || nivelSonido > 60) {
        return {
          general: 'Ligeramente alterado',
          recomendacion: 'Observar comportamiento',
          color: '#ff9800',
          puntuacion: 60
        };
      } else if (urgenciaTermica === 'ninguna' && nivelSonido <= 30) {
        return {
          general: 'Excelente estado',
          recomendacion: 'Todo perfecto',
          color: '#4caf50',
          puntuacion: 95
        };
      } else {
        return {
          general: 'Estado bueno',
          recomendacion: 'Comportamiento normal',
          color: '#2196f3',
          puntuacion: 80
        };
      }
    } catch (err) {
      console.error('Error evaluando bienestar:', err);
      return {
        general: 'Error en evaluación',
        recomendacion: 'Verificar conexión',
        color: '#666',
        puntuacion: 0
      };
    }
  };

  const procesarDatos = (data) => {
    try {
      if (!data) {
        throw new Error('No hay datos disponibles');
      }

      console.log('📡 Datos recibidos de Firebase:', data);

      const tempMascota = data.temperatura?.mascota || 0;
      const tempAmbiente = data.temperatura?.ambiente || 0;
      const nivelSonido = data.sonido || 0;
      const posicion = data.posicion || {};
      
      const estadoTermico = interpretarEstadoTermico(tempMascota, tempAmbiente);
      const comportamiento = interpretarComportamiento(nivelSonido);
      const bienestar = evaluarBienestarGeneral(estadoTermico, { nivelSonido });

      const nuevoDato = {
        temperatura: {
          ambiente: estadoTermico.tempA,
          mascota: estadoTermico.tempM,
          diferencia: estadoTermico.diferencia,
          estado: estadoTermico.estado,
          descripcion: estadoTermico.descripcion,
          confortTermico: estadoTermico.confortTermico,
          color: estadoTermico.color
        },
        comportamiento: {
          nivelSonido: Number(nivelSonido) || 0,
          estado: comportamiento.estado,
          descripcion: comportamiento.descripcion,
          color: comportamiento.color,
          emoji: comportamiento.emoji,
          consejo: comportamiento.consejo
        },
        ubicacion: {
          latitud: Number(posicion.latitud) || -17.381569,
          longitud: Number(posicion.longitud) || -66.165263,
          coordenadas: posicion.Coordenadas || `${posicion.latitud || -17.381569}, ${posicion.longitud || -66.165263}`,
          estado: 'GPS activo'
        },
        bienestar: bienestar,
        conectado: true,
        ultima_actualizacion: new Date().toLocaleString()
      };

      setDatosCollar(nuevoDato);
      setError(null);

    } catch (err) {
      console.error('❌ Error procesando datos:', err);
      setError(err.message);
    }
  };

  const connectToFirebase = () => {
    try {
      const collarRef = ref(db, 'AnimTech/device01');
      
      const unsubscribe = onValue(collarRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          procesarDatos(data);
        }
        setCargando(false);
        setRefreshing(false);
      }, (error) => {
        console.error('❌ Error Firebase:', error);
        setError('Error de conexión con Firebase');
        setCargando(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('❌ Error conectando Firebase:', err);
      setError('Error al conectar con Firebase');
      setCargando(false);
      setRefreshing(false);
      return null;
    }
  };

  useEffect(() => {
    // Conectar a Firebase para obtener datos en tiempo real
    const unsubscribe = connectToFirebase();
    
    // Iniciar guardado automático
    const guardadoListener = HistorialService.iniciarGuardadoAutomatico();
    setGuardadoAutomaticoActivo(true);
    
    console.log('🚀 Sistema iniciado - Monitoreo y guardado automático activos');
    
    return () => {
      if (unsubscribe) unsubscribe();
      HistorialService.detenerGuardadoAutomatico();
      setGuardadoAutomaticoActivo(false);
      console.log('⏹️ Sistema detenido - Monitoreo y guardado automático desactivados');
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    connectToFirebase();
  }, []);

  const handleShowGraphs = () => {
    navigation.navigate('CollarGraphs');
  };

  const handleShowLocation = () => {
    navigation.navigate('CollarLocation', { ubicacion: datosCollar.ubicacion });
  };

  // NUEVA FUNCIÓN: Navegar al historial dentro del mismo stack
  const handleShowHistorial = () => {
    navigation.navigate('CollarHistorial');  // Este será tu nueva pantalla
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef2f5' }}>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={{ marginTop: 15, fontSize: 16, color: '#4b5563', fontWeight: '500' }}>
          Conectando con el collar...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef2f5', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#ef4444', marginBottom: 10, fontWeight: '600' }}>Error de conexión</Text>
        <Text style={{ fontSize: 14, color: '#4b5563', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#42a8a1', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
          onPress={() => {
            setError(null);
            setCargando(true);
            connectToFirebase();
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#eef2f5' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#42a8a1']} tintColor={'#42a8a1'}/>
      }
      showsVerticalScrollIndicator={false}
    >
      <Container>
        {/* INDICADOR DE BIENESTAR */}
        <WellnessCard statusColor={datosCollar.bienestar.color}>
          <WellnessIndicator color={datosCollar.bienestar.color}>
            <WellnessScore>{datosCollar.bienestar.puntuacion}</WellnessScore>
            <WellnessText>Bienestar</WellnessText>
          </WellnessIndicator>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <StatusTitle>{datosCollar.bienestar.general}</StatusTitle>
            <StatusDescription>{datosCollar.bienestar.recomendacion}</StatusDescription>
          </View>
        </WellnessCard>

        {/* MÉTRICAS PRINCIPALES */}
        <MetricsGrid>
          <MetricCard>
            <MetricTitle>Temperatura</MetricTitle>
            <MetricValue color={datosCollar.temperatura.color}>
              {datosCollar.temperatura.mascota.toFixed(1)}
              <MetricUnit>°C</MetricUnit>
            </MetricValue>
            <Text style={{ fontSize: 10, color: '#6c757d', marginTop: 4 }}>
              {datosCollar.temperatura.estado}
            </Text>
          </MetricCard>

          <MetricCard>
            <MetricTitle>Comportamiento</MetricTitle>
            <MetricValue color={datosCollar.comportamiento.color}>
              {datosCollar.comportamiento.nivelSonido}
              <MetricUnit>%</MetricUnit>
            </MetricValue>
            <Text style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>
              {datosCollar.comportamiento.estado}
            </Text>
          </MetricCard>
        </MetricsGrid>

        <MetricsGrid>
          <MetricCard>
            <MetricTitle>Ambiente</MetricTitle>
            <MetricValue color="#6c757d">
              {datosCollar.temperatura.ambiente.toFixed(1)}
              <MetricUnit>°C</MetricUnit>
            </MetricValue>
            <Text style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>
              Temperatura externa
            </Text>
          </MetricCard>

          <MetricCard>
            <MetricTitle>Diferencia</MetricTitle>
            <MetricValue color="#ff9800">
              +{datosCollar.temperatura.diferencia.toFixed(1)}
              <MetricUnit>°C</MetricUnit>
            </MetricValue>
            <Text style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>
              Mascota vs Ambiente
            </Text>
          </MetricCard>
        </MetricsGrid>

        {/* ESTADO TÉRMICO */}
        <StatusCard statusColor={datosCollar.temperatura.color}>
          <StatusIcon>🌡️</StatusIcon>
          <View style={{ flex: 1 }}>
            <StatusTitle>Estado térmico</StatusTitle>
            <StatusDescription>
              {datosCollar.temperatura.descripcion} • {datosCollar.temperatura.confortTermico}
            </StatusDescription>
          </View>
        </StatusCard>

        {/* COMPORTAMIENTO */}
        <StatusCard statusColor={datosCollar.comportamiento.color}>
          <StatusIcon>{datosCollar.comportamiento.emoji}</StatusIcon>
          <View style={{ flex: 1 }}>
            <StatusTitle>Comportamiento</StatusTitle>
            <StatusDescription>
              {datosCollar.comportamiento.descripcion} • {datosCollar.comportamiento.consejo}
            </StatusDescription>
          </View>
        </StatusCard>

        {/* BOTONES DE ACCIÓN PRINCIPALES */}
        <ActionButtonsContainer>
          <ActionButton onPress={handleShowGraphs}>
            <StatusIcon style={{ fontSize: 15 }}>📊</StatusIcon>
            <ActionButtonText>Gráficos</ActionButtonText>
          </ActionButton>

          <ActionButton onPress={handleShowLocation}>
            <StatusIcon style={{ fontSize: 15 }}>📍</StatusIcon>
            <ActionButtonText>Ubicación</ActionButtonText>
          </ActionButton>
        </ActionButtonsContainer>

        {/* NUEVA FILA: HISTORIAL Y REPORTES */}
        <ActionButtonsContainer>
          <ActionButton onPress={handleShowHistorial}>
            <StatusIcon style={{ fontSize: 15 }}>📈</StatusIcon>
            <ActionButtonText>Historial</ActionButtonText>
          </ActionButton>

          <ActionButton onPress={() => {
            Alert.alert(
              'Información del sistema',
              `• Guardado automático: ${guardadoAutomaticoActivo ? 'Activo' : 'Inactivo'}\n` +
              `• Los datos se guardan por fechas en Firebase\n` +
              `• Última actualización: ${datosCollar.ultima_actualizacion}`,
              [{ text: 'OK', style: 'default' }]
            );
          }}>
            <StatusIcon style={{ fontSize: 15 }}>ℹ️</StatusIcon>
            <ActionButtonText>Info Sistema</ActionButtonText>
          </ActionButton>
        </ActionButtonsContainer>

        <LastUpdate>
          Última actualización: {datosCollar.ultima_actualizacion}
        </LastUpdate>

        {/* NOTIFICACIÓN SOBRE SISTEMA DE GUARDADO */}
        <View style={{ 
          backgroundColor: '#e8f5e8', 
          padding: 15, 
          borderRadius: 8, 
          marginTop: 15,
          borderLeftWidth: 4,
          borderLeftColor: '#28a745'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>💾</Text>
            <Text style={{ fontSize: 14, color: '#155724', fontWeight: '600' }}>
              Guardado automático por fechas
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#155724', lineHeight: 16 }}>
            • Cada lectura se guarda automáticamente en Firebase{'\n'}
            • Organizados por fecha (YYYY-MM-DD){'\n'}
            • Acceso fácil desde "Historial"{'\n'}
            • Los datos incluyen: temperatura, sonido, ubicación GPS{'\n'}
            • Respaldo automático en tiempo real
          </Text>
        </View>
      </Container>
    </ScrollView>
  );
};

export default CollarScreen;