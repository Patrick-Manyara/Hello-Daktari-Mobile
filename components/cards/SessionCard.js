import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Pressable,
  Image,
  ImageBackground,
  View,
} from 'react-native';

import NormalText from '../ui/NormalText';

import {colors, css} from '../../assets/styles';
import {Paths} from '../../utils/paths';
import {getShortDate, getTimeInAmPm} from '../../utils/dateFormat';
import getImageUri from '../../utils/imageHelper';
import MediumText from '../ui/MediumText';

export default function SessionCard({session, isToday, onPress}) {
  return (
    <View style={styles.cardOutside}>
      <Pressable
        android_ripple={{color: '#ccc'}}
        style={({pressed}) => [
          styles.sessionCard,
          pressed ? css.buttonPressed : null,
        ]}
        onPress={onPress}>
        <View style={css.deeFlex}>
          <View>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={{uri: getImageUri(Paths.IMAGE_URL, session.user_image)}}
            />
          </View>
          <View>
            <MediumText styleProp={styles.userName}>
              {session.user_name}
            </MediumText>
            <NormalText styleProp={styles.sessionDate}>
              {isToday ? 'Today' : getShortDate(session.session_date)}
            </NormalText>
            <NormalText styleProp={styles.sessionTime}>
              {getTimeInAmPm(session.session_start_time)} to{' '}
              {getTimeInAmPm(session.session_end_time)}
            </NormalText>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            style={{width: 25, height: 25, resizeMode: 'cover'}}
            source={
              session.session_channel === 'home'
                ? require('../../assets/icons/home_house.png')
                : session.session_channel === 'audio'
                ? require('../../assets/icons/home_call.png')
                : session.session_channel === 'video'
                ? require('../../assets/icons/home_video.png')
                : null // Default if no match
            }
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sessionCard: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  sessionDate: {
    marginLeft: 10,
    color: 'white',
  },
  sessionTime: {
    color: 'white',
    marginLeft: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cardOutside: {
    width: '95%',
    marginRight: 10,
    borderRadius: 8,
    padding: 5,
    flex: 1,
  },
});
