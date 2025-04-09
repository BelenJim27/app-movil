import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export default function Dashboard({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await API.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Respuesta de usuarios:', response.data);
      setUsers(response.data.data); // Ajusta si tu API responde diferente
    } catch (error) {
      console.error('Error al cargar usuarios:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await API.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Usuario eliminado');
      fetchUsers(); // refresca la lista
    } catch (error) {
      console.error('Error al eliminar usuario:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo eliminar el usuario');
    }
  };

  const handleEditUser = (user) => {
    // Pasamos la función fetchUsers para refrescar la lista después de editar
    navigation.navigate('EditUser', { user, refreshUsers: fetchUsers });
  };

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userText}>{item.email}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleEditUser(item)} style={styles.editButton}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser(item._id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Bienvenido al Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              fetchUsers();
            }} />
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No hay usuarios registrados</Text>}
        />
      )}
      <Button title="Cerrar sesión" onPress={handleLogout} color="#f4511e" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  userCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  userText: { fontSize: 16, marginBottom: 10 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: { color: '#fff' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});
