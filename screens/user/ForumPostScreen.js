import React, {useState, useEffect} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';

import LoadingOverlay from '../../components/ui/LoadingOverlay';
import NormalText from '../../components/ui/NormalText';
import HeaderText from '../../components/ui/HeaderText';
import InputHybrid from '../../components/forms/InputHybrid';
import IconButton from '../../components/ui/IconButton';
import MediumText from '../../components/ui/MediumText';
import RenderOverlay from '../../components/ui/RenderOverlay';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBookmark,
  faEye,
  faPaperPlane,
} from '@fortawesome/free-regular-svg-icons';
import {getDayAndMonth} from '../../utils/dateFormat';
import {Paths} from '../../utils/paths';
import {colors, css} from '../../assets/styles';
import getImageUri from '../../utils/imageHelper';
import he from 'he';

export default function ForumPostScreen({route, navigation}) {
  const [user, setUser] = useState([]);
  const [forum, setForum] = useState({});

  const [isFetching, setIsFetching] = useState(true);
  const [comments, setComments] = useState([]);
  const [deleting, setIsDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [doctors, setDoctors] = useState([]);

  // FETCH USER DETAILS

  const fetchUser = async () => {
    let u = await AsyncStorage.getItem('token');
    if (u) {
      u = JSON.parse(u);
      setUser(u);
    }
  };

  useEffect(() => {
    fetchUser();
    if (route.params && route.params.forum) {
      setForum(route.params.forum);
      setDoctors(route.params.doctors);
    }
  }, [route.params]);

  useEffect(() => {
    fetchComments();
  }, [forum]);

  // MAIN FORUM CLICKABLE
  // Function to parse and format forum text with clickable doctor's name
  const formatForumText = (forum, forumText) => {
    if (!forum.tagged_doctor || !forumText) {
      return he.decode(forumText);
    }

    const doctorName = '@' + forum.doctor_name;
    const textParts = forumText.split(doctorName);

    return textParts.map((part, index) => (
      <React.Fragment key={index}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <NormalText>{he.decode(part)}</NormalText>
          {index < textParts.length - 1 && (
            <NormalText
              boldProp={true}
              styleProp={{color: colors.darkBlue}}
              onPress={() => handleDoctorClick(forum.tagged_doctor)}>
              {doctorName}
            </NormalText>
          )}
        </View>
      </React.Fragment>
    ));
  };

  const handleDoctorClick = doctor => {
    navigation.navigate('SpecialistScreen', {
      doctor: doctor,
      fromSearch: false,
    });
  };

  // FETCH COMMENTS
  const baseUrl = Paths.API_URL + 'forum.php';

  const fetchComments = () => {
    const queryParams = `action=comments&forum_id=` + forum.forum_id;
    const url = `${baseUrl}?${queryParams}`;
    try {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setIsFetching(false);
          setComments(data.comments);
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
    const unsubscribe = navigation.addListener('focus', () => {
      fetchComments();
    });

    return unsubscribe;
  }, [navigation, forum]);

  // SUBMISSION
  const [enteredComment, setEnteredComment] = useState('');

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Function to filter doctors based on input text
  const filterDoctors = text => {
    const filtered = doctors.filter(doctor =>
      doctor.doctor_name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredDoctors(filtered.slice(0, 3)); // Show only the first 5 matches
  };

  const handleCommentChange = text => {
    // Check if '@' is typed
    const atIndex = text.lastIndexOf('@');
    if (atIndex > -1) {
      const searchText = text.substring(atIndex + 1); // Text after '@'
      filterDoctors(searchText);
    } else {
      setFilteredDoctors([]); // Clear the filtered doctors list if '@' is not present
    }
    setEnteredComment(text);
  };

  // Function to handle doctor selection
  const selectDoctor = doctor => {
    setSelectedDoctor(doctor);
    const updatedComment = enteredComment.replace(
      /@\w*$/,
      `@${doctor.doctor_name}`,
    );
    setEnteredComment(updatedComment);
    setFilteredDoctors([]); // Clear filtered doctors list
  };

  //SUBMISSION

  const url = Paths.API_URL + 'forum.php?action=add_comment';

  let submitForm = async () => {
    try {
      if (enteredComment != '') {
        setUploading(true);
        const data = new FormData();
        data.append('user_id', user.user_id);
        data.append('forum_id', forum.forum_id);
        data.append('forum_poster', forum.poster_id);
        data.append('comment_text', enteredComment);
        data.append('comment_doctor', 'no');

        if (selectedDoctor != null) {
          data.append('tagged_doctor', selectedDoctor.doctor_id);
          data.append('doctor_name', selectedDoctor.doctor_name);
        }
        fetch(url, {
          method: 'POST',
          body: data,
        })
          .then(response => response.json())
          .then(data => {
            setEnteredComment('');
            setUploading(false);
            fetchComments();
          })
          .catch(error => {
            setEnteredComment('');
            setUploading(false);
            console.error('Fetch error:', error);
          });
      } else {
        setEnteredComment('');
        Alert.alert('Invalid input', 'Please check your entered credentials.');
      }
    } catch (error) {
      setEnteredComment('');
      setUploading(false);
      console.error('Request setup error:', error);
    }
  };

  return (
    <SafeAreaView style={[css.safeAreaView, {backgroundColor: '#f0f0f1'}]}>
      <ScrollView>
        {isFetching ? (
          <LoadingOverlay message="Getting your comments" />
        ) : (
          <View>
            <View style={styles.forumContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <View>
                  <Image
                    style={{width: 40, height: 40, borderRadius: 20}}
                    source={{
                      uri: getImageUri(Paths.IMAGE_URL, forum.poster_image),
                    }}
                  />
                </View>
                <View style={{marginLeft: 10, flex: 1, marginVertical: 5}}>
                  <View style={css.deeStart}>
                    <NormalText boldProp styleProp={{fontSize: 12}}>
                      {forum.poster_name}
                    </NormalText>
                    {forum.forum_doctor == 'yes' && (
                      <Image
                        style={{width: 15, height: 15, marginLeft: 2}}
                        source={require('../../assets/icons/verify.png')}
                      />
                    )}
                  </View>
                  <NormalText styleProp={{fontSize: 10}}>
                    {getDayAndMonth(forum.forum_date_created)}
                  </NormalText>
                </View>
                <View>
                  <FontAwesomeIcon
                    icon={faBookmark}
                    color={colors.primaryBlue}
                  />
                </View>
              </View>

              <HeaderText style={styles.forumTitle}>
                {forum.forum_title}
              </HeaderText>
              <NormalText>
                {formatForumText(forum, forum.forum_text)}
              </NormalText>
            </View>

            <View>
              <HeaderText styleProp={{fontSize: 14, color: 'black'}}>
                Replies
              </HeaderText>
              {comments.length > 0 ? (
                comments.map(comment => (
                  <View
                    key={comment.comment_id}
                    style={styles.commentContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <View>
                        <Image
                          style={{width: 40, height: 40, borderRadius: 20}}
                          source={{
                            uri: getImageUri(
                              Paths.IMAGE_URL,
                              comment.commenter_image,
                            ),
                          }}
                        />
                      </View>
                      <View
                        style={{marginLeft: 10, flex: 1, marginVertical: 5}}>
                        <View style={css.deeStart}>
                          <NormalText boldProp styleProp={{fontSize: 12}}>
                            {comment.commenter_name}
                          </NormalText>
                          {comment.comment_doctor == 'yes' && (
                            <Image
                              style={{width: 15, height: 15, marginLeft: 2}}
                              source={require('../../assets/icons/verify.png')}
                            />
                          )}
                        </View>
                        <NormalText styleProp={{fontSize: 10}}>
                          {getDayAndMonth(comment.comment_date_created)}
                        </NormalText>
                      </View>
                    </View>
                    <NormalText style={styles.commentText}>
                      {formatForumText(comment, comment.comment_text)}
                    </NormalText>
                  </View>
                ))
              ) : (
                <View style={styles.noCommentsContainer}>
                  <NormalText style={styles.noCommentsText}>
                    No comments yet.
                  </NormalText>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <View>
        {enteredComment && filteredDoctors.length > 0 && (
          <View style={styles.doctorsList}>
            <MediumText>Click a doctor's name to tag</MediumText>
            {filteredDoctors.map(doctor => (
              <Pressable
                style={{
                  marginVertical: 4,
                  borderBottomWidth: 2,
                  borderBottomColor: '#D8D8D8',
                  borderRadius: 5,
                }}
                key={doctor.doctor_id}
                onPress={() => selectDoctor(doctor)}>
                <NormalText>{doctor.doctor_name}</NormalText>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.commentInputContainer}>
          <InputHybrid
            containerStyle={styles.commentInput}
            placeholder="Add Your Comment..."
            label="Post Here"
            value={enteredComment}
            onChangeText={value => handleCommentChange(value)}
            placeholderTextColor="#7A8B8B"
            inputStyle={styles.inputStyle}
          />

          <IconButton
            styleProp={styles.iconButton}
            iconSize={24}
            iconName={faPaperPlane}
            iconColor="white"
            onPress={submitForm}
          />
        </View>
      </View>
      {uploading && <RenderOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  forumContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  forumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  forumText: {
    fontSize: 16,
    color: '#555',
  },
  commentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  noCommentsContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#555',
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  inputStyle: {
    fontSize: 12,
  },
  iconButton: {
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: colors.primaryBlue,
  },
  doctorsList: {
    zIndex: 99999999,
    marginLeft: 20,
    backgroundColor: colors.whiteSmoke,
    borderRadius: 10,
    padding: 5,
  },
});
