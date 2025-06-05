import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const CartButton = ({ onPress }) => (
  <TouchableOpacity style={[styles.button, styles.cartButton]} onPress={onPress}>
    <View style={styles.buttonContent}>
      <Ionicons name="cart-outline" size={20} color="#fff" style={styles.icon} />
      <Text style={styles.buttonText}>Agregar al carrito</Text>
    </View>
  </TouchableOpacity>
);

export const EditButton = ({ onPress }) => (
  <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onPress}>
    <View style={styles.buttonContent}>
      <Ionicons name="create-outline" size={18} color="#fff" style={styles.icon} />
      <Text style={styles.buttonText}>Editar</Text>
    </View>
  </TouchableOpacity>
);

export const DeleteButton = ({ onPress }) => (
  <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onPress}>
    <View style={styles.buttonContent}>
      <Ionicons name="trash-outline" size={18} color="#fff" style={styles.icon} />
      <Text style={styles.buttonText}>Eliminar</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  icon: {
    marginRight: 5,
  },
  cartButton: {
    backgroundColor: '#FF6B00', // Naranja llamativo como Amazon
    width: '100%',
  },
  editButton: {
    backgroundColor: '#3483FA', // Azul Mercado Libre
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF2D55', // Rojo Shein
    flex: 1,
    marginLeft: 8,
  },
});

export default {
  CartButton,
  EditButton,
  DeleteButton,
};