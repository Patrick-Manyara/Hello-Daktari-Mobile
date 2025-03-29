import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert, ToastAndroid, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingOverlay from '../../components/ui/LoadingOverlay';
import RenderOverlay from '../../components/ui/RenderOverlay';
import HeaderText from '../../components/ui/HeaderText';
import PrimaryButton from '../../components/ui/PrimaryButton';
import NormalText from '../../components/ui/NormalText';
import AddressCard from '../../components/cards/AddressCard';
import UrgencyCard from '../../components/cards/UrgencyCard';
import TransparentButton from '../../components/ui/TransparentButton';
import PagerView from 'react-native-pager-view';
import AddressModal from '../../components/modals/AddressModal';
import TextAreaInput from '../../components/forms/TextAreaInput';

import {Paths} from '../../utils/paths';
import {colors, css} from '../../assets/styles';
import getImageUri from '../../utils/imageHelper';
import MediumText from '../../components/ui/MediumText';

export default function HomeVisitScreen({navigation}) {
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

  let queryParams = '';
  let baseUrl = '';
  let url = '';

  //PAGE MOTION
  const [page, setpage] = React.useState(0);
  const ref = React.useRef();

  //URGENCY
  const [selectedUrgency, setSelectedUrgency] = useState(null);

  const urgencyOptions = [
    {
      text: 'Urgent. Would like to see available doctor immediately.',
      keyProp: 'urgent',
    },
    {
      text: 'Scheduled. Select a date and time to see a doctor',
      keyProp: 'scheduled',
    },
  ];

  function handleUrgencyOption(keyProp) {
    setSelectedUrgency(keyProp);
  }

  const renderUrgencyOptions = (
    urgencyOptions,
    handleUrgencyOption,
    selectedUrgency,
  ) => {
    return (
      <View>
        <View style={styles.numberAreaStyle}>
          <HeaderText styleProp={styles.numberStyle}>1</HeaderText>
          <NormalText boldProp styleProp={styles.descStyle}>
            Please provide information on the urgency of your medical concern
          </NormalText>
        </View>

        {urgencyOptions.map((option, index) => (
          <UrgencyCard
            key={index}
            text={option.text}
            onPress={() => handleUrgencyOption(option.keyProp)}
            isSelected={selectedUrgency === option.keyProp}
          />
        ))}
      </View>
    );
  };

  //ADDRESS
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressExists, setAddressExists] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNewModal, setIsNewModal] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAddress, setModalAddress] = useState(null);

  // baseUrl = Paths.API_URL + "addresses.php";

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAddresses();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchAddresses = callback => {
    if (!user) return;
    baseUrl = Paths.API_URL + 'addresses.php';
    queryParams = `action=all&user_id=${user.user_id}`;
    url = `${baseUrl}?${queryParams}`;
    try {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (callback) {
            callback();
          }
          setIsFetching(false);
          let arr = data.addresses;
          if (Array.isArray(arr)) {
            setAddresses(data.addresses);
          } else {
            console.log('No addresses');
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

  const removeAddress = address_id => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => performDeletion(address_id),
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const performDeletion = address_id => {
    setIsDeleting(true);
    baseUrl = Paths.API_URL + 'addresses.php';
    queryParams = `action=delete`;
    url = `${baseUrl}?${queryParams}`;

    const formData = new FormData();
    formData.append('address_id', address_id);

    try {
      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            ToastAndroid.show(
              'Address successfully deleted',
              ToastAndroid.SHORT,
            );
            setIsDeleting(false);
            fetchAddresses();
          } else {
            setIsDeleting(false);
            console.error('Failed to delete address:', data.error);
          }
        })
        .catch(error => {
          setIsDeleting(false);
          console.error('Delete address error:', error);
        });
    } catch (error) {
      setIsDeleting(false);
      console.error('Delete address request setup error:', error);
    }
  };

  const openModal = (address, isNew) => {
    setModalAddress(address);
    setIsNewModal(isNew);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderAddressCards = (
    addresses,
    selectedAddress,
    removeAddress,
    handleAddressSelection,
  ) => {
    if (addresses.length > 0) {
      return (
        <View>
          <View style={styles.numberAreaStyle}>
            <HeaderText styleProp={styles.numberStyle}>2</HeaderText>
            <NormalText boldProp styleProp={styles.descStyle}>
              Kindly select your location
            </NormalText>
          </View>
          {addresses.map(address => (
            <AddressCard
              key={address.address_id}
              address={address}
              editAddress={() => openModal(address, false)}
              removeAddress={() => removeAddress(address.address_id)}
              onPress={() => handleAddressSelection(address.address_id)}
              isSelected={selectedAddress === address.address_id}
            />
          ))}
          {isModalVisible && (
            <AddressModal
              visible={isModalVisible}
              closeModal={closeModal}
              address={modalAddress}
              isNew={isNewModal}
              fetchAddresses={() => fetchAddresses(closeModal)}
              user={user.user_id}
            />
          )}
        </View>
      );
    } else {
      return (
        <View>
          <NormalText>You have not saved any addresses.</NormalText>
        </View>
      );
    }
  };

  //SEARCH
  const [selectedSearch, setSelectedSearch] = useState(null);

  const searchOptions = [
    {
      text: "I'd like the system to assign me a doctor",
      keyProp: 'assign',
    },
    {
      text: "I'd like to search for a doctor myself",
      keyProp: 'myself',
    },
  ];

  function handleSearchOption(keyProp) {
    setSelectedSearch(keyProp);
  }

  //DETAILS
  const [enteredDetails, setEnteredDetails] = useState('');

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'details':
        setEnteredDetails(enteredValue);
        break;
    }
  }

  //SUBMISSION
  const [uploading, setUploading] = useState(false);

  baseUrl = Paths.API_URL + 'session.php';
  queryParams = `action=house`;
  url = `${baseUrl}?${queryParams}`;

  let submitForm = async () => {
    try {
      if (
        selectedUrgency != null &&
        selectedAddress != null &&
        selectedSearch != null
      ) {
        setUploading(true);

        const fd = new FormData();

        fd.append('urgency', selectedUrgency);
        fd.append('address', selectedAddress);
        fd.append('search', selectedSearch);
        fd.append('details', enteredDetails);
        fd.append('user_id', user.user_id);

        let res = await fetch(url, {
          method: 'POST',
          body: fd,
        });
        console.log(fd);
        if (res.ok) {
          let responseJson = await res.json();
          if (responseJson.data === true) {
            if (responseJson.search === 'assign') {
              navigation.navigate('DoctorDetailsScreen', {
                doctor: responseJson.doctor,
                sessionData: responseJson.session_data,
              });
            } else if (responseJson.search === 'myself') {
              navigation.navigate('AllDoctorsScreen', {
                doctors: responseJson.doctors,
                sessionData: responseJson.session_data,
              });
            }
          } else {
            Alert.alert('Error');
            console.log('error here');
          }
        } else {
          console.log('error here');
        }

        setUploading(false);
      } else {
        setUploading(false);
        alert('Please fill all the fields first');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  function handleAddressSelection(addy) {
    setSelectedAddress(addy);
    setAddressExists(true);
  }

  return (
    <SafeAreaView
      style={{flex: 1, paddingTop: 5, backgroundColor: colors.primaryBlue}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={styles.imageStyle}
          source={{
            uri: getImageUri(Paths.IMAGE_URL, user.user_image),
          }}
        />
        <HeaderText styleProp={{color: '#fff', marginLeft: 10}}>
          Hi,
          {user.user_name}
        </HeaderText>
      </View>
      <NormalText styleProp={{color: '#fff', marginLeft: 10}}>
        Welcome to our Home Based Care platform. Kindly follow the steps below
      </NormalText>

      <PagerView
        style={{flex: 1, backgroundColor: '#fff'}}
        initialPage={0}
        ref={ref}
        onPageScroll={e => {
          let page = e.nativeEvent.position;
          setpage(page);
        }}>
        <View key="0" style={styles.pageStyle}>
          {renderUrgencyOptions(
            urgencyOptions,
            handleUrgencyOption,
            selectedUrgency,
          )}

          {selectedUrgency && (
            <View style={[styles.buttonView, {justifyContent: 'flex-end'}]}>
              <PrimaryButton
                styleProp={styles.btnStyle}
                onPress={() => {
                  ref.current?.setPage(1);
                }}>
                NEXT
              </PrimaryButton>
            </View>
          )}
        </View>

        <View key="1" style={styles.pageStyle}>
          {isFetching || isDeleting ? (
            <LoadingOverlay message="Getting your addresses" />
          ) : (
            <View>
              {renderAddressCards(
                addresses,
                selectedAddress,
                removeAddress,
                handleAddressSelection,
              )}
              <PrimaryButton
                styleProp={{backgroundColor: colors.turqouise}}
                onPress={() => openModal(null, true)}>
                Add Address
              </PrimaryButton>
            </View>
          )}

          {selectedAddress && (
            <View style={styles.buttonView}>
              <TransparentButton
                styleProp={styles.btnStyle}
                onPress={() => {
                  ref.current?.setPage(4);
                }}>
                SKIP
              </TransparentButton>

              <PrimaryButton
                styleProp={styles.btnStyle}
                onPress={() => {
                  ref.current?.setPage(2);
                }}>
                NEXT
              </PrimaryButton>
            </View>
          )}
        </View>

        <View key="2" style={styles.pageStyle}>
          <View>
            <View style={styles.numberAreaStyle}>
              <HeaderText styleProp={styles.numberStyle}>3</HeaderText>
              <NormalText boldProp styleProp={styles.descStyle}>
                Share if you're looking for a doctor or medical professional for
                yourself.
              </NormalText>
            </View>

            {searchOptions.map((option, index) => (
              <UrgencyCard
                key={index}
                text={option.text}
                onPress={() => handleSearchOption(option.keyProp)}
                isSelected={selectedSearch === option.keyProp}
              />
            ))}
          </View>

          {selectedSearch && (
            <View style={styles.buttonView}>
              <TransparentButton
                styleProp={styles.btnStyle}
                onPress={() => {
                  ref.current?.setPage(4);
                }}>
                SKIP
              </TransparentButton>

              <PrimaryButton
                styleProp={styles.btnStyle}
                onPress={() => {
                  ref.current?.setPage(3);
                }}>
                NEXT
              </PrimaryButton>
            </View>
          )}
        </View>

        <View key="3" style={styles.pageStyle}>
          <View>
            <View style={styles.numberAreaStyle}>
              <HeaderText styleProp={styles.numberStyle}>4</HeaderText>
              <NormalText boldProp styleProp={styles.descStyle}>
                Describe the specific area or symptoms you're experiencing
                (optional).
              </NormalText>
            </View>
            <TextAreaInput
              numberOfLines={4}
              placeholder="Enter your details here..."
              label="Enter details below(optional):"
            />
          </View>

          <View style={styles.buttonView}>
            <TransparentButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(4);
              }}>
              SKIP
            </TransparentButton>

            <PrimaryButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(4);
              }}>
              NEXT
            </PrimaryButton>
          </View>
        </View>

        <View key="4" style={styles.pageStyle}>
          {selectedAddress && selectedSearch && selectedUrgency ? (
            <View>
              <MediumText styleProp={css.centerText}>
                Your details are saved
              </MediumText>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  style={styles.medicStyle}
                  source={require('../../assets/images/medic.png')}
                />
                <PrimaryButton onPress={submitForm}>Proceed</PrimaryButton>
              </View>
              {uploading && <RenderOverlay />}
            </View>
          ) : (
            <View>
              <NormalText>Not Hey</NormalText>
            </View>
          )}

          <View style={styles.buttonView}></View>
        </View>
      </PagerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginLeft: 10,
  },
  btnStyle: {
    width: 100,
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberStyle: {
    fontSize: 40,
  },
  descStyle: {
    fontSize: 12,
  },
  pageStyle: {
    padding: 10,
    flex: 1,
  },
  numberAreaStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicStyle: {
    height: 300,
    width: 300,
    objectFit: 'contain',
  },
});
