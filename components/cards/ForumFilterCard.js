import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../assets/styles';

import NormalText from '../ui/NormalText';

export default function ForumFilterCard({categoryName, isSelected, onPress}) {
  return (
    <Pressable style={{width: 90}} onPress={onPress}>
      <View style={[styles.timeSlot, isSelected && styles.selectedStyle]}>
        <NormalText
          boldProp={isSelected ? true : false}
          styleProp={[styles.textStyle]}>
          {categoryName}
        </NormalText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  timeSlot: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '95%',
    height: 30,
  },
  textStyle: {
    fontSize: 8,
    color: 'black',
    textTransform: 'capitalize',
  },
  selectedStyle: {
    borderBottomColor: colors.primaryBlue,
    borderBottomWidth: 4,
  },
});
