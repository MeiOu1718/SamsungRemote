/**
 * SamsungRemote — Root Application Component
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RemoteScreen from './src/screens/RemoteScreen';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RemoteScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
