import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import InputHybrid from "../../components/forms/InputHybrid";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { colors, css } from "../../assets/styles";
import { Paths } from "../../utils/paths";


export default function ChatScreen({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [doctor, setDoctor] = useState([]);
  const [messages, setMessages] = useState([]);
  const [item, setItem] = useState({});

  useEffect(() => {
    if (route.params && route.params.item) {
      setItem(route.params.item);
    }
  }, [route.params]);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setDoctor(u);
    }
  };

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      id: id,
      roomId: item.id,
      timeStamp: timeStamp,
      message: message,
      user: item.user,
      doctor: item.doctor,
      sender: item.doctor.doctor_id,
      receiver: item.user.user_id,
    };
    setMessage("");

    if (message !== "") {
      await addDoc(
        collection(doc(firestore, "chats", item.id), "messages"),
        _doc
      )
        .then(() => {})
        .catch((err) => alert(err));
    } else {
      Alert.alert("Empty");
    }
  };

  useLayoutEffect(() => {
    if (item && item.id) {
      const msgQuery = query(
        collection(firestore, "chats", item.id, "messages"),
        orderBy("timeStamp", "asc")
      );

      const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
        const upMsg = querySnap.docs.map((doc) => doc.data());
        setMessages(upMsg);
        setIsLoading(false);
      });

      return unsubscribe;
    }
  }, [navigation, item]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 2, backgroundColor: "white" }}
    >
      <HeaderText styleProp={css.centerText}>{item.chatName}</HeaderText>
      <View style={styles.outerView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={140}
        >
          <View style={{ flex: 1 }}>
            <ScrollView> 
              {isLoading ? (
                <>
                  <LoadingOverlay message="Getting your messages..." />
                </>
              ) : (
                <>
                  {messages?.map((msg, i) =>
                    msg.sender === doctor.doctor_id ? (
                      <>
                        <View style={{ margin: 4 }} key={i}>
                          <View style={styles.senderTextStyle}>
                            <NormalText styleProp={{ color: "white" }}>
                              {msg.message}
                            </NormalText>
                          </View>

                          <View style={{ alignSelf: "flex-end" }}>
                            {msg?.timeStamp?.seconds && (
                              <NormalText>
                                {new Date(
                                  parseInt(msg?.timeStamp?.seconds) * 1000
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })}
                              </NormalText>
                            )}
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.receiverTextArea} key={i}>
                          <View style={styles.receiverInner}>
                            <View>
                              <Image
                                source={{
                                  uri:
                                    Paths.IMAGE_URL +
                                    (msg?.user?.user_image === null
                                      ? "default.png"
                                      : msg?.user?.user_image),
                                }}
                                resizeMode="cover"
                                style={styles.userAvatar}
                              />
                            </View>

                            <View style={{ marginLeft: 4 }}>
                              <View style={styles.receiverTextStyle}>
                                <NormalText styleProp={{ color: "white" }}>
                                  {msg.message}
                                </NormalText>
                              </View>

                              <View style={{ alignSelf: "flex-start" }}>
                                {msg?.timeStamp?.seconds && (
                                  <NormalText>
                                    {new Date(
                                      parseInt(msg?.timeStamp?.seconds) * 1000
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    })}
                                  </NormalText>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </>
                    )
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.inputAreaCover}>
              <View style={styles.inputArea}>
                <Pressable onPress={() => {}}></Pressable>

                <InputHybrid
                  containerStyle={styles.containerStyle}
                  inputStyle={styles.txtInput}
                  onChangeText={(text) => setMessage(text)}
                  value={message}
                  placeholder="Type Here..."
                  placeholderTextColor="black"
                />

                
              </View>
              <Pressable onPress={sendMessage}>
                <FontAwesomeIcon icon={faPaperPlane} size={24} color="black" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerView: {
    borderRadius: 24,
    paddingHorizontal: 8,
    flex: 1,
  },
  txtInput: {
    flex: 1,
    height: 32,
    fontSize: 12,
    color: "#000",
    marginLeft: 5,
    width: "100%",
    alignSelf: "flex-start",
  },

  senderTextStyle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: "#007fff",
    alignSelf: "flex-end",
  },
  receiverTextStyle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: colors.primaryPink,
    alignSelf: "flex-start",
  },
  inputAreaCover: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  inputArea: {
    backgroundColor: colors.secondaryGrey,
    borderRadius: 16,
    paddingHorizontal: 4,
    marginHorizontal: 4,
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  receiverTextArea: {
    justifyContent: "flex-start",
    marginVertical: 4,
  },
  receiverInner: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 4,
  },
  userAvatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },

  containerStyle: {
    height: 40,
    justifyContent: "space-between",
    paddingHorizontal: 1,
    paddingVertical: 1,
    width: "100%",
  },
});
