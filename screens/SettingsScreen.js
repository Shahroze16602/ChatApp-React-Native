import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { auth, database } from '../config/firebase.js';
import { updatePassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import images from '../utils/Images.js';
import { Appbar } from 'react-native-paper';

const SettingsScreen = ({ route }) => {
  const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState({ username: false, currentPassword: false, newPassword: false });
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState({ username: false, password: false });
    // const [currentUserId, setCurrentUserId] = useState("");

    const updateUsername = async (newUsername) => {
        const user = auth.currentUser;
        if (user) {
            // await updateProfile(user, { displayName: newUsername });
            const userRef = doc(database, 'users', user.uid);
            await updateDoc(userRef, { name: newUsername });
            console.log("Username updated successfully");
        }
    };

    // const fetchUsername = () => {
    //     console.log(currentUserId);
    //     if (currentUserId) {
    //         const userRef = doc(database, 'users', currentUserId);
    //         getDoc(userRef).then((user) => {
    //             if (user.exists) {
    //                 const userData = user.data();
    //                 setUsername(userData.name); // Assuming "name" field stores the username
    //             } else {
    //                 console.error('User document not found in database');
    //             }
    //         });
    //     } else {
    //         console.log("User not found");
    //     }
    // };

    const fetchUserId = () => {
        const user = auth.currentUser;
        console.log("UserId: ", user.uid);
        // setCurrentUserId(user.uid);
        // fetchUsername();
        const userRef = doc(database, 'users', user.uid);
        getDoc(userRef).then((user) => {
            if (user.exists) {
                const userData = user.data();
                setUsername(userData.name); // Assuming "name" field stores the username
            } else {
                console.error('User document not found in database');
            }
        });

    };

    useEffect(() => {
        fetchUserId();
    }, []);

    const handleEditUsername = () => {
        setModalVisible({ ...modalVisible, username: true });
        setNewUsername(username);
    }

    const handleUpdateUsername = () => {
        if (!newUsername.trim()) {
            setError(true);
            Toast.show({
                type: 'error',
                text1: 'Invalid Username',
                text2: 'Please enter a valid username',
                visibilityTime: 3000,
                autoHide: true,
                bottomOffset: 30,
            });
            return;
        }

        updateUsername(newUsername)
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Username Updated',
                    text2: 'Your username has been updated successfully',
                    visibilityTime: 3000,
                    autoHide: true,
                    bottomOffset: 30,
                });
                setUsername(newUsername)
                setModalVisible({ ...modalVisible, username: false });
            })
            .catch((error) => {
                console.error('Error updating username:', error);
                setError(true);
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                    text2: error.message,
                    visibilityTime: 3000,
                    autoHide: true,
                    bottomOffset: 30,
                });
            });
    };

    const handleUpdatePassword = () => {
        if (!currentPassword || !newPassword) {
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

        const user = auth.currentUser;
        if (user) {
            updatePassword(user, newPassword)
                .then(() => {
                    Toast.show({
                        type: 'success',
                        text1: 'Password Updated',
                        text2: 'Your password has been updated successfully',
                        visibilityTime: 3000,
                        autoHide: true,
                        bottomOffset: 30,
                    });
                    setModalVisible({ ...modalVisible, password: false });
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                    setError(true);
                    Toast.show({
                        type: 'error',
                        text1: 'Update Failed',
                        text2: error.message,
                        visibilityTime: 3000,
                        autoHide: true,
                        bottomOffset: 30,
                    });
                });
        }
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigation.replace('Login');
            })
            .catch((error) => {
                console.error('Error logging out:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Logout Failed',
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
            <Appbar.Header style={{ backgroundColor: '#121212', borderBottomWidth: 1, borderBottomColor: '#FFFFFF66' }}>
                <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Settings" titleStyle={{ fontWeight: 'bold', fontSize: 24, color: '#00E1C5' }} />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.card}>
                    <Image source={images.profile2} style={styles.profile} />
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{username}</Text>
                        <TouchableOpacity onPress={handleEditUsername}>
                            <Icon name="edit" size={12} color="white" style={{ padding: 4 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.button, { marginTop: 220 }]}
                    onPress={() => setModalVisible({ ...modalVisible, password: true })}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible.username}
                    onRequestClose={() => setModalVisible({ ...modalVisible, username: false })}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Update Username</Text>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : isFocused.username ? styles.inputFocused : null]}
                                placeholder="Enter new username"
                                placeholderTextColor="#FFFFFF66"
                                value={newUsername}
                                onChangeText={setNewUsername}
                                onFocus={() => handleFocus('username')}
                                onBlur={() => handleBlur('username')}
                            />
                            <TouchableOpacity style={styles.modalButton} onPress={handleUpdateUsername}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible({ ...modalVisible, username: false })}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible.password}
                    onRequestClose={() => setModalVisible({ ...modalVisible, password: false })}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Update Password</Text>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : isFocused.currentPassword ? styles.inputFocused : null]}
                                placeholder="Enter current password"
                                placeholderTextColor="#FFFFFF66"
                                autoCapitalize="none"
                                secureTextEntry={!passwordVisible}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                onFocus={() => handleFocus('currentPassword')}
                                onBlur={() => handleBlur('currentPassword')}
                            />
                            <TextInput
                                style={[styles.input, error ? styles.inputError : isFocused.newPassword ? styles.inputFocused : null]}
                                placeholder="Enter new password"
                                placeholderTextColor="#FFFFFF66"
                                autoCapitalize="none"
                                secureTextEntry={!passwordVisible}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                onFocus={() => handleFocus('newPassword')}
                                onBlur={() => handleBlur('newPassword')}
                            />
                            <TouchableOpacity style={styles.modalButton} onPress={handleUpdatePassword}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible({ ...modalVisible, password: false })}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#121212',
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00E1C5',
        marginBottom: 20,
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
        marginBottom: 15,
    },
    inputFocused: {
        borderColor: '#00E1C5',
    },
    inputError: {
        borderColor: '#E02424',
    },
    button: {
        backgroundColor: '#00E1C5',
        width: '100%',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#121212',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        color: '#00E1C5',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#00E1C5',
        width: '100%',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 15,
    },
    profile: {
        width: 100,
        height: 100,
        marginBottom: 40,
        borderColor: '#00E1C5',
        borderWidth: 2,
        borderRadius: 1000,
        alignSelf: 'center'
    },
    separator: {
        height: 1,
        backgroundColor: '#FFFFFF66',
    },
    card: {
        flex: 1,
        borderColor: "#FFFFFF66",
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: "#FFFFFF11",
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignContent: 'center',
    },
    username: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    }
});

export default SettingsScreen;