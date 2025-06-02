import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Importa useAuth
import Icon from 'react-native-vector-icons/FontAwesome';
import API from '../../services/api';

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart, updateQuantity, addToCart } = useCart();
  const { user } = useAuth(); // Obtén el usuario del contexto de autenticación
  
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.precio) || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  // Función para manejar el checkout
  const handleCheckout = async () => {
    try {
      // Verificar autenticación
      if (!user || !user.token) {
        Alert.alert('Error', 'Debes iniciar sesión para finalizar la compra');
        navigation.navigate('Login');
        return;
      }

      // Verificar que hay productos en el carrito
      if (cartItems.length === 0) {
        Alert.alert('Error', 'No hay productos en el carrito');
        return;
      }

      // Decrementar existencias para cada producto
      const updatePromises = cartItems.map(async (item) => {
        try {
          const response = await API.put(
            `/productos/${item._id}/decrement`, 
            { quantity: item.quantity },
            {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            }
          );
          
          if (!response.data.success) {
            throw new Error(response.data.message || 'Error al actualizar existencias');
          }
        } catch (error) {
          console.error(`Error al actualizar producto ${item._id}:`, error);
          throw error;
        }
      });

      // Ejecutar todas las actualizaciones
      await Promise.all(updatePromises);

      // Limpiar carrito y mostrar éxito
      clearCart();
      Alert.alert('Éxito', 'Compra realizada con éxito');
      
    } catch (error) {
      console.error('Error en checkout:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 
        error.message || 
        'No se pudo completar la compra'
      );
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1);
    } else {
      removeFromCart(item._id);
    }
  };

  const handleIncrease = (item) => {
    addToCart(item);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('DetallesProducto', { producto: item })}>
        <Image 
          source={{ uri: `http://192.168.1.65:5000/${item.imagenes[0]}` }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productPrice}>${parseFloat(item.precio).toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => handleDecrease(item)}
            style={styles.quantityButton}
          >
            <Icon name="minus" size={14} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => handleIncrease(item)}
            style={styles.quantityButton}
          >
            <Icon name="plus" size={14} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => removeFromCart(item._id)}
        style={styles.deleteButton}
      >
        <Icon name="trash" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Tu Carrito</Text>
        
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Icon name="shopping-cart" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              scrollEnabled={false}
            />
            
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envío:</Text>
                <Text style={styles.summaryValue}>$5.00</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total:</Text>
                <Text style={styles.totalValue}>${(total + 5).toFixed(2)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      
      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout} // Usamos la función definida
        >
          <Text style={styles.checkoutText}>Finalizar Compra</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Estilos permanecen igual
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
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
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3ca926',
  },
  checkoutButton: {
    backgroundColor: '#c880de',
    padding: 15,
    borderRadius: 5,
    margin: 15,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});