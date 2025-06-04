import React, { useState, useNavigator } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function CreateUserScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigator = useNavigator();

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    // Validación básica
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigation.navigate('Login'); // Redirigir a pantalla principal
    } catch (error) {
      // Manejo de errores específicos del servidor
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      Alert.alert('Error', error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Ej: Juan Pérez"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Ej: usuario@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#495057',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    marginTop: 5,
    fontSize: 14,
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});