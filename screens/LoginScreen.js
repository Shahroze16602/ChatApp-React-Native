import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { auth } from '../config/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({ username: false, password: false });
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    if (username === '' || password === '') {
      setError(true);
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
      await signInWithEmailAndPassword(auth, username, password);
      setError(false);
      // navigate to Chats screen after successful login
      navigation.navigate('Chats');
    } catch (error) {
      console.error(error);
      setError(true);
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

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
    setError(false);
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 90}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar barStyle="light-content" />
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.appName}>ChatLife</Text>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, error ? styles.labelError : isFocused.username ? styles.labelFocused : null]}>
            Email
          </Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : isFocused.username ? styles.inputFocused : null]}
            placeholder="Enter your Email"
            placeholderTextColor="#FFFFFF66"
            autoCapitalize="none"
            keyboardType="email-address"
            value={username}
            onChangeText={setUsername}
            onFocus={() => handleFocus('username')}
            onBlur={() => handleBlur('username')}
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
              style={[styles.passwordInput]}
              placeholder="Enter your Password"
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.textLink}>
          <Text style={styles.linkText}>Don't have an account?</Text>
          <Text style={[styles.linkText, { color: "#00E1C5" }]}>Create new account</Text>
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
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
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

export default LoginScreen;
