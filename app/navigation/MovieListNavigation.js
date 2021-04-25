
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import MovieListScreen from '../screens/MovieListScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';


const Stack = createStackNavigator();
const MovieListNavigator = () => ( //This was supposed to be named AppNavigation, but I already accidentally used AppNavigation for the Login stack
    <Stack.Navigator initialRouteName="Movie List"
    screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#841584' },
        headerTintColor: 'white'
    }}>
      <Stack.Screen name="Movie List" component={MovieListScreen} />
      <Stack.Screen name="Movie Detail" component={MovieDetailScreen} />
    </Stack.Navigator>
);

export default MovieListNavigator;