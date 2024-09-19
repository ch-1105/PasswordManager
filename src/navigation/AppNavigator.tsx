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
      <Stack.Navigator>
        <Stack.Screen name="PasswordList" component={PasswordListScreen} options={{ title: '密码列表' }} />
        <Stack.Screen name="AddEditPassword" component={AddEditPasswordScreen} options={{ title: '添加/编辑密码' }} />
        <Stack.Screen name="PasswordDetail" component={PasswordDetailScreen} options={{ title: '密码详情' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
