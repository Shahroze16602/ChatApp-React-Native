import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { auth } from '../FirebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Credentials',
        text2: 'Please enter username and password',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 30,
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      // navigate to Chats screen after successful login
      navigation.navigate('Chats');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message,
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 30,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#171E26' }]}>
      <StatusBar barStyle="light-content" />
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={[styles.title, { color: '#00E1C5' }]}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#999"
          autoCapitalize="none"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="#999" style={styles.eyeIcon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.textLink}>
        <Text style={styles.linkText}>Do not have an account? Create one</Text>
      </TouchableOpacity>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      backgroundColor: '#2C3848',
      width: '100%',
      padding: 15,
      marginBottom: 20,
      borderRadius: 5,
      color: 'white',
    },
    button: {
      backgroundColor: '#00E1C5',
      width: '100%',
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    textLink: {
      marginTop: 10,
    },
    linkText: {
      color: 'white',
      textAlign: 'center',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2C3848',
      width: '100%',
      borderRadius: 5,
      marginBottom: 20,
    },
    passwordInput: {
      flex: 1,
      padding: 15,
      color: 'white',
    },
    eyeIcon: {
      padding: 15,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
  });

export default LoginScreen;
