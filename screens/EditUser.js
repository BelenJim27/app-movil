import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export default function EditUser({ route, navigation }) {
  const { user, refreshUsers } = route.params; // Recibimos la función refreshUsers

  // Establecemos los valores iniciales para cada campo
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validación para asegurarnos de que al menos uno de los campos esté siendo modificado
    if (!name || !email || (password && password.length < 6)) {
      Alert.alert('Error', 'Por favor complete todos los campos correctamente.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      // Actualizamos los datos del usuario (nombre, correo y contraseña si se ingresó)
      const updatedData = { name, email };
      if (password) updatedData.password = password;

      await API.put(`/users/${user._id}`, updatedData, {
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Usuario</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña (opcional)"
        secureTextEntry
      />
      <Button title={loading ? 'Guardando...' : 'Guardar'} onPress={handleSave} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: '600', color: '#333' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    marginBottom: 20, 
    borderRadius: 10, 
    fontSize: 16, 
    backgroundColor: '#f9f9f9' 
  },
});
