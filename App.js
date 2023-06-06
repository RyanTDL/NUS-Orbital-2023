import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './App/Signing_In/LogIn'
import SignUp from './App/Signing_In/SignUp'
import Welcome from './App/Signing_In/Welcome'
import HomeScreen from './App/Main_Page/Home';
import DailyLog from './App/Main_Page/DailyLog'
import WeeklyActivity from './App/Main_Page/WeeklyActivity';
import FriendsList from './App/Main_Page/FriendsList';


const Stack= createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'none'}}>
        <Stack.Screen name='Welcome Page' component={Welcome}/>
        <Stack.Screen name='Sign Up Page' component={SignUp}/>
        <Stack.Screen name='Log In Page' component={LogIn}/> 
        <Stack.Screen name='Home Screen' component={HomeScreen}/> 
        <Stack.Screen name='Daily Log' component={DailyLog}/> 
        <Stack.Screen name='Weekly Activity' component={WeeklyActivity}/> 
        <Stack.Screen name='Friends List' component={FriendsList}/> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
