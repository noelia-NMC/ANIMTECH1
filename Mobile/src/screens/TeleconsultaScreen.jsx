import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, Linking, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { crearTeleconsulta, getTeleconsultasDelPropietario } from '../services/teleconsultaService';
import { getMisPerfiles } from '../services/perfilMascotaService'; // Corregido

export default function TeleconsultaScreen() {
  const [motivo, setMotivo] = useState('');
  const [consultas, setConsultas] = useState([]);
  const [misMascotas, setMisMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      const [resConsultas, resMascotas] = await Promise.all([
        getTeleconsultasDelPropietario(),
        getMisPerfiles() // Corregido
      ]);
      
      setConsultas(resConsultas.data);
      // getMisPerfiles ya devuelve el array de datos directamente por cómo está construido en el servicio
      setMisMascotas(resMascotas); 

      if (resMascotas.length > 0) {
        setMascotaSeleccionada(resMascotas[0].id);
      } else {
        setMascotaSeleccionada(null);
      }
    } catch (error) {
      console.error(error.response?.data || error);
      Alert.alert('Error', 'No se pudieron cargar tus datos. Intenta iniciar sesión de nuevo.');
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    cargarDatos().finally(() => setIsLoading(false));
  }, [cargarDatos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cargarDatos().finally(() => setRefreshing(false));
  }, [cargarDatos]);

  const handleEnviar = async () => {
    if (!mascotaSeleccionada) {
      Alert.alert('Atención', 'Debes registrar una mascota antes de solicitar una consulta.');
      return;
    }
    if (!motivo.trim()) {
      Alert.alert('Atención', 'Por favor, describe el motivo de la consulta.');
      return;
    }
    try {
      setIsSubmitting(true);
      await crearTeleconsulta({ 
        mascota_id: mascotaSeleccionada, 
        motivo 
      });
      setMotivo('');
      Alert.alert('Éxito', 'Tu solicitud ha sido enviada.');
      onRefresh(); 
    } catch (error) {
      console.error(error.response?.data || error);
      Alert.alert('Error', 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Mascota: {item.nombre_mascota}</Text>
      <Text style={styles.cardText}><Text style={styles.label}>Motivo:</Text> {item.motivo}</Text>
      <Text style={styles.cardText}><Text style={styles.label}>Fecha:</Text> {new Date(item.fecha).toLocaleString()}</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={[styles.status, styles[item.estado] || {}]}>{item.estado?.toUpperCase()}</Text>
      </View>
      {item.estado === 'aceptada' && item.meet_link && (
        <View style={{ marginTop: 10 }}>
          <Button title="Unirse a la Videollamada" onPress={() => Linking.openURL(item.meet_link)} color="#5cb85c" />
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.form}>
        <Text style={styles.formTitle}>Nueva Solicitud de Teleconsulta</Text>
        {misMascotas.length > 0 ? (
          <>
            <Text style={styles.label}>Selecciona tu mascota:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={mascotaSeleccionada}
                onValueChange={(itemValue) => setMascotaSeleccionada(itemValue)}
                >
                {misMascotas.map(mascota => (
                  <Picker.Item key={mascota.id} label={mascota.nombre} value={mascota.id} />
                  ))}
              </Picker>
            </View>
            <TextInput 
              placeholder="Describe brevemente el motivo de la consulta..." 
              value={motivo} 
              onChangeText={setMotivo} 
              style={styles.input}
              multiline
            />
            <Button 
                title={isSubmitting ? "Enviando..." : "Enviar Solicitud"} 
                onPress={handleEnviar} 
                disabled={isSubmitting}
            />
          </>
        ) : (
          <Text style={styles.emptyText}>Debes registrar al menos una mascota para poder solicitar una teleconsulta.</Text>
        )}
      </View>

      <Text style={styles.title}>Mis Solicitudes</Text>
      {consultas.length === 0 ? (
        <Text style={styles.emptyText}>No tienes solicitudes de teleconsulta.</Text>
      ) : (
        <FlatList
          data={consultas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false} // Evita el scroll anidado
        />
      )}
    </ScrollView>
  );
}

// Los estilos son los mismos que ya tenías
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, textAlign: 'center', color: '#333' },
    form: { padding: 20, margin: 10, backgroundColor: 'white', borderRadius: 10, elevation: 3 },
    formTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 15, minHeight: 80, textAlignVertical: 'top', backgroundColor: '#fff' },
    pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 15, backgroundColor: 'white' },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginHorizontal: 10, marginBottom: 10, elevation: 2 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    cardText: { fontSize: 14, color: '#555', lineHeight: 20 },
    label: { fontWeight: 'bold' },
    statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    status: { marginLeft: 5, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 12, color: 'white', fontWeight: 'bold', fontSize: 12, textTransform: 'capitalize' },
    pendiente: { backgroundColor: '#f0ad4e' },
    aceptada: { backgroundColor: '#5cb85c' },
    finalizada: { backgroundColor: '#777' },
    emptyText: { textAlign: 'center', marginVertical: 20, fontSize: 16, color: 'gray' },
});