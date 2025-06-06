// navigation/BottomTabsNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import ProfileScreen from '../screens/Usuarios/ProfileScreen';

import CartScreen from '../screens/CartScreen';
import MainStack from './MainStack';
import userStack from './userStack'; // Asegúrate de que este path sea correcto
import { useCart } from '../context/CartContext';
import CartIcon from '../components/CartIcon';
import AddProductScreen from '../screens/Productos/AddProductScreen';
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // Ocultamos el header para manejar los títulos dentro de cada stack
        tabBarActiveTintColor: '#000',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Carrito') iconName = 'cart';
          else if (route.name === 'Usuarios') iconName = 'add';
          else if (route.name === 'Agregar') iconName = 'add-circle';

          else if (route.name === 'Perfil') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={MainStack} // MainStack como pantalla de la pestaña
        options={{title:'',headerShown: false}}
      />
      <Tab.Screen 
        name="Carrito" 
        component={CartScreen}
        options={{
          tabBarIcon: ({ color }) => <CartIcon color={color} />,
          tabBarLabel: 'Carrito',
        }}
      />
      {isAdmin && (
        <Tab.Screen 
          name="Usuarios" 
          component={userStack} 
        />
      )}
    
      <Tab.Screen 
      name="Perfil" 
      component={ProfileScreen} 
    />
          {isAdmin && (

     <Tab.Screen 
      name="Agregar" 
      component={AddProductScreen} 
    />  )}

    </Tab.Navigator>
  );
}