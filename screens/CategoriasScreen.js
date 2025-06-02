import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const CategoriasScreen = ({ navigation }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerCategorias = async () => {
    try {
      const res = await axios.get('http://192.168.1.65:5000/api/categorias');
      
      // Mapeamos las categorías con imágenes por defecto si no existen
      const categoriasFormateadas = res.data.data.map(categoria => ({
        nombre: categoria,
        // Usamos una imagen por defecto si no existe la específica
        imagenUrl: `http://192.168.1.65:5000/uploads/${categoria.toLowerCase()}.jpg`
      }));
      
      setCategorias(categoriasFormateadas);
    } catch (error) {
      console.error('Error al obtener categorías:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductosPorCategoria', { categoria: item.nombre })}
      >
        <Image 
          source={{ uri: item.imagenUrl }} 
          style={styles.image}
          onError={(e) => {
          }}
        />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.nombre}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Categorías</Text>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.nombre}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    aspectRatio: 1, // Mantiene relación cuadrada
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
});

export default CategoriasScreen;