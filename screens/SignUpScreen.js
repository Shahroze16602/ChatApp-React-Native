import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { auth } from '../config/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { database } from '../config/firebase.js';

const addUser = async (userId, name, email, image) => {
  const newUser = {
    name: name,
    email: email,
    image: image,
  };
  const collectionRef = collection(database, 'users');
  const docRef = doc(collectionRef, userId || undefined);
  setDoc(docRef, newUser)
    .then(() => {
      console.log("Data written successfully");
    })
    .catch((error) => {
      console.error('Error adding document:', error);
    });
};

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({ name: false, email: false, password: false, confirmPassword: false });
  const [error, setError] = useState(false);

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError(true);
      Toast.show({
        type: 'error',
        text1: 'Incomplete Info',
        text2: 'Please fill all fields',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 30,
      });
      return;
    }

    if (password !== confirmPassword) {
      setError(true);
      Toast.show({
        type: 'error',
        text1: 'Password Confirmation Unsuccessful',
        text2: 'Password and Confirm Password must be same',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 30,
      });
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await addUser(user.uid, name, email, "");
        setError(false);
        // navigation.navigate('Login');
      })
      .catch((error) => {
        console.log(error.message);
        setError(true);
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: error.message,
          visibilityTime: 3000,
          autoHide: true,
          bottomOffset: 30,
        });
      });
  };

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
    setError(false);
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar barStyle="light-content" />
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.appName}>ChatLife</Text>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, error ? styles.labelError : isFocused.name ? styles.labelFocused : null]}>
            Username
          </Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : isFocused.name ? styles.inputFocused : null]}
            placeholder="Enter your Username"
            placeholderTextColor="#FFFFFF66"
            value={name}
            onChangeText={setName}
            onFocus={() => handleFocus('name')}
            onBlur={() => handleBlur('name')}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, error ? styles.labelError : isFocused.email ? styles.labelFocused : null]}>
            Email
          </Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : isFocused.email ? styles.inputFocused : null]}
            placeholder="Enter your Email"
            placeholderTextColor="#FFFFFF66"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, error ? styles.labelError : isFocused.password ? styles.labelFocused : null]}>
            Password
          </Text>
          <View style={[
            styles.passwordContainer, 
            error ? styles.inputError : isFocused.password ? styles.inputFocused : null
          ]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Atleast 6 characters"
              placeholderTextColor="#FFFFFF66"
              autoCapitalize="none"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={14} color="#00E1C5" style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, error ? styles.labelError : isFocused.confirmPassword ? styles.labelFocused : null]}>
            Confirm Password
          </Text>
          <View style={[
            styles.passwordContainer, 
            error ? styles.inputError : isFocused.confirmPassword ? styles.inputFocused : null
          ]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Atleast 6 characters"
              placeholderTextColor="#FFFFFF66"
              autoCapitalize="none"
              secureTextEntry={!passwordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={() => handleBlur('confirmPassword')}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon name={passwordVisible ? 'eye-slash' : 'eye'} size={14} color="#00E1C5" style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.textLink}>
          <Text style={styles.linkText}>Already have an account?</Text>
          <Text style={[styles.linkText, {color: "#00E1C5", paddingStart: 5}]}>Log In</Text>
        </TouchableOpacity>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#121212',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00E1C5',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    left: 5,
    top: -5,
    color: 'white',
    fontSize: 14,
  },
  labelFocused: {
    color: '#00E1C5',
  },
  labelError: {
    color: '#E02424',
  },
  input: {
    backgroundColor: '#FFFFFF11',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    color: 'white',
    borderWidth: 1,
    borderColor: '#FFFFFF66',
  },
  inputFocused: {
    borderColor: '#00E1C5',
  },
  inputError: {
    borderColor: '#E02424',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF11',
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF66',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    color: 'white',
  },
  eyeIcon: {
    paddingHorizontal: 15,
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
    flexDirection: 'row',
    marginTop: 20,
  },
  linkText: {
    color: 'white',
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default SignUpScreen;
