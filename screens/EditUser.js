import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export default function EditUser({ route, navigation }) {
  const { user, refreshUsers } = route.params; // Recibimos la función refreshUsers

  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      await API.put(`/users/${user._id}`, { email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Éxito', 'Usuario actualizado');
      refreshUsers(); // Llamamos la función de actualización
      navigation.goBack(); // Volver a la pantalla anterior
    } catch (error) {
      console.error('Error al actualizar usuario:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuario</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <Button title={loading ? 'Guardando...' : 'Guardar'} onPress={handleSave} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 },
});
