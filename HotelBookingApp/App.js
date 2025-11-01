import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from './screens/SearchScreen';
import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import ChatbotScreen from './screens/ChatbotScreen';

import colors from './constants/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Hotel Search' }}
        />
        <Stack.Screen
          name="List"
          component={ListScreen}
          options={{ title: 'Available Properties' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailScreen}
          options={{ title: 'Hotel Details' }}
        />
        <Stack.Screen 
          name="Chatbot"
          component={ChatbotScreen}
          options={{ 
            presentation: 'modal',
            title: 'Booking Assistant'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
