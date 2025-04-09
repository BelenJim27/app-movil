import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from './src/api';

export default function UserListScreen() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data);
    } catch (error) {
      Alert.alert('Error al obtener usuarios', error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text style={{ padding: 10 }}>{item.name} - {item.email}</Text>
        )}
      />
    </View>
  );
}
