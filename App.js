import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



  const Stack = createNativeStackNavigator();

import Lista from './Screens/Lista';
import CrearLista from './Screens/CrearLista';
import ActualizarLista from './Screens/ActualizarLista';
import CrearCategoria from './Screens/CrearCategoria';
import Carrito from './Screens/carrito'
import Historial from './Screens/Historial'
import DetallesProductos from './Screens/DetallesProductos'


import CrearUsuarios from './usuarios/CrearUsuarios';

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Lista" component={Lista} />

      <Stack.Screen name="Añadir Producto" component={CrearLista} />
      <Stack.Screen name="ActualizarLista" component={ActualizarLista} />
      <Stack.Screen name='categoria' component={CrearCategoria}/>
      <Stack.Screen name='carrito' component={Carrito}/>

      <Stack.Screen name='Historial' component={Historial}/>
      <Stack.Screen name="DetallesProductos" component={DetallesProductos} />


      <Stack.Screen name='CrearUsuarios' component={CrearUsuarios}/>

    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;