import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './App/LogIn'
import SignUp from './App/SignUp'
import Welcome from './App/Welcome'


const Stack= createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Welcome Page' component={Welcome}/>
        <Stack.Screen name='Sign Up Page' component={SignUp}/>
        <Stack.Screen name='Log In Page' component={LogIn}/> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
