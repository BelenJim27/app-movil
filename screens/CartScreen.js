import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../services/api';
import { CardField } from '@stripe/stripe-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';
export default function CartScreen({ route, navigation }) {
  const [cardDetails, setCardDetails] = useState();
  const stripe = useStripe();
  const { cart: initialCart } = route.params || { cart: [] };
  const [cart, setCart] = useState(initialCart);
  const shippingCost = 5; // Costo de envío fijo

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost;
  };

  const handleCheckout = async () => {
    try {
      
      // Primero validar que haya suficiente existencia
      const validationPromises = cart.map(item => 
        API.get(`/productos/${item._id}`)
          .then(res => {
            if (res.data.success && res.data.producto.existencia < item.quantity) {
              return { valid: false, product: item };
            }
            return { valid: true };
          })
      );

      const validationResults = await Promise.all(validationPromises);
      const invalidItems = validationResults.filter(result => !result.valid);

      if (invalidItems.length > 0) {
        Alert.alert(
          'Existencia insuficiente',
          `Algunos productos no tienen suficiente existencia. Por favor ajusta las cantidades.`,
          [{ text: 'OK' }]
        );
        return;
      }
 // TOTAL EN CENTAVOS
 const amount = Math.round(calculateTotal() * 100);
 // Crear PaymentIntent desde el backend
 const response = await API.post('/create-payment-intent', { amount });
 const clientSecret = response.data.clientSecret;

 // Confirmar el pago
 const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
   paymentMethodType: 'Card',
 });

 if (error) {
   Alert.alert('Error', error.message);
   return;
 }
 if (paymentIntent && paymentIntent.status === 'Succeeded') {
  Alert.alert('Pago exitoso', 'Tu pedido ha sido procesado correctamente.');

  // Actualizar existencias y limpiar carrito como ya haces
  const updatePromises = cart.map(async (item) => {
    try {
      const res = await API.get(`/productos/${item._id}`);
      const productoActual = res.data.producto;
      const nuevaExistencia = productoActual.existencia - item.quantity;

      return API.put(`/productos/${item._id}`, {
        ...productoActual,
        existencia: nuevaExistencia
      });
    } catch (err) {
      console.error(`Error al actualizar el producto ${item._id}:`, err);
    }
  });

  await Promise.all(updatePromises);
  setCart([]);
  navigation.goBack();
}

} catch (error) {
console.error('Error durante el pago:', error);
Alert.alert('Error', 'Ocurrió un error al procesar el pago.');
}
};
  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueShoppingText}>Seguir comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image 
                  source={{ uri: `http://192.168.1.88:5000/${item.imagenes[0]}` }} 
                  style={styles.cartItemImage} 
                />
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName} numberOfLines={2}>{item.nombre}</Text>
                  <Text style={styles.cartItemPrice}>${item.precio.toFixed(2)} c/u</Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.cartItemTotal}>
                  <Text style={styles.cartItemTotalText}>
                    ${(item.precio * item.quantity).toFixed(2)}
                  </Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item._id)}
                  >
                    <Ionicons name="trash" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Envío</Text>
              <Text style={styles.summaryValue}>${shippingCost.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryTotal}>${calculateTotal().toFixed(2)}</Text>
            </View>
            <CardField
  postalCodeEnabled={false}
  placeholder={{
    number: '4242 4242 4242 4242',
  }}
  cardStyle={{
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  }}
  style={{
    width: '100%',
    height: 50,
    marginVertical: 10,
  }}
  onCardChange={(cardDetails) => {
    setCardDetails(cardDetails);
  }}
/>

            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Pagar ahora</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueShoppingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  cartItemTotal: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  cartItemTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  removeButton: {
    padding: 5,
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});