import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Alert, RefreshControl, Share, Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  RescatesList,
  RescateCard,
  CardHeader,
  AnimalAvatar,
  AnimalInitial,
  CardContent,
  CardTitle,
  StatusChip,
  StatusText,
  CardDescription,
  InfoRow,
  InfoIcon,
  InfoText,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptySubtitle,
  LoadingContainer,
  LoadingText,
  SuccessContainer,
  SuccessText,
  DurationText,
  StatsContainer,
  StatItem,
  StatNumber,
  StatLabel,
  ActionContainer,
  ActionButton,
  ActionButtonText
} from '../../../styles/RescatesStyles';

const MisRescatesTab = ({ navigation, userProfile }) => {
  const [misRescates, setMisRescates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [rescateSeleccionado, setRescateSeleccionado] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    enProceso: 0,
    finalizados: 0,
    reportados: 0,
    ayudados: 0,
    promedioTiempo: 0,
    tiempoTotalAyuda: 0,
    puntuacionImpacto: 0,
    racha: 0
  });

  // Funciones auxiliares optimizadas
  const getAnimalInitial = useCallback((descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('perro') || desc.includes('cachorro')) return '🐕';
    if (desc.includes('gato') || desc.includes('gatito')) return '🐱';
    if (desc.includes('ave') || desc.includes('pájaro')) return '🐦';
    if (desc.includes('conejo')) return '🐰';
    if (desc.includes('hamster')) return '🐹';
    return '🐾';
  }, []);

  const getTimeAgo = useCallback((fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    const now = new Date();
    let then;
    
    if (typeof fecha === 'number') {
      then = new Date(fecha);
    } else if (typeof fecha === 'object' && fecha.seconds) {
      then = new Date(fecha.seconds * 1000);
    } else if (typeof fecha === 'string') {
      then = new Date(fecha);
    } else {
      return 'Fecha no válida';
    }
    
    if (isNaN(then.getTime())) return 'Fecha no válida';
    
    const diffInMinutes = Math.floor((now - then) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    
    const diffInDays = Math.floor(diffInMinutes / 1440);
    if (diffInDays === 1) return 'Hace 1 día';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    
    return `Hace ${Math.floor(diffInDays / 30)} meses`;
  }, []);

  const calcularDuracionRescate = useCallback((rescate) => {
    if (!rescate.fechaFinalizacion) return null;
    
    const inicio = rescate.fechaAsignacion || rescate.fecha;
    const fin = rescate.fechaFinalizacion;
    
    if (!inicio) return null;
    
    const duracionMs = fin - inicio;
    const duracionHoras = Math.floor(duracionMs / (1000 * 60 * 60));
    const duracionMinutos = Math.floor((duracionMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (duracionHoras > 0) {
      return {
        texto: `${duracionHoras}h ${duracionMinutos}min`,
        horas: duracionHoras,
        minutos: duracionMinutos,
        totalMinutos: Math.floor(duracionMs / (1000 * 60))
      };
    } else {
      return {
        texto: `${duracionMinutos} minutos`,
        horas: 0,
        minutos: duracionMinutos,
        totalMinutos: duracionMinutos
      };
    }
  }, []);

  const formatearFecha = useCallback((fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    let dateObj;
    if (typeof fecha === 'number') {
      dateObj = new Date(fecha);
    } else if (typeof fecha === 'object' && fecha.seconds) {
      dateObj = new Date(fecha.seconds * 1000);
    } else if (typeof fecha === 'string') {
      dateObj = new Date(fecha);
    } else {
      return 'Fecha no válida';
    }
    
    if (isNaN(dateObj.getTime())) return 'Fecha no válida';
    
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const calcularPuntuacionImpacto = useCallback((rescates) => {
    let puntuacion = 0;
    
    rescates.forEach(rescate => {
      // Puntos base por participación
      if (rescate.tipoParticipacion === 'rescatista') {
        puntuacion += 10; // Más puntos por rescatar
      } else {
        puntuacion += 5;  // Menos puntos por reportar
      }
      
      // Bonificación por completar rescate
      if (rescate.estado === 'finalizado') {
        puntuacion += 5;
      }
      
      // Bonificación por documentar con foto
      if (rescate.fotoProgreso) {
        puntuacion += 3;
      }
      
      // Bonificación por comentario final
      if (rescate.comentarioFinal) {
        puntuacion += 2;
      }
      
      // Bonificación por rapidez (menos de 2 horas)
      const duracion = calcularDuracionRescate(rescate);
      if (duracion && duracion.totalMinutos < 120) {
        puntuacion += 3;
      }
    });
    
    return puntuacion;
  }, [calcularDuracionRescate]);

  const calcularRacha = useCallback((rescates) => {
    // Ordenar rescates finalizados por fecha
    const rescatesFinalizados = rescates
      .filter(r => r.estado === 'finalizado')
      .sort((a, b) => {
        const fechaA = a.fechaFinalizacion || 0;
        const fechaB = b.fechaFinalizacion || 0;
        return fechaB - fechaA;
      });
    
    if (rescatesFinalizados.length === 0) return 0;
    
    let racha = 0;
    const ahora = Date.now();
    const unDia = 24 * 60 * 60 * 1000;
    
    // Contar rescates consecutivos en los últimos días
    for (let i = 0; i < rescatesFinalizados.length; i++) {
      const fecha = rescatesFinalizados[i].fechaFinalizacion;
      const diasAtras = Math.floor((ahora - fecha) / unDia);
      
      if (diasAtras <= racha + 1) {
        racha++;
      } else {
        break;
      }
    }
    
    return racha;
  }, []);

  // Listener de Firebase para mis rescates con estadísticas avanzadas
  useEffect(() => {
    if (!userProfile?.id) {
      console.log('⏳ [MisRescatesTab] Esperando perfil de usuario...');
      setLoading(false);
      return;
    }

    console.log('🔄 [MisRescatesTab] Iniciando escucha de mis rescates para usuario:', userProfile.id);
    const rescatesRef = ref(db, 'rescates');
    
    const unsubscribe = onValue(rescatesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📊 [MisRescatesTab] Datos recibidos de Firebase:', data);
      
      if (!data) {
        setMisRescates([]);
        setEstadisticas({
          total: 0,
          enProceso: 0,
          finalizados: 0,
          reportados: 0,
          ayudados: 0,
          promedioTiempo: 0,
          tiempoTotalAyuda: 0,
          puntuacionImpacto: 0,
          racha: 0
        });
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Filtrar mis rescates (rescates que ayudé + rescates que reporté)
      const lista = [];
      let totalTiempo = 0;
      let rescatesConTiempo = 0;
      let enProceso = 0;
      let finalizados = 0;
      let reportados = 0;
      let ayudados = 0;

      Object.entries(data).forEach(([id, rescate]) => {
        const esAyudante = rescate.ayudanteId === userProfile.id;
        const esCreador = rescate.creadorId === userProfile.id;
        
        if (esAyudante || esCreador) {
          const rescateConDatos = { 
            id, 
            ...rescate,
            fechaOriginal: rescate.fecha,
            tipoParticipacion: esAyudante ? 'rescatista' : 'reportador',
            esAyudante,
            esCreador
          };
          
          lista.push(rescateConDatos);

          // Contar por estado
          if (rescate.estado === 'en_proceso' || rescate.estado === 'asignado') {
            enProceso++;
          } else if (rescate.estado === 'finalizado' || rescate.estado === 'resuelto') {
            finalizados++;
          }

          // Contar por tipo de participación
          if (esCreador) {
            reportados++;
          }
          if (esAyudante) {
            ayudados++;
          }

          // Calcular tiempo promedio (solo para rescates que ayudé)
          if (esAyudante && rescate.fechaFinalizacion && (rescate.fechaAsignacion || rescate.fecha)) {
            const inicio = rescate.fechaAsignacion || rescate.fecha;
            const fin = rescate.fechaFinalizacion;
            const tiempoRescate = fin - inicio;
            totalTiempo += tiempoRescate;
            rescatesConTiempo++;
          }
        }
      });

      // Ordenar por fecha más reciente (priorizar fecha de finalización, luego asignación, luego creación)
      lista.sort((a, b) => {
        const fechaA = a.fechaFinalizacion || a.fechaAsignacion || a.fechaOriginal || 0;
        const fechaB = b.fechaFinalizacion || b.fechaAsignacion || b.fechaOriginal || 0;
        return new Date(fechaB) - new Date(fechaA);
      });

      console.log(`✅ ${lista.length} rescates del usuario encontrados`);

      // Calcular estadísticas avanzadas
      const puntuacionImpacto = calcularPuntuacionImpacto(lista);
      const racha = calcularRacha(lista);

      setMisRescates(lista);
      setEstadisticas({
        total: lista.length,
        enProceso,
        finalizados,
        reportados,
        ayudados,
        promedioTiempo: rescatesConTiempo > 0 ? Math.floor(totalTiempo / rescatesConTiempo / (1000 * 60)) : 0,
        tiempoTotalAyuda: Math.floor(totalTiempo / (1000 * 60)),
        puntuacionImpacto,
        racha
      });
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('❌ Error escuchando rescates:', error);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [userProfile, calcularPuntuacionImpacto, calcularRacha]);

  // Refrescar datos
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('🔄 [MisRescatesTab] Refrescando mis rescates...');
  }, []);

  // Abrir modal con detalles
  const abrirModalDetalles = useCallback((rescate) => {
    setRescateSeleccionado(rescate);
    setModalVisible(true);
  }, []);

  // Cerrar modal
  const cerrarModal = () => {
    setModalVisible(false);
    setRescateSeleccionado(null);
  };

  // Compartir mi rescate
  const compartirMiRescate = async (rescate) => {
    try {
      const esRescatista = rescate.tipoParticipacion === 'rescatista';
      const duracion = calcularDuracionRescate(rescate);
      
      const mensaje = `${esRescatista ? '🚀' : '📝'} ${esRescatista ? 'Rescaté' : 'Reporté'} un animalito en AnimTech!

${rescate.descripcion}

${duracion ? `⏱️ Tiempo: ${duracion.texto}` : ''}
${rescate.comentarioFinal ? `💬 "${rescate.comentarioFinal}"` : ''}

¡Únete a nuestra comunidad de rescate animal! 🐾`;

      await Share.share({
        message: mensaje,
        title: `${esRescatista ? 'Mi rescate' : 'Mi reporte'} - AnimTech`
      });
    } catch (error) {
      console.error('❌ Error compartiendo:', error);
    }
  };

  // Mostrar estadísticas detalladas
  const mostrarEstadisticasDetalladas = () => {
    const { 
      total, 
      reportados, 
      ayudados, 
      finalizados, 
      tiempoTotalAyuda, 
      puntuacionImpacto, 
      racha 
    } = estadisticas;

    const mensaje = `
📊 Tu impacto en AnimTech:

🎯 Participación:
• Total de participaciones: ${total}
• Rescates reportados: ${reportados}
• Rescates donde ayudé: ${ayudados}
• Rescates completados: ${finalizados}

⏱️ Tiempo invertido:
• Total ayudando: ${Math.floor(tiempoTotalAyuda / 60)} horas ${tiempoTotalAyuda % 60} min
• Promedio por rescate: ${estadisticas.promedioTiempo} min

🏆 Logros:
• Puntuación de impacto: ${puntuacionImpacto} pts
• Racha actual: ${racha} rescates
• Eficiencia: ${ayudados > 0 ? Math.round((finalizados / ayudados) * 100) : 0}%

¡Cada acción cuenta! 💙
    `;

    Alert.alert('📊 Mi impacto personal', mensaje.trim());
  };

  // Estado de carga simple
  if (loading) {
    return (
      <Container>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#4b5563', fontWeight: '500' }}>
            Cargando mis rescates...
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      {/* Estadísticas personales */}
      {misRescates.length > 0 && (
        <StatsContainer>
          <StatItem onPress={mostrarEstadisticasDetalladas}>
            <StatNumber>{estadisticas.total}</StatNumber>
            <StatLabel>Participaciones</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{estadisticas.ayudados}</StatNumber>
            <StatLabel>Rescatados</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{estadisticas.reportados}</StatNumber>
            <StatLabel>Reportados</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{estadisticas.puntuacionImpacto}</StatNumber>
            <StatLabel>Puntos</StatLabel>
          </StatItem>
        </StatsContainer>
      )}

      <RescatesList>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={8}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#42a8a1']}
            />
          }
        >
          {misRescates.length > 0 ? (
            misRescates.map((rescate, index) => (
              <RescateCard 
                key={rescate.id} 
                onPress={() => abrirModalDetalles(rescate)}
              >
                <CardHeader>
                  <AnimalAvatar small>
                    <AnimalInitial small>
                      {getAnimalInitial(rescate.descripcion)}
                    </AnimalInitial>
                  </AnimalAvatar>
                  
                  <CardContent>
                    <CardTitle>
                      {rescate.tipoParticipacion === 'rescatista' ? '🚀' : '📝'} #{index + 1} - {rescate.tipoParticipacion === 'rescatista' ? 'Rescaté' : 'Reporté'}
                    </CardTitle>
                    
                    <StatusChip estado={rescate.estado} small>
                      <StatusText small>
                        {rescate.estado === 'finalizado' ? '✅ Completado' :
                         rescate.estado === 'en_proceso' ? '⏳ En proceso' :
                         rescate.estado === 'pendiente' ? '🆘 Pendiente' : rescate.estado}
                      </StatusText>
                    </StatusChip>
                  </CardContent>
                </CardHeader>

                <CardDescription>
                  {rescate.descripcion.length > 100 
                    ? rescate.descripcion.substring(0, 100) + '...' 
                    : rescate.descripcion}
                </CardDescription>

                <InfoRow>
                  <InfoIcon>{rescate.tipoParticipacion === 'rescatista' ? '🚀' : '📝'}</InfoIcon>
                  <InfoText>
                    {rescate.tipoParticipacion === 'rescatista' 
                      ? 'Yo fui el rescatista' 
                      : 'Yo reporté este caso'}
                  </InfoText>
                </InfoRow>

                {rescate.fechaFinalizacion && (
                  <InfoRow>
                    <InfoIcon>✅</InfoIcon>
                    <InfoText>Finalizado: {getTimeAgo(rescate.fechaFinalizacion)}</InfoText>
                  </InfoRow>
                )}

                {calcularDuracionRescate(rescate) && (
                  <InfoRow>
                    <InfoIcon>⏱️</InfoIcon>
                    <InfoText>
                      <DurationText>
                        Duración: {calcularDuracionRescate(rescate).texto}
                      </DurationText>
                    </InfoText>
                  </InfoRow>
                )}

                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#f3f4f6'
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {rescate.fotoProgreso && (
                      <View style={{ 
                        backgroundColor: '#10b981', 
                        paddingHorizontal: 8, 
                        paddingVertical: 4, 
                        borderRadius: 12, 
                        marginRight: 8 
                      }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                          📷 Con foto
                        </Text>
                      </View>
                    )}
                    {rescate.comentarioFinal && (
                      <View style={{ 
                        backgroundColor: '#42a8a1', 
                        paddingHorizontal: 8, 
                        paddingVertical: 4, 
                        borderRadius: 12 
                      }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                          💬 Con comentario
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#42a8a1',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    onPress={() => abrirModalDetalles(rescate)}
                  >
                    <Ionicons name="eye-outline" size={14} color="white" />
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                      Ver detalles
                    </Text>
                  </TouchableOpacity>
                </View>

                {rescate.estado === 'finalizado' && (
                  <View style={{
                    backgroundColor: '#f0fdf4',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: 12
                  }}>
                    <Text style={{ 
                      fontSize: 12, 
                      color: '#10b981', 
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      {rescate.tipoParticipacion === 'rescatista' 
                        ? '¡Rescate completado exitosamente! 🎉' 
                        : '¡Gracias por reportar y ayudar! 🎉'}
                    </Text>
                  </View>
                )}
              </RescateCard>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyTitle>
                {userProfile ? 'No tienes rescates aún' : 'Cargando perfil...'}
              </EmptyTitle>
              <EmptySubtitle>
                {userProfile 
                  ? 'Cuando ayudes en rescates o reportes casos aparecerán aquí. ¡Únete a la comunidad AnimTech!'
                  : 'Obteniendo información de tu perfil...'}
              </EmptySubtitle>
            </EmptyState>
          )}
        </ScrollView>
      </RescatesList>

      {/* MODAL DE DETALLES MEJORADO */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={cerrarModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            maxHeight: '90%'
          }}>
            {/* Header del modal */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#f3f4f6'
            }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: '#1f2937',
                flex: 1
              }}>
                {rescateSeleccionado?.tipoParticipacion === 'rescatista' ? '🚀 Mi rescate' : '📝 Mi reporte'}
              </Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {rescateSeleccionado && (
              <ScrollView style={{ maxHeight: 400 }}>
                {/* Información básica */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: 8 
                  }}>
                    🐾 Descripción del animal
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#4b5563', 
                    lineHeight: 20,
                    backgroundColor: '#f8fafc',
                    padding: 12,
                    borderRadius: 8
                  }}>
                    {rescateSeleccionado.descripcion}
                  </Text>
                </View>

                {/* Mi participación */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: 12 
                  }}>
                    📋 Mi participación
                  </Text>
                  
                  <View style={{ backgroundColor: '#f0f9ff', padding: 12, borderRadius: 8 }}>
                    <Text style={{ fontSize: 13, color: '#1e3a8a', fontWeight: '600', marginBottom: 6 }}>
                      {rescateSeleccionado.tipoParticipacion === 'rescatista' 
                        ? '🚀 Yo fui el rescatista de este caso' 
                        : '📝 Yo reporté este caso'}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                      📅 Estado: {rescateSeleccionado.estado === 'finalizado' ? 'Completado ✅' :
                                  rescateSeleccionado.estado === 'en_proceso' ? 'En proceso ⏳' :
                                  rescateSeleccionado.estado === 'pendiente' ? 'Pendiente 🆘' : rescateSeleccionado.estado}
                    </Text>
                    {rescateSeleccionado.fechaFinalizacion && (
                      <Text style={{ fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                        ✅ Finalizado: {formatearFecha(rescateSeleccionado.fechaFinalizacion)}
                      </Text>
                    )}
                    {calcularDuracionRescate(rescateSeleccionado) && (
                      <Text style={{ fontSize: 13, color: '#42a8a1', fontWeight: '600' }}>
                        ⏱️ Duración: {calcularDuracionRescate(rescateSeleccionado).texto}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Otros participantes */}
                {rescateSeleccionado.tipoParticipacion === 'reportador' && rescateSeleccionado.ayudante && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '600', 
                      color: '#1f2937', 
                      marginBottom: 8 
                    }}>
                      👤 Rescatista que ayudó
                    </Text>
                    <View style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8 }}>
                      <Text style={{ fontSize: 14, color: '#4b5563' }}>
                        {rescateSeleccionado.ayudante}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Foto si existe */}
                {rescateSeleccionado.fotoProgreso && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '600', 
                      color: '#1f2937', 
                      marginBottom: 8 
                    }}>
                      📷 Foto del rescate
                    </Text>
                    <Image
                      source={{ uri: rescateSeleccionado.fotoProgreso }}
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 12,
                        backgroundColor: '#f3f4f6'
                      }}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Comentario si existe */}
                {rescateSeleccionado.comentarioFinal && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '600', 
                      color: '#1f2937', 
                      marginBottom: 8 
                    }}>
                      💬 Comentario final
                    </Text>
                    <View style={{
                      backgroundColor: '#f0f9ff',
                      padding: 12,
                      borderRadius: 8,
                      borderLeftWidth: 4,
                      borderLeftColor: '#42a8a1'
                    }}>
                      <Text style={{ 
                        fontSize: 14, 
                        color: '#1f2937', 
                        fontStyle: 'italic',
                        lineHeight: 20
                      }}>
                        "{rescateSeleccionado.comentarioFinal}"
                      </Text>
                    </View>
                  </View>
                )}

                {/* Mensaje de agradecimiento personalizado */}
                <View style={{
                  backgroundColor: rescateSeleccionado.tipoParticipacion === 'rescatista' ? '#f0fdf4' : '#fef3c7',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 20
                }}>
                  <Text style={{ 
                    fontSize: 14, 
                    color: rescateSeleccionado.tipoParticipacion === 'rescatista' ? '#10b981' : '#f59e0b', 
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    {rescateSeleccionado.tipoParticipacion === 'rescatista' 
                      ? '¡Gracias por rescatar y hacer la diferencia! 🚀💙' 
                      : '¡Gracias por reportar y ayudar! 📝💙'}
                  </Text>
                </View>
              </ScrollView>
            )}

            {/* Botones de acción */}
            <View style={{ 
              flexDirection: 'row', 
              gap: 12,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: '#f3f4f6'
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => {
                  compartirMiRescate(rescateSeleccionado);
                  cerrarModal();
                }}
              >
                <Ionicons name="share-outline" size={16} color="white" />
                <Text style={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  marginLeft: 6 
                }}>
                  Compartir
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#f1f5f9',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={cerrarModal}
              >
                <Text style={{ 
                  color: '#64748b', 
                  fontWeight: 'bold' 
                }}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default MisRescatesTab;