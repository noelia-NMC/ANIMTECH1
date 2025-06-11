import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ComunidadScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comunidad</Text>
      <Text style={styles.text}>Aquí podrás conectarte con otros rescatistas y dueños 💬</Text>
    </View>
  );
};

export default ComunidadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5ffff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#42a8a1',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
