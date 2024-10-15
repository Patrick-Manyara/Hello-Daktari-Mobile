// components/BufferScreen.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import NormalText from '../ui/NormalText';

const BufferScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#075E54" />
      <NormalText style={styles.text}>Hang on while Hello Daktari Call Management System tries to make a connection...</NormalText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5FA',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#075E54',
  },
});

export default BufferScreen;
