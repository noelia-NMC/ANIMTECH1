// 📁 src/screens/EventosScreen.jsx (VERSIÓN CORREGIDA)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import * as Notifications from 'expo-notifications';
import { getEventos, addEvento, deleteEvento } from '../services/eventosService';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const EventoIcon = ({ type }) => {
    const icons = {
        veterinario: { name: 'medical', color: '#e74c3c' },
        vacuna: { name: 'eyedrop', color: '#3498db' },
        comida: { name: 'fast-food', color: '#f1c40f' },
        baño: { name: 'water', color: '#1abc9c' },
        paseo: { name: 'walk', color: '#9b59b6' },
        otro: { name: 'help-circle', color: '#95a5a6' }
    };
    const icon = icons[type] || icons.otro;
    return <Ionicons name={icon.name} size={24} color={icon.color} style={styles.eventIcon} />;
};


const EventosScreen = () => {
  const [items, setItems] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [eventTitle, setEventTitle] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [eventType, setEventType] = useState('otro');
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const eventos = await getEventos();
      const formatted = {};
      
      eventos.forEach(evento => {
        const dateStr = evento.date;
        if (!formatted[dateStr]) formatted[dateStr] = [];
        formatted[dateStr].push({
          id: evento._id,
          title: evento.title,
          notes: evento.notes,
          type: evento.type,
        });
      });
      setItems(formatted);
    } catch (error) {
      console.error("Fallo al cargar eventos, revisa el log del servicio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []); 

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const scheduleNotification = async (date, title) => {
      const eventDate = new Date(`${date}T09:00:00`);
      if(eventDate < new Date()) return;

      await Notifications.scheduleNotificationAsync({
        content: { title: "¡Recordatorio de AnimTech! 🐾", body: `Hoy tienes un evento: ${title}`, data: { screen: 'Eventos' } },
        trigger: eventDate,
      });
  }

  const handleAddEvent = async () => {
    if (!eventTitle.trim()) {
      Alert.alert('Campo Requerido', 'Por favor, ingresa un título para el evento.');
      return;
    }
    const newEventData = { title: eventTitle, date: selectedDate, notes: eventNotes, type: eventType };
    
    try {
      await addEvento(newEventData);
      await scheduleNotification(selectedDate, eventTitle);
      setModalVisible(false);
      setEventTitle(''); setEventNotes(''); setEventType('otro');
      await loadEvents(); // Recargamos los eventos
    } catch(error) {
      Alert.alert('Error', 'No se pudo guardar el evento.');
    }
  };

  const handleDeleteEvent = (eventId) => {
      Alert.alert('Confirmar Eliminación', '¿Estás seguro?',
          [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Eliminar', style: 'destructive', onPress: async () => {
                  try {
                      await deleteEvento(eventId);
                      await loadEvents(); // Recargamos los eventos
                  } catch (error) {
                      Alert.alert('Error', 'No se pudo eliminar el evento.');
                  }
              }}
          ]
      )
  }

  const renderItem = (item) => (
      <TouchableOpacity style={styles.itemContainer} onPress={() => Alert.alert(item.title, item.notes || 'Sin notas adicionales.')}>
        <EventoIcon type={item.type} />
        <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEvent(item.id)}>
            <Ionicons name="trash-bin-outline" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </TouchableOpacity>
  );

  const renderEmptyDate = () => (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>No hay eventos para este día.</Text>
      </View>
  );
  
  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        onDayPress={handleDayPress}
        selected={moment().format('YYYY-MM-DD')}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={(r1, r2) => r1.id !== r2.id}
        theme={{
            agendaDayTextColor: '#42a8a1', agendaDayNumColor: '#42a8a1', agendaTodayColor: '#e74c3c',
            agendaKnobColor: '#42a8a1', selectedDayBackgroundColor: '#42a8a1', dotColor: '#42a8a1',
            todayTextColor: '#e74c3c',
        }}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Añadir Evento para {moment(selectedDate).format('D [de] MMMM')}</Text>
                    <TextInput style={styles.input} placeholder="Título del evento (ej. Cita veterinaria)" value={eventTitle} onChangeText={setEventTitle} />
                    <TextInput style={[styles.input, {height: 80}]} placeholder="Notas adicionales..." value={eventNotes} onChangeText={setEventNotes} multiline />
                    <Text style={styles.typeSelectorLabel}>Tipo de Evento:</Text>
                    <View style={styles.typeSelector}>
                        {['veterinario', 'vacuna', 'baño', 'paseo', 'comida', 'otro'].map(type => (
                            <TouchableOpacity key={type} onPress={() => setEventType(type)} style={[styles.typeButton, eventType === type && styles.typeButtonSelected]}>
                                <EventoIcon type={type} />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleAddEvent}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        {loading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="#42a8a1" />}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  itemContainer: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginRight: 10, marginTop: 17, flexDirection: 'row', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, },
  itemContent: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemNotes: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyDate: { height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: 10, marginTop: 17, backgroundColor: '#f9f9f9' },
  emptyDateText: { color: '#aaa', fontStyle: 'italic' },
  eventIcon: { width: 30, textAlign: 'center' },
  deleteButton: { padding: 5, },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20, },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 25, width: '100%', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 15, fontSize: 16, },
  typeSelectorLabel: { fontSize: 16, color: '#555', marginBottom: 10, alignSelf: 'flex-start' },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, width: '100%' },
  typeButton: { padding: 10, borderRadius: 50, borderWidth: 2, borderColor: 'transparent' },
  typeButtonSelected: { borderColor: '#42a8a1', backgroundColor: 'rgba(66, 168, 161, 0.1)' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, width: '100%' },
  button: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', },
  cancelButton: { backgroundColor: '#a0a0a0', marginRight: 10 },
  saveButton: { backgroundColor: '#42a8a1' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
export default EventosScreen;