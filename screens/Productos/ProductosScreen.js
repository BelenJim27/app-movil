import React, { useEffect, useState , useCallback} from 'react';
import { useCart } from '../../context/CartContext';

import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import API from '../../services/api';
import FloatingCartButton from '../../components/FloatingCartButton';
import { useRoute, useNavigation,useFocusEffect } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2; // Para 2 columnas con márgenes

export default function ProductosScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const categoriaSeleccionada = route.params?.categoria || null;
  const { addToCart } = useCart();

  const agregarAlCarrito = (producto) => {
    addToCart(producto);
  };
  
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
        setError(null);
      } else {
        setError('No se pudieron cargar los productos.');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Recarga productos al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchProductos();
    }, [categoriaSeleccionada])
  );
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

  const renderProductItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DetallesProducto', { producto: item })}
      >
        {item.imagenes ? (
          <Image
            source={{ uri: `http://192.168.1.65:5000/${item.imagenes[0]}` }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
          <Text style={styles.productPrice}>${item.precio} MXN</Text>
        </View>
      </TouchableOpacity>
  
      {/* Botón de añadir al carrito */}
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => agregarAlCarrito(item)} // función que usarás
      >
        <Ionicons name="cart-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {categoriaSeleccionada && (
        <Text style={styles.categoryTitle}>{categoriaSeleccionada}</Text>
      )}
      <FlatList
        data={productos}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No hay productos en esta categoría</Text>
          </View>
          
        }
      />
          <FloatingCartButton />

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#f5f5f5',
  },
  placeholderImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    height: 36,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 8,
    color: '#333',
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
  },addToCartButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
    elevation: 6,
  },
  addToCartButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
    elevation: 6,
  },
    
});
