import React, {useEffect, useState} from 'react';
import {StyleSheet, Pressable, Image, View} from 'react-native';

import NormalText from '../ui/NormalText';

import {colors, css} from '../../assets/styles';
import {Paths} from '../../utils/paths';
import {
  getLongDate,
  getOrdinalDateAndTime,
  getTimeInAmPm,
} from '../../utils/dateFormat';
import getImageUri from '../../utils/imageHelper';
import IconButton from '../ui/IconButton';
import {faChevronCircleRight} from '@fortawesome/free-solid-svg-icons';
import MediumText from '../ui/MediumText';
import HeaderText from '../ui/HeaderText';

export default function NextSessionCard({session, isToday, onPress}) {
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
          <IconButton
            iconName={faChevronCircleRight}
            styleProp={{backgroundColor: colors.turqouise}}
            iconColor="#fff"
            onPress={onPress}
          />
        </View>

        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <View>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={{uri: getImageUri(Paths.IMAGE_URL, session.user_image)}}
            />
          </View>
          <View style={{marginLeft: 10}}>
            <HeaderText>{session.user_name}</HeaderText>
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
  userName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  pinkBg: {
    backgroundColor: colors.mediumPink,
  },
  blueBg: {
    backgroundColor: colors.darkBlue,
  },

  innerViewStyle: {
    borderLeftColor: colors.turqouise,
    borderLeftWidth: 5,
  },
  upperViewStyle: {
    marginLeft: 10,
  },
});
