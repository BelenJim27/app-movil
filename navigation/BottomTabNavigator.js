// navigation/BottomTabsNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // puedes usar MaterialIcons si prefieres

import DashboardScreen from '../screens/Dashboard';
import CartScreen from '../screens/CartScreen';
import UserStack from './userStack';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
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
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Carrito" component={CartScreen} />
      {isAdmin && <Tab.Screen name="Usuarios" component={UserStack} />}
    </Tab.Navigator>
  );
}
