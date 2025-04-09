import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
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
      setUsers(response.data.data);
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
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await API.delete(`/users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              Alert.alert('Éxito', 'Usuario eliminado correctamente');
              fetchUsers();
            } catch (error) {
              console.error('Error al eliminar usuario:', error.response?.data || error.message);
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  const handleEditUser = (user) => {
    navigation.navigate('EditUser', { user, refreshUsers: fetchUsers });
  };

  const handleShowUser = (user) => {
    navigation.navigate('UserDetails', { user });
  };

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <TouchableOpacity 
        style={styles.userInfo} 
        onPress={() => handleShowUser(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="person-circle" size={24} color="#6c5ce7" />
        <View style={styles.userDetails}>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userRole}>{item.role || 'Usuario'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          onPress={() => handleShowUser(item)} 
          style={[styles.actionButton, styles.viewButton]}
        >
          <Ionicons name="eye-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleEditUser(item)} 
          style={[styles.actionButton, styles.editButton]}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDeleteUser(item._id)} 
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Lista Usuarios</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#6c5ce7" />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6c5ce7" />
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={() => {
                  setRefreshing(true);
                  fetchUsers();
                }}
                colors={['#6c5ce7']}
                tintColor="#6c5ce7"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#ddd" />
                <Text style={styles.emptyText}>No hay usuarios registrados</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d3436',
  },
  logoutButton: {
    padding: 8,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
  },
  userRole: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  viewButton: {
    backgroundColor: '#0984e3',
  },
  editButton: {
    backgroundColor: '#00b894',
  },
  deleteButton: {
    backgroundColor: '#d63031',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#b2bec3',
    marginTop: 16,
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
});