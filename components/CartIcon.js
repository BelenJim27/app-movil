// components/CartIcon.js
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const CartIcon = ({ color }) => {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={{ position: 'relative' }}>
      <Ionicons name="cart" size={24} color={color} />
      {itemCount > 0 && (
        <View style={{
          position: 'absolute',
          right: -8,
          top: -8,
          backgroundColor: 'red',
          borderRadius: 10,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ color: 'white', fontSize: 12 }}>{itemCount}</Text>
        </View>
      )}
    </View>
  );
};

export default CartIcon;