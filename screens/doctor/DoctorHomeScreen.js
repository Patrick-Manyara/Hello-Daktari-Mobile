import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {colors, css} from '../../assets/styles';
import {Paths} from '../../utils/paths';

import PrimaryButton from '../../components/ui/PrimaryButton';
import NormalText from '../../components/ui/NormalText';
import NextSessionCard from '../../components/cards/NextSessionCard';
import NotificationBell from '../../components/ui/NotificationBell';
import HeaderText from '../../components/ui/HeaderText';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import MediumText from '../../components/ui/MediumText';
import {getFullTextDate, getToday} from '../../utils/dateFormat';
import NavCard from '../../components/cards/NavCard';
import SessionCard from '../../components/cards/SessionCard';

export default function DoctorHomeScreen() {
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

  const today = getToday();

  //SESSIONS
  const [isFetching, setIsFetching] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [futureSessions, setFutureSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [userSessions, setUserSessions] = useState([]);

  const fetchSessions = async () => {
    setIsFetching(true);
    const fetchurl = Paths.API_URL + 'session.php';
    const queryParams = `action=docall&doctor_id=${doctor.doctor_id}`;
    const url = `${fetchurl}?${queryParams}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data.sessions)) {
        setSessions(data.sessions);

        const future = data.sessions.filter(
          session => session.session_date >= today,
        );
        const past = data.sessions.filter(
          session => session.session_date <= today,
        );
        const todaySess = data.sessions.filter(
          session => session.session_date == today,
        );

        // Sort future sessions first by date, then by time
        const futureSorted = future.sort((a, b) => {
          // First, compare by session_date
          if (a.session_date !== b.session_date) {
            return a.session_date.localeCompare(b.session_date); // Sort by date
          }
          // If the dates are the same, compare by session_start_time
          return a.session_start_time.localeCompare(b.session_start_time); // Sort by time
        });

        setFutureSessions(futureSorted);
        setPastSessions(past);
        setTodaySessions(todaySess);
        setIsFetching(false);
      } else {
        console.log('No sessions');
        setIsFetching(false);
      }
    } catch (error) {
      setIsFetching(false);
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [doctor]);

  const navigation = useNavigation();

  const navigateToDetails = session => {
    navigation.navigate('SessionDetailsScreen', {session: session});
  };

  const navigateToAppointment = item => {
    const userSess = sessions.filter(
      session => session.client_id === item.client_id,
    );
    navigation.navigate('AppointmentDetailsScreen', {
      sessions: userSess,
    });
  };

  const homeCards = [
    {
      image: require('../../assets/icons/doc_profile.png'),
      header: 'Your Profile',
      text: 'Manage and update your professional details.',
      nav: 'DoctorProfile',
    },
    {
      image: require('../../assets/icons/doc_forum.png'),
      header: 'Patient Forum',
      text: 'Engage with patients in community discussions.',
      nav: 'DocForumScreen',
    },
    {
      image: require('../../assets/icons/doc_patients.png'),
      header: 'Your Patients',
      text: 'Access and manage your patient records.',
      nav: 'MyPatients',
    },
    {
      image: require('../../assets/icons/doc_session.png'),
      header: 'Your Sessions',
      text: 'Track and manage your booked appointments.',
      nav: 'AppointmentsScreen',
    },
    {
      image: require('../../assets/icons/doc_schedule.png'),
      header: 'Your Schedule',
      text: 'Plan and organize your daily tasks efficiently.',
      nav: 'ScheduleScreen',
    },
    {
      image: require('../../assets/icons/doc_chat.png'),
      header: 'Your Chats',
      text: 'Connect with patients and colleagues in real-time.',
      nav: 'DoctorChatRooms',
    },
  ];

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <HeaderText styleProp={{fontSize: 16}}>
          Welcome {doctor.doctor_name}.
        </HeaderText>

        {todaySessions.length == 0 && (
          <NormalText boldProp styleProp={{color: 'black'}}>
            Hey Doc. You don't have any appointments today
          </NormalText>
        )}

        <ImageBackground
          source={require('../../assets/images/bluebg.png')}
          style={styles.backgroundStyle}
          imageStyle={styles.imageBackgroundStyle}>
          <View
            style={{paddingHorizontal: 10, paddingTop: 5, borderRadius: 20}}>
            <NormalText boldProp styleProp={styles.bannerText}>
              {getFullTextDate(today)}
            </NormalText>
          </View>

          {futureSessions.length > 0 && (
            <SessionCard
              session={futureSessions[0]}
              key={0}
              isToday={futureSessions[0].session_date === today ? true : false}
            />
          )}
        </ImageBackground>

        <HeaderText styleProp={styles.headerStyle}>Services</HeaderText>

        {homeCards.map((option, index) => (
          <NavCard
            key={index}
            text={option.text}
            header={option.header}
            image={option.image}
            onPress={() => navigation.navigate(option.nav)}
          />
        ))}

        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    height: 120,
    resizeMode: 'cover',
    borderRadius: 20,
    marginTop: 10,
  },
  imageBackgroundStyle: {
    borderRadius: 10, // Applies the borderRadius to the actual image
  },
  bannerText: {
    color: 'white',
    fontSize: 16,
  },
  headerStyle: {
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
  },
});
