import React, {useState, useEffect} from 'react';
import {FlatList, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NotificationBell from '../../components/ui/NotificationBell';
import HeaderText from '../../components/ui/HeaderText';
import NormalText from '../../components/ui/NormalText';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import CategoryFilterCard from '../../components/cards/CategoryFilterCard';
import SessionHistoryCard from '../../components/cards/SessionHistoryCard';

import {getToday} from '../../utils/dateFormat';
import {css} from '../../assets/styles';
import {Paths} from '../../utils/paths';

export default function SessionHistoryScreen({navigation}) {
  const [user, setUser] = useState([]);
  //SESSIONS
  const [isFetching, setIsFetching] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [initialSessions, setInitialSessions] = useState([]);

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

  const fetchSessions = () => {
    setIsFetching(true);
    if (!user) return;
    const fetchurl = Paths.API_URL + 'session.php';
    const queryParams = `action=all&user_id=${user.user_id}`;
    const url = `${fetchurl}?${queryParams}`;
    try {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setIsFetching(false);
          let arr = data.sessions;
          if (Array.isArray(arr)) {
            setSessions(data.sessions);
            setInitialSessions(data.sessions);
          } else {
            console.log('No sessions');
          }
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
    fetchSessions();
  }, [user]);

  //CHANNELS
  const [channels, setChannels] = useState(['All']);
  const [selectedChannel, setSelectedChannel] = useState('All');

  const extractUniqueChannels = sessions => {
    const uniqueChannels = [
      'All',
      ...new Set(sessions.map(session => session.session_channel)),
    ];
    return uniqueChannels;
  };

  useEffect(() => {
    if (initialSessions.length > 0) {
      const uniqueChannels = extractUniqueChannels(initialSessions);
      setChannels(uniqueChannels);
    }
  }, [initialSessions]);

  function handleChannelClick(sessionKey) {
    setSelectedChannel(sessionKey);

    if (sessionKey === 'All') {
      setSessions(initialSessions);
    } else {
      setIsFetching(true);
      const filteredSessions = initialSessions.filter(
        session => session.session_channel === sessionKey,
      );
      setIsFetching(false);
      setSessions(filteredSessions);
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedSessionIndex, setSelectedSessionIndex] = useState(null);

  const openModal = doctorId => {
    setSelectedSessionIndex(doctorId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <HeaderText styleProp={css.centerText}>Your Session History</HeaderText>
      {isFetching ? (
        <LoadingOverlay message="Getting your session history" />
      ) : sessions.length > 0 ? (
        <View style={{marginBottom: 150}}>
          <ScrollView horizontal>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              {channels.map((channel, index) => (
                <CategoryFilterCard
                  key={index}
                  categoryName={channel}
                  onPress={() => handleChannelClick(channel)}
                  isSelected={selectedChannel === channel}
                />
              ))}
            </View>
          </ScrollView>
          <FlatList
            data={sessions}
            keyExtractor={(item, index) => index.toString()} // Use the index as the key
            renderItem={({item}) => (
              <SessionHistoryCard
                userImg={item.doctor_image}
                userName={item.doctor_name}
                session={item}
                isUser
                isToday={item.session_date === getToday ? true : false}
              />
            )}
          />
        </View>
      ) : (
        <View>
          <NormalText>You do not have any sessions at the moment...</NormalText>
        </View>
      )}
    </SafeAreaView>
  );
}
