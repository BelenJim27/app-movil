import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../services/api';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext'; // ajusta el path según corresponda

export default function DetalleProducto() {
  const { user } = useAuth(); // Y `user.token` es el JWT

  const route = useRoute();
  const navigation = useNavigation();
  const productos = route.params?.producto;
  const [producto, setProducto] = useState(null);

  const fetchProducto = async () => {
    try {
      const res = await API.get(`/productos/${productos._id}`);
      setProducto(res.data.producto);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el producto');
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
            console.log('Producto eliminado:', productos._id); 
          } catch (error) {
            console.error('Error al eliminar:', error.response?.data || error.message);
            Alert.alert('Error', 'No se pudo eliminar el producto.');
          }
        },
      },
    ]
  );
};


  if (!producto) {
    return (
      <View style={styles.container}>
        <Text>Cargando producto...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.image}>
        {producto.imagenes?.[0] && (
          <Image
            source={{ uri: `http://192.168.1.172:5000/${producto.imagenes[0]}` }}
            style={styles.image}
          />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{producto.nombre}</Text>
        <Text style={styles.productPrice}>{producto.precio} NMX</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.text}>{producto.descripcion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categoría</Text>
          <Text style={styles.text}>{producto.categoria}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Existencia</Text>
          <Text style={styles.text}>{producto.existencia} unidades</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Editar Producto"
            onPress={() => navigation.navigate('EditarProducto', { producto })}
            icon={<Ionicons name="create-outline" size={20} color="#fff" />}
            style={styles.editButton}
          />
          <Button
            title="Eliminar Producto"
            onPress={eliminarProducto}
            icon={<Ionicons name="trash-outline" size={20} color="#fff" />}
            style={styles.deleteButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// styles iguales que antes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    padding: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e86de',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
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