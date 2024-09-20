import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import DatabaseService from './src/services/DatabaseService';
import 'react-native-gesture-handler';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('Initializing database...');
        await DatabaseService.initDatabase();
        console.log('Database initialized successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize database', error);
        Alert.alert('错误', '初始化数据库失败，请重启应用。');
      }
    };

    initDb();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
