import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Pressable, Platform} from 'react-native';

import HeaderText from '../ui/HeaderText';
import NormalText from '../ui/NormalText';
import MediumText from '../ui/MediumText';
import IconButton from '../ui/IconButton';

import {getOrdinalDateAndTime} from '../../utils/dateFormat';
import {colors, css} from '../../assets/styles';
import {Paths} from '../../utils/paths';
import {faChevronCircleRight} from '@fortawesome/free-solid-svg-icons';
import getImageUri from '../../utils/imageHelper';

export default function SessionHistoryCard({
  session,
  isToday,
  onPress,
  isUser,
  userName,
  userImg,
}) {
  return (
    <View style={styles.sessionCardStyle}>
      <View style={styles.innerViewStyle}>
        <View style={[css.deeBetween, {width: '100%'}]}>
          <View style={styles.upperViewStyle}>
            <NormalText>Appointment Date</NormalText>
            <MediumText>
              {isToday ? 'Today' : getOrdinalDateAndTime(session.session_date)}
            </MediumText>
          </View>
          {!isUser && (
            <IconButton
              iconName={faChevronCircleRight}
              styleProp={{backgroundColor: colors.turqouise}}
              iconColor="#fff"
              onPress={onPress}
            />
          )}
        </View>

        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <View>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={{uri: getImageUri(Paths.IMAGE_URL, userImg)}}
            />
          </View>
          <View style={{marginLeft: 10}}>
            <HeaderText>{userName}</HeaderText>
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <NormalText styleProp={{textTransform: 'capitalize'}}>
                {session.session_channel}
              </NormalText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sessionCardStyle: {
    width: '96%',
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 5,
    elevation: 1,
    padding: 5,
    // IOS
    shadowColor: 'black',
    shadowOpacity: 0.125,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    //LAYOUT
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  innerViewStyle: {
    borderLeftColor: colors.turqouise,
    borderLeftWidth: 5,
  },
  upperViewStyle: {
    marginLeft: 10,
  },
});
