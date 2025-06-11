// Mobile/src/screens/RegistroMascotaScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { registrarPerfilMascota } from '../services/perfilMascotaService';

const RegistroMascotaScreen = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [especie, setEspecie] = useState('canino');
    const [raza, setRaza] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(''); // Formato YYYY-MM-DD
    const [genero, setGenero] = useState('');
    const [collarId, setCollarId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegistro = async () => {
        if (!nombre.trim() || !especie || !fechaNacimiento.trim() || !genero) {
            Alert.alert('Campos Incompletos', 'Por favor, rellena todos los campos obligatorios.');
            return;
        }
        setLoading(true);
        try {
            const datosMascota = {
                nombre: nombre.trim(),
                especie,
                raza: raza.trim(),
                fecha_nacimiento: fechaNacimiento.trim(),
                genero,
                collar_id: especie === 'canino' ? collarId.trim() : null,
            };
            await registrarPerfilMascota(datosMascota);
            Alert.alert('¡Mascota Registrada!', '¡Bienvenido a AnimTech!');
            navigation.replace('MainDrawer'); // Redirige a la app principal
        } catch (error) {
            Alert.alert('Error de Registro', error.message || 'No se pudo registrar la mascota. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crea el Perfil de tu Mascota</Text>
            <Text style={styles.subtitle}>Un último paso para empezar a cuidar de tu compañero.</Text>
            
            <Text style={styles.label}>¿Es un perro o un gato?</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={especie}
                    onValueChange={(itemValue) => setEspecie(itemValue)}
                >
                    <Picker.Item label="Perro" value="canino" />
                    <Picker.Item label="Gato" value="felino" />
                </Picker>
            </View>

            <Text style={styles.label}>Nombre de tu mascota</Text>
            <TextInput style={styles.input} placeholder="Ej: Rocky, Luna..." value={nombre} onChangeText={setNombre} />

            <Text style={styles.label}>Raza (opcional)</Text>
            <TextInput style={styles.input} placeholder="Ej: Pug, Siamés..." value={raza} onChangeText={setRaza} />

            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <TextInput style={styles.input} placeholder="Formato: AAAA-MM-DD" value={fechaNacimiento} onChangeText={setFechaNacimiento} />
            
            <Text style={styles.label}>Género</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={genero} onValueChange={(itemValue) => setGenero(itemValue)}>
                    <Picker.Item label="Selecciona su género..." value="" />
                    <Picker.Item label="Macho" value="Macho" />
                    <Picker.Item label="Hembra" value="Hembra" />
                </Picker>
            </View>

            {especie === 'canino' && (
                <View style={styles.collarSection}>
                    <Text style={styles.collarTitle}>Vincular Collar Inteligente (Opcional)</Text>
                    <TextInput style={styles.input} placeholder="Ingresa el ID del collar" value={collarId} onChangeText={setCollarId} />
                    <Text style={styles.collarInfo}>Si no tienes un collar ahora, puedes agregarlo más tarde desde el perfil de tu mascota.</Text>
                </View>
            )}

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegistro} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Registrando..." : "Finalizar Registro"}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, paddingBottom: 40, backgroundColor: 'white', flexGrow: 1 },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
    subtitle: { fontSize: 16, textAlign: 'center', color: 'gray', marginBottom: 30 },
    label: { fontSize: 16, fontWeight: '500', color: '#444', marginBottom: 8 },
    input: { height: 50, borderColor: '#ddd', borderWidth: 1, marginBottom: 20, paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#f9f9f9' },
    pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 20, backgroundColor: '#f9f9f9' },
    collarSection: { marginTop: 20, padding: 15, backgroundColor: '#eef6ff', borderRadius: 10, borderWidth: 1, borderColor: '#cce0ff' },
    collarTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#0052cc' },
    collarInfo: { fontSize: 13, color: 'gray', textAlign: 'center', marginTop: 5 },
    button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    buttonDisabled: { backgroundColor: '#a0c7ff' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default RegistroMascotaScreen;