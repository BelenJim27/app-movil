// navigation/CategoriasStack.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriasScreen from '../screens/CategoriasScreen';
import ProductosScreen from '../screens/Productos/ProductosScreen';
import DetallesProducto from '../screens/Productos/DetallesProducto';
import EditarProducto from '../screens/Productos/EditarProducto';
import CartScreen from '../screens/Carrito/CarritoScreen';
const Stack = createNativeStackNavigator();

export default function CategoriasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen name="Categorias" component={CategoriasScreen} />
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
        <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Mi Carrito' }} />

      
    </Stack.Navigator>
  );
}
