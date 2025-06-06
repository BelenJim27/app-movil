// screens/ProductosScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import API from '../../services/api';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que el path sea correcto
const { width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2; // Para mostrar 2 columnas con margen

// ... tus imports permanecen igual

export default function ProductosScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const categoriaSeleccionada = route.params?.categoria || null;
  const { cart, addToCart } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [refreshing, setRefreshing] = useState(false);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
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
      setRefreshing(false); 
    }
  };

  // useEffect ahora usa fetchProductos
  useEffect(() => {
    fetchProductos();
  }, [categoriaSeleccionada]);

  // handleRefresh ya puede acceder a fetchProductos
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProductos();
  };
  const visibleProducts = productos.filter(product => {
    if (isAdmin) return true; // admin ve todo
    return product.existencia > 0; // cliente ve solo disponibles
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
      <FlatList
      
        data={productos}
        numColumns={2}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={refreshing} 
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('DetallesProducto', { producto: item })}
            style={styles.productCard}
          >
            <View style={styles.imageContainer}>
              {item.imagenes ? (
                <Image 

                  source={{ uri: `https://api-server-zen2.onrender.com/:5000/${item.imagenes[0]}` }} 
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
        {isAdmin && (
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    )}
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
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
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: itemWidth,
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowStockBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  lowStockText: {
    color: 'white',
    fontSize: 12,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#ebc387',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 12,
  },
  outOfStockBadge: {
  position: 'absolute',
  top: 5,
  left: 5,
  backgroundColor: 'red',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 5,
},

outOfStockText: {
  color: 'white',
  fontSize: 12,
  fontWeight: 'bold',
},

outOfStockCard: {
  opacity: 0.4,
},

});