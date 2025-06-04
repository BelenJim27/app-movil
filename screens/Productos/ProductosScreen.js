import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import API from '../../services/api';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2; // Para mostrar 2 columnas con margen

export default function ProductosScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const categoriaSeleccionada = route.params?.categoria || null;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

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

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

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
      <FlatList
        data={productos}
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
              {item.imagenes ? (
                <Image 
                  source={{ uri: `http://192.168.137.121:5000/${item.imagenes[0]}` }} 
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
              <Text style={styles.productName} numberOfLines={1}>{item.nombre}</Text>
              <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
              
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
            <Text style={styles.emptyText}>No hay productos en esta categoría</Text>
          </View>
        }
      />
      
      {/* Botón flotante del carrito */}
      {cart.length > 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Carrito', { cart })}
        >
          <Ionicons name="cart" size={24} color="white" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cart.reduce((total, item) => total + item.quantity, 0)}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: itemWidth,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: itemWidth * 1.2,
  },
  placeholderImage: {
    width: '100%',
    height: itemWidth * 1.2,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  lowStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(25, 151, 18)',
    marginBottom: 10,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: 'rgb(19, 142, 219) ',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
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
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: ' #1c90ef ',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});