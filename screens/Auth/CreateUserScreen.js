import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, ActivityIndicator } from 'react-native';
import API from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
export default function CreateUserScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleCreateUser = async () => {
    if (!name || !name.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      await register(name, email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
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