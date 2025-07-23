// src/screens/EventosScreen.jsx

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Alert, Modal, ActivityIndicator, Text, Platform } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

import { getEventos, createEvento, deleteEvento } from '../../services/eventosService';
import { getMisPerfiles } from '../../services/perfilMascotaService';
import NotificationService from '../../services/notificationService';

import {
  Container, ModalOverlay, ModalContent, ModalTitle, Label, Input, NotasInput,
  PickerContainer, HoraSelector, HoraText, BtnContainer, CancelarBtn, CancelarText,
  GuardarBtn, GuardarText, EventosContainer, EventoItem, EventoHeader, EventoTitle,
  EliminarBtn, EliminarText, EventoNotas, ModalScrollContainer, calendarTheme,
  EmptyContainer, EmptyText, EmptyIcon, TipoBadge, TipoText, AppointmentsHeader,
  AppointmentsTitle, AddButton, AddButtonText, EventoMascota,
  colors, ReminderContainer, ReminderLabel,
  ReminderOptionsContainer, ReminderOption, ReminderOptionText
} from '../../styles/EventosStyles';

// Configuración de localización
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Sep.','Oct.','Nov.','Dic.'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom.','Lun.','Mar.','Mié.','Jue.','Vie.','Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

// Configuración mejorada de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const eventColors = {
    'vacuna': colors.error,
    'consulta': '#3b82f6',
    'medicamento': colors.success,
    'baño': '#8b5cf6',
    'desparasitacion': colors.warning,
    'otro': colors.textTertiary
};

const getColorByType = (type) => eventColors[type] || colors.textTertiary;

