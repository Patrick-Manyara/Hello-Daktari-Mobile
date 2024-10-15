import React, { useState, useEffect, useLayoutEffect } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationBell from "../../components/ui/NotificationBell";
import NormalText from "../../components/ui/NormalText";
import MediumText from "../../components/ui/MediumText";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { css } from "../../assets/styles";
import ChatListCard from "../../components/cards/ChatListCard";

export default function UserChatRooms({ navigation }) {
  const [chats, setChats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setUser(u);
    }
  };

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestore, "chats"),
      orderBy("id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
      const chatRooms = querySnapshot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);

      const filteredChats = chatRooms.filter(
        (chat) => chat.receiver === user.user_id
      );
      setChats(filteredChats);
    });

    return unsubscribe;
  }, [user.user_id]);

  const renderItem = ({ item }) => (
    <ChatListCard
      onPress={() => {
        navigation.navigate("UserChatScreen", { item: item });
      }}
      img={item.doctor.doctor_image}
      userName={item.doctor.doctor_name}
      chatName={item.chatName}
    />
  );

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      {isLoading ? (
        <LoadingOverlay message="Fetching your chat rooms" />
      ) : (
        <View>
          <MediumText>Your Chats</MediumText>
          <NormalText>List of your Chats</NormalText>

          <FlatList
            data={chats}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
