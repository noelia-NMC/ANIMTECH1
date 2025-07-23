import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getHistorialClinico } from '../../services/historialService';

// --- Mapeo de Iconos y Colores para cada tipo de evento ---
const eventVisuals = {
  'Teleconsulta': { icon: 'video', color: '#8b5cf6', lib: FontAwesome5 },
  'consulta': { icon: 'stethoscope', color: '#3b82f6', lib: FontAwesome5 },
  'vacuna': { icon: 'syringe', color: '#ef4444', lib: FontAwesome5 },
  'medicamento': { icon: 'pills', color: '#10b981', lib: FontAwesome5 },
  'desparasitacion': { icon: 'bug', color: '#f59e0b', lib: FontAwesome5 },
  'default': { icon: 'file-medical-alt', color: '#6b7280', lib: FontAwesome5 },
};
const getVisuals = (type) => eventVisuals[type.trim()] || eventVisuals['default'];

// --- Componente para cada item del historial ---
const HistorialItem = ({ item }) => {
  const visuals = getVisuals(item.tipo);
  const IconComponent = visuals.lib;
  
  return (
    <View style={styles.historialItem}>
        <View style={[styles.iconContainer, { backgroundColor: visuals.color }]}>
            <IconComponent name={visuals.icon} size={20} color="#fff" />
        </View>
        <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTipo}>{item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</Text>
              <Text style={styles.itemFecha}>{new Date(item.fecha_evento).toLocaleDateString('es-ES')}</Text>
            </View>
            <Text style={styles.itemTitulo}>{item.titulo}</Text>
            {item.notas && <Text style={styles.itemNotas}>Notas: {item.notas}</Text>}
            <Text style={styles.itemFuente}>Fuente: {item.fuente}</Text>
        </View>
    </View>
  );
};

// --- Pantalla Principal ---
const HistorialClinicoScreen = ({ navigation, route }) => {
  // Verificamos si los params existen antes de desestructurar
  const mascotaId = route.params?.mascotaId;
  const nombreMascota = route.params?.nombreMascota;

  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarHistorial = useCallback(async (isRefreshing = false) => {
    // Si no tenemos mascotaId, no hacemos nada y el error se mostrará.
    if (!mascotaId) {
        setLoading(false);
        setRefreshing(false);
        return;
    }

    if (!isRefreshing) setLoading(true);

    try {
      const data = await getHistorialClinico(mascotaId);
      setHistorial(data.historial);
      
    } catch (error) {
      Alert.alert('Error', error.message);
      navigation.goBack(); 
    } finally {
      if (!isRefreshing) setLoading(false);
      setRefreshing(false);
    }
  }, [mascotaId, navigation]); 
  
  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);
  
  const onRefresh = () => {
      setRefreshing(true);
      cargarHistorial(true);
  };

  // Render principal de la pantalla
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Historial Clínico</Text>
          {nombreMascota && <Text style={styles.headerSubtitle}>Mascota: {nombreMascota}</Text>}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#42a8a1" /></View>
      ) : historial.length === 0 ? (
        <ScrollView 
            contentContainerStyle={styles.centered}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#42a8a1"]}/>}
        >
            <Ionicons name="document-text-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No hay registros para {nombreMascota || 'esta mascota'}.</Text>
            <Text style={styles.emptySubText}>Los eventos de salud y teleconsultas finalizadas aparecerán aquí.</Text>
        </ScrollView>
      ) : (
        <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#42a8a1"]}/>}
        >
            {historial.map((item, index) => <HistorialItem item={item} key={`${item.id}-${index}`} />)}
        </ScrollView>
      )}
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 30, paddingBottom: 15, paddingHorizontal: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    backButton: { padding: 5, marginRight: 15 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
    headerSubtitle: { fontSize: 14, color: '#6b7280' },
    content: { paddingVertical: 16, paddingHorizontal: 12 },
    historialItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 3 },
    iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    itemContent: { flex: 1 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    itemTipo: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
    itemFecha: { fontSize: 12, color: '#6b7280' },
    itemTitulo: { fontSize: 14, color: '#374151', marginBottom: 6, fontWeight: '500' },
    itemNotas: { fontSize: 13, color: '#4b5563', fontStyle: 'italic', marginTop: 4, lineHeight: 18 },
    itemFuente: { fontSize: 12, color: '#9ca3af', textAlign: 'right', marginTop: 8 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { marginTop: 15, fontSize: 17, textAlign: 'center', color: '#4b5563', fontWeight: '600' },
    emptySubText: { marginTop: 8, fontSize: 14, textAlign: 'center', color: '#9ca3af', paddingHorizontal: 20 },
});

export default HistorialClinicoScreen;