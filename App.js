import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ChatScreen from './screens/ChatScreen';
import ChatListScreen from './screens/ChatListScreen';
import AddContactScreen from './screens/AddContactScreen';
import SettingsScreen from './screens/SettingsScreen.js';
import { AppRegistry } from 'react-native';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import CustomSplashScreen from './screens/CustomSplashScreen.js';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

AppRegistry.registerComponent('ChatLife', () => App);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00E1C5',
  },
};

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={ChatListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddContactScreen" component={AddContactScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const AuthenticatedUserContext = createContext({});
const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    );
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? <ChatStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    </PaperProvider>
  );
};

export default App;
