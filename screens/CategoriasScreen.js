import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image,StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import API from '../services/api';

export default function CategoriasScreen() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await API.get('/categorias');
        if (res.data.success && res.data.data) {
          setCategorias(res.data.data);
        } else {
          setError(res.data.message || 'No se pudieron obtener las categorías');
        }
      } catch (err) {
        setError(err.message || 'Error de red');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar categorías: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <Text style={styles.header}>Categorías</Text>
    <FlatList
      data={categorias}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductosPorCategoria', { categoria: item })}
          >
            <Image
              source={{ uri: `http://192.168.1.88:5000/uploads/${item.toLowerCase()}.jpg` }}
              style={styles.image}
              onError={() => {}}
            />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item}</Text>
        </View>
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>No hay categorías disponibles</Text>
        </View>
      }
    />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 30,
  },
  cardContainer: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    aspectRatio: 1, // relación cuadrada
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});
