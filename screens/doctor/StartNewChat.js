import React, {useState, useEffect, useContext} from 'react';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderText from '../../components/ui/HeaderText';
import NormalText from '../../components/ui/NormalText';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import PatientListCard from '../../components/cards/PatientListCard';

import {firestore} from '../../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';

import {Paths} from '../../utils/paths';
import {css} from '../../assets/styles';

export default function StartNewChat({route, navigation}) {
  const [doctor, setDoctor] = useState([]);

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

  const [chats, setChats] = useState({});

  useEffect(() => {
    if (route.params && route.params.chats) {
      setChats(route.params.chats);
    }
  }, [route.params]);

  //PATIENTS
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

  const handlePatientPress = async patient => {
    try {
      // Check if a chat room with this patient already exists
      const chatQuery = query(
        collection(firestore, 'chats'),
        where('sender', '==', doctor.doctor_id),
        where('receiver', '==', patient.user_id),
      );

      const querySnapshot = await getDocs(chatQuery);
      if (!querySnapshot.empty) {
        // Chat exists, navigate to it
        const existingChat = querySnapshot.docs[0].data();
        navigation.navigate('ChatScreen', {
          item: existingChat,
          user: patient,
          doctor: doctor,
        });
        return;
      }

      // Chat does not exist, create one
      const id = `${Date.now()}`;
      const newChat = {
        id: id,
        user: patient.user_id,
        doctor: doctor.doctor_id,
        chatName: `ChatRoom-${Math.floor(Math.random() * 1000000)}`,
        sender: doctor.doctor_id,
        receiver: patient.user_id,
      };

      await setDoc(doc(firestore, 'chats', id), newChat);
      navigation.navigate('ChatScreen', {item: newChat});
    } catch (error) {
      console.error('Error creating chat:', error);
      Alert.alert('Error', 'Could not start a new chat. Please try again.');
    }
  };

  const renderItem = ({item}) => (
    <PatientListCard onPress={() => handlePatientPress(item)} patient={item} />
  );
  return (
    <SafeAreaView style={css.safeAreaView}>
      {isFetching ? (
        <LoadingOverlay message="Fetching your client list" />
      ) : (
        <View>
          <HeaderText styleProp={css.centerText}>Your Patients</HeaderText>
          <NormalText styleProp={css.centerText}>
            Click any of the below clients to start a chat
          </NormalText>
          <FlatList
            data={patients}
            keyExtractor={item => item.user_id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
