import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Principal</Text>
      <Button title="Abrir menú" onPress={() => navigation.openDrawer()} />
      <Button title="Ver Usuarios" onPress={() => navigation.navigate('Usuarios')} />
      {/* Aquí puedes añadir más secciones, widgets, etc */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
});
