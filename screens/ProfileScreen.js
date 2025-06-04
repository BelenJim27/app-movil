// screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={100} color="#6c5ce7" />
          </View>
          <Text style={styles.title}>{user?.name || 'Usuario sin nombre'}</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={20} color="#6c5ce7" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Rol</Text>
              <Text style={styles.detailValue}>{user?.role || 'No definido'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="key-outline" size={20} color="#6c5ce7" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>ID de usuario</Text>
              <Text style={styles.detailValue}>{user?.id || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: width - 48,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    backgroundColor: '#f3f0ff',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#e9e3ff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  detailIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '500',
  },
});

export default ProfileScreen;