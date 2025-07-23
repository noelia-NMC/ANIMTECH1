// src/screens/community/TeleconsultaScreen.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Alert, Linking, ActivityIndicator, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { 
  crearTeleconsulta, 
  getTeleconsultasDelPropietario,
  cancelarTeleconsulta 
} from '../../services/teleconsultaService';
import { getMisPerfiles } from '../../services/perfilMascotaService';
import {
  Container, Header, HeaderContent, HeaderLeft, BackButton, HeaderTitleContainer, 
  HeaderTitle, HeaderSubtitle, ScrollContainer, FormSection, FormCard, FormCardBackground,
  FormHeader, FormIconContainer, FormTitle, FormSubtitle, InputGroup, Label, 
  PickerContainer, Input, SubmitButton, SubmitButtonGradient, SubmitButtonText,
  SectionContainer, SectionHeader, SectionIconContainer, SectionTitleContainer,
  SectionTitle, SectionSubtitle, ConsultaCard, ConsultaCardBackground, CardHeader, 
  CardTitleContainer, CardTitle, CardDate, StatusContainer, StatusPill, StatusText,
  InfoContainer, InfoRow, InfoIconContainer, InfoTextContainer, InfoLabel, InfoText,
  VideoCallButton, VideoCallButtonText, EmptyStateContainer, EmptyStateIconContainer,
  EmptyStateTitle, EmptyStateText, EmptyStateButton, EmptyStateButtonText,
  LoadingContainer, LoadingIconContainer, LoadingText,
  SearchContainer, SearchCard, SearchInput, FiltersContainer, FilterButton,
  FilterButtonText, ActiveFilterDot, FilterRow, ClearFiltersButton, ClearFiltersText,
  ResultsContainer, ResultsText
} from '../../styles/TeleconsultaStyles';

