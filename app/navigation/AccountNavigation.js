
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from '../screens/WelcomeScreen';
import ViewImageScreen from '../screens/ViewImageScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import LessonScreen from '../screens/LessonScreen';
import AccountScreen from '../screens/AccountScreen';

const Stack = createStackNavigator();
const AccountNavigator = () => (
    <Stack.Navigator initialRouteName="Home"
    screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#841584' },
        headerTintColor: 'white'
    }}>
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
);

export default AccountNavigator;