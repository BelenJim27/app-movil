import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, 
  Platform, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function CrearProducto() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    existencia: '',
    categoria: '',
    material: '',
    color: '',
  });

  const [imagenes, setImagenes] = useState([]);
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [creandoProducto, setCreandoProducto] = useState(false);

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
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
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

      // Las imágenes se subirán cuando se cree el producto
      setImagenes(prev => [...prev, { uri, uploading: false }]);
    } catch (error) {
      console.error('Error al preparar imagen:', error);
      throw error;
    }
  };

  const eliminarImagen = (index) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes.splice(index, 1);
    setImagenes(nuevasImagenes);
  };

  const crearProducto = async () => {
    if (!formData.nombre || !formData.precio || !formData.existencia) {
      Alert.alert('Campos requeridos', 'Por favor complete al menos nombre, precio y existencia');
      return;
    }

    if (imagenes.length === 0) {
      Alert.alert('Imágenes requeridas', 'Debe subir al menos una imagen del producto');
      return;
    }

    setCreandoProducto(true);

    try {
      // Primero creamos el producto con los datos básicos
      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        existencia: parseInt(formData.existencia),
        categoria: formData.categoria,
        material: formData.material,
        color: formData.color
      };

      // Crear FormData para enviar las imágenes
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', productoData.nombre);
      formDataToSend.append('descripcion', productoData.descripcion);
      formDataToSend.append('precio', productoData.precio.toString());
      formDataToSend.append('existencia', productoData.existencia.toString());
      formDataToSend.append('categoria', productoData.categoria);
      formDataToSend.append('material', productoData.material);
      formDataToSend.append('color', productoData.color);

      // Agregar imágenes al FormData
      imagenes.forEach((img, index) => {
        formDataToSend.append('imagenes', {
          uri: img.uri,
          name: `imagen_${index}.jpg`,
          type: 'image/jpeg'
        });
      });

      const res = await API.post('/productos', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`
        }
      });

      Alert.alert('Éxito', 'Producto creado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al crear producto:', error);
      Alert.alert('Error', error.response?.data?.message || 'Error al crear el producto');
    } finally {
      setCreandoProducto(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Crear Nuevo Producto</Text>
  
        {/* Sección de imágenes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imágenes del Producto</Text>
          <View style={styles.galeriaContainer}>
            {imagenes.map((img, index) => (
              <View key={index} style={styles.imagenContainer}>
                <Image 
                  source={{ uri: img.uri }} 
                  style={styles.imagen} 
                />
                <TouchableOpacity 
                  style={styles.botonEliminar}
                  onPress={() => eliminarImagen(index)}
                >
                  <Ionicons name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.imagenAgregarContainer}
              onPress={seleccionarImagen}
              disabled={cargandoImagen}
            >
              {cargandoImagen ? (
                <Ionicons name="cloud-upload" size={40} color="#7f8c8d" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={40} color="#3498db" />
                  <Text style={styles.imagenAgregarTexto}>Agregar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre del Producto *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Camiseta de algodón"
              value={formData.nombre}
              onChangeText={(text) => handleChange('nombre', text)}
            />
          </View>

          <View style={[styles.inputContainer, { marginTop: 15 }]}>
            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe detalladamente el producto..."
              value={formData.descripcion}
              onChangeText={(text) => handleChange('descripcion', text)}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
        
        {/* Precio e inventario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Precio e Inventario *</Text>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Precio *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={formData.precio}
                onChangeText={(text) => handleChange('precio', text)}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Existencia *</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.existencia}
                onChangeText={(text) => handleChange('existencia', text)}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Detalles adicionales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles Adicionales</Text>
          
// ...

<View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Electrónica, Ropa, etc."
              value={formData.categoria}
              onChangeText={(text) => handleChange('categoria', text)}
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Material</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Algodón, Plástico"
                value={formData.material}
                onChangeText={(text) => handleChange('material', text)}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Color</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Rojo, Azul"
                value={formData.color}
                onChangeText={(text) => handleChange('color', text)}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.botonGuardar, creandoProducto && styles.botonDeshabilitado]}
          onPress={crearProducto}
          disabled={creandoProducto}
        >
          {creandoProducto ? (
            <Text style={styles.botonGuardarTexto}>Creando Producto...</Text>
          ) : (
            <Text style={styles.botonGuardarTexto}>Crear Producto</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#2c3e50',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 16,
  },
  galeriaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imagen: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagenContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  imagenAgregarContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  imagenAgregarTexto: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownMenu: {
    marginTop: -30, // Ajusta segú
    width: '80%',
  },
  botonEliminar: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#5d6d7e',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2c3e50',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  botonGuardar: {
    backgroundColor: '#79a9dc',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  botonDeshabilitado: {
    backgroundColor: '#95a5a6',
  },
  botonGuardarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});