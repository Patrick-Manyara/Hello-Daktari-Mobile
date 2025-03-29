import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Pressable, Animated , Platform} from "react-native";

import NormalText from "../ui/NormalText";
import HeaderText from "../ui/HeaderText";

import { Paths } from "../../utils/paths";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBagShopping, faCheck } from "@fortawesome/free-solid-svg-icons";
import { colors } from "../../assets/styles";

export default function ProductCard({ product, onPress, onAddToCart }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    if (isAddedToCart) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Adjust the duration as needed
        useNativeDriver: false, // Add this line for non-native driver
      }).start();
    }
  }, [isAddedToCart, fadeAnim]);

  const handleAddToCart = () => {
    onAddToCart();
    setIsAddedToCart(true);
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Pressable onPress={onPress}>
          <Image
            source={{
              uri: Paths.IMAGE_URL + product.product_image,
            }}
            style={styles.imageStyle}
          />
        </Pressable>
      </View>
      <View style={styles.textBlock}>
        <Pressable onPress={onPress}>
          <HeaderText styleProp={{ fontSize: 12 }}>
            {product.product_name}
          </HeaderText>
        </Pressable>

        <NormalText>Ksh. {product.product_price}</NormalText>
        <NormalText>{product.product_offer_price}</NormalText>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <View style={styles.tagContainer}>
          {isAddedToCart ? (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Pressable onPress={() => handleAddToCart()}>
                <FontAwesomeIcon
                  size={20}
                  icon={faCheck}
                  color={colors.colorSuccess100}
                />
              </Pressable>
            </Animated.View>
          ) : (
            <Pressable onPress={() => handleAddToCart()}>
              <FontAwesomeIcon
                size={20}
                icon={faBagShopping}
                color={colors.primaryBlue}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: "45%",
    backgroundColor: colors.secondaryGrey,
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    padding: 5,
    // IOS
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    backgroundColor: "white",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  imageStyle: {
    width: 100,
    height: 100,
    objectFit: "cover",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tagContainer: {
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.primaryBlue,
    padding: 2,
  },
});
