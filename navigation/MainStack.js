// navigation/MainStack.js
import React from 'react';
import { TouchableOpacity} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductosScreen from '../screens/Productos/ProductosScreen';
import DetallesProducto from '../screens/Productos/DetallesProducto';
import EditarProducto from '../screens/Productos/EditarProducto';
import CategoriasScreen from '../screens/CategoriasScreen';
import { useNavigation } from '@react-navigation/native';
import CartIcon from '../components/CartIcon';
const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    //aqui debe ir el boton de salir
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: '#000',
       
      }}
    >
      <Stack.Screen
        name="Categorias"
        component={CategoriasScreen}
        options={{ title: 'Categorías' }}
      />
      <Stack.Screen
        name="ProductosPorCategoria"
        component={ProductosScreen}
        options={({ route }) => ({
          title: route.params?.categoria || 'Productos',
        })}
      />
      <Stack.Screen
        name="DetallesProducto"
        component={DetallesProducto}
        options={({ route }) => ({
          title: route.params?.producto?.nombre || 'Detalles',
        })}
      />
      <Stack.Screen
        name="EditarProducto"
        component={EditarProducto}
        options={{ title: 'Editar Producto' }}
      />
    </Stack.Navigator>
  );
}