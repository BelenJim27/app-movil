import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/Auth/LoginScreen';
import Toast from 'react-native-toast-message';
import CreateUserScreen from './screens/Auth/CreateUserScreen';
import { StripeProvider } from '@stripe/stripe-react-native';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { CartProvider } from './context/CartContext';
import ProfileScreen from './screens/Usuarios/ProfileScreen';


const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Registro"
        component={CreateUserScreen} // Aquí deberías tener un componente de registro
        options={{ title: 'Registro' }}
      />
      <Stack.Screen
        name="Logout"
        component={ProfileScreen} // Asumiendo que CreateUserScreen maneja tanto la creación como la edición
        options={{ title: 'Carrar sesion' }}
      />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { user } = useAuth();
  return (
    <>
      <NavigationContainer>
        {user ? <BottomTabNavigator /> : <AuthStack />}
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default function App() {
  return (
     
    <AuthProvider>
      <CartProvider>
        <StripeProvider
          publishableKey="pk_test_51RVT7WPt8YfLrb17pAT5PbSGpVzy0wQz8BdCWO5CUE1BAFNvB92uBlmTjxZTWsn9MnxRbiIkVzRefyyso0BdiqSO00qfabh95N"
        >
        <AppContent />
        </StripeProvider>
      </CartProvider>
    </AuthProvider>   
  );
}
