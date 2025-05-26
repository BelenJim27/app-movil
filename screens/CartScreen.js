import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await API.get('/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data.items);
      calculateTotal(response.data.items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'No se pudieron cargar los items del carrito');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => {
      return acc + (item.product.precio * item.quantity);
    }, 0);
    setTotal(sum);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = await AsyncStorage.getItem('token');
      await API.put(`/cart/${itemId}`, { quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await API.delete(`/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await API.post('/cart/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Éxito', 'Compra realizada con éxito');
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert('Error', 'No se pudo completar la compra');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.product.url?.[0] || 'https://via.placeholder.com/150' }} 
        style={styles.productImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.product.nombre}</Text>
        <Text style={styles.productPrice}>${item.product.precio?.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => updateQuantity(item._id, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={20} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => updateQuantity(item._id, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => removeItem(item._id)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={24} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrito de Compras</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          <TouchableOpacity 
            style={styles.continueShopping}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.continueText}>Continuar comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 10,
    padding: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 16,
    color: '#2e7d32',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  continueShopping: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default CartScreen;