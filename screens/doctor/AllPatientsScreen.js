import React, {useState, useEffect, useContext} from 'react';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {css} from '../../assets/styles';
import {Paths} from '../../utils/paths';

import NotificationBell from '../../components/ui/NotificationBell';
import HeaderText from '../../components/ui/HeaderText';
import NormalText from '../../components/ui/NormalText';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import PatientListCard from '../../components/cards/PatientListCard';

export default function AllPatientsScreen({navigation}) {
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

  //SESSIONS
  const [isFetching, setIsFetching] = useState(true);
  const [patients, setPatients] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [uploads, setUploads] = useState({});
  const [prescriptions, setPrescriptions] = useState({});
  const [sessions, setSessions] = useState({});

  const fetchPatients = () => {
    setIsFetching(true);
    if (!doctor) return;
    const fetchurl = Paths.API_URL + 'doctor.php';
    const queryParams = `action=patients&doctor_id=${doctor.doctor_id}`;
    const url = `${fetchurl}?${queryParams}`;
    try {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setPatients(data.patients);
          setAddresses(data.addresses);
          setUploads(data.uploads);
          setPrescriptions(data.prescriptions);
          setSessions(data.sessions);
          setIsFetching(false);
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

  const renderItem = ({item}) => (
    <PatientListCard
      onPress={() =>
        navigation.navigate('PatientBioScreen', {
          patient: item,
          addresses: addresses[item.user_id] || [],
          uploads: uploads[item.user_id] || [],
          prescriptions: prescriptions[item.user_id] || [],
          sessions: sessions[item.user_id] || [],
        })
      }
      patient={item}
    />
  );
  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      {isFetching ? (
        <LoadingOverlay message="Fetching your client list" />
      ) : (
        <View>
          <HeaderText>Your Patients</HeaderText>
          <NormalText>List of your patients </NormalText>
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
