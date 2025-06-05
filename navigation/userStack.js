// navigation/UserStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserListScreen from '../screens/Usuarios/UserListScreen';
import UserDetails from '../screens/Usuarios/UserDetails';
import EditUser from '../screens/Usuarios/EditUser';
import CreateUserScreen from '../screens/Auth/CreateUserScreen';
import ProfileScreen from '../screens/Usuarios/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator  >
      <Stack.Screen 
        name="Usuarios" 
        component={UserListScreen}
        options={{title:'', headerShown: false }}
         />
      <Stack.Screen name="DetallesUsuario" component={UserDetails} />
      <Stack.Screen name="EditarUsuario" component={EditUser} />
      <Stack.Screen 
        name="CrearUsuario" 
        component={CreateUserScreen} // Asumiendo que EditUser maneja tanto la edición como la creación
        options={{ title: 'Crear Usuario' }}
      />
      <Stack.Screen 
        name="CerrarSesion" 
        component={ProfileScreen} 
        options={{ title: 'Cerrar sesion' }}
      />
    </Stack.Navigator>
  );
}