export default function TeleconsultaScreen({ navigation }) {
  // ===== ESTADOS PRINCIPALES =====
  const [motivo, setMotivo] = useState('');
  const [consultas, setConsultas] = useState([]);
  const [misMascotas, setMisMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ===== ESTADOS PARA BÚSQUEDA Y FILTROS =====
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroMascota, setFiltroMascota] = useState('todas');
  const [filtroFecha, setFiltroFecha] = useState('todas');

  // ===== FUNCIÓN PARA CARGAR DATOS =====
  const cargarDatos = useCallback(async () => {
    try {
      console.log('🔄 Cargando datos de teleconsultas...');
      
      const [resConsultas, resMascotas] = await Promise.all([
        getTeleconsultasDelPropietario(),
        getMisPerfiles(),
      ]);

      console.log('📋 Consultas recibidas:', resConsultas.data);
      console.log('🐕 Mascotas recibidas:', resMascotas);

      // Verificar que resConsultas.data existe y es un array
      const consultasData = Array.isArray(resConsultas.data) ? resConsultas.data : [];
      const mascotasData = Array.isArray(resMascotas) ? resMascotas : [];

      setConsultas(consultasData);
      setMisMascotas(mascotasData); 
      
      // Auto-seleccionar la primera mascota si no hay ninguna seleccionada
      if (mascotasData.length > 0 && !mascotaSeleccionada) {
        setMascotaSeleccionada(mascotasData[0].id);
        console.log('🎯 Mascota auto-seleccionada:', mascotasData[0].nombre);
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'No se pudieron cargar tus datos. Verifica tu conexión e intenta de nuevo.'
      );
    }
  }, [mascotaSeleccionada]);

  // ===== EFECTOS =====
  useEffect(() => {
    setIsLoading(true);
    cargarDatos().finally(() => setIsLoading(false));
  }, [cargarDatos]);

  // ===== FUNCIÓN DE REFRESH =====
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cargarDatos().finally(() => setRefreshing(false));
  }, [cargarDatos]);

  // ===== FUNCIÓN PARA ENVIAR NUEVA CONSULTA =====
  const handleEnviar = async () => {
    console.log('📤 Iniciando envío de consulta...');
    
    // Validaciones
    if (!mascotaSeleccionada) {
      Alert.alert('Atención', 'Debes registrar una mascota antes de solicitar una consulta.');
      return;
    }
    
    if (!motivo.trim()) {
      Alert.alert('Atención', 'Por favor, describe el motivo de la consulta.');
      return;
    }

    if (motivo.trim().length < 10) {
      Alert.alert('Atención', 'El motivo debe tener al menos 10 caracteres para que el veterinario pueda entenderlo mejor.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('📝 Enviando consulta con datos:', { mascota_id: mascotaSeleccionada, motivo: motivo.trim() });
      
      const response = await crearTeleconsulta({ 
        mascota_id: mascotaSeleccionada, 
        motivo: motivo.trim() 
      });

      console.log('✅ Consulta creada exitosamente:', response.data);
      
      // Limpiar formulario
      setMotivo('');
      
      Alert.alert(
        '¡Perfecto!', 
        'Tu solicitud ha sido enviada exitosamente. Te notificaremos cuando un veterinario la acepte.',
        [{ text: 'Entendido', onPress: () => onRefresh() }]
      );
      
    } catch (error) {
      console.error('❌ Error al crear consulta:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'No se pudo enviar la solicitud. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== FUNCIÓN PARA CANCELAR CONSULTA =====
  const handleCancelarConsulta = (consultaId) => {
    Alert.alert(
      'Cancelar Consulta',
      '¿Estás seguro de que deseas cancelar esta consulta?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚫 Cancelando consulta:', consultaId);
              await cancelarTeleconsulta(consultaId);
              Alert.alert('Consulta cancelada', 'La consulta ha sido cancelada exitosamente.');
              onRefresh();
            } catch (error) {
              console.error('❌ Error al cancelar consulta:', error);
              Alert.alert('Error', error.response?.data?.message || 'No se pudo cancelar la consulta.');
            }
          }
        }
      ]
    );
  };

  // ===== FUNCIONES AUXILIARES =====
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('❌ Error al formatear fecha:', error);
      return 'Fecha no válida';
    }
  };

  const getStatusDisplayName = (estado) => {
    const statusNames = {
      pendiente: 'Pendiente',
      aceptada: 'Aceptada',
      finalizada: 'Completada',
      rechazada: 'Rechazada',
      cancelada: 'Cancelada'
    };
    return statusNames[estado] || estado;
  };

  // ===== LÓGICA DE FILTRADO MEJORADA =====
  const consultasFiltradas = consultas.filter(consulta => {
    // Verificar que consulta existe y tiene propiedades necesarias
    if (!consulta) return false;

    // Filtro por búsqueda de texto
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      (consulta.motivo && consulta.motivo.toLowerCase().includes(searchTerm)) ||
      (consulta.nombre_mascota && consulta.nombre_mascota.toLowerCase().includes(searchTerm)) ||
      (consulta.veterinario_nombre && consulta.veterinario_nombre.toLowerCase().includes(searchTerm));

    // Filtro por estado
    const matchesEstado = filtroEstado === 'todos' || consulta.estado === filtroEstado;

    // Filtro por mascota
    const matchesMascota = filtroMascota === 'todas' || (consulta.mascota_id && consulta.mascota_id.toString() === filtroMascota);

    // Filtro por fecha
    let matchesFecha = true;
    if (filtroFecha !== 'todas' && consulta.fecha) {
      try {
        const fechaConsulta = new Date(consulta.fecha);
        const hoy = new Date();
        const unaSemanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
        const unMesAtras = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

        switch (filtroFecha) {
          case 'hoy':
            matchesFecha = fechaConsulta.toDateString() === hoy.toDateString();
            break;
          case 'semana':
            matchesFecha = fechaConsulta >= unaSemanaAtras;
            break;
          case 'mes':
            matchesFecha = fechaConsulta >= unMesAtras;
            break;
        }
      } catch (error) {
        console.warn('⚠️ Error al procesar fecha:', error);
        matchesFecha = true; // Si hay error con fecha, incluir el item
      }
    }

    return matchesSearch && matchesEstado && matchesMascota && matchesFecha;
  });

  // ===== FUNCIONES DE FILTROS =====
  const limpiarFiltros = () => {
    console.log('🧹 Limpiando filtros...');
    setSearchQuery('');
    setFiltroEstado('todos');
    setFiltroMascota('todas');
    setFiltroFecha('todas');
  };

  const hayFiltrosActivos = searchQuery !== '' || filtroEstado !== 'todos' || 
    filtroMascota !== 'todas' || filtroFecha !== 'todas';

  // ===== FUNCIÓN PARA ABRIR VIDEOLLAMADA =====
  const handleOpenVideoCall = (meetLink) => {
    if (!meetLink) {
      Alert.alert('Error', 'No hay enlace de videollamada disponible.');
      return;
    }

    console.log('📹 Abriendo videollamada:', meetLink);

    Alert.alert(
      'Abrir Videollamada',
      '¿Deseas abrir el enlace de la videollamada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir',
          onPress: () => {
            Linking.openURL(meetLink).catch((error) => {
              console.error('❌ Error al abrir enlace:', error);
              Alert.alert('Error', 'No se pudo abrir el enlace. Verifica tu conexión.');
            });
          }
        }
      ]
    );
  };

  // ===== COMPONENTE PARA RENDERIZAR CADA CONSULTA =====
  const renderItem = ({ item }) => {
    // Verificar que el item existe
    if (!item) return null;

    return (
      <ConsultaCard 
        estado={item.estado} 
        activeOpacity={0.8}
        onPress={() => console.log('🎯 Consulta seleccionada:', item.id)}
      >
        <ConsultaCardBackground estado={item.estado} />
        
        <CardHeader>
          <CardTitleContainer>
            <CardTitle>Consulta para {item.nombre_mascota || 'Mascota'}</CardTitle>
            <CardDate>{formatDate(item.fecha)}</CardDate>
          </CardTitleContainer>
          
          <StatusContainer>
            <StatusPill estado={item.estado}>
              <StatusText>{getStatusDisplayName(item.estado)}</StatusText>
            </StatusPill>
          </StatusContainer>
        </CardHeader>

        <InfoContainer>
          <InfoRow>
            <InfoIconContainer>
              <Ionicons name="document-text" size={16} color="#ffffff" />
            </InfoIconContainer>
            <InfoTextContainer>
              <InfoLabel>Motivo de consulta</InfoLabel>
              <InfoText>{item.motivo || 'Sin descripción'}</InfoText>
            </InfoTextContainer>
          </InfoRow>

          {item.veterinario_nombre && (
            <InfoRow>
              <InfoIconContainer>
                <Ionicons name="medical" size={16} color="#ffffff" />
              </InfoIconContainer>
              <InfoTextContainer>
                <InfoLabel>Veterinario asignado</InfoLabel>
                <InfoText>Dr. {item.veterinario_nombre}</InfoText>
              </InfoTextContainer>
            </InfoRow>
          )}

          {item.respuesta_veterinario && (
            <InfoRow>
              <InfoIconContainer>
                <Ionicons name="chatbubble" size={16} color="#ffffff" />
              </InfoIconContainer>
              <InfoTextContainer>
                <InfoLabel>Respuesta del veterinario</InfoLabel>
                <InfoText>{item.respuesta_veterinario}</InfoText>
              </InfoTextContainer>
            </InfoRow>
          )}
        </InfoContainer>

        {/* Botón de videollamada para consultas aceptadas */}
        {item.estado === 'aceptada' && item.meet_link && (
          <VideoCallButton onPress={() => handleOpenVideoCall(item.meet_link)}>
            <Ionicons name="videocam" size={20} color="#ffffff" />
            <VideoCallButtonText>Unirse a Videollamada</VideoCallButtonText>
          </VideoCallButton>
        )}

        {/* Botón de cancelar para consultas pendientes */}
        {item.estado === 'pendiente' && (
          <SubmitButton onPress={() => handleCancelarConsulta(item.id)}>
            <SubmitButtonGradient colors={['#ef4444', '#dc2626']}>
              <Ionicons name="close-circle" size={20} color="#ffffff" />
              <SubmitButtonText>Cancelar Consulta</SubmitButtonText>
            </SubmitButtonGradient>
          </SubmitButton>
        )}
      </ConsultaCard>
    );
  };

  // ===== COMPONENTE ESTADO VACÍO PARA CONSULTAS =====
  const EmptyConsultas = () => (
    <EmptyStateContainer>
      <EmptyStateIconContainer>
        <Ionicons name="medical-outline" size={48} color="#94a3b8" />
      </EmptyStateIconContainer>
      <EmptyStateTitle>
        {hayFiltrosActivos ? 'No se encontraron consultas' : 'No tienes consultas'}
      </EmptyStateTitle>
      <EmptyStateText>
        {hayFiltrosActivos 
          ? 'No hay consultas que coincidan con los filtros aplicados. Intenta cambiar los criterios de búsqueda.'
          : 'Cuando solicites una teleconsulta, aparecerá aquí. Podrás ver el estado, detalles y unirte a videollamadas.'
        }
      </EmptyStateText>
      {hayFiltrosActivos && (
        <EmptyStateButton onPress={limpiarFiltros}>
          <EmptyStateButtonText>Limpiar Filtros</EmptyStateButtonText>
        </EmptyStateButton>
      )}
    </EmptyStateContainer>
  );

  // ===== COMPONENTE ESTADO VACÍO PARA MASCOTAS =====
  const EmptyMascotas = () => (
    <EmptyStateContainer>
      <EmptyStateIconContainer>
        <Ionicons name="paw-outline" size={48} color="#94a3b8" />
      </EmptyStateIconContainer>
      <EmptyStateTitle>Registra tu mascota</EmptyStateTitle>
      <EmptyStateText>
        Para solicitar una teleconsulta, primero necesitas registrar al menos una mascota en tu perfil.
      </EmptyStateText>
      <EmptyStateButton onPress={() => navigation.navigate('AgregarMascota')}>
        <EmptyStateButtonText>Registrar Mascota</EmptyStateButtonText>
      </EmptyStateButton>
    </EmptyStateContainer>
  );

  // ===== PANTALLA DE LOADING =====
  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingIconContainer>
            <ActivityIndicator size="large" color="#ffffff" />
          </LoadingIconContainer>
          <LoadingText>Cargando teleconsultas...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <Container>
      {/* HEADER */}
      <Header>
        <HeaderContent>
          <HeaderLeft>
            <BackButton onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </BackButton>
            
            <HeaderTitleContainer>
              <HeaderTitle>Teleconsulta</HeaderTitle>
              <HeaderSubtitle>Consultas veterinarias remotas</HeaderSubtitle>
            </HeaderTitleContainer>
          </HeaderLeft>
        </HeaderContent>
      </Header>

      <ScrollContainer 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#42a8a1']}
            tintColor="#42a8a1"
          />
        }
      >
        {/* FORMULARIO DE NUEVA SOLICITUD */}
        <FormSection>
          <FormCard>
            <FormCardBackground />
            
            <FormHeader>
              <FormIconContainer>
                <Ionicons name="videocam" size={25} color="#ffffff" />
              </FormIconContainer>
              <FormTitle>Nueva Consulta</FormTitle>
              <FormSubtitle>
                Solicita una consulta veterinaria desde la comodidad de tu hogar
              </FormSubtitle>
            </FormHeader>

            {misMascotas.length > 0 ? (
              <>
                <InputGroup>
                  <Label>Selecciona tu mascota</Label>
                  <PickerContainer>
                    <Picker
                      selectedValue={mascotaSeleccionada}
                      onValueChange={(itemValue) => {
                        console.log('🐕 Mascota seleccionada:', itemValue);
                        setMascotaSeleccionada(itemValue);
                      }}
                    >
                      {misMascotas.map(mascota => (
                        <Picker.Item 
                          key={mascota.id} 
                          label={`${mascota.nombre} (${mascota.especie || 'Mascota'})`} 
                          value={mascota.id} 
                        />
                      ))}
                    </Picker>
                  </PickerContainer>
                </InputGroup>

                <InputGroup>
                  <Label>Describe el motivo de la consulta</Label>
                  <Input 
                    placeholder="Ejemplo: Mi perro lleva dos días sin comer y se ve decaído. Ha estado muy quieto y no quiere jugar como normalmente lo hace..." 
                    value={motivo} 
                    onChangeText={(text) => {
                      setMotivo(text);
                      console.log('📝 Motivo actualizado:', text.length, 'caracteres');
                    }} 
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="#94a3b8"
                    maxLength={500}
                  />
                  <InfoText style={{ fontSize: 10, color: '#94a3b8', marginTop: 8 }}>
                    {motivo.length}/500 caracteres (mínimo 10)
                  </InfoText>
                </InputGroup>

                <SubmitButton 
                  onPress={handleEnviar} 
                  disabled={isSubmitting || !motivo.trim() || motivo.trim().length < 10}
                  style={{ opacity: (isSubmitting || !motivo.trim() || motivo.trim().length < 10) ? 0.6 : 1 }}
                >
                  <SubmitButtonGradient colors={['#42a8a1', '#5dc1b9']}>
                    {isSubmitting ? (
                      <>
                        <ActivityIndicator color="#ffffff" size="small" />
                        <SubmitButtonText>Enviando solicitud...</SubmitButtonText>
                      </>
                    ) : (
                      <>
                        <Ionicons name="send" size={20} color="#ffffff" />
                        <SubmitButtonText>Solicitar Consulta</SubmitButtonText>
                      </>
                    )}
                  </SubmitButtonGradient>
                </SubmitButton>
              </>
            ) : (
              <EmptyMascotas />
            )}
          </FormCard>
        </FormSection>

        {/* BUSCADOR Y FILTROS */}
        {consultas.length > 0 && (
          <SearchContainer>
            <SearchCard>
              <SearchInput
                placeholder="Buscar por mascota, motivo o veterinario..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94a3b8"
              />
              
              <FiltersContainer>
                <FilterRow>
                  <FilterButton 
                    isActive={filtroEstado !== 'todos'}
                    onPress={() => {
                      const estados = ['todos', 'pendiente', 'aceptada', 'finalizada', 'rechazada', 'cancelada'];
                      const currentIndex = estados.indexOf(filtroEstado);
                      const nextIndex = (currentIndex + 1) % estados.length;
                      setFiltroEstado(estados[nextIndex]);
                    }}
                  >
                    <Ionicons name="pulse" size={16} color={filtroEstado !== 'todos' ? "#ffffff" : "#42a8a1"} />
                    <FilterButtonText isActive={filtroEstado !== 'todos'}>
                      {filtroEstado === 'todos' ? 'Estado' : getStatusDisplayName(filtroEstado)}
                    </FilterButtonText>
                    {filtroEstado !== 'todos' && <ActiveFilterDot />}
                  </FilterButton>

                  <FilterButton 
                    isActive={filtroMascota !== 'todas'}
                    onPress={() => {
                      const opciones = ['todas', ...misMascotas.map(m => m.id.toString())];
                      const currentIndex = opciones.indexOf(filtroMascota);
                      const nextIndex = (currentIndex + 1) % opciones.length;
                      setFiltroMascota(opciones[nextIndex]);
                    }}
                  >
                    <Ionicons name="paw" size={16} color={filtroMascota !== 'todas' ? "#ffffff" : "#42a8a1"} />
                    <FilterButtonText isActive={filtroMascota !== 'todas'}>
                      {filtroMascota === 'todas' 
                        ? 'Mascota' 
                        : misMascotas.find(m => m.id.toString() === filtroMascota)?.nombre || 'Mascota'
                      }
                    </FilterButtonText>
                    {filtroMascota !== 'todas' && <ActiveFilterDot />}
                  </FilterButton>

                  <FilterButton 
                    isActive={filtroFecha !== 'todas'}
                    onPress={() => {
                      const fechas = ['todas', 'hoy', 'semana', 'mes'];
                      const currentIndex = fechas.indexOf(filtroFecha);
                      const nextIndex = (currentIndex + 1) % fechas.length;
                      setFiltroFecha(fechas[nextIndex]);
                    }}
                  >
                    <Ionicons name="calendar" size={16} color={filtroFecha !== 'todas' ? "#ffffff" : "#42a8a1"} />
                    <FilterButtonText isActive={filtroFecha !== 'todas'}>
                      {filtroFecha === 'todas' ? 'Fecha' : 
                       filtroFecha === 'hoy' ? 'Hoy' :
                       filtroFecha === 'semana' ? 'Esta semana' : 'Este mes'}
                    </FilterButtonText>
                    {filtroFecha !== 'todas' && <ActiveFilterDot />}
                  </FilterButton>
                </FilterRow>

                {hayFiltrosActivos && (
                  <ClearFiltersButton onPress={limpiarFiltros}>
                    <Ionicons name="close-circle" size={16} color="#ef4444" />
                    <ClearFiltersText>Limpiar filtros</ClearFiltersText>
                  </ClearFiltersButton>
                )}
              </FiltersContainer>
            </SearchCard>
          </SearchContainer>
        )}

        {/* SECCIÓN DE CONSULTAS */}
        <SectionContainer>
          <SectionHeader>
            <SectionIconContainer>
              <Ionicons name="list" size={20} color="#ffffff" />
            </SectionIconContainer>
            <SectionTitleContainer>
              <SectionTitle>
                Mis Consultas ({consultasFiltradas.length})
              </SectionTitle>
              <SectionSubtitle>
                {hayFiltrosActivos 
                  ? `Mostrando ${consultasFiltradas.length} de ${consultas.length} consultas`
                  : 'Historial de teleconsultas solicitadas'
                }
              </SectionSubtitle>
            </SectionTitleContainer>
          </SectionHeader>

          {consultasFiltradas.length === 0 ? (
            <EmptyConsultas />
          ) : (
            <>
              {hayFiltrosActivos && (
                <ResultsContainer>
                  <ResultsText>
                    Se encontraron {consultasFiltradas.length} consulta{consultasFiltradas.length !== 1 ? 's' : ''}
                  </ResultsText>
                </ResultsContainer>
              )}
              
              <FlatList
                data={consultasFiltradas}
                keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                renderItem={renderItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </SectionContainer>
      </ScrollContainer>
    </Container>
  );
}