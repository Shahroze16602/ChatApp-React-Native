// Import necessary modules
import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import images from '../Images';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


// Define Chat Item component
const ChatItem = ({ name, status, message, image, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Image source={image} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
            <View>
                <Text style={{ fontWeight: 'bold', color: 'white' }}>{name}</Text>
                {status !== null && (
                    status === 'online' ? (
                        <Text style={{ color: 'green' }}>Online</Text>
                    ) : (
                        <Text style={{ color: '#999' }}>{status}</Text>
                    )
                )}
                <Text numberOfLines={2} style={{ color: 'white' }}>{message}</Text>
            </View>
        </TouchableOpacity>
    );
};

// Define Chat List Screen component
const ChatList = () => {
    const navigation = useNavigation();

    const [chats, setChats] = React.useState([
        { id: 1, name: 'Henna Beck', status: 'online', message: 'Hi John!', image: images.profile1 },
        { id: 2, name: 'John Smith', status: null, message: 'Congrats! After all this searches you finally made it!', image: images.profile2 },
        { id: 3, name: 'Nuria Cortez', status: 'typing...', message: 'How are you doing?', image: images.profile3 },
    ]);

    const handleChatPress = (chatId, username, profilePicture) => {
        console.log('Chat pressed:', chatId);
        navigation.navigate('ChatScreen', { chatId: chatId, username: username, profilePicture: profilePicture });
    };

    return (
        <FlatList
            data={chats}
            renderItem={({ item }) => (
                <ChatItem
                    name={item.name}
                    status={item.status}
                    message={item.message}
                    image={item.image}
                    onPress={() => handleChatPress(item.id, item.name, item.image)}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
        />
    );
};

const ChatListScreen = () => {
    const handleMenuPress = () => {
        console.log('Menu button pressed!');
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#171E26' }}>
            <StatusBar barStyle="light-content" />
            <Appbar.Header style={[styles.appbar, { backgroundColor: '#171E26' }]}>
                <Appbar.Content title="Chats" titleStyle={{ fontWeight: 'bold', fontSize: 24, color: '#00E1C5' }} />
                <Appbar.Action icon="dots-vertical" onPress={handleMenuPress} color="white" />
            </Appbar.Header>
            <View style={styles.separator}></View>
            <ChatList />
        </View>
    )
}

export default ChatListScreen;

// Define styles
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