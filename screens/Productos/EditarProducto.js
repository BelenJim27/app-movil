import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import API from '../../services/api';

export default function EditarProducto() {
  const route = useRoute();
  const navigation = useNavigation();
  const producto = route.params?.producto;

  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [precio, setPrecio] = useState(String(producto.precio));
  const [existencia, setExistencia] = useState(String(producto.existencia));
  const [categoria, setCategoria] = useState(producto.categoria);
  const [imagen, setImagen] = useState(producto.imagenes || null);
  const [imagenNueva, setImagenNueva] = useState(null);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.cancelled) {
      setImagenNueva(resultado.assets[0].uri);
    }
  };

 const actualizarProducto = async () => {
  try {
    let imagenURL = imagen;

    // Si hay una imagen nueva, la subimos primero
    if (imagenNueva) {
      const formData = new FormData();
      formData.append('imagen', {
        uri: imagenNueva,
        name: 'producto.jpg',
        type: 'image/jpeg',
      });

      const imgRes = await API.post(`/productos/upload/${producto._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      imagenURL = imgRes.data.imagen; // Asegúrate de que el backend devuelve esto
    }

    // Actualizamos el producto
    const res = await API.put(`/productos/${producto._id}`, {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      existencia: parseInt(existencia),
      categoria,
      imagen: imagenURL,
    });

    if (res.data.success) {
      Alert.alert('Actualizado', 'Producto actualizado correctamente');
      navigation.goBack(); // Esto hará que en DetalleProducto se recargue por useFocusEffect
    } else {
      Alert.alert('Error', 'No se pudo actualizar el producto');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Ocurrió un error al actualizar el producto');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>

      <TouchableOpacity onPress={seleccionarImagen} style={styles.imagePicker}>
        <Image
          source={{ uri: imagenNueva || imagen || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        <Text style={styles.imageText}>Cambiar Imagen</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
      <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Existencia" value={existencia} onChangeText={setExistencia} keyboardType="number-pad" />
      <TextInput style={styles.input} placeholder="Categoría" value={categoria} onChangeText={setCategoria} />

      <TouchableOpacity onPress={actualizarProducto} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imageText: {
    marginTop: 8,
    color: '#007AFF',
    fontWeight: '500',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
