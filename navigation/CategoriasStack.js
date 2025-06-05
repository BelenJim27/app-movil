// navigation/CategoriasStack.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriasScreen from '../screens/CategoriasScreen';
import ProductosScreen from '../screens/Productos/ProductosScreen';
import DetallesProducto from '../screens/Productos/DetallesProducto';
import EditarProducto from '../screens/Productos/EditarProducto';
import CartScreen from '../screens/CartScreen';
const Stack = createNativeStackNavigator();

export default function CategoriasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <HeaderSearchInput />, // Aquí se muestra el buscador en el header
        headerBackTitleVisible: false,
        headerTintColor: '#003',
      }}
    >
      <Stack.Screen name="Categorias" component={CategoriasScreen} />
      <Stack.Screen name="Carrito" component={CartScreen} />
      <Stack.Screen name="Busqueda" component={BusquedaScreen} />
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
              title: route.params?.producto?.nombre || 'Detalles del Producto',
            })}
        />  
        <Stack.Screen name="EditarProducto" component={EditarProducto} />
        
      
    </Stack.Navigator>
  );
}
