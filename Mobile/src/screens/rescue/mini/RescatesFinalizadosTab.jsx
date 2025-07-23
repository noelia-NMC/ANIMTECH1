import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Alert, RefreshControl, Share, Platform, Modal, View, Text, TouchableOpacity, Image } from 'react-native';
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

const RescatesFinalizadosTab = ({ navigation, userProfile }) => {
  const [rescatesFinalizados, setRescatesFinalizados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [rescateSeleccionado, setRescateSeleccionado] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalFinalizados: 0,
    promedioTiempo: 0,
    rescatesConFoto: 0,
    rescatesConComentario: 0,
    tiempoTotalRescates: 0,
    rescateMasRapido: null,
    rescateMasLento: null,
    rescatistaEstrella: null
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

  // Listener optimizado de Firebase con cálculo de estadísticas
  useEffect(() => {
    console.log('🔄 [RescatesFinalizadosTab] Iniciando escucha de rescates finalizados...');
    const rescatesRef = ref(db, 'rescates');
    
    const unsubscribe = onValue(rescatesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📊 [RescatesFinalizadosTab] Datos recibidos de Firebase:', data);
      
      if (!data) {
        setRescatesFinalizados([]);
        setEstadisticas({
          totalFinalizados: 0,
          promedioTiempo: 0,
          rescatesConFoto: 0,
          rescatesConComentario: 0,
          tiempoTotalRescates: 0,
          rescateMasRapido: null,
          rescateMasLento: null,
          rescatistaEstrella: null
        });
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const lista = [];
      let totalTiempo = 0;
      let rescatesConTiempo = 0;
      let rescatesConFoto = 0;
      let rescatesConComentario = 0;
      let rescateMasRapido = null;
      let rescateMasLento = null;
      const rescatistaStats = {};

      // Filtrar solo rescates finalizados y calcular estadísticas
      Object.entries(data).forEach(([id, rescate]) => {
        if (rescate.estado === 'finalizado' || rescate.estado === 'resuelto') {
          const rescateConId = { id, ...rescate, fechaOriginal: rescate.fecha };
          lista.push(rescateConId);

          // Calcular duración
          const duracion = calcularDuracionRescate(rescate);
          if (duracion) {
            totalTiempo += duracion.totalMinutos;
            rescatesConTiempo++;

            // Encontrar rescate más rápido y más lento
            if (!rescateMasRapido || duracion.totalMinutos < rescateMasRapido.duracion) {
              rescateMasRapido = {
                rescate: rescateConId,
                duracion: duracion.totalMinutos,
                texto: duracion.texto
              };
            }
            
            if (!rescateMasLento || duracion.totalMinutos > rescateMasLento.duracion) {
              rescateMasLento = {
                rescate: rescateConId,
                duracion: duracion.totalMinutos,
                texto: duracion.texto
              };
            }
          }

          // Contar fotos y comentarios
          if (rescate.fotoProgreso) {
            rescatesConFoto++;
          }

          if (rescate.comentarioFinal) {
            rescatesConComentario++;
          }

          // Estadísticas de rescatistas
          if (rescate.ayudante) {
            if (!rescatistaStats[rescate.ayudante]) {
              rescatistaStats[rescate.ayudante] = 0;
            }
            rescatistaStats[rescate.ayudante]++;
          }
        }
      });

      // Encontrar rescatista estrella
      let rescatistaEstrella = null;
      let maxRescates = 0;
      Object.entries(rescatistaStats).forEach(([nombre, cantidad]) => {
        if (cantidad > maxRescates) {
          maxRescates = cantidad;
          rescatistaEstrella = { nombre, cantidad };
        }
      });

      // Ordenar por fecha de finalización más reciente
      lista.sort((a, b) => {
        const fechaA = a.fechaFinalizacion ? new Date(a.fechaFinalizacion) : new Date(0);
        const fechaB = b.fechaFinalizacion ? new Date(b.fechaFinalizacion) : new Date(0);
        return fechaB - fechaA;
      });

      console.log(`✅ ${lista.length} rescates finalizados encontrados`);
      
      setRescatesFinalizados(lista);
      setEstadisticas({
        totalFinalizados: lista.length,
        promedioTiempo: rescatesConTiempo > 0 ? Math.floor(totalTiempo / rescatesConTiempo) : 0,
        rescatesConFoto,
        rescatesConComentario,
        tiempoTotalRescates: totalTiempo,
        rescateMasRapido,
        rescateMasLento,
        rescatistaEstrella
      });
      setLoading(false);
      setRefreshing(false);
    }, (error) => {
      console.error('❌ Error escuchando rescates:', error);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [calcularDuracionRescate]);

  // Refrescar datos
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log('🔄 [RescatesFinalizadosTab] Refrescando rescates finalizados...');
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

  // Compartir historia de rescate
  const compartirRescate = async (rescate) => {
    try {
      const duracion = calcularDuracionRescate(rescate);
      const mensaje = `🎉 ¡Rescate exitoso en AnimTech!

${rescate.descripcion}

👤 Rescatista: ${rescate.ayudante || 'Voluntario anónimo'}
${duracion ? `⏱️ Tiempo: ${duracion.texto}` : ''}
${rescate.comentarioFinal ? `💬 "${rescate.comentarioFinal}"` : ''}

¡Únete a nuestra comunidad de rescate animal! 🐾`;

      const result = await Share.share({
        message: mensaje,
        title: 'Rescate exitoso - AnimTech'
      });

      if (result.action === Share.sharedAction) {
        console.log('✅ Historia compartida exitosamente');
      }
    } catch (error) {
      console.error('❌ Error compartiendo:', error);
      Alert.alert('Error', 'No se pudo compartir la historia del rescate.');
    }
  };

  // Mostrar estadísticas detalladas
  const mostrarEstadisticasDetalladas = () => {
    const { 
      totalFinalizados, 
      promedioTiempo, 
      tiempoTotalRescates, 
      rescateMasRapido, 
      rescateMasLento, 
      rescatistaEstrella 
    } = estadisticas;

    const mensaje = `
📊 Estadísticas detalladas de rescates:

🎯 General:
• Total de rescates completados: ${totalFinalizados}
• Tiempo promedio por rescate: ${promedioTiempo} min
• Tiempo total invertido: ${Math.floor(tiempoTotalRescates / 60)} horas

⚡ Records:
• Rescate más rápido: ${rescateMasRapido ? rescateMasRapido.texto : 'N/A'}
• Rescate más dedicado: ${rescateMasLento ? rescateMasLento.texto : 'N/A'}

🌟 Rescatista estrella:
${rescatistaEstrella ? `${rescatistaEstrella.nombre} (${rescatistaEstrella.cantidad} rescates)` : 'N/A'}

📸 Documentación:
• Con fotos: ${estadisticas.rescatesConFoto}/${totalFinalizados}
• Con comentarios: ${estadisticas.rescatesConComentario}/${totalFinalizados}

¡Gracias a todos los voluntarios! 💙
    `;

    Alert.alert('📊 Estadísticas completas', mensaje.trim());
  };

  // Estado de carga simple
  if (loading) {
    return (
      <Container>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#4b5563', fontWeight: '500' }}>
            Cargando rescates finalizados...
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      {/* Estadísticas mejoradas */}
      {rescatesFinalizados.length > 0 && (
        <StatsContainer>
          <StatItem onPress={mostrarEstadisticasDetalladas}>
            <StatNumber>{estadisticas.totalFinalizados}</StatNumber>
            <StatLabel>Rescates exitosos</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{estadisticas.promedioTiempo}min</StatNumber>
            <StatLabel>Tiempo promedio</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{estadisticas.rescatesConFoto}</StatNumber>
            <StatLabel>Con fotos</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{Math.floor(estadisticas.tiempoTotalRescates / 60)}h</StatNumber>
            <StatLabel>Tiempo total</StatLabel>
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
          {rescatesFinalizados.length > 0 ? (
            rescatesFinalizados.map((rescate, index) => (
              <RescateCard 
                key={rescate.id} 
                onPress={() => abrirModalDetalles(rescate)}
                finalizado
              >
                <CardHeader>
                  <AnimalAvatar small>
                    <AnimalInitial small>
                      {getAnimalInitial(rescate.descripcion)}
                    </AnimalInitial>
                  </AnimalAvatar>
                  
                  <CardContent>
                    <CardTitle>
                      ✅ Rescate #{index + 1}
                    </CardTitle>
                    
                    <StatusChip estado="finalizado" small>
                      <StatusText small>Finalizado</StatusText>
                    </StatusChip>
                  </CardContent>
                </CardHeader>

                <CardDescription>
                  {rescate.descripcion.length > 100 
                    ? rescate.descripcion.substring(0, 100) + '...' 
                    : rescate.descripcion}
                </CardDescription>

                <InfoRow>
                  <InfoIcon>✅</InfoIcon>
                  <InfoText>Finalizado: {getTimeAgo(rescate.fechaFinalizacion)}</InfoText>
                </InfoRow>

                <InfoRow>
                  <InfoIcon>👤</InfoIcon>
                  <InfoText>Rescatista: {rescate.ayudante || 'Usuario voluntario'}</InfoText>
                </InfoRow>

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
                      Detalles
                    </Text>
                  </TouchableOpacity>
                </View>
              </RescateCard>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyTitle>
                Aún no hay rescates finalizados
              </EmptyTitle>
              <EmptySubtitle>
                Cuando los voluntarios completen los rescates aparecerán aquí con toda la documentación del proceso.
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
                ✅ Detalles del rescate
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

                {/* Información del rescate */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    marginBottom: 12 
                  }}>
                    📋 Información del rescate
                  </Text>
                  
                  <View style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8 }}>
                    <Text style={{ fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                      👤 Rescatista: {rescateSeleccionado.ayudante || 'Usuario voluntario'}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                      📝 Reportado por: {rescateSeleccionado.creador || 'Usuario anónimo'}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                      📅 Finalizado: {formatearFecha(rescateSeleccionado.fechaFinalizacion)}
                    </Text>
                    {calcularDuracionRescate(rescateSeleccionado) && (
                      <Text style={{ fontSize: 13, color: '#42a8a1', fontWeight: '600' }}>
                        ⏱️ Duración: {calcularDuracionRescate(rescateSeleccionado).texto}
                      </Text>
                    )}
                  </View>
                </View>

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
                      💬 Comentario del rescatista
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

                {/* Mensaje de agradecimiento */}
                <View style={{
                  backgroundColor: '#f0fdf4',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 20
                }}>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#10b981', 
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    ¡Gracias por hacer la diferencia! 💙
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
                  compartirRescate(rescateSeleccionado);
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

export default RescatesFinalizadosTab;