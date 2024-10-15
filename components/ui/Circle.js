import * as React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

export default (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={{ ...styles.circle, backgroundColor: props.color }}
    ></Pressable>
  );
};
const styles = StyleSheet.create({
  circle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    margin: 2,
  },
});
