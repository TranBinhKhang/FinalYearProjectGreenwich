
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';

import WelcomeScreen from '../screens/WelcomeScreen';
import ViewImageScreen from '../screens/ViewImageScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();
const AppNavigator = () => (
    <Stack.Navigator initialRouteName="Welcome Screen" screenOptions={{
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#841584' },
      headerTintColor: 'white'
  }}>
        <Stack.Screen name="Welcome Screen" component={WelcomeScreen} options={{
          headerShown: false,
          headerStyle: { backgroundColor: '#841584' }
        }}/>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

export default AppNavigator;