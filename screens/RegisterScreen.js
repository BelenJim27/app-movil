import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import API from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const { data } = await API.post('/register', { name, email, password });
      Alert.alert('✅ Registro exitoso', data.message);
      navigation.replace('Dashboard'); // Redirige al Login después de registrarse
    } catch (error) {
      Alert.alert('❌ Error', error.response?.data?.message || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput 
        placeholder="Nombre" 
        value={name} 
        onChangeText={setName} 
        style={styles.input} 
        placeholderTextColor="#888"
      />
      <TextInput 
        placeholder="Correo" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        placeholderTextColor="#888"
      />
      <TextInput 
        placeholder="Contraseña" 
        value={password} 
        secureTextEntry 
        onChangeText={setPassword} 
        style={styles.input} 
        placeholderTextColor="#888"
      />
      <View style={styles.buttonContainer}>
        <Button title="Registrarse" onPress={handleRegister} color="#4CAF50" />
      </View>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>¿Ya tienes cuenta?</Text>
        <Button title="Inicia sesión" onPress={() => navigation.navigate('Login')} color="#2196F3" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 15,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#555',
    marginRight: 5,
  },
});
