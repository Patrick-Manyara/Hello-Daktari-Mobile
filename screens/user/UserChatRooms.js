import React, {useState, useEffect, useLayoutEffect} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import NotificationBell from '../../components/ui/NotificationBell';
import NormalText from '../../components/ui/NormalText';
import MediumText from '../../components/ui/MediumText';
import LoadingOverlay from '../../components/ui/LoadingOverlay';

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {firestore} from '../../firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {css} from '../../assets/styles';
import ChatListCard from '../../components/cards/ChatListCard';
import {Paths} from '../../utils/paths';

export default function UserChatRooms({navigation}) {
  const [chats, setChats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    let u = await AsyncStorage.getItem('token');
    if (u) {
      u = JSON.parse(u);
      setUser(u);
    }
  };

  const fetchDoctorDetails = async doctorId => {
    const baseUrl = Paths.API_URL + 'doctor.php';
    const queryParams = `action=profile&doctor_id=${doctorId}`;
    const fetchUrl = `${baseUrl}?${queryParams}`;

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('Failed to fetch doctor details');
      const result = await response.json();

      if (result.status === 1 && result.data) {
        const doctorData = result.data;
        return {
          doctor_name: doctorData.doctor_name,
          doctor_image: doctorData.doctor_image,
        };
      } else {
        throw new Error('Invalid doctor data received');
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      return {
        doctor_name: 'Unknown Doctor',
        doctor_image: 'default_image_url', // Replace with a placeholder URL
      };
    }
  };
  const doctorCache = {};

  const fetchDoctorDetailsCached = async doctorId => {
    if (doctorCache[doctorId]) {
      return doctorCache[doctorId];
    }
    const doctorDetails = await fetchDoctorDetails(doctorId);
    doctorCache[doctorId] = doctorDetails; // Cache the result
    return doctorDetails;
  };

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestore, 'chats'),
      orderBy('id', 'desc'),
    );

    const unsubscribe = onSnapshot(chatQuery, async querySnapshot => {
      const chatRooms = querySnapshot.docs.map(doc => doc.data());
      const filteredChats = chatRooms.filter(
        chat => chat.receiver === user.user_id,
      );

      const chatsWithDoctorDetails = await Promise.all(
        filteredChats.map(async chat => {
          const doctorDetails = await fetchDoctorDetailsCached(chat.sender);
          return {
            ...chat,
            doctor: doctorDetails,
          };
        }),
      );

      setChats(chatsWithDoctorDetails);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user?.user_id]);

  const renderItem = ({item}) => (
    <ChatListCard
      onPress={() => {
        navigation.navigate('UserChatScreen', {
          item: item,
          doctor: item.doctor,
        });
      }}
      img={item.doctor.doctor_image}
      userName={item.doctor.doctor_name}
      chatName={item.chatName}
      chatId={item.id}
      onDelete={deleteChat}
    />
  );

  const deleteChat = async chatId => {
    // Show a confirmation alert before deletion
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this chat?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => performDeleteChat(chatId), // Proceed with deletion if confirmed
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  // Actual deletion function
  const performDeleteChat = async chatId => {
    try {
      await deleteDoc(doc(firestore, 'chats', chatId));
      // Optionally, update the state to remove the deleted chat from the UI
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      setOriginalChats(prevOriginalChats =>
        prevOriginalChats.filter(chat => chat.id !== chatId),
      );
    } catch (error) {
      console.error('Error deleting chat: ', error);
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      {isLoading ? (
        <LoadingOverlay message="Fetching your chat rooms" />
      ) : (
        <View>
          <MediumText>Your Chats</MediumText>
          <NormalText>List of your Chats</NormalText>

          <FlatList
            data={chats}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
