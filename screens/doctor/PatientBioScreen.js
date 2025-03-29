import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Paths} from '../../utils/paths';
import {colors, css} from '../../assets/styles';

import LoadingOverlay from '../../components/ui/LoadingOverlay';
import HeaderText from '../../components/ui/HeaderText';
import PrescriptionCard from '../../components/cards/PrescriptionCard';
import MediumText from '../../components/ui/MediumText';
import NormalText from '../../components/ui/NormalText';
import getImageUri from '../../utils/imageHelper';
import {calculateAge} from '../../utils/dateFormat';

export default function PatientBioScreen({route, navigation}) {
  const [patient, setPatient] = useState();
  const [addresses, setAddresses] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const [selectedTab, setSelectedTab] = useState('Overview');

  useEffect(() => {
    if (route.params) {
      // Set patient
      if (route.params.patient) {
        setPatient(route.params.patient);
      }

      // Set addresses
      if (route.params.addresses) {
        setAddresses(route.params.addresses);
      }

      // Set uploads
      if (route.params.uploads) {
        setUploads(route.params.uploads);
      }

      // Set sessions
      if (route.params.sessions) {
        setSessions(route.params.sessions);
      }

      // Set prescriptions
      if (route.params.prescriptions) {
        setPrescriptions(route.params.prescriptions);
      }
      setIsFetching(false);
    }
  }, [route.params]);

  const detailCards = [
    {
      image: require('../../assets/icons/height.png'),
      header: 'Height',
      text: patient ? patient.user_height + ' cm' : '',
    },
    {
      image: require('../../assets/icons/weight.png'),
      header: 'Weight',
      text: patient ? patient.user_weight + ' kg' : '',
    },
    {
      image: require('../../assets/icons/age.png'),
      header: 'Age',
      text: patient ? calculateAge(patient.user_dob) + ' yrs' : '',
    },
    {
      image: require('../../assets/icons/bgroup.png'),
      header: 'Blood Group',
      text: patient ? patient.user_blood_group : '',
    },
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.turqouise}}>
      <StatusBar barStyle="light-content" backgroundColor={colors.turqouise} />
      {isFetching ? (
        <View style={styles.preloadedView}>
          <LoadingOverlay message="Getting Your Data" />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.safeAreaExtension}></View>
          <View style={{flex: 2, backgroundColor: 'white'}}>
            <View style={styles.imageArea}>
              <Image
                style={styles.profilePic}
                source={{uri: getImageUri(Paths.IMAGE_URL, patient.user_image)}}
              />
            </View>
            <View>
              <HeaderText
                styleProp={[css.centerText, {color: 'black', fontSize: 20}]}>
                {patient.user_name}
              </HeaderText>

              <NormalText styleProp={css.centerText} boldProp>
                {patient.user_email}
              </NormalText>

              <NormalText styleProp={css.centerText} boldProp>
                {patient.user_phone}
              </NormalText>

              <View style={styles.tabBar}>
                <Pressable
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,

                    borderBottomWidth: selectedTab === 'Overview' ? 2 : 0,
                    borderBottomColor:
                      selectedTab === 'Overview' ? colors.primaryBlue : 'black',
                  }}
                  onPress={() => setSelectedTab('Overview')}>
                  <NormalText
                    boldProp={selectedTab === 'Overview' ? true : false}
                    styleProp={{
                      color:
                        selectedTab === 'Overview'
                          ? colors.primaryBlue
                          : 'black',
                    }}>
                    Overview
                  </NormalText>
                </Pressable>

                <Pressable
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontWeight: selectedTab === 'Addresses' ? 'bold' : 'normal',
                    borderBottomWidth: selectedTab === 'Addresses' ? 2 : 0,
                    borderBottomColor:
                      selectedTab === 'Addresses'
                        ? colors.primaryBlue
                        : 'black',
                  }}
                  onPress={() => setSelectedTab('Addresses')}>
                  <NormalText
                    boldProp={selectedTab === 'Addresses' ? true : false}
                    styleProp={{
                      color:
                        selectedTab === 'Addresses'
                          ? colors.primaryBlue
                          : 'black',
                    }}>
                    Addresses
                  </NormalText>
                </Pressable>
                <Pressable
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderBottomColor:
                      selectedTab === 'Uploads' ? colors.primaryBlue : 'black',
                    borderBottomWidth: selectedTab === 'Uploads' ? 2 : 0,
                  }}
                  onPress={() => setSelectedTab('Uploads')}>
                  <NormalText
                    boldProp={selectedTab === 'Uploads' ? true : false}
                    styleProp={{
                      color:
                        selectedTab === 'Uploads'
                          ? colors.primaryBlue
                          : 'black',
                    }}>
                    Uploads
                  </NormalText>
                </Pressable>
                <Pressable
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderBottomColor:
                      selectedTab === 'Prescriptions'
                        ? colors.primaryBlue
                        : 'black',
                    borderBottomWidth: selectedTab === 'Prescriptions' ? 2 : 0,
                  }}
                  onPress={() => setSelectedTab('Prescriptions')}>
                  <NormalText
                    boldProp={selectedTab === 'Prescriptions' ? true : false}
                    styleProp={{
                      color:
                        selectedTab === 'Prescriptions'
                          ? colors.primaryBlue
                          : 'black',
                    }}>
                    Prescriptions
                  </NormalText>
                </Pressable>
              </View>

              {selectedTab == 'Overview' && (
                <View>
                  <View style={styles.detailsArea}>
                    {detailCards.map((item, index) => (
                      <View style={{alignItems: 'center'}} key={index}>
                        <View style={styles.imageContainer}>
                          <Image style={styles.iconStyle} source={item.image} />
                        </View>
                        <NormalText styleProp={{color: '#919191'}} boldProp>
                          {item.header}
                        </NormalText>
                        <NormalText>{item.text}</NormalText>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {selectedTab == 'Addresses' &&
                (addresses.length <= 0 ? (
                  <NormalText>You have no addresses saved</NormalText>
                ) : (
                  <View>
                    {addresses.map(address => (
                      <View style={styles.patientCard} key={address.address_id}>
                        <View style={styles.tagView}>
                          <HeaderText>{address.address_label}</HeaderText>
                        </View>

                        <View>
                          <NormalText>{address.address_name}</NormalText>
                          <NormalText>{address.address_location}</NormalText>
                          <NormalText>{address.address_phone}</NormalText>
                        </View>

                        <View style={{marginVertical: 2}}></View>
                      </View>
                    ))}
                  </View>
                ))}

              {selectedTab == 'Uploads' && (
                <View style={styles.uploadsViewStyle}>
                  {uploads.length <= 0 ? (
                    <NormalText>You have no uploads saved</NormalText>
                  ) : (
                    <FlatList
                      data={uploads}
                      numColumns={2}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) => (
                        <View style={styles.cardContainer}>
                          <Pressable onPress={() => {}}>
                            <View style={styles.patientCard}>
                              <View style={styles.tagView}>
                                <HeaderText styleProp={css.centerText}>
                                  {item.upload_name}
                                </HeaderText>
                              </View>

                              <View style={css.displayFlex}>
                                <Image
                                  source={require('../../assets/icons/folder.png')}
                                  style={styles.imageStyle}
                                />
                              </View>

                              <View>
                                <NormalText styleProp={css.centerText}>
                                  {item.upload_code}
                                </NormalText>
                              </View>
                            </View>
                          </Pressable>
                        </View>
                      )}
                    />
                  )}
                </View>
              )}

              {selectedTab == 'Prescriptions' &&
                (prescriptions.length <= 0 ? (
                  <NormalText>You have no prescriptions saved</NormalText>
                ) : (
                  <View>
                    <PrescriptionCard prescriptions={prescriptions} />
                  </View>
                ))}
            </View>
          </View>
        </View>
      )}
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
