import React, { useState, useEffect } from "react";
import { View, ScrollView, ToastAndroid, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderText from "../../components/ui/HeaderText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import NotificationBell from "../../components/ui/NotificationBell";
import AddressCard from "../../components/cards/AddressCard";
import NormalText from "../../components/ui/NormalText";
import AddressModal from "../../components/modals/AddressModal";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

import { Paths } from "../../utils/paths";
import { colors, css } from "../../assets/styles";

export default function AddressManager({ route, navigation }) {
  const [user, setUser] = useState([]);


  const [isFetching, setIsFetching] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [deleting, setIsDeleting] = useState(false);

  const [isNewModal, setIsNewModal] = useState(false);


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAddress, setModalAddress] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchAddresses(); 
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAddresses();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchUser = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setUser(u);
    }
  };

  const baseUrl = Paths.API_URL + "addresses.php";

  const fetchAddresses = (callback) => {
    if (!user) return; 

    const queryParams = `action=all&user_id=${user.user_id}`;
    const url = `${baseUrl}?${queryParams}`;
    try {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (callback) {
            callback();
          }
          setIsFetching(false);
          let arr = data.addresses;
          if (Array.isArray(arr)) {
            setAddresses(data.addresses);
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

  const removeAddress = (address_id) => {
    // Show a confirmation alert before deletion
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel", 
        },
        {
          text: "Delete",
          onPress: () => performDeletion(address_id), 
          style: "destructive", 
        },
      ],
      { cancelable: true } 
    );
  };

  const performDeletion = (address_id) => {
    setIsDeleting(true);
    const queryParams = `action=delete`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();
    formData.append("address_id", address_id);

    try {
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            ToastAndroid.show(
              "Address successfully deleted",
              ToastAndroid.SHORT
            );
            setIsDeleting(false);
            fetchAddresses(); 
          } else {
            setIsDeleting(false);
            console.error("Failed to delete address:", data.error);
          }
        })
        .catch((error) => {
          setIsDeleting(false);
          console.error("Delete address error:", error);
        });
    } catch (error) {
      setIsDeleting(false);
      console.error("Delete address request setup error:", error);
    }
  };

  const openModal = (address, isNew) => {
    setModalAddress(address);
    setIsNewModal(isNew);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        {isFetching ? (
          <LoadingOverlay message="Fetching Your Addresses" />
        ) : (
          <View>
            <HeaderText styleProp={[css.centerText, { marginVertical: 5 }]}>Your Addresses</HeaderText>


            {addresses.length > 0 ? (
              <View>
                {addresses.map((address) => (
                  <AddressCard
                    key={address.address_id}
                    address={address}
                    editAddress={() => openModal(address, false)}
                    removeAddress={() => removeAddress(address.address_id)}
                    onPress={() => handleAddressSelection(address.address_id)}
                  />
                ))}
                {isModalVisible && (
                  <AddressModal
                    visible={isModalVisible}
                    closeModal={closeModal}
                    address={modalAddress}
                    isNew={isNewModal}
                    fetchAddresses={() => fetchAddresses(closeModal)}
                    user={user.user_id}
                  />
                )}
              </View>
            ) : (
              <View>
                <NormalText>You have not saved any addresses yet. Click the button below to add a new one.</NormalText>
              </View>
            )}

            <PrimaryButton styleProp={{ backgroundColor: colors.turqouise }} onPress={() => openModal(null, true)}>Add Address</PrimaryButton>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
