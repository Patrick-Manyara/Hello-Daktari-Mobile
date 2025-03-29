import React, {useState, useEffect} from 'react';
import {StyleSheet, Image, View, ScrollView, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import HeaderText from '../../components/ui/HeaderText';
import NormalText from '../../components/ui/NormalText';
import ScheduleCard from '../../components/cards/ScheduleCard';

import {Paths} from '../../utils/paths';
import {colors, css} from '../../assets/styles';
import getImageUri from '../../utils/imageHelper';

export default function DoctorScreen({route, navigation}) {
  const [doctor, setDoctor] = useState({});

  const [days, setDays] = useState();
  const [timesArray, setTimesArray] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  // const [fromSearch, setfromSearch] = useState(null);
  const [docId, setDocId] = useState('');

  useEffect(() => {
    if (route.params && route.params.doctor) {
      fetchDays(route.params.doctor);
      setDocId(route.params.doctor);
    }
  }, [route.params]);

  // Function to fetch the doctor's profile
  const fetchProfile = async doctorId => {
    const fetchurl = Paths.API_URL + 'doctor.php';
    const queryParams = `action=profile&doctor_id=${doctorId}`;
    const url = `${fetchurl}?${queryParams}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setIsFetching(false);
      setDoctor(data.data);
    } catch (error) {
      setIsFetching(false);
      console.error('Fetch error:', error);
    }
  };

  // useEffect to handle initial route parameters
  useEffect(() => {
    if (route.params && route.params.doctor) {
      fetchDays(route.params.doctor); // Assuming fetchDays is defined elsewhere
      setDocId(route.params.doctor.doctor_id);
    }
  }, [route.params]);

  // useEffect to fetch profile when docId changes
  useEffect(() => {
    if (docId) {
      fetchProfile(docId);
    }
  }, [docId]);

  const renderProfileContent = () => (
    <View>
      <HeaderText styleProp={styles.titleStyle}>
        {doctor.doctor_name}
      </HeaderText>
      <NormalText styleProp={styles.subTitle}>
        {doctor.doctor_qualifications}
      </NormalText>
      <NormalText styleProp={styles.subTitle}>
        Years of Experience: 12 Year(s)
      </NormalText>

      <View style={styles.ratingArea}>
        <Image source={require('../../assets/icons/star.png')} />
        <NormalText>4.5</NormalText>
      </View>
    </View>
  );

  //SCHEDULE
  function fetchDays(doctorId) {
    const baseUrl = Paths.API_URL + 'doctor.php';
    const queryParams = `action=fetch_schedule&doctor_id=${doctorId}`;
    const fetchUrl = `${baseUrl}?${queryParams}`;
    try {
      fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
          setIsFetching(false);
          let arr = data.schedule;
          if (Array.isArray(arr)) {
            setDays(data.schedule);
            setDoctor(data.doctor);
          } else {
            console.log('No specialties');
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
  }

  function handleDayClick(dayName) {
    setSelectedDay(dayName);
    const selectedDay = days.find(item => item.day === dayName);

    if (selectedDay) {
      setSelectedDate(selectedDay.date);
      setTimesArray(Object.values(selectedDay.times));
      setSelectedTime('');
    } else {
      console.log('Day not found');
    }
  }

  function handleTimeClick(time) {
    setSelectedTime(time.start_time);
    setSelectedEndTime(time.end_time);
  }

  const renderScheduleContent = () => (
    <View>
      <NormalText>Days</NormalText>
      {days && (
        <ScrollView horizontal>
          <View style={{flexDirection: 'row'}}>
            {days.map((day, index) => (
              <ScheduleCard
                isSelected={selectedDay === day.day}
                key={index}
                day={day}
                onPress={() => handleDayClick(day.day)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      <NormalText>Time</NormalText>
      {timesArray.length > 0 ? (
        <ScrollView horizontal>
          <View style={{flexDirection: 'row'}}>
            {timesArray.map((time, index) => (
              <ScheduleCard
                isSelected={selectedTime === time.start_time}
                key={index}
                day={time}
                isTime={true}
                onPress={() => handleTimeClick(time)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <NormalText>No Data To Load</NormalText>
      )}
    </View>
  );

  return (
    <SafeAreaView style={css.safeAreaView}>
      <HeaderText styleProp={[css.centerText, {marginVertical: 5}]}>
        Specialist Profile
      </HeaderText>
      {isFetching ? (
        <View>
          <NormalText>Fetching</NormalText>
        </View>
      ) : (
        <View>
          <View style={styles.innerView}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: getImageUri(Paths.IMAGE_URL, doctor.doctor_image),
              }}
            />
            <View>
              <View style={styles.tabBar}>
                <Pressable
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderBottomWidth: activeTab === 'profile' ? 2 : 0,
                    borderBottomColor:
                      activeTab === 'profile' ? colors.primaryBlue : 'black',
                  }}
                  onPress={() => setActiveTab('profile')}>
                  <NormalText
                    boldProp={activeTab === 'profile' ? true : false}
                    styleProp={{
                      color:
                        activeTab === 'profile' ? colors.primaryBlue : 'black',
                    }}>
                    Profile
                  </NormalText>
                </Pressable>

                <Pressable
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontWeight: activeTab === 'schedule' ? 'bold' : 'normal',
                    borderBottomWidth: activeTab === 'schedule' ? 2 : 0,
                    borderBottomColor:
                      activeTab === 'schedule' ? colors.primaryBlue : 'black',
                  }}
                  onPress={() => setActiveTab('schedule')}>
                  <NormalText
                    boldProp={activeTab === 'schedule' ? true : false}
                    styleProp={{
                      color:
                        activeTab === 'schedule' ? colors.primaryBlue : 'black',
                    }}>
                    Schedule
                  </NormalText>
                </Pressable>
              </View>

              <View style={styles.contentArea}>
                {activeTab === 'profile'
                  ? renderProfileContent()
                  : renderScheduleContent()}
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 14,
    textAlign: 'center',
  },
  subTitle: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  ratingArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  innerView: {
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
  },
  imageStyle: {
    height: 140,
    width: 140,
    borderRadius: 70,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryBlue,
  },
  contentArea: {
    flex: 2,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
