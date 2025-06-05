// navigation/MainStack.js
import React from 'react';
import { TouchableOpacity} from 'react-native';
import HeaderSearchInput from '../components/HeaderSearchInput';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductosScreen from '../screens/Productos/ProductosScreen';
import DetallesProducto from '../screens/Productos/DetallesProducto';
import EditarProducto from '../screens/Productos/EditarProducto';
import CategoriasScreen from '../screens/CategoriasScreen';
import CartScreen from '../screens/CartScreen';
import { useNavigation } from '@react-navigation/native';
import CartIcon from '../components/CartIcon';
const Stack = createNativeStackNavigator();
import BusquedaScreen from '../screens/BusquedaScreen';
export default function MainStack() {
  return (
    //aqui debe ir el boton de salir
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <HeaderSearchInput />, // Aquí se muestra el buscador en el header
        headerBackTitleVisible: false,
        headerTintColor: '#003',
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
        name="Busqueda"
        component={BusquedaScreen} // Asumiendo que ProductosScreen maneja la búsqueda
        options={{ title: 'Buscar Productos' }}
      />
      <Stack.Screen
        name="EditarProducto"
        component={EditarProducto}
        options={{ title: 'Editar Producto' }}
      />
       <Stack.Screen
        name="Carrito"
        component={CartScreen}
        options={{ title: 'Editar Producto' }}
      />
    </Stack.Navigator>
  );
}