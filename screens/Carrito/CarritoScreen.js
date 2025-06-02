import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useCart } from '../../context/CartContext';
export default function CartScreen() {
  const { cartItems, total, removeFromCart, clearCart } = useCart();

  const handleCheckout = () => {
    // Aquí puedes hacer una petición a tu API para actualizar el stock
    console.log('Procesando pedido...');
    clearCart(); // Limpia después de pagar
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} x {item.quantity}</Text>
            <Text>${item.price * item.quantity}</Text>
            <Button title="Eliminar" onPress={() => removeFromCart(item._id)} />
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <Button title="Finalizar compra" onPress={handleCheckout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginVertical: 20 },
});
