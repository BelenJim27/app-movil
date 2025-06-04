// screens/CartScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../services/api';
import { CardField } from '@stripe/stripe-react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useCart } from '../context/CartContext';
import { useRoute, useNavigation } from '@react-navigation/native';


export default function CartScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const stripe = useStripe();
    const navigation = useNavigation();
  
  const shippingCost = 5; // Costo de envío fijo

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost;
  };

  const validateCart = async () => {
    try {
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
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validando carrito:', error);
      Alert.alert('Error', 'Ocurrió un error al validar tu carrito.');
      return false;
    }
  };

  const handleCheckout = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Por favor completa los datos de tu tarjeta');
      return;
    }

    setIsProcessing(true);
    
    try {
      // TOTAL EN CENTAVOS
      const amount = Math.round(calculateTotal() * 100);
      const response = await API.post('/create-payment-intent', { amount });
      const clientSecret = response.data.clientSecret;

      const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'Succeeded') {
        // Actualizar existencias
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
        
        Alert.alert('Pago exitoso', 'Tu pedido ha sido procesado correctamente.', [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              setModalVisible(false);
              navigation.goBack();
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error durante el pago:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  const openPaymentModal = async () => {
    const isValid = await validateCart();
    if (isValid) {
      setModalVisible(true);
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
                <TouchableOpacity 
                  onPress={() => navigation.navigate('DetallesProducto', { producto: item })}
                >
                  <Image 
                    source={{ uri: `http://192.168.137.121:5000/${item.imagenes[0]}` }} 
                    style={styles.cartItemImage} 
                  />
                </TouchableOpacity>
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

            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={openPaymentModal}
            >
              <Text style={styles.checkoutButtonText}>Ir a pagar</Text>
            </TouchableOpacity>
          </View>

          {/* Modal de pago */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Información de pago</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.paymentDetails}>
                  <Text style={styles.totalText}>Total a pagar: ${calculateTotal().toFixed(2)}</Text>
                  
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
                      marginVertical: 20,
                    }}
                    onCardChange={(cardDetails) => {
                      setCardDetails(cardDetails);
                    }}
                  />
                  
                  <TouchableOpacity 
                    style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                    onPress={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Text style={styles.payButtonText}>Procesando...</Text>
                    ) : (
                      <Text style={styles.payButtonText}>Pagar ahora</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 20,
  },
  continueShoppingButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 5,
  },
  continueShoppingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  cartItemTotal: {
    alignItems: 'flex-end',
  },
  cartItemTotalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeButton: {
    marginTop: 5,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
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
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  checkoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  paymentDetails: {
    width: '100%',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});