import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import API from '../services/api';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2;

export default function BusquedaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { query } = route.params;

  const { cart, addToCart } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const res = await API.get(`/productos?search=${query}`);
        if (res.data.success && res.data.data) {
          setProductos(res.data.data);
        } else {
          setError('No se pudieron cargar los resultados.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [query]);

  const visibleProducts = productos.filter(product => {
    if (isAdmin) return true;
    return product.existencia > 0;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
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
    <View style={styles.container}>
      <Text style={styles.title}>Resultados para: "{query}"</Text>
      <FlatList
        data={visibleProducts}
        numColumns={2}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('DetallesProducto', { producto: item })}
            style={styles.productCard}
          >
            <View style={styles.imageContainer}>
              {item.imagenes?.length > 0 ? (
                <Image
                  source={{ uri: `http://192.168.1.120:5000/${item.imagenes[0]}` }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={{ color: '#999' }}>Sin imagen</Text>
                </View>
              )}
              {item.existencia <= 5 && (
                <View style={styles.lowStockBadge}>
                  <Text style={styles.lowStockText}>¡Últimas {item.existencia}!</Text>
                </View>
              )}
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.nombre}
              </Text>
              <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
                {isAdmin && item.existencia === 0 && (
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Sin existencias</Text>
                    )}

              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => addToCart(item)}
              >
                <Ionicons name="cart" size={16} color="white" />
                <Text style={styles.addToCartText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: itemWidth,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lowStockText: {
    fontSize: 10,
    color: 'white',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    color: '#555',
    fontSize: 13,
    marginBottom: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});