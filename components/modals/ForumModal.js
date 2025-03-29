import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';

import {Paths} from '../../utils/paths';
import {colors} from '../../assets/styles';
import {faClose} from '@fortawesome/free-solid-svg-icons';

import InputHybrid from '../forms/InputHybrid';
import TransparentButton from '../ui/TransparentButton';
import IconButton from '../ui/IconButton';
import RenderOverlay from '../ui/RenderOverlay';
import NormalText from '../ui/NormalText';
import MediumText from '../ui/MediumText';
import TextAreaInput from '../forms/TextAreaInput';

export default function ForumModal({
  visible,
  closeModal,
  fetchForum,
  doctors,
  uid,
  isDoctor,
}) {
  const [enteredComment, setEnteredComment] = useState('');
  const [enteredTitle, setEnteredTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'forum_title':
        setEnteredTitle(enteredValue);
        break;
      case 'forum_text':
        setEnteredComment(enteredValue);
        break;
    }
  }

  const postUrl = Paths.API_URL + 'forum.php?action=add_forum';

  let submitForm = async () => {
    try {
      if (enteredComment != '' && enteredTitle != '') {
        setUploading(true);
        const data = new FormData();
        data.append('isDoctor', isDoctor);
        data.append('user_id', uid);
        data.append('forum_text', enteredComment);
        data.append('forum_title', enteredTitle);
        if (selectedDoctor != null) {
          data.append('tagged_doctor', selectedDoctor.doctor_id);
          data.append('doctor_name', selectedDoctor.doctor_name);
        }
        fetch(postUrl, {
          method: 'POST',
          body: data,
        })
          .then(response => response.json())
          .then(data => {
            setUploading(false);
            fetchForum();
          })
          .catch(error => {
            setUploading(false);
            console.error('Fetch error:', error);
          });
      } else {
        Alert.alert('Invalid input', 'Please check your entered credentials.');
      }
    } catch (error) {
      setUploading(false);
      console.error('Request setup error:', error);
    }
  };

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
      setFilteredDoctors([]);
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
    setFilteredDoctors([]);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.modalInnerView}>
          <View>
            <InputHybrid
              containerStyle={styles.titleInput}
              placeholder="Add Your Title..."
              label="Title"
              value={enteredTitle}
              onChangeText={value =>
                updateInputValueHandler('forum_title', value)
              }
              placeholderTextColor="#7A8B8B"
              inputStyle={styles.inputStyle}
            />

            <TextAreaInput
              placeholder="Add Your Comment..."
              label="Post"
              value={enteredComment}
              onChangeText={value => handleCommentChange(value)}
              placeholderTextColor="#7A8B8B"
              numberOfLines={6}
            />

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
            <TransparentButton onPress={submitForm}>Post</TransparentButton>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <IconButton
              styleProp={styles.iconButton}
              iconSize={24}
              iconName={faClose}
              iconColor="black"
              onPress={closeModal}
            />
          </View>
        </View>
      </View>
      {uploading && <RenderOverlay />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerView: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  titleInput: {
    borderRadius: 8,
    padding: 8,
  },
  commentInput: {
    borderRadius: 8,
    padding: 8,
    height: 100,
  },
  inputStyle: {
    fontSize: 12,
  },
  iconButton: {
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: colors.mainPink,
  },
  doctorsList: {
    zIndex: 99999999,
    marginLeft: 20,
    backgroundColor: colors.whiteSmoke,
    borderRadius: 10,
    padding: 5,
  },
});
