import React from 'react';
import {View, Image, StyleSheet, Pressable, Platform} from 'react-native';

import {colors, css} from '../../assets/styles';
import {Paths} from '../../utils/paths';
import getImageUri from '../../utils/imageHelper';
import {
  getNumericDate,
  getNumericDay,
  getShortMonth,
} from '../../utils/dateFormat';

import HeaderText from '../ui/HeaderText';
import NormalText from '../ui/NormalText';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import he from 'he';

import {
  faBookmark,
  faComments,
  faEye,
} from '@fortawesome/free-regular-svg-icons';

export default function ForumCard({onPress, forum}) {
  const truncateText = (text, maxLength) => {
    const words = text.split(' ');
    const truncatedText =
      words.length > maxLength
        ? words.slice(0, maxLength).join(' ') + '...'
        : text;
    return truncatedText;
  };

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{color: '#ccc'}}
      style={({pressed}) => [
        styles.card,
        {marginTop: 4},
        pressed ? css.buttonPressed : null,
      ]}>
      <View style={styles.upperViewStyle}>
        <View style={styles.dateViewStyle}>
          <NormalText styleProp={{color: '#fff'}}>
            {getShortMonth(forum.forum_date_created)}
          </NormalText>
          <NormalText styleProp={{color: '#fff'}}>
            {getNumericDay(forum.forum_date_created)}
          </NormalText>
        </View>
        <View>
          <Image
            style={{width: 40, height: 40, borderRadius: 20}}
            source={{
              uri: getImageUri(Paths.IMAGE_URL, forum.poster_image),
            }}
          />
        </View>
        <View style={{marginLeft: 10, flex: 1, marginVertical: 5}}>
          <HeaderText styleProp={{fontSize: 14}} fontProp="poppins-semibold">
            {forum.forum_title}
          </HeaderText>
          <View style={css.deeStart}>
            <NormalText boldProp styleProp={{fontSize: 10}}>
              {forum.poster_name}
            </NormalText>
            {forum.forum_doctor == 'yes' && (
              <Image
                style={{width: 15, height: 15, marginLeft: 2}}
                source={require('../../assets/icons/verify.png')}
              />
            )}
          </View>
        </View>
      </View>

      <View>
        <NormalText style={{flexWrap: 'wrap', maxWidth: '90%'}}>
          {truncateText(he.decode(forum.forum_text), 20)}
        </NormalText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={css.deeFlex}>
          <FontAwesomeIcon icon={faComments} color={colors.primaryBlue} />
          <NormalText styleProp={{fontSize: 12, marginHorizontal: 4}}>
            {forum.comment_count}
          </NormalText>
        </View>
        <View style={css.deeFlex}>
          <FontAwesomeIcon icon={faEye} color={colors.primaryBlue} />

          <NormalText styleProp={{fontSize: 12, marginHorizontal: 4}}>
            View
          </NormalText>
        </View>
        <View style={css.deeBetween}>
          <FontAwesomeIcon icon={faBookmark} color={colors.primaryBlue} />

          <NormalText styleProp={{fontSize: 12, marginHorizontal: 4}}>
            Save
          </NormalText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '96%',
    backgroundColor: 'white',
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
  },
  upperViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: colors.primaryGrey,
    borderBottomWidth: 4,
  },
  dateViewStyle: {
    backgroundColor: colors.turqouise,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
    marginRight: 10,
  },
});
