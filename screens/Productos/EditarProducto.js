import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView,  KeyboardAvoidingView,
  Platform, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Editar Producto</Text>
  
        {/* Sección de imágenes - Ahora más grande */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imágenes del Producto</Text>
          <View style={styles.galeriaContainer}>
            {imagenes.map((img, index) => (
              <View key={index} style={styles.imagenContainer}>
                <Image 
                  source={{ uri: `http://192.168.1.120:5000/${img}` }} 
                  style={styles.imagen} 
                />
                <TouchableOpacity 
                  style={styles.botonEliminar}
                  onPress={() => eliminarImagen(img)}
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
        
      {/* Información básica - Con más espacio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Básica</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre del Producto</Text>
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
          <Text style={styles.sectionTitle}>Precio e Inventario</Text>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Precio</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={formData.precio}
                onChangeText={(text) => handleChange('precio', text)}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Existencia</Text>
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
          style={styles.botonGuardar}
          onPress={actualizarProducto}
        >
          <Text style={styles.botonGuardarTexto}>Guardar Cambios</Text>
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
    width: 100,  // Aumentado de 80 a 100
    height: 100, // Aumentado de 80 a 100
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  imagenAgregarContainer: {
    width: 100,  // Aumentado de 80 a 100
    height: 100, // Aumentado de 80 a 100
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
    fontSize: 14, // Aumentado de 13 a 14
    color: '#5d6d7e', // Color más oscuro
    marginBottom: 6, // Aumentado de 4 a 6
    fontWeight: '500', // Más visible
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
    minHeight: 100, // Aumentado de 80 a 100
    textAlignVertical: 'top',
  },
  botonGuardar: {
    backgroundColor: '#27ae60',
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
  botonGuardarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});