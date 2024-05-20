import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { Appbar } from 'react-native-paper';
import { collection, query, getDocs, setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import images from '../utils/Images';

const AddContactScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [searchVisible, setSearchVisible] = useState(false);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid);
            } else {
                setCurrentUserId("");
            }
        });
        return unsubscribe;
    }, []);

    const fetchContacts = useCallback(async () => {
        setRefreshing(true);
        try {
            const collectionRef = collection(database, 'users');
            const q = query(collectionRef);
            const querySnapshot = await getDocs(q);
            const fetchedContacts = querySnapshot.docs
                .filter(doc => doc.id !== currentUserId)
                .map(doc => ({
                    userId: doc.id,
                    name: doc.data().name,
                    email: doc.data().email,
                    image: doc.data().image
                }));
            setContacts(fetchedContacts);
        } catch (error) {
            console.error("Error fetching contacts: ", error);
        }
        setRefreshing(false);
        setLoading(false);
    }, [currentUserId]);

    useEffect(() => {
        if (currentUserId) {
            fetchContacts();
        }
    }, [currentUserId, fetchContacts]);

    useEffect(() => {
        setFilteredContacts(
            contacts.filter(contact => contact.email.toLowerCase().includes(search.toLowerCase()))
        );
    }, [search, contacts]);

    const handleAddContact = async (userId, username, profilePicture) => {
        setLoading(true);
        const chatRoomId = currentUserId < userId ? `${currentUserId}_${userId}` : `${userId}_${currentUserId}`;
        const createdAt = serverTimestamp();
        const collectionRef = collection(database, chatRoomId);
        const docRef = doc(collectionRef, "lastUpdatedAt");
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists && docSnap.data() !== undefined) {
                console.log("found chat", docSnap.data());
                navigation.navigate('ChatScreen', { chatRoomId, username, profilePicture });
                setLoading(false);
            } else {
                console.log("creating new chat");
                await setDoc(docRef, { date_time: createdAt });
                const chatsCollectionRef = collection(database, 'chats');
                const chatsDocRef = doc(chatsCollectionRef, chatRoomId);
                await setDoc(chatsDocRef, { lastUpdatedAt: createdAt });
                navigation.navigate('ChatScreen', { chatRoomId, username, profilePicture });
                setLoading(false);
            }
        } catch (error) {
            console.error("Something went wrong: ", error);
            setLoading(false);
        }
    };

    const handleSeachVisibility = () => {
        setSearchVisible(!searchVisible);
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={[styles.appbar, { backgroundColor: '#121212' }]}>
                <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="New Chat" titleStyle={{ fontWeight: 'bold', fontSize: 24, color: '#00E1C5' }} />
                <Appbar.Action icon="magnify" onPress={handleSeachVisibility} color="white" />
            </Appbar.Header>
            {searchVisible ? <TextInput
                placeholder="Search by email"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholderTextColor="#FFFFFF66"
            /> : null}
            <View style={styles.separator}></View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00E1C5" />
                </View>
            ) : (
                <FlatList
                    data={filteredContacts}
                    keyExtractor={(item) => item.userId}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.userItem, { padding: 10, flexDirection: 'row', alignItems: 'center' }]}
                            onPress={() => handleAddContact(item.userId, item.name, item.image)}>
                            <Image source={images.profile2} style={{ width: 50, height: 50, borderRadius: 25, marginHorizontal: 10 }} />
                            <View style={{ marginEnd: 16 }}>
                                <Text style={{ fontWeight: 'bold', color: 'white' }}>{item.name}</Text>
                                <Text numberOfLines={1} style={{ color: 'white' }}>{item.email}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchContacts} />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: '#FFFFFF66',
        borderWidth: 1,
        borderRadius: 24,
        marginBottom: 16,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        color: 'white',
    },
    userItem: {
        padding: 10,
        marginHorizontal: 15,
        marginTop: 15,
        backgroundColor: "#FFFFFF11",
        borderWidth: 1,
        borderColor: '#FFFFFF66',
        borderRadius: 10
    },
    userName: {
        color: 'white',
        fontWeight: 'bold',
    },
    userEmail: {
        color: '#999',
    },
    separator: {
        height: 1,
        backgroundColor: '#FFFFFF66',
    },
});

export default AddContactScreen;
