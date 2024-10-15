import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Platform,
  ToastAndroid,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import RenderOverlay from "../../components/ui/RenderOverlay";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { colors, css } from "../../assets/styles";
import { Paths } from "../../utils/paths";

export default function ProductDetailsScreen({ route }) {
  const [product, setProduct] = useState({});
  const [uploading, setUploading] = useState(false);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (route.params && route.params.product) {
      setProduct(route.params.product);
    }
  }, [route.params]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async (product) => {
    setUploading(true);
    let itemArray = await AsyncStorage.getItem("cartItems");
    const newItem = { product: product, quantity: quantity };
    itemArray = JSON.parse(itemArray);
    if (itemArray) {
      let array = itemArray;

      // Check if the product already exists in the cart
      const existingProductIndex = array.findIndex(
        (item) => item.product.product_id === product.product_id
      );

      if (existingProductIndex !== -1) {
        // Product already exists, update the quantity
        array[existingProductIndex].quantity = quantity;
      } else {
        // Product doesn't exist, add it to the cart
        array.push(newItem);
      }

      try {
        await AsyncStorage.setItem("cartItems", JSON.stringify(array));
        setUploading(false);
        ToastAndroid.show(
          "Item Added Successfully to cart",
          ToastAndroid.SHORT
        );
      } catch (error) {
        setUploading(false);
        return error;
      }
    } else {
      let array = [];
      array.push(newItem);
      try {
        await AsyncStorage.setItem("cartItems", JSON.stringify(array));
        setUploading(false);
        ToastAndroid.show(
          "Item Added Successfully to cart",
          ToastAndroid.SHORT
        );
      } catch (error) {
        setUploading(false);
        return error;
      }
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <ScrollView style={{ backgroundColor: colors.secondaryGrey }}>
        <View style={styles.curvedView}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: Paths.IMAGE_URL + product.product_image,
              }}
              style={styles.imageStyle}
            />
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <View
            style={styles.innerArea}
          >
            <FontAwesomeIcon icon={faCartShopping} />
            <NormalText styleProp={{ fontSize: 12, color: colors.primaryBlue, }}>Shopping </NormalText>
          </View>

          <HeaderText>{product.product_name}</HeaderText>
          <NormalText>Ksh. {product.product_price}</NormalText>

          <View>
            <View style={css.container}>
              <Pressable onPress={handleDecrement} style={css.buttonMinus}>
                <NormalText styleProp={css.buttonText}>-</NormalText>
              </Pressable>
              <View style={css.textContainer}>
                <NormalText styleProp={css.quantityText}>{quantity}</NormalText>
              </View>

              <Pressable onPress={handleIncrement} style={css.buttonPlus}>
                <NormalText styleProp={css.buttonText}>+</NormalText>
              </Pressable>
            </View>
          </View>
          <View>
            <NormalText>{product.product_description}</NormalText>
          </View>
          <PrimaryButton onPress={() => addToCart(product)}>
            <NormalText>Add To Cart</NormalText>
          </PrimaryButton>
        </View>
      </ScrollView>
      {uploading && <RenderOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productCard: {
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
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  imageStyle: {
    width: 150,
    height: 150,
    objectFit: "contain",
    padding: 10,
  },
  curvedView: {
    height: 200,
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  innerArea: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  }
});
