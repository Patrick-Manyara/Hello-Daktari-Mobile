import React, {useContext, useEffect, useState} from 'react';
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
import SessionHistoryCard from '../../components/cards/SessionHistoryCard';
import NextSessionCard from '../../components/cards/NextSessionCard';
import NotificationBell from '../../components/ui/NotificationBell';
import HeaderText from '../../components/ui/HeaderText';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import MediumText from '../../components/ui/MediumText';
import {getFullTextDate, getToday} from '../../utils/dateFormat';
import NavCard from '../../components/cards/NavCard';
import SessionCard from '../../components/cards/SessionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppointmentsScreen({route, navigation}) {
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

  const [selectedTab, setSelectedTab] = useState('Upcoming');

  const fetchSessions = async () => {
    if (!doctor) return;
    setIsFetching(true);
    const fetchurl = Paths.API_URL + 'session.php';
    const queryParams = `action=docall&doctor_id=${doctor.doctor_id}`;
    const url = `${fetchurl}?${queryParams}`;
    console.log(url);

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

  const navigateToDetails = session => {
    navigation.navigate('SessionDetailsScreen', {session: session});
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <View style={styles.tabBar}>
        <Pressable
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,

            borderBottomWidth: selectedTab === 'Upcoming' ? 2 : 0,
            borderBottomColor:
              selectedTab === 'Upcoming' ? colors.primaryBlue : 'black',
          }}
          onPress={() => setSelectedTab('Upcoming')}>
          <NormalText
            boldProp={selectedTab === 'Upcoming' ? true : false}
            styleProp={{
              color: selectedTab === 'Upcoming' ? colors.primaryBlue : 'black',
            }}>
            Upcoming
          </NormalText>
        </Pressable>

        <Pressable
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            fontWeight: selectedTab === 'Past' ? 'bold' : 'normal',
            borderBottomWidth: selectedTab === 'Past' ? 2 : 0,
            borderBottomColor:
              selectedTab === 'Past' ? colors.primaryBlue : 'black',
          }}
          onPress={() => setSelectedTab('Past')}>
          <NormalText
            boldProp={selectedTab === 'Past' ? true : false}
            styleProp={{
              color: selectedTab === 'Past' ? colors.primaryBlue : 'black',
            }}>
            Past
          </NormalText>
        </Pressable>
        <Pressable
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomColor:
              selectedTab === 'Cancelled' ? colors.primaryBlue : 'black',
            borderBottomWidth: selectedTab === 'Cancelled' ? 2 : 0,
          }}
          onPress={() => setSelectedTab('Cancelled')}>
          <NormalText
            boldProp={selectedTab === 'Cancelled' ? true : false}
            styleProp={{
              color: selectedTab === 'Cancelled' ? colors.primaryBlue : 'black',
            }}>
            Cancelled
          </NormalText>
        </Pressable>
      </View>

      <ScrollView>
        {selectedTab == 'Upcoming' && (
          <View>
            {futureSessions.length > 0 ? (
              <View>
                {futureSessions.map((item, index) => {
                  return (
                    <NextSessionCard
                      session={item}
                      key={index}
                      isToday={item.session_date === today ? true : false}
                      onPress={() => navigateToDetails(item)}
                    />
                  );
                })}
              </View>
            ) : (
              <View>
                <NormalText>You do not have any Upcoming sessions</NormalText>
              </View>
            )}
          </View>
        )}

        {selectedTab == 'Past' && (
          <View>
            {pastSessions.length > 0 && (
              <View>
                {pastSessions.map((item, index) => (
                  <SessionHistoryCard
                    session={item}
                    userImg={item.user_image}
                    userName={item.user_name}
                    isToday={item.session_date === today ? true : false}
                    key={index}
                    onPress={() => navigateToDetails(item)}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {selectedTab == 'Cancelled' && (
          <View>
            <NormalText>You do not have any Cancelled sessions</NormalText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientCard: {
    width: '95%',
    backgroundColor: colors.secondaryGrey,
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    padding: 5,
    // IOS
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: 'white',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  tagView: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    marginVertical: 5,
  },
  uploadsViewStyle: {
    width: '100%',
  },
  cardContainer: {
    width: '48%',
  },
  imageStyle: {
    width: 60,
    height: 60,
    marginBottom: 10,
    marginTop: 10,
  },

  preloadedView: {
    flex: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  safeAreaExtension: {
    height: 100,
    backgroundColor: colors.turqouise,
  },
  imageContainer: {
    backgroundColor: '#edf5f7',
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    height: 40,
    width: 40,
  },
  detailsArea: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
