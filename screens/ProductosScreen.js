// screens/ProductosScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import API from '../api'; 

export default function ProductosScreen() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await API.get('/productos');
        setProductos(response.data.productos);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    obtenerProductos();
  }, []);
  

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Image source={{ uri: item.url[0] }} style={styles.imagen} />
      <Text>{item.descripcion}</Text>
      <Text>Precio: ${item.precio}</Text>
    </View>
  );

  return (
    <FlatList
      data={productos}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  imagen: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    resizeMode: 'cover',
    borderRadius: 10
  }
});
