import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView
} from 'react-native';
import API from '../../services/api';
import Toast from 'react-native-toast-message';

export default function EditUser({ route, navigation }) {
  const { user } = route.params;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !email || (newPassword && newPassword.length < 6)) {
      Toast.show({
        type: 'error',
        text1: 'Error de validación',
        text2: 'Por favor complete todos los campos correctamente.',
      });
      return;
    }

    try {
      setLoading(true);

      const updatedData = { name, email };
      if (newPassword) {
        if (!currentPassword) {
          Toast.show({
            type: 'error',
            text1: 'Contraseña requerida',
            text2: 'Debe ingresar la contraseña actual para cambiarla.',
          });
          return;
        }
        updatedData.currentPassword = currentPassword;
        updatedData.newPassword = newPassword;
      }

      await API.put(`/users/${user._id}`, updatedData);

      Toast.show({
        type: 'success',
        text1: 'Usuario actualizado',
        text2: 'Los datos se guardaron correctamente.',
      });

      setTimeout(() => navigatio('DetallesUsuario'), 1500); // volver tras mostrar el toast
      
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar',
        text2: error.response?.data?.message || 'No se pudo actualizar el usuario',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      <Text style={styles.sectionTitle}>Cambiar Contraseña (opcional)</Text>

      <Text style={styles.label}>Contraseña actual</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Contraseña actual"
        secureTextEntry
      />

      <Text style={styles.label}>Nueva contraseña</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Nueva contraseña"
        secureTextEntry
      />

      <Button
        title={loading ? 'Guardando...' : 'Guardar'}
        onPress={handleSave}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold', color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#555' },
  label: { fontSize: 14, marginBottom: 5, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});
