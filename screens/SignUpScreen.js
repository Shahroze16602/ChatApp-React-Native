import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { auth } from '../FirebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    // const navigation = useNavigation();

    const handleRegister = () => {
      if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Password Confirmation Unsuccessful',
          text2: 'Password and Confirm Password must be same',
          visibilityTime: 3000,
          autoHide: true,
          bottomOffset: 30,
        });
        return
      }
  
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          Alert.alert("Message", "Successfully created user with email and password.");
          navigation.navigate('Chats')
        })
        .catch((error) => {
          //  Alert.alert("Error", error.message);
          console.log(error.message);
        });
    };
  
    return (
      <View style={[styles.container, { backgroundColor: '#171E26' }]}>
        <StatusBar barStyle="light-content" />
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={[styles.title, { color: '#00E1C5' }]}>Sign Up</Text>
        {/* <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
        /> */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            autoCapitalize="none"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="#999" style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            autoCapitalize="none"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={20} color="#999" style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.textLink}>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
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

  export default SignUpScreen;