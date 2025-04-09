// UserDetails.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserDetails = ({ route }) => {
  const { user } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color="#6c5ce7" />
          <Text style={styles.title}>{user.email}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>ID:</Text>
          <Text style={styles.detailValue}>{user._id}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Nombre:</Text>
          <Text style={styles.detailValue}>{user.name || 'Usuario'}</Text>
        </View>
        
        {/* Añade más campos según tu modelo de usuario */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    color: '#2d3436',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontWeight: '600',
    width: 80,
    color: '#636e72',
  },
  detailValue: {
    flex: 1,
    color: '#2d3436',
  },
});

export default UserDetails;