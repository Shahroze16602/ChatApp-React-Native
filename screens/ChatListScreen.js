import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StatusBar, StyleSheet, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import images from '../utils/Images';
import { Appbar, FAB, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { collection, query, getDoc, onSnapshot, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const ChatItem = ({ chatRoomId, userId, lastUpdatedAt, isLoading, setIsLoading }) => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const collectionRef = collection(database, 'users');
    if (userId) {
      getDoc(doc(collectionRef, userId))
        .then((docSnap) => {
          if (docSnap.exists && docSnap.data() !== undefined) {
            setUserName(docSnap.data()?.name)
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.error("Something went wrong", error);
        });
    }
  }, [userId]);

  const handleChatPress = (chatRoomId, username, profilePicture) => {
    const createdAt = serverTimestamp();
    const collectionRef = collection(database, chatRoomId);
    const docRef = doc(collectionRef, "lastUpdatedAt");
setIsLoading(true)
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists && docSnap.data() !== undefined) {
          console.log("found chat", docSnap.data());
          navigation.navigate('ChatScreen', { chatRoomId, username, profilePicture });
          setIsLoading(false)
        } else {
          console.log("creating new chat");
          setDoc(docRef, { date_time: createdAt })
            .then(() => {
              const chatsCollectionRef = collection(database, 'chats');
              const chatsDocRef = doc(chatsCollectionRef, chatRoomId);
              setDoc(chatsDocRef, { lastUpdatedAt: createdAt })
                .then(() => {
                  navigation.navigate('ChatScreen', { chatRoomId, username, profilePicture });
                })
                .catch((error) => {
                  console.error("Something went wrong", error);
                });
            })
            .catch((error) => {
              console.error("Something went wrong", error);
            });
        }
      })
      .catch((error) => {
        console.error("Something went wrong: ", error);
      })
  };

  return (
    <TouchableOpacity onPress={() => handleChatPress(chatRoomId, userName, "")} style={styles.chatItem}>
      <Image source={images.profile2} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
      <View>
        <Text style={{ fontWeight: 'bold', color: 'white', marginBottom: 4 }}>{userName}</Text>
        <Text numberOfLines={1} style={{ color: '#FFFFFF66', fontSize: 8 }}>{substringToLastWhitespace(lastUpdatedAt.toString())}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Define Chat List Screen component
const ChatList = ({ currentUserId }) => {
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadChats = () => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('lastUpdatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      setChats(
        querySnapshot.docs
          .filter(doc => doc.id.includes(currentUserId))
          .map(doc => ({
            chatRoomId: doc.id,
            lastUpdatedAt: doc.data().lastUpdatedAt?.toDate()
          }))
      );
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = loadChats();
    setLoading(false)
    return unsubscribe;
  }, [currentUserId]);

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    loadChats();
    setRefreshing(false);
    setLoading(false);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return (
    <View style={ loading? styles.loadingContainer : {} }>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00E1C5" />
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={({ item }) => (
            <ChatItem
              chatRoomId={item.chatRoomId}
              userId={item.chatRoomId.replace(currentUserId, "").replace("_", "").trim()}
              lastUpdatedAt={item.lastUpdatedAt ? item.lastUpdatedAt : ""}
              isLoading={loading}
              setIsLoading={setLoading}
            />
          )}
          keyExtractor={(item) => item.chatRoomId}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />)}
    </View>
  );
};

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  // const [search, setSearch] = useState("");
  // const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid) // Access the UUID here
      } else {
        setCurrentUserId("")
      }
    });
  }, []);

  const handleMenuPress = () => setMenuVisible(true);

  const handleLogout = () => {
    signOut(auth) // Perform sign out action
      .then(() => {
        // Navigate to Login screen or any other screen after logout
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const closeMenu = () => setMenuVisible(false); // Close the menu

  // const handleSeachVisibility = () => {
  //   setSearchVisible(!searchVisible);
  // }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <StatusBar barStyle="light-content" />
      <Appbar.Header style={[styles.appbar, { backgroundColor: '#121212' }]}>
        <Appbar.Content title="Chats" titleStyle={{ fontWeight: 'bold', fontSize: 24, color: '#00E1C5' }} />
        {/* <Appbar.Action icon="magnify" onPress={handleSeachVisibility} color="white" /> */}
        {/* <Appbar.Action icon={<MaterialCommunityIcons name="settings" size={24} color="white" />} onPress={handleMenuPress} /> */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={handleMenuPress} color="white" />}
        >
          <Menu.Item onPress={handleLogout} title="Logout" />
        </Menu>
      </Appbar.Header>
      {/* {searchVisible ? <TextInput
        placeholder="Search by email"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
        placeholderTextColor="#FFFFFF66"
      /> : null} */}
      <View style={styles.separator}></View>
      <ChatList currentUserId={currentUserId} />
      <FAB
        style={styles.fab}
        icon="plus"
        color='black'
        onPress={() => navigation.navigate('AddContactScreen')}
      />
    </View>
  );
};

function substringToLastWhitespace(text) {
  const lastSpaceIndex = text.lastIndexOf(' ');
  if (lastSpaceIndex !== -1) {
    return text.substring(0, lastSpaceIndex);
  } else {
    return text;
  }
}

export default ChatListScreen;

// Define styles
const styles = StyleSheet.create({
  appbar: {
    elevation: 4,
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
  separator: {
    height: 1,
    backgroundColor: '#FFFFFF66',
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: '#00E1C5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#FFFFFF66",
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: "#FFFFFF11"
  }
});
