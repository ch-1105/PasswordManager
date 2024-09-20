import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PasswordListScreen from '../screens/PasswordListScreen';
import AddEditPasswordScreen from '../screens/AddEditPasswordScreen';
import PasswordDetailScreen from '../screens/PasswordDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PasswordList" component={PasswordListScreen} />
      <Stack.Screen name="AddEditPassword" component={AddEditPasswordScreen} />
      <Stack.Screen name="PasswordDetail" component={PasswordDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
