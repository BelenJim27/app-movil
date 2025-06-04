// navigation/BottomTabsNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CartScreen from '../screens/CartScreen';
import MainStack from './MainStack';
import userStack from './userStack'; // Asegúrate de que este path sea correcto

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ocultamos el header para manejar los títulos dentro de cada stack
        tabBarActiveTintColor: '#000',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Carrito') iconName = 'cart';
          else if (route.name === 'Usuarios') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={MainStack} // MainStack como pantalla de la pestaña
      />
      <Tab.Screen 
        name="Carrito" 
        component={CartScreen} 
      />
      {isAdmin && (
        <Tab.Screen 
          name="Usuarios" 
          component={userStack} 
        />
      )}
    </Tab.Navigator>
  );
}