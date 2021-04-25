
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
import AdminAddClipScreen from '../screens/AdminAddClipScreen';
import AdminAddMovieScreen from '../screens/AdminAddMovieScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import AdminClipListScreen from '../screens/AdminClipListScreen';
import AdminClipDetailScreen from '../screens/AdminClipDetailScreen';
import AdminMovieListScreen from '../screens/AdminMovieListScreen';
import AdminMovieDetailScreen from '../screens/AdminMovieDetailScreen';
import AdminLessonDetailScreen from '../screens/AdminLessonDetailScreen';
import AdminAddLessonScreen from '../screens/AdminAddLessonScreen';
import AdminLessonListScreen from '../screens/AdminLessonListScreen';
import TestScreen from '../screens/TestScreen';
import AdminTestListScreen from '../screens/AdminTestListScreen';
import AdminTestDetailScreen from '../screens/AdminTestDetailScreen';
import AdminReportScreen from '../screens/AdminReportScreen';


const Stack = createStackNavigator();
const AdminNavigator = () => (
    <Stack.Navigator initialRouteName="Admin Home"
    screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#841584' },
        headerTintColor: 'white'
    }}>
      <Stack.Screen name="Admin Home" component={AdminHomeScreen} />
      <Stack.Screen name="Admin Add Clip" component={AdminAddClipScreen} />
      <Stack.Screen name="Admin Clip List" component={AdminClipListScreen} />
      <Stack.Screen name="Admin Clip Detail" component={AdminClipDetailScreen} />
      <Stack.Screen name="Admin Movie Add" component={AdminAddMovieScreen} />
      <Stack.Screen name="Admin Movie List" component={AdminMovieListScreen} />
      <Stack.Screen name="Admin Movie Detail" component={AdminMovieDetailScreen} />
      <Stack.Screen name="Admin Lesson Add" component={AdminAddLessonScreen} />
      <Stack.Screen name="Admin Lesson List" component={AdminLessonListScreen} />
      <Stack.Screen name="Admin Lesson Detail" component={AdminLessonDetailScreen} />
      <Stack.Screen name="Admin Test List" component={AdminTestListScreen} />
      <Stack.Screen name="Admin Test Detail" component={AdminTestDetailScreen} />
      <Stack.Screen name="Admin Report" component={AdminReportScreen} />
    </Stack.Navigator>
);

export default AdminNavigator;