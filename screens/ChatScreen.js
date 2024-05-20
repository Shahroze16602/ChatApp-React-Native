import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, FlatList, Image, StyleSheet, StatusBar } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { chatId, username, profilePicture } = route.params;
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const randomChatData = [
      { message: 'Hi there!', sender: 'You' },
      { message: 'Hello! How are you?', sender: username },
    ];
    setChatHistory(randomChatData);
  }, []);

  const sendMessage = () => {
    if (!message) return;
    setChatHistory([...chatHistory, { message, sender: 'You' }]);
    setMessage('');
  };

  const renderChatItem = ({ item }) => {
    const isYou = item.sender === 'You';
    const backgroundColor = isYou ? '#333' : '#ddd'; // Darker shade for You, lighter for others
    const textColor = isYou ? '#fff' : '#000'; // White text for You, black for others
    const containerStyle = {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 10,
      backgroundColor,
      borderRadius: 10,
      maxWidth: '80%', // Limit horizontal width to 80%
      alignSelf: isYou ? 'flex-end' : 'flex-start', // Align messages based on sender
      marginRight: isYou ? 10 : 25, // Margin for better spacing
      marginLeft: isYou ? 25 : 10,
      marginVertical: 5
    };

    return (
      <View style={containerStyle}>
        {isYou ? null : (
          <Image source={profilePicture} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
        )}
        <View style={{ flex: 1 }}> 
          <Text style={{ fontWeight: 'bold', color: textColor }}>{item.sender}</Text>
          <Text style={{ color: textColor }}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#171E26' }}>
      <StatusBar barStyle="light-content" />
      <Appbar.Header style={[styles.appbar, { backgroundColor: '#171E26' }]}>
        <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title={username} titleStyle={{ fontWeight: 'bold', fontSize: 20, color: '#00E1C5' }} />
      </Appbar.Header>
      <View style={styles.separator}></View>
      <FlatList
        data={chatHistory}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.message}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#eee' }}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={{ flex: 1, paddingHorizontal: 10 }}
        />
        <Button title="Send" onPress={sendMessage} disabled={!message} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default ChatScreen;