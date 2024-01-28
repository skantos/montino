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


function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Crear Lista" component={CrearLista} />
      <Stack.Screen name="ActualizarLista" component={ActualizarLista} />
      <Stack.Screen name="Lista" component={Lista} />
      <Stack.Screen name='categoria' component={CrearCategoria}/>
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