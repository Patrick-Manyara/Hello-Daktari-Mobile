import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { AuthContext } from "../utils/auth-context";

export default function Home() {
  const authCtx = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>HOME</Text>
      <Pressable
        onPress={authCtx.logout}
        style={{ margin: 10, backgroundColor: "#007fff" }}
      >
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
