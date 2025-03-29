import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';

import NormalText from '../ui/NormalText';
import MediumText from '../ui/MediumText';

import {css} from '../../assets/styles';
import {getLongDate} from '../../utils/dateFormat';
import HeaderText from '../ui/HeaderText';

export default function NavCard({image, onPress, header, text}) {
  return (
    <Pressable
      android_ripple={{color: '#ccc'}}
      style={({pressed}) => [
        styles.navCardStyle,
        pressed ? css.buttonPressed : null,
      ]}
      onPress={onPress}>
      <View>
        <Image style={styles.navImage} source={image} />
      </View>
      <View style={{marginLeft: 4}}>
        <HeaderText>{header}</HeaderText>
        <NormalText>{text}</NormalText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  navCardStyle: {
    width: '96%',
    margin: 5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 1,
    backgroundColor: 'white',
    padding: 5,
    borderWidth: 2,
    borderColor: '#edf2f2',
  },
  navImage: {
    width: 45,
    height: 45,
    resizeMode: 'cover',
  },
});
