import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Paths } from "../../utils/paths";
import InputHybrid from "../../components/forms/InputHybrid";
import RenderOverlay from "../../components/ui/RenderOverlay";
import { css } from "../../assets/styles";
import DisabledInput from "../../components/forms/DisabledInput";
import PaymentCard from "../../components/cards/PaymentCard";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function CheckoutScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [cartData, setCartData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadCartData();
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadCartData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadCartData = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cartItems");
      if (cartData) {
        const parsedCartData = JSON.parse(cartData);
        setCartData(parsedCartData);
        // console.log(cartData);
        setIsLoadingData(false);
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
      setIsLoadingData(false);
    }
  };

  const [inputs, setInputs] = useState({
    address_name: {
      value: "",
      isValid: true,
    },
    address_label: {
      value: "",
      isValid: true,
    },
    address_location: {
      value: "",
      isValid: true,
    },
    address_phone: {
      value: "",
      isValid: true,
    },
  });

  function handlePaymentOption(keyProp) {
    setSelectedPaymentMethod(keyProp);
  }

  function updateInputValueHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  const renderAddressDropdown = () => (
    <View>
      <HeaderText styleProp={{ fontSize: 12, color: "black" }}>
        Address
      </HeaderText>

      <Picker
        style={[css.disabledContainer, styles.customInput]}
        selectedValue={selectedAddress}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedAddress(itemValue);
        }}
      >
        <Picker.Item label="Select an address" value={null} />
        {addresses.map((item) => (
          <Picker.Item
            key={item.address_id}
            label={item.address_label}
            value={item}
          />
        ))}
      </Picker>
    </View>
  );

  const renderNewAddressForm = () => (
    <View>
      <HeaderText styleProp={{ fontSize: 12, color: "black" }}>
        Address
      </HeaderText>
      <InputHybrid
        label="Address Name"
        onChangeText={(value) => updateInputValueHandler("address_name", value)}
        value={inputs.address_name.value}
        isInvalid={!inputs.address_name.isValid}
      />
      <InputHybrid
        label="Address Label"
        onChangeText={(value) =>
          updateInputValueHandler("address_label", value)
        }
        value={inputs.address_label.value}
        isInvalid={!inputs.address_label.isValid}
      />
      <InputHybrid
        label="Address Location"
        onChangeText={(value) =>
          updateInputValueHandler("address_location", value)
        }
        value={inputs.address_location.value}
        isInvalid={!inputs.address_location.isValid}
      />
      <InputHybrid
        label="Address Phone Number"
        onChangeText={(value) =>
          updateInputValueHandler("address_phone", value)
        }
        value={inputs.address_phone.value}
        isInvalid={!inputs.address_phone.isValid}
      />
    </View>
  );

  const fetchAddresses = () => {
    setIsFetching(true);
    if (!user) return; 
    const addressurl = Paths.API_URL + "addresses.php";
    const queryParams = `action=all&user_id=${user.user_id}`;
    const url = `${addressurl}?${queryParams}`;
    try {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);
          let arr = data.addresses;
          if (Array.isArray(arr)) {
            setAddresses(data.addresses);
            // console.log(arr);
          } else {
            console.log("No addresses");
          }
        })
        .catch((error) => {
          setIsFetching(false);
          console.error("Fetch error:", error);
        });
    } catch (error) {
      setIsFetching(false);
      console.error("Request setup error:", error);
    }
  };

  const paymentOptions = [
    {
      text: "Pay with mobile money",
      img1: require("../../assets/images/mpesa.png"),
      img2: require("../../assets/images/airtel.png"),
      keyProp: "mobile",
    },
    {
      text: "Pay with Credit Card",
      img1: require("../../assets/images/visa.png"),
      img2: require("../../assets/images/mastercard.png"),
      keyProp: "card",
    },
  ];

  const checkoutHandler = async () => {
    setIsAdding(true);
    let addressIsInvalid;

    if (addresses.length === 0) {
      addressIsInvalid =
        !inputs.address_name.value ||
        !inputs.address_label.value ||
        !inputs.address_phone.value ||
        !inputs.address_location.value;
    } else {
      addressIsInvalid = !selectedAddress;
    }
    const paymentMethodValidity = !selectedPaymentMethod;
    const submitUrl = Paths.API_URL + "checkout.php";
    const formData = new FormData();
    if (addressIsInvalid || paymentMethodValidity) {
      Alert.alert("address is invalid");
      setIsAdding(false);
    } else {
      if (addresses.length === 0) {
        formData.append("address_name", inputs.address_name.value);
        formData.append("address_label", inputs.address_label.value);
        formData.append("address_phone", inputs.address_phone.value);
        formData.append("address_location", inputs.address_location.value);
      } else {
        formData.append("address_id", selectedAddress.address_id);
      }

      formData.append("user_id", user.user_id);
      formData.append("cart_data", JSON.stringify(cartData));
      formData.append("payment_method", selectedPaymentMethod);

      try {
        fetch(submitUrl, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.text())
          .then((data) => {
            emptyCart();
            setIsAdding(false);
            navigation.navigate("SuccessScreen");
          })
          .catch((error) => {
            setIsAdding(false);
            console.error("Fetch error:", error);
          });
      } catch (error) {
        setIsAdding(false);
        console.error("Request setup error:", error);
      }
    }
  };

  const emptyCart = async () => {
    try {
      setIsLoadingData(true);
      await AsyncStorage.removeItem("cartItems");
      setCartData([]);

      // Introduce a 3-second delay before setting isLoadingData to false
      setTimeout(() => {
        setIsLoadingData(false);
      }, 3000);

      ToastAndroid.show("Cart is empty", ToastAndroid.SHORT);
    } catch (error) {
      setIsLoadingData(false);
      console.error("Error emptying cart:", error);
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        {isFetching ? (
          <LoadingOverlay message="Setting all your data." />
        ) : (
          <View>
            <HeaderText>Checkout</HeaderText>
            <View style={css.viewCard}>
              <View>
                <HeaderText styleProp={{ fontSize: 12, color: "black" }}>
                  Personal Details
                </HeaderText>
                <DisabledInput
                  placeholder="Full Name"
                  inputText={user.user_name}
                />
                <DisabledInput
                  placeholder="Phone Number"
                  inputText={user.user_phone}
                />
                <DisabledInput
                  placeholder="Email Address"
                  inputText={user.user_email}
                />
              </View>
              <View>
                {addresses.length === 0 ? (
                  renderNewAddressForm()
                ) : (
                  <View>
                    {renderAddressDropdown()}
                    {selectedAddress && (
                      <View>
                        <DisabledInput
                          placeholder="Address"
                          inputText={selectedAddress.address_name}
                        />
                        <DisabledInput
                          placeholder="Location"
                          inputText={selectedAddress.address_location}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
            <View style={css.viewCard}>
              <View>
                {paymentOptions.map((option, index) => (
                  <PaymentCard
                    key={index}
                    text={option.text}
                    img1={option.img1}
                    img2={option.img2}
                    onPress={() => handlePaymentOption(option.keyProp)}
                    isSelected={selectedPaymentMethod === option.keyProp}
                  />
                ))}
              </View>
            </View>
            <PrimaryButton onPress={checkoutHandler}>Next</PrimaryButton>
          </View>
        )}
      </ScrollView>
      {isAdding && <RenderOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  customInput: {
    height: 50,
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 8,
    marginVertical: 2,
  },
});
