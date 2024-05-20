import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, Image, StyleSheet, StatusBar } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import images from '../utils/Images';
import { collection, orderBy, query, onSnapshot, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { MaterialIcons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const { chatRoomId, username, profilePicture } = route.params;
  const [message, setMessage] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId("");
      }
    });
    return unsubscribeAuth;
  }, []);

  useLayoutEffect(() => {
    const collectionRef = collection(database, chatRoomId);
    const q = query(collectionRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        text: doc.data().text,
        user: doc.data().user
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const onSend = (text) => {
    if (text === "" || currentUserId === "") return;
    setMessage('');
    const newMessage = {
      createdAt: serverTimestamp(),
      text: text,
      user: currentUserId
    };
    const collectionRef = collection(database, chatRoomId);
    const docRef = doc(collectionRef);
    setDoc(docRef, newMessage)
      .then(() => {
        const chatsCollectionRef = collection(database, 'chats');
        const chatsDocRef = doc(chatsCollectionRef, chatRoomId);
        setDoc(chatsDocRef, { lastUpdatedAt: serverTimestamp() })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sendMessage = () => {
    if (message.trim()) onSend(message.trim());
  };

  const SendButton = ({ onPress, disabled }) => {
    const opacity = disabled ? 0.5 : 1;
  
    return (
      <TouchableOpacity
        style={[styles.button, { opacity }]}
        onPress={onPress}
        disabled={disabled}
      >
        <MaterialIcons name="send" size={30} color="black" />
      </TouchableOpacity>
    );
  };

  const Toolbar = () => {
    return (
      <Appbar.Header style={[styles.appbar, { backgroundColor: '#121212' }]}>
        <Appbar.Action icon="arrow-left" onPress={() => navigation.navigate("Chats")} color="white" />
        <Avatar.Image size={40} source={images.profile2} style={{ marginHorizontal: 10 }} />
        <Appbar.Content title={username} titleStyle={{ fontWeight: 'bold', fontSize: 20, color: '#00E1C5' }} />
      </Appbar.Header>
    );
  };

  const renderChatItem = ({ item }) => {
    const isYou = item.user === currentUserId;
    const createdTime = item.createdAt ? item.createdAt.toLocaleString() : '';
    const backgroundColor = isYou ? '#283540' : '#0A433D';
    const textColor = '#fff';
    const containerStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 5,
      backgroundColor,
      borderRadius: 10,
      maxWidth: '80%',
      alignSelf: isYou ? 'flex-end' : 'flex-start',
      marginRight: isYou ? 10 : 25,
      marginLeft: isYou ? 25 : 10,
      marginTop: 8
    };

    return (
      <View style={containerStyle}>
        {/* {isYou ? null : (
          <Image source={images.profile2} style={{ width: 50, height: 50, borderRadius: 20, marginRight: 10 }} />
        )} */}
        <View>
          {/* <Text style={{ fontWeight: 'bold', color: textColor }}>{isYou ? "You" : username}</Text> */}
          <Text style={{ color: textColor }}>{item.text}</Text>
          {createdTime ? (
            <Text style={{ color: '#FFFFFF88', fontSize: 8, textAlign: 'right', paddingVertical: 4 }}>
              {createdTime}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <StatusBar barStyle="light-content" />
      <Toolbar />
      <View style={styles.separator}></View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#121212' }}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={"#aaa"}
          style={styles.input}
        />
        <SendButton onPress={sendMessage} disabled={!message} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appbar: {
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  separator: {
    height: 1,
    backgroundColor: '#FFFFFF66',
  },
  button: {
    backgroundColor: '#00E1C5', // You can customize the color here
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF11',
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginEnd: 10,
    borderRadius: 25,
    color: 'white',
    borderWidth: 1,
    borderColor: '#FFFFFF66',
  },
});

export default ChatScreen;
