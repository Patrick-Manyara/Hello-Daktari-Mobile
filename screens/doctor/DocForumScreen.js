import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Paths} from '../../utils/paths';
import {colors} from '../../assets/styles';
import {faArrowsRotate} from '@fortawesome/free-solid-svg-icons';

import HeaderText from '../../components/ui/HeaderText';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import ForumCard from '../../components/cards/ForumCard';
import NormalText from '../../components/ui/NormalText';
import ForumModal from '../../components/modals/ForumModal';
import IconButton from '../../components/ui/IconButton';
import ForumFilterCard from '../../components/cards/ForumFilterCard';
import PrimaryButton from '../../components/ui/PrimaryButton';
import InputHybrid from '../../components/forms/InputHybrid';

export default function DocForumScreen({navigation}) {
  const [doctor, setDoctor] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [forums, setForums] = useState([]);
  const [initialForums, setInitialForums] = useState([]);
  const [deleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [doctors, setDoctors] = useState([]);

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

  const categories = [
    {
      text: 'all',
      keyProp: 'all',
    },
    {
      text: 'popular',
      keyProp: 'popular',
    },
    {
      text: 'latest',
      keyProp: 'latest',
    },
    {
      text: 'yours',
      keyProp: 'yours',
    },
  ];

  const baseUrl = Paths.API_URL + 'forum.php';

  const fetchForums = callback => {
    const queryParams = `action=all`;
    const url = `${baseUrl}?${queryParams}`;
    try {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (callback) {
            callback();
          }
          setIsFetching(false);
          let arr = data.forums;
          if (Array.isArray(arr)) {
            setForums(data.forums);
            setDoctors(data.doctors);
            setInitialForums(data.forums);
          } else {
            console.log('No forums');
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

  // Add an event listener to refetch forums when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchForums();
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToSingleForum = forum => {
    navigation.navigate('DocForumPost', {
      forum: forum,
      doctors: doctors,
    });
  };

  //NEW POST
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  function handleCategoryClick(categoryKey) {
    setSelectedCategory(categoryKey);

    if (categoryKey === 'all') {
      setForums(initialForums);
    } else {
      setIsFetching(true);
      let filteredForums = [];

      if (categoryKey === 'popular') {
        setIsFetching(true);
        // Assuming you have the comment_count property in your forum object
        filteredForums = [...initialForums].sort(
          (a, b) => b.comment_count - a.comment_count,
        );
      } else if (categoryKey === 'latest') {
        // Sort forums by forum_date_created in descending order
        filteredForums = [...initialForums].sort(
          (a, b) => b.forum_date_created - a.forum_date_created,
        );
      } else if (categoryKey === 'yours') {
        // Filter forums where user_id is equal to doctor.doctor_id
        filteredForums = initialForums.filter(
          forum => forum.user_id === doctor.doctor_id,
        );
      }

      setIsFetching(false);
      setForums(filteredForums);
    }
  }

  //SEARCH
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = text => {
    setSearchQuery(text);
    if (text) {
      const filteredForums = initialForums.filter(forum =>
        forum.forum_title.toLowerCase().includes(text.toLowerCase()),
      );
      setForums(filteredForums);
    } else {
      setForums(initialForums);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <View style={{width: '80%', marginLeft: 10}}>
          <HeaderText styleProp={{color: '#fff'}}>
            Hi,
            {doctor.doctor_name}
          </HeaderText>
          <NormalText styleProp={{color: '#fff'}}>
            Welcome to our patient forum. Use the refresh button on the right or
            add button below.
          </NormalText>
        </View>
        <IconButton
          styleProp={styles.iconButton}
          iconSize={20}
          iconName={faArrowsRotate}
          iconColor={colors.primaryBlue}
          onPress={() => fetchForums()}
        />
      </View>

      <ScrollView style={styles.userDetails}>
        {isFetching ? (
          <LoadingOverlay message="Getting your forums" />
        ) : (
          <View>
            <ScrollView horizontal>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                {categories.map((category, index) => (
                  <ForumFilterCard
                    key={category.keyProp}
                    categoryName={category.text}
                    onPress={() => handleCategoryClick(category.keyProp)}
                    isSelected={selectedCategory === category.keyProp}
                  />
                ))}
              </View>
            </ScrollView>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <PrimaryButton
                  onPress={() => openModal()}
                  styleProp={styles.btnStyle}>
                  Add New
                </PrimaryButton>
                <InputHybrid
                  onChangeText={handleSearch}
                  placeholder="Search by title"
                  value={searchQuery}
                  containerStyle={{marginHorizontal: 10, width: '75%'}}
                />
              </View>
              {forums.length > 0 ? (
                forums.map(forum => (
                  <ForumCard
                    key={forum.forum_id}
                    onPress={() => navigateToSingleForum(forum)}
                    forum={forum}
                  />
                ))
              ) : (
                <View>
                  <NormalText>
                    There are currently no forums. Press the + button to be the
                    first to contribute to the Hello Daktari Patient Forum.
                  </NormalText>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <ForumModal
        fetchForum={() => fetchForums(closeModal)}
        visible={isModalVisible}
        closeModal={closeModal}
        doctors={doctors}
        uid={doctor.doctor_id}
        isDoctor="yes"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: colors.primaryBlue,
  },
  blueBtn: {
    backgroundColor: colors.primaryBlue,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  userDetails: {
    backgroundColor: colors.primaryBlue,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 5,
    marginTop: 10,
    height: '100%',
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#f0f0f1',
  },
  iconButton: {
    backgroundColor: '#fff',
  },
  btnStyle: {
    backgroundColor: colors.turqouise,
    height: 40,
  },
});
