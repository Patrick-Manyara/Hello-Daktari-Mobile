import React, { useState, useEffect } from "react";
import { View, FlatList, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Paths } from "../../utils/paths";
import { css } from "../../assets/styles";

import HeaderText from "../../components/ui/HeaderText";
import NotificationBell from "../../components/ui/NotificationBell";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import LabCard from "../../components/cards/LabCard";
 
export default function LabScreen({ route, navigation }) {
  const [labs, setLabs] = useState([]);
  const baseUrl = Paths.API_URL + "lab.php";
  const [isFetching, setIsFetching] = useState(true);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5; // Number of items to load at a time

  const fetchLabServices = () => {
    const apiUrl = `${baseUrl}?page=${page}&pageSize=${PAGE_SIZE}`;
    try {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);
          if (Array.isArray(data.labs)) {
            setLabs((prevLabs) => [...prevLabs, ...data.labs]);
          } else {
            console.log("No labs");
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

  useEffect(() => {
    fetchLabServices();
  }, [page]);

  const loadMore = () => {
    setPage(page + 1);
  };

  const [selectedLabs, setSelectedLabs] = useState([]);

  const handleLabCardPress = (item) => {
    const isItemInCart = selectedLabs.some((lab) => lab.lab_id === item.lab_id);

    if (isItemInCart) {
      // Remove the item from the cart
      const updatedLabs = selectedLabs.filter(
        (lab) => lab.lab_id !== item.lab_id
      );
      setSelectedLabs(updatedLabs);

      ToastAndroid.show("Item Removed From Cart", ToastAndroid.SHORT);
    } else {
      // Add the item to the cart
      setSelectedLabs((prevSelectedLabs) => [...prevSelectedLabs, item]);

      ToastAndroid.show("Item Added Successfully to cart", ToastAndroid.SHORT);
    }
  };

  const navigateToAddressScreen = () => {
    navigation.navigate("AddressScreen", { labs: selectedLabs });
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      {isFetching ? (
        <LoadingOverlay message="Getting Lab Services." />
      ) : (
        <View style={{ marginBottom: 100 }}>
          <HeaderText styleProp={css.centerText}>Select A Service</HeaderText>

          <NormalText>
            Once you've selected the lab service(s) you would like to access,
            press proceed.
          </NormalText>
          {selectedLabs && (
            <PrimaryButton onPress={navigateToAddressScreen}>
              Proceed
            </PrimaryButton>
          )}

          {labs.length > 0 ? (
            <FlatList
              data={labs}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) => (
                <LabCard
                  lab={item}
                  onPress={() => handleLabCardPress(item)}
                  isInCart={selectedLabs.some(
                    (lab) => lab.lab_id === item.lab_id
                  )}
                />
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
            />
          ) : (
            <NormalText>No addresses to display.</NormalText>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
