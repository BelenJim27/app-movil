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
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../services/api';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

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
        source={{ uri: `http://192.168.1.118:5000/${item}` }}
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

        <View style={styles.actionsContainer}>
        {isAdmin && (<Button
            title="Editar Producto"
            onPress={() => navigation.navigate('EditarProducto', { producto })}
            icon={<Ionicons name="create-outline" size={20} color="#fff" />}
            style={styles.editButton}
          /> )}
          
          {isAdmin && (
            <Button
            title="Eliminar Producto"
            onPress={eliminarProducto}
            icon={<Ionicons name="trash-outline" size={20} color="#fff" />}
            style={styles.deleteButton}
          />      )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    height: 300,
    width: '100%',
    marginBottom: 10,
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '90%',
    height: '90%',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#2e86de',
    width: 12,
  },
  detailsContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#af20db',
    
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b76ef',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f7f7f7',
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  actionsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#3498db',
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#e74c3c',
  },
});