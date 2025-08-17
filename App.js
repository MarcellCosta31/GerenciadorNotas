import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AnoScreen from './screens/AnoScreen';
import MateriaScreen from './screens/MateriaScreen';
import ResumoScreen from './screens/ResumoScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Ano" component={AnoScreen} />
        <Stack.Screen name="Materia" component={MateriaScreen} />
        <Stack.Screen name="Resumo" component={ResumoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
