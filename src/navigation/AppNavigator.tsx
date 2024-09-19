import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PasswordListScreen from '../screens/PasswordListScreen';
import AddEditPasswordScreen from '../screens/AddEditPasswordScreen';
import PasswordDetailScreen from '../screens/PasswordDetailScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F5F5F5' }
        }}
      >
        <Stack.Screen name="PasswordList" component={PasswordListScreen} />
        <Stack.Screen name="AddEditPassword" component={AddEditPasswordScreen} />
        <Stack.Screen name="PasswordDetail" component={PasswordDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
