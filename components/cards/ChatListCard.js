import React from "react";
import { View, Image, StyleSheet } from "react-native";

import { Paths } from "../../utils/paths";
import getImageUri from "../../utils/imageHelper";

import HeaderText from "../ui/HeaderText";
import NormalText from "../ui/NormalText";
import IconButton from "../ui/IconButton";

import { colors } from "../../assets/styles";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

export default function ChatListCard({ img, userName, chatName, chatId, onPress, onDelete }) {
  return (
    <View style={styles.chatCard}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.imageContainerStyle}>
          <Image
            style={styles.imageStyle}
            source={{ uri: getImageUri(Paths.IMAGE_URL, img) }}
          />
        </View>
        <View style={{ marginLeft: 10 }}>
          <HeaderText styleProp={{ fontSize: 14 }} fontProp="poppins-semibold">
            {userName}
          </HeaderText>
          <NormalText>{chatName}</NormalText>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <IconButton
          iconName={faChevronCircleRight}
          styleProp={{ backgroundColor: colors.turqouise }}
          iconColor="#fff"
          onPress={onPress}
        />

        <IconButton
          iconName={faTrashCan}
          styleProp={{ backgroundColor: colors.turqouise }}
          iconColor="#fff"
          onPress={() => onDelete(chatId)}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  chatCard: {
    width: "96%",
    margin: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: colors.primaryGrey,
    borderBottomWidth: 4
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  imageContainerStyle: {
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 27,
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center"
  }
});
