import React, { useState } from "react";
import { View, Image, StyleSheet, Pressable, Platform } from "react-native";

import { Paths } from "../../utils/paths";

import NormalText from "../ui/NormalText";
import HeaderText from "../ui/HeaderText";

import { colors } from "../../assets/styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CartCard({
  productImage,
  productName,
  productQty,
  productPrice,
  productTotal,
  onDelete,
}) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.cartCard}>
      <View style={styles.topView}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: Paths.IMAGE_URL + productImage,
            }}
            style={styles.imageStyle}
          />
        </View>
        <View>
          <HeaderText styleProp={{ fontSize: 12 }}>{productName}</HeaderText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <NormalText>
              {productQty} x Ksh. {productPrice} :{" "}
            </NormalText>
            <HeaderText styleProp={{ fontSize: 12 }}>
              Ksh. {productTotal}
            </HeaderText>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingBottom: 5,
        }}
      >
        <View>
          <NormalText>In Stock</NormalText>
        </View>
        <Pressable
          onPress={onDelete}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.whiteSmoke,
          }}
        >
          <FontAwesomeIcon icon={faTrash} color={colors.primaryPink} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: 5,
  },
  cartCard: {
    width: "98%",
    backgroundColor: colors.secondaryGrey,
    margin: 5,
    borderRadius: 8,
    elevation: 4,

    // IOS
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    backgroundColor: "white",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    width: 80,
    height: 80,
    objectFit: "cover",
  },
});
