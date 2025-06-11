// 📁 src/screens/HistorialClinicoScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente de ejemplo para un item del historial
const HistorialItem = ({ fecha, motivo, clinica }) => (
  <View style={styles.historialItem}>
    <View style={styles.itemHeader}>
      <Text style={styles.itemFecha}>{fecha}</Text>
      <Text style={styles.itemClinica}>{clinica}</Text>
    </View>
    <Text style={styles.itemMotivo}>{motivo}</Text>
  </View>
);

const HistorialClinicoScreen = ({ navigation }) => {
  // Datos de ejemplo
  const historialData = [
    { fecha: '15/05/2024', motivo: 'Vacuna anual y desparasitación.', clinica: 'Veterinaria San Francisco' },
    { fecha: '22/02/2024', motivo: 'Consulta por alergia en la piel.', clinica: 'Clínica PetLove' },
    { fecha: '10/11/2023', motivo: 'Chequeo general.', clinica: 'Veterinaria San Francisco' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial Clínico</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {historialData.map((item, index) => (
          <HistorialItem 
            key={index}
            fecha={item.fecha}
            motivo={item.motivo}
            clinica={item.clinica}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  historialItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemFecha: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#42a8a1',
  },
  itemClinica: {
    fontSize: 12,
    color: '#888',
  },
  itemMotivo: {
    fontSize: 16,
    color: '#333',
  },
});

export default HistorialClinicoScreen;