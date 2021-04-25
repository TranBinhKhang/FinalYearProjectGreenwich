import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";


import WelcomeScreen from '../screens/WelcomeScreen';
import ViewImageScreen from '../screens/ViewImageScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SuccessNavigator from './SuccessNavigation';
import AccountNavigator from './AccountNavigation';
import MovieListNavigator from './MovieListNavigation';




const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{
    headerTitleAlign: 'center',
    headerStyle: { backgroundColor: '#841584' },
    headerTintColor: 'white'
}}
  tabBarOptions={{
    activeBackgroundColor: '#841584',
  activeTintColor: 'white',
  inactiveBackgroundColor: '#841584'
  }}
>
    <Tab.Screen
      name="Home"
      component={SuccessNavigator}
      options={{
        tabBarIcon: () => (
          <MaterialCommunityIcons name="home" color='white' size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="Movie List"
      component={MovieListNavigator}
      options={{
        tabBarIcon: () => (
          <MaterialCommunityIcons name="movie" color='white' size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="Account"
      component={AccountNavigator}
      options={{
        tabBarIcon: () => (
          <MaterialCommunityIcons name="account" color='white' size={24} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;