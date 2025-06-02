import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingCartButton() {
  const navigation = useNavigation();
  const { cartItems } = useCart();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('CartScreen')}
      style={styles.floatingButton}
    >
      <Ionicons name="cart" size={30} color="white" />
      {cartItems.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartItems.length}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2c3e50',
    borderRadius: 50,
    padding: 15,
    zIndex: 100,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
});
