import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import DatabaseService from './src/services/DatabaseService';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        await DatabaseService.initDatabase();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize database', error);
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

  return <AppNavigator />;
}
