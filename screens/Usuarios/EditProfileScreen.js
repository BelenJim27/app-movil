import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';

const EditProfileScreen = ({ route, navigation }) => {
  const { user, refreshProfile } = route.params;
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Nombre y correo electrónico son obligatorios');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await API.put('/users/me', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      refreshProfile();
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.sectionTitle}>Cambiar contraseña</Text>

        <Text style={styles.label}>Contraseña actual</Text>
        <TextInput
          style={styles.input}
          value={formData.currentPassword}
          onChangeText={(text) => handleChange('currentPassword', text)}
          secureTextEntry
          placeholder="Dejar vacío si no desea cambiar"
        />

        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          value={formData.newPassword}
          onChangeText={(text) => handleChange('newPassword', text)}
          secureTextEntry
          placeholder="Dejar vacío si no desea cambiar"
        />

        <Text style={styles.label}>Confirmar nueva contraseña</Text>
        <TextInput
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          secureTextEntry
          placeholder="Dejar vacío si no desea cambiar"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#79a9dc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditProfileScreen;