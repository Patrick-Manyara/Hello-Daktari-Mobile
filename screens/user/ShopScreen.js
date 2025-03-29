import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  ScrollView,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Paths } from "../../utils/paths";
import { css } from "../../assets/styles";
 
import ProductCard from "../../components/cards/ProductCard";
import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import InputHybrid from "../../components/forms/InputHybrid";

export default function ShopScreen({ route, navigation }) {
  const [products, setProducts] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); 

  //fetching
  const productsUrl = Paths.API_URL + "products.php?action=all";
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    try {
      fetch(productsUrl)
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);
          const productData = data.products;
          setProducts(productData);
          setInitialProducts(data.products);
        })
        .catch((error) => {
          setIsFetching(false);
          console.error("Fetch error:", error);
        });
    } catch (error) {
      setIsFetching(false);
      console.error("Request setup error:", error);
    }
  }, []);

  const navigateToSingleProduct = (product) => {
    navigation.navigate("ProductDetailsScreen", { product: product });
  };

  //ADD TO CART
  const addToCart = async (product) => {
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
        ToastAndroid.show(
          "Item Added Successfully to cart",
          ToastAndroid.SHORT
        );
      } catch (error) {
        return error;
      }
    } else {
      let array = [];
      array.push(newItem);
      try {
        await AsyncStorage.setItem("cartItems", JSON.stringify(array));
        ToastAndroid.show(
          "Item Added Successfully to cart",
          ToastAndroid.SHORT
        );
      } catch (error) {
        return error;
      }
    }
  };

  //SEARCH
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filteredProducts = initialProducts.filter((product) =>
        product.product_name.toLowerCase().includes(text.toLowerCase())
      );
      setProducts(filteredProducts);
    } else {
      setProducts(initialProducts);
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        {isFetching ? (
          <LoadingOverlay message="Fetching products." />
        ) : (
          <View>
            <HeaderText styleProp={[css.centerText, { marginVertical: 5 }]}>Pharmacy</HeaderText>
            <InputHybrid
              onChangeText={handleSearch}
              placeholder="Search for products"
              value={searchQuery}
              inputStyle={styles.searchInput}
            />

            {products && (
              <View style={styles.productContainer}>
                {products.map((product, index) => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                    onPress={() => navigateToSingleProduct(product)}
                    style={styles.column}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "row", 
    flexWrap: "wrap", 
    width: "100%",
    justifyContent: "flex-start",
  },
  column: {
    flexBasis: "50%", 
  },
});
