import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';

export default function CarritoScreen() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const calcularTotal = () => {
    return cartItems.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.producto.nombre}</Text>
      <Text>Cantidad: {item.cantidad}</Text>
      <Text>Subtotal: ${item.producto.precio * item.cantidad} MXN</Text>
      <TouchableOpacity onPress={() => removeFromCart(item.producto._id)} style={styles.btn}>
        <Text style={styles.btnText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.producto._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>El carrito está vacío</Text>}
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${calcularTotal()} MXN</Text>
          <TouchableOpacity onPress={clearCart} style={styles.btn}>
            <Text style={styles.btnText}>Vaciar carrito</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 8 },
  title: { fontWeight: 'bold', fontSize: 16 },
  btn: { marginTop: 5, backgroundColor: 'red', padding: 6, borderRadius: 4, alignItems: 'center' },
  btnText: { color: '#fff' },
  footer: { marginTop: 20 },
  total: { fontSize: 18, fontWeight: 'bold' },
});
