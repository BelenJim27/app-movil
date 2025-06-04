import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../services/api';

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getUsers = async () => {
  try {
    const response = await API.get('/users');
    console.log('Usuarios cargados:', response.data.data); // Debug
    setUsers(response.data.data);
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    Alert.alert('Error al obtener usuarios', error.response?.data?.message || error.message);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getUsers();
  };

  const handleAddUser = () => {
    navigation.navigate('CrearUsuario');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Usuarios</Text>
        <TouchableOpacity onPress={handleAddUser} style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableHighlight 
              onPress={() => navigation.navigate('DetallesUsuario', { user: item })}
              underlayColor="#f0f0f0"
              activeOpacity={0.7}
            >
              <View style={styles.userItem}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            </TouchableHighlight>
          )}
          contentContainerStyle={users.length === 0 && styles.emptyList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No hay usuarios disponibles</Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6C63FF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 68,
  },
});