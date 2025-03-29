import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import NormalText from '../ui/NormalText';
import {getDayAndMonth} from '../../utils/dateFormat';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye} from '@fortawesome/free-regular-svg-icons';
import {colors} from '../../assets/styles';
import getImageUri from '../../utils/imageHelper';
import {Paths} from '../../utils/paths';

export default function CommentCard({comment}) {
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

  return (
    <View key={comment.comment_id} style={styles.commentContainer}>
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
              uri: getImageUri(Paths.IMAGE_URL, comment.commenter_image),
            }}
          />
        </View>
        <View style={{marginLeft: 10, flex: 1, marginVertical: 5}}>
          <NormalText styleProp={{fontSize: 12}}>
            {comment.commenter_name}
          </NormalText>
          <NormalText styleProp={{fontSize: 10}}>
            {getDayAndMonth(comment.comment_date_created)}
          </NormalText>
        </View>
      </View>
      <NormalText style={styles.commentText}>
        {formatForumText(comment, comment.comment_text)}
      </NormalText>
      <FontAwesomeIcon icon={faEye} color={colors.primaryBlue} />
    </View>
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
