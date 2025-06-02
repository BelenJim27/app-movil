import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditarProducto() {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { producto } = route.params;

  const [formData, setFormData] = useState({
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precio: producto.precio.toString(),
    existencia: producto.existencia.toString(),
    categoria: producto.categoria || '',
    material: producto.material || '',
    color: producto.color || '',
  });

  const [imagenes, setImagenes] = useState(producto.imagenes || []);
  const [cargandoImagen, setCargandoImagen] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const seleccionarImagen = async () => {
    setCargandoImagen(true);
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería para subir imágenes');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        const imagenSeleccionada = resultado.assets[0];
        await subirImagen(imagenSeleccionada.uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen');
    } finally {
      setCargandoImagen(false);
    }
  };

  const subirImagen = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('imagenes', {
        uri: uri,
        name: `imagen_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      const res = await API.post(
        `/productos/${producto._id}/imagenes`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      setImagenes(res.data.imagenes);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  };

  const eliminarImagen = async (imagenUrl) => {
    try {
      await API.delete(`/productos/${producto._id}/imagenes`, {
        data: { imagenUrl },
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setImagenes(imagenes.filter(img => img !== imagenUrl));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la imagen');
    }
  };

  const actualizarProducto = async () => {
    try {
      const res = await API.put(
        `/productos/${producto._id}`,
        {
          ...formData,
          precio: parseFloat(formData.precio),
          existencia: parseInt(formData.existencia)
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      Alert.alert('Éxito', 'Producto actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al actualizar');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>

      {/* Galería de imágenes */}
      <View style={styles.galeriaContainer}>
        {imagenes.map((img, index) => (
          <View key={index} style={styles.imagenContainer}>
<Image source={{ uri: `http://192.168.1.65:5000/${img}` }} style={styles.imagen} />
<TouchableOpacity 
              style={styles.botonEliminar}
              onPress={() => eliminarImagen(img)}
            >
              <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Botón para agregar imagen */}
      <TouchableOpacity 
        style={styles.botonAgregarImagen}
        onPress={seleccionarImagen}
        disabled={cargandoImagen}
      >
        {cargandoImagen ? (
          <Text style={styles.botonTexto}>Cargando...</Text>
        ) : (
          <>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.botonTexto}>Agregar Imagen</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Formulario de edición */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={formData.descripcion}
        onChangeText={(text) => handleChange('descripcion', text)}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={formData.precio}
        onChangeText={(text) => handleChange('precio', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Existencia"
        value={formData.existencia}
        onChangeText={(text) => handleChange('existencia', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={formData.categoria}
        onChangeText={(text) => handleChange('categoria', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Material"
        value={formData.material}
        onChangeText={(text) => handleChange('material', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Color"
        value={formData.color}
        onChangeText={(text) => handleChange('color', text)}
      />

      <TouchableOpacity 
        style={styles.botonGuardar}
        onPress={actualizarProducto}
      >
        <Text style={styles.botonGuardarTexto}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  galeriaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imagenContainer: {
    width: 120,
    height: 120,
    margin: 5,
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  botonEliminar: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonAgregarImagen: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  botonTexto: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  botonGuardar: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  botonGuardarTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});