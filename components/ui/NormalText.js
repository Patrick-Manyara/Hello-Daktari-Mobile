import React, {useState, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';

export default function NormalText({children, styleProp, boldProp, onPress}) {
  return (
    <Text
      onPress={onPress}
      style={[
        styles.primaryText,
        styleProp,
        boldProp ? {fontFamily: 'Poppins-SemiBold'} : null,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  primaryText: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
});
