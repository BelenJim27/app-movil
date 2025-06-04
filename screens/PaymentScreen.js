import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useCart } from '../context/CartContext';

const PaymentScreen = ({ navigation }) => {
  const { cartItems, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePayment = () => {
    // Lógica para procesar el pago
    console.log('Procesando pago con método:', paymentMethod);
    clearCart();
    navigation.navigate('Inicio');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Método de Pago</Text>
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      
      {/* Aquí irían los diferentes métodos de pago */}
      <Button 
        title="Pagar con Tarjeta" 
        onPress={() => setPaymentMethod('tarjeta')} 
      />
      <Button 
        title="Pagar en Efectivo" 
        onPress={() => setPaymentMethod('efectivo')} 
      />
      
      <Button 
        title="Confirmar Pago" 
        onPress={handlePayment} 
        disabled={!paymentMethod}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  total: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default PaymentScreen;