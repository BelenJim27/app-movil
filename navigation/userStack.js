// navigation/UserStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserListScreen from '../screens/Usuarios/UserListScreen';
import UserDetails from '../screens/Usuarios/UserDetails';
import EditUser from '../screens/Usuarios/EditUser';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Usuarios" 
        component={UserListScreen}
         />
      <Stack.Screen name="DetallesUsuario" component={UserDetails} />
      <Stack.Screen name="EditarUsuario" component={EditUser} />
    </Stack.Navigator>
  );
}
