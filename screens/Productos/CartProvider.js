import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './screens/Productos/CartContext'; // Ajusta esta ruta

import AppNavigator from './navigation'; // o como se llame tu navegación principal

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}