// Opciones de recordatorio
const reminderOptions = [
  { value: 0, label: 'En el momento del evento' },
  { value: 15, label: '15 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 120, label: '2 horas antes' },
  { value: 1440, label: '1 día antes' },
  { value: 2880, label: '2 días antes' },
  { value: 10080, label: '1 semana antes' }
];

const EventosScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventos, setEventos] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del formulario del modal
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('vacuna');
  const [horaEvento, setHoraEvento] = useState(new Date());
  const [mostrarHora, setMostrarHora] = useState(false);
  const [mascotaId, setMascotaId] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [reminderMinutes, setReminderMinutes] = useState(1440); // 1 día antes por defecto

  const tiposEventos = ['vacuna', 'consulta', 'medicamento', 'baño', 'desparasitacion', 'otro'];

  // Configurar permisos de notificaciones y listeners al cargar
  useEffect(() => {
    const inicializarNotificaciones = async () => {
      await NotificationService.configurarNotificaciones();
    };
    inicializarNotificaciones();

    // Configurar listeners para manejar notificaciones
    const limpiarListeners = NotificationService.configurarListenersNotificaciones(navigation);
    
    return limpiarListeners; // Limpiar al desmontar
  }, [navigation]);

  const configurarNotificaciones = async () => {
    return await NotificationService.configurarNotificaciones();
  };

  // useEffect para la carga inicial
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setIsLoading(true);
      try {
        const misMascotas = await getMisPerfiles();
        
        if (misMascotas && misMascotas.length > 0) {
          setMascotas(misMascotas);
          setMascotaId(misMascotas[0].id);
        } else {
          Alert.alert("No tienes mascotas", "Para usar el calendario, necesitas registrar una mascota.", [{ text: 'OK', onPress: () => navigation.goBack() }]);
          setMascotas([]);
        }
        const eventosData = await getEventos();
        setEventos(eventosData);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        Alert.alert('Error', 'No se pudo cargar la información. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatosIniciales();
  }, [navigation]);

  // useEffect para recargar eventos cuando la pantalla vuelve a tener foco
  useEffect(() => {
    const recargarAlEnfocar = async () => {
      try {
        const eventosData = await getEventos();
        setEventos(eventosData);
      } catch(e) {
        console.log("No se pudieron recargar los eventos al enfocar la pantalla.");
      }
    }
    const unsubscribe = navigation.addListener('focus', recargarAlEnfocar);
    return unsubscribe;
  }, [navigation]);

  // useEffect para marcar las fechas del calendario
  useEffect(() => {
    const newMarkedDates = {};
    eventos.forEach(evento => {
      const date = evento.date;
      if (!newMarkedDates[date]) { newMarkedDates[date] = { dots: [] }; }
      if (!newMarkedDates[date].dots.some(dot => dot.key === evento.type)) {
        newMarkedDates[date].dots.push({ key: evento.type, color: getColorByType(evento.type), selectedDotColor: 'white' });
      }
    });
    if (selectedDate) {
      newMarkedDates[selectedDate] = { ...newMarkedDates[selectedDate], selected: true, selectedColor: colors.primary, disableTouchEvent: true };
    }
    setMarkedDates(newMarkedDates);
  }, [eventos, selectedDate]);

  const recargarEventos = async () => {
    try {
      setIsLoading(true);
      const eventosData = await getEventos();
      setEventos(eventosData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar los eventos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const limpiarFormulario = () => {
    setTitle('');
    setNotes('');
    setType('vacuna');
    setHoraEvento(new Date());
    setReminderMinutes(1440); // Reset a 1 día antes
  };

  const abrirFormulario = () => {
    if (mascotas.length === 0) {
      Alert.alert("Sin Mascotas", "Debes registrar una mascota primero para poder crear eventos.");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Selecciona una fecha", "Por favor, elige un día en el calendario para agregar un evento.");
      return;
    }
    limpiarFormulario();
    
    // Configurar hora del evento para el día seleccionado
    const nuevaHora = new Date();
    const [yyyy, mm, dd] = selectedDate.split('-');
    nuevaHora.setFullYear(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    setHoraEvento(nuevaHora);
    
    setModalVisible(true);
  };

  const validarFormulario = () => {
    if (!title.trim()) { 
      Alert.alert('Error', 'El título es obligatorio'); 
      return false; 
    }
    if (!mascotaId) { 
      Alert.alert('Error', 'Debe seleccionar una mascota'); 
      return false; 
    }
    
    // Validar que la fecha del evento no sea en el pasado
    const fechaEvento = new Date(selectedDate + 'T' + horaEvento.toTimeString().slice(0, 8));
    const ahora = new Date();
    
    if (fechaEvento < ahora) {
      Alert.alert('Error', 'No puedes crear eventos en fechas pasadas');
      return false;
    }
    
    return true;
  };

  const programarNotificacion = async (eventoCreado) => {
    try {
      // Calcular la fecha y hora exacta del evento
      const fechaEvento = new Date(selectedDate + 'T' + horaEvento.toTimeString().slice(0, 8));
      
      const notificationId = await NotificationService.programarNotificacionEvento({
        eventoId: eventoCreado.id,
        titulo: title.trim(),
        tipoEvento: type,
        mascotaNombre: mascotas.find(m => m.id === mascotaId)?.nombre || 'Tu mascota',
        fechaEvento: fechaEvento,
        minutosAntes: reminderMinutes
      });

      return notificationId;
    } catch (error) {
      console.error('Error programando notificación:', error);
      return null;
    }
  };

  const agendarEvento = async () => {
    if (!validarFormulario()) return;

    try {
      const nuevoEvento = {
        title: title.trim(),
        date: selectedDate,
        notes: notes.trim() || null,
        type: type,
        mascotaId: mascotaId,
      };

      const eventoCreado = await createEvento(nuevoEvento);
      
      // Programar notificación
      const notificationId = await programarNotificacion(eventoCreado);
      
      const mensajeExito = notificationId 
        ? 'Evento guardado y recordatorio programado exitosamente 🎉'
        : 'Evento guardado (recordatorio no disponible)';
        
      Alert.alert('¡Éxito!', mensajeExito);
      setModalVisible(false);
      await recargarEventos();
    } catch (error) {
      Alert.alert('Error', `No se pudo guardar el evento: ${error.message || 'Error desconocido'}`);
    }
  };

  const eliminarEvento = async (eventoId) => {
    Alert.alert('Confirmar eliminación', '¿Estás seguro de eliminar este evento y su recordatorio?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await deleteEvento(eventoId);
            
            // Cancelar notificación asociada si existe
            await NotificationService.cancelarNotificacion(eventoId.toString());
            
            Alert.alert('✅ Éxito', 'Evento y recordatorio eliminados.');
            await recargarEventos();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el evento.');
          }
        }
      }
    ]);
  };

  const formatearTiempoRecordatorio = (minutes) => {
    if (minutes === 0) return 'En el momento';
    if (minutes < 60) return `${minutes} min antes`;
    if (minutes < 1440) return `${Math.floor(minutes/60)}h antes`;
    return `${Math.floor(minutes/1440)}d antes`;
  };

  const renderEventoItem = ({ item }) => (
    <EventoItem borderColor={getColorByType(item.type)}>
      <EventoHeader>
        <EventoTitle>{item.title}</EventoTitle>
        <EliminarBtn onPress={() => eliminarEvento(item.id)}>
          <EliminarText>🗑️</EliminarText>
        </EliminarBtn>
      </EventoHeader>
      <EventoMascota>🐕 {item.mascota_nombre || 'No especificada'}</EventoMascota>
      <TipoBadge bgColor={getColorByType(item.type)}>
        <TipoText>{item.type}</TipoText>
      </TipoBadge>
      {item.notes && <EventoNotas>📝 {item.notes}</EventoNotas>}
    </EventoItem>
  );

  const renderEmptyList = () => (
    <EmptyContainer>
      <EmptyIcon>🗓️</EmptyIcon>
      <EmptyText>No hay eventos para este día.</EmptyText>
      <EmptyText>¡Toca en "+ AGREGAR" para crear uno!</EmptyText>
    </EmptyContainer>
  );

  const renderCalendarHeader = () => (
    <Fragment>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={calendarTheme}
        style={{ margin: 10, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
        monthFormat={'MMMM yyyy'}
        firstDay={1}
        minDate={new Date().toISOString().split('T')[0]} // No permitir seleccionar fechas pasadas
      />
      <AppointmentsHeader>
        <AppointmentsTitle>📅 Eventos del {selectedDate}</AppointmentsTitle>
        <AddButton onPress={abrirFormulario}>
          <AddButtonText>+ AGREGAR</AddButtonText>
        </AddButton>
      </AppointmentsHeader>
    </Fragment>
  );

  if (isLoading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <EmptyText>Cargando tu agenda...</EmptyText>
      </Container>
    );
  }

  return (
    <Container>
      <EventosContainer
        data={eventos.filter(e => e.date === selectedDate)}
        renderItem={renderEventoItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderCalendarHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <ModalOverlay>
          <ModalContent>
            <ModalScrollContainer showsVerticalScrollIndicator={false}>
              <ModalTitle>✨ Nuevo evento - {selectedDate}</ModalTitle>
              
              <Label>Título del evento *</Label>
              <Input placeholder="Ej: Vacuna antirrábica" value={title} onChangeText={setTitle} />
              
              <Label>Mascota *</Label>
              <PickerContainer>
                <Picker selectedValue={mascotaId} onValueChange={(itemValue) => setMascotaId(itemValue)} enabled={mascotas.length > 0}>
                  {mascotas.map(m => <Picker.Item key={m.id} label={`🐕 ${m.nombre}`} value={m.id} />)}
                </Picker>
              </PickerContainer>

              <Label>Tipo de evento *</Label>
              <PickerContainer>
                <Picker selectedValue={type} onValueChange={setType}>
                  {tiposEventos.map(t => <Picker.Item key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} value={t} />)}
                </Picker>
              </PickerContainer>

              <Label>Hora del evento</Label>
              <HoraSelector onPress={() => setMostrarHora(true)}>
                <Text>⏰</Text>
                <HoraText>{horaEvento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</HoraText>
              </HoraSelector>
              {mostrarHora && (
                <DateTimePicker 
                  value={horaEvento} 
                  mode="time" 
                  is24Hour={true} 
                  display="default"
                  onChange={(e, date) => { 
                    setMostrarHora(false); 
                    if (date) setHoraEvento(date); 
                  }}
                />
              )}

              <ReminderContainer>
                <ReminderLabel>🔔 Recordarme</ReminderLabel>
                <ReminderOptionsContainer>
                  {reminderOptions.map((option) => (
                    <ReminderOption
                      key={option.value}
                      selected={reminderMinutes === option.value}
                      onPress={() => setReminderMinutes(option.value)}
                    >
                      <ReminderOptionText selected={reminderMinutes === option.value}>
                        {option.label}
                      </ReminderOptionText>
                    </ReminderOption>
                  ))}
                </ReminderOptionsContainer>
              </ReminderContainer>

              <Label>Notas adicionales</Label>
              <NotasInput placeholder="Información adicional, dosis, veterinario..." value={notes} onChangeText={setNotes} multiline />

              <BtnContainer>
                <CancelarBtn onPress={() => setModalVisible(false)}>
                  <CancelarText>Cancelar</CancelarText>
                </CancelarBtn>
                <GuardarBtn onPress={agendarEvento}>
                  <GuardarText>🎉 Guardar</GuardarText>
                </GuardarBtn>
              </BtnContainer>
            </ModalScrollContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );  
};

export default EventosScreen;