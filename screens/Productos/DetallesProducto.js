import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect,TouchableOpacity } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../services/api';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { CartButton, EditButton,DeleteButton } from '../../components/Button';

const { width } = Dimensions.get('window');

export default function DetalleProducto() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';  const route = useRoute();
  const navigation = useNavigation();
  const productos = route.params?.producto;
  const [producto, setProducto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProducto = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/productos/${productos._id}`);
      setProducto(res.data.producto);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducto();
    }, [productos._id])
  );

  const eliminarProducto = async () => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await API.delete(`/productos/${productos._id}`, {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              });
              setProducto(null);
              Alert.alert('Éxito', 'Producto eliminado.');
              navigation.goBack();
            } catch (error) {
              console.error('Error al eliminar:', error.response?.data || error.message);
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
      </View>
    );
  }

  if (!producto) {
    return (
      <View style={styles.container}>
        <Text>No se pudo cargar el producto</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Carrusel de imágenes */}
      <View style={styles.carouselContainer}>
      <FlatList
  data={producto.imagenes || []}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={styles.imageContainer}>
      <Image

        source={{ uri: `http://192.168.1.120:5000/${item}` }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </View>
  )}
  ListEmptyComponent={
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: 'https://via.placeholder.com/300' }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </View>
  }
  onScroll={(e) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (width - 40));
    setCurrentIndex(index);
  }}
/>
        {/* Indicadores de página */}
        {producto.imagenes?.length > 1 && (
          <View style={styles.indicatorContainer}>
            {producto.imagenes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Detalles del producto */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{producto.nombre}</Text>
        <Text style={styles.productPrice}>${producto.precio} NMX</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.text}>{producto.descripcion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoría</Text>
          <Text style={styles.text}>{producto.categoria}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <Text style={styles.text}>{producto.color}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Existencia</Text>
          <Text style={styles.text}>{producto.existencia} unidades</Text>
        </View>

        <View style={styles.buttonContainer}>
        <CartButton onPress={() => navigation.navigate('Carrito')} />
      </View>

      {isAdmin && (
        <View style={styles.adminButtonsContainer}>
          <EditButton onPress={() => navigation.navigate('EditarProducto', { producto })} />
          <DeleteButton onPress={eliminarProducto} />
        </View>
      )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Fondo más claro como las apps de shopping
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
  },
  adminButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  carouselContainer: {
    height: 380, 
    width: '100%',
    marginBottom: 0, 
    backgroundColor: '#fff', 
  },
  imageContainer: {
    width: width,
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, 
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Para que la imagen se vea completa
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20, // Más arriba que antes
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#ff2d55', // Rojo estilo Shein/Amazon
    width: 12,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: '#fff', // Fondo blanco para la sección de detalles
    marginTop: 5, // Pequeña separación
    borderRadius: 8, // Bordes redondeados
    marginHorizontal: 10, // Margen a los lados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 22, // Un poco más pequeño
    fontWeight: '600', // Semibold en lugar de bold
    marginBottom: 8,
    color: '#333', // Negro en lugar de morado
  },
  productPrice: {
    fontSize: 24, // Más grande para destacar el precio
    fontWeight: 'bold',
    color: '#007AFF', // 
    marginBottom: 15,
  },
  priceOriginal: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: '#ff2d55',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    marginLeft: 8,
  },
  section: {
    marginBottom: 20, // Más espacio
    paddingTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#eee', // Línea más suave
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 15, // Un poco más pequeño
    color: '#666', // Gris un poco más oscuro
    lineHeight: 22,
  },
  actionsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingStars: {
    color: '#ffcc00', // Amarillo para estrellas
    marginRight: 5,
  },
  ratingText: {
    color: '#3483fa',
    fontSize: 14,
    marginLeft: 5,
  },
}); 