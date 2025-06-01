import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import API from '../../services/api';
import { useRoute, useNavigation} from '@react-navigation/native';

export default function ProductosScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const categoriaSeleccionada = route.params?.categoria || null;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = categoriaSeleccionada
          ? await API.get(`/productos/categoria/${categoriaSeleccionada}`)
          : await API.get('/productos');

        if (res.data.success && res.data.data) {
          setProductos(res.data.data);
        } else {
          setError('No se pudieron cargar los productos.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [categoriaSeleccionada]);

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
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={productos}
      
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity 
      onPress={() => navigation.navigate('DetallesProducto', { producto: item })}>
        <View style={styles.card}>
          {item.imagenes ? (
            <Image source={{ uri: `http://192.168.80.109:5000/${item.imagenes[0]}`  }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={{ color: '#999' }}>Sin imagen</Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.price}>{item.precio} NMX</Text>
          </View>
        </View>
        </TouchableOpacity>
        
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>No hay productos en esta categoría</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 15,
    color: '#007AFF',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
