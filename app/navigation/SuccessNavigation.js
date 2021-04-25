
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
import TestScreen from '../screens/TestScreen';
import CongratScreen from '../screens/CongratScreen';
import CommentScreen from '../screens/CommentScreen';
import MovieListScreen from '../screens/MovieListScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';


const Stack = createStackNavigator();
const SuccessNavigator = () => ( //This was supposed to be named AppNavigation, but I already accidentally used AppNavigation for the Login stack
    <Stack.Navigator initialRouteName="Home"
    screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#841584' },
        headerTintColor: 'white'
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="Test" component={TestScreen} />
      <Stack.Screen name="Lesson Completed" component={CongratScreen} />
      <Stack.Screen name="Comment" component={CommentScreen} />
      <Stack.Screen name="Movie List" component={MovieListScreen} />
    </Stack.Navigator>
);

export default SuccessNavigator;