import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, ActivityIndicator } from 'react-native';
import API from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateUserScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Crear el usuario
      await API.post('/register', { name, email, password, role });
      
      // 2. Iniciar sesión automáticamente con las credenciales
      const loginResponse = await API.post('/login', { email, password });
      
      // 3. Guardar el token en AsyncStorage
      await AsyncStorage.setItem('userToken', loginResponse.data.token);
      
      // 4. Redirigir a la pantalla principal
      navigation.navigate('Dashboard');
      
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear nuevo usuario</Text>

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
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Contraseña" 
        value={password} 
        secureTextEntry 
        onChangeText={setPassword} 
        style={styles.input} 
        placeholderTextColor="#888"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Crear usuario" onPress={handleCreateUser} color="#4CAF50" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F9',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
});