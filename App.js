import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/Auth/LoginScreen';
import DrawerNavigator from './navigation/DrawerNavigator';
import Toast from 'react-native-toast-message';
import ProductosScreen from './screens/Productos/ProductosScreen';
import CreateUserScreen from './screens/Auth/CreateUserScreen';
import DetallesProducto from './screens/Productos/ProductosScreen';
import EditarProducto from './screens/Productos/EditarProducto';

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
    </Stack.Navigator>
  );
}
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerShown: true,
      }}
    >
      {/* Este es el Drawer, se usa como "pantalla principal" */}
      <Stack.Screen
        name="MainDrawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      {/* Este es el stack adicional para navegación profunda */}
      <Stack.Screen
        name="ProductosPorCategoria"
        component={ProductosScreen}
        options={({ route }) => ({
          title: route.params?.categoria || 'Productos',
        })}
      />
      <Stack.Screen
        name="DetallesProducto"
        component={DetallesProducto}// Asegúrate de que este sea el componente correcto para detalles
        options={({ route }) => ({
          title: route.params?.producto?.nombre || 'Detalles del Producto',
        })}
      />
      <Stack.Screen
        name="EditarProducto"
        component={EditarProducto} // Asegúrate de que este sea el componente correcto para editar
        options={{ title: 'Editar Producto' }}
      />
    </Stack.Navigator>
  );
}


function AppContent() {
  const { user } = useAuth();
  return (
    <>
      <NavigationContainer>
        {user ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
