import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/Dashboard';
import { useAuth } from '../context/AuthContext';
import UserStack from './userStack';
import CategoriasStack from './CategoriasStack';
import CartScreen from '../screens/Carrito/CarritoScreen';
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Drawer.Navigator initialRouteName="Inicio">
      <Drawer.Screen name="Inicio" component={DashboardScreen}  options={{ title: 'Inicio' }}/>
      <Drawer.Screen name="Categorias" component={CategoriasStack} options={{ title: 'Productos' }} />

<Drawer.Screen 
  name="Carrito" 
  component={CartScreen} 
  options={{ title: 'Mi Carrito' }} 
/>
      {isAdmin && (
        <>
          <Drawer.Screen name="Usuarios" component={UserStack}  options={{ title: 'Usuarios' }}/>
        </>
      )}
    </Drawer.Navigator>
  );
}