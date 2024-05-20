import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const CustomSplashScreen = () => {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.appName}>ChatLife</Text>
      <Text style={styles.footer}>Developed by DEV-26</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171E26',
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E1C5',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 16,
    color: 'white',
  },
});

export default CustomSplashScreen;
