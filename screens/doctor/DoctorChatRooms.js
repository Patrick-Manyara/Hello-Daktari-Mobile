import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
import {FlatList, View, Alert, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {firestore} from '../../firebaseConfig';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';

import NotificationBell from '../../components/ui/NotificationBell';
import HeaderText from '../../components/ui/HeaderText';
import NormalText from '../../components/ui/NormalText';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import ChatListCard from '../../components/cards/ChatListCard';
import {colors, css} from '../../assets/styles';
import InputHybrid from '../../components/forms/InputHybrid';
import IconButton from '../../components/ui/IconButton';
import {faUserGroup} from '@fortawesome/free-solid-svg-icons';
import {Paths} from '../../utils/paths';

export default function DoctorChatRooms({navigation}) {
  const [doctor, setDoctor] = useState([]);
  const [chats, setChats] = useState(null);
  const [originalChats, setOriginalChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    let u = await AsyncStorage.getItem('token');
    if (u) {
      u = JSON.parse(u);
      setDoctor(u);
    }
  };

  const [isFetching, setIsFetching] = useState(true);
  const [patients, setPatients] = useState([]);

  const fetchPatients = () => {
    if (!doctor) return;

    setIsFetching(true);
    const fetchurl = Paths.API_URL + 'doctor.php';
    const queryParams = `action=patients&doctor_id=${doctor.doctor_id}`;
    const url = `${fetchurl}?${queryParams}`;
    // console.log(url);
    try {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setIsFetching(false);
          setPatients(data.patients);
        })
        .catch(error => {
          setIsFetching(false);
          console.error('Fetch error:', error);
        });
    } catch (error) {
      setIsFetching(false);
      console.error('Request setup error:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [doctor]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPatients();
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestore, 'chats'),
      orderBy('id', 'desc'),
    );

    const unsubscribe = onSnapshot(chatQuery, async querySnapshot => {
      const chatRooms = querySnapshot.docs.map(doc => doc.data());
      setOriginalChats(chatRooms); // Keep the original chats for search purposes

      // Filter chats where the doctor is the sender
      const filteredChats = chatRooms.filter(
        chat => chat.sender === doctor.doctor_id,
      );

      // Map patients to chats by matching receiver with user_id
      const enhancedChats = filteredChats.map(chat => {
        const matchingPatient = patients.find(
          patient => patient.user_id === chat.receiver,
        );

        return {
          ...chat,
          user: {
            user_name: matchingPatient?.user_name || 'Unknown Patient',
            user_image: matchingPatient?.user_image || 'default_image_url', // Placeholder if no image
          },
        };
      });

      setChats(enhancedChats);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [doctor.doctor_id, patients]);

  const renderItem = ({item}) => (
    <ChatListCard
      onPress={() => {
        navigation.navigate('ChatScreen', {item: item, user: item.user});
      }}
      img={item.user.user_image}
      userName={item.user.user_name}
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

  const [search, setSearch] = useState('');

  const searchPatiens = val => {
    setSearch(val);
    if (val === '') {
      setChats(originalChats);
    } else {
      setChats(originalChats.filter(chat => chat.user.match(val)));
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      {isLoading ? (
        <LoadingOverlay message="Fetching your client list" />
      ) : (
        <View style={{flex: 1}}>
          <HeaderText styleProp={[css.centerText, {marginVertical: 6}]}>
            Your Chats
          </HeaderText>
          <FlatList
            data={chats}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
          />
          <IconButton
            onPress={() => {
              navigation.navigate('StartNewChat', {
                chats: chats,
                patients: patients,
              });
            }}
            styleProp={styles.chatButton}
            iconName={faUserGroup}
            iconColor={colors.primaryBlue}
            iconSize={24}
            iconStyle={{margin: 10}}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: colors.whiteSmoke,
  },
});
