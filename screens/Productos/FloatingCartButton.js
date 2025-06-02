import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './CartContext';
export default function FloatingCartButton({ navigation }) {
  const { cartItems } = useCart();
  const cantidadTotal = cartItems.reduce((total, item) => total + item.cantidad, 0);

  if (cantidadTotal === 0) return null; // No mostrar si no hay productos

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('Carrito')}
      activeOpacity={0.7}
    >
      <Ionicons name="cart" size={24} color="white" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{cantidadTotal}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
});
