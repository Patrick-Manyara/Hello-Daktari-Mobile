import React, { useState } from "react";
import { View, StyleSheet, Modal, } from "react-native";

import { Paths } from "../../utils/paths";
import { colors } from "../../assets/styles";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import TransparentButton from "../ui/TransparentButton";
import InputHybrid from "../forms/InputHybrid";
import IconButton from "../ui/IconButton";
import RenderOverlay from "../ui/RenderOverlay";

export default function AddressModal({
  visible,
  closeModal,
  address,
  isNew,
  fetchAddresses,
  user
}) {
  const [uploading, setUploading] = useState(false);

  const [inputs, setInputs] = useState({
    address_name: {
      value: isNew ? "" : address.address_name,
      isValid: true,
    },
    address_label: {
      value: isNew ? "" : address.address_label,
      isValid: true,
    },
    address_location: {
      value: isNew ? "" : address.address_location,
      isValid: true,
    },
    address_phone: {
      value: isNew ? "" : address.address_phone,
      isValid: true,
    },
  });

  function updateInputValueHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  const baseUrl = Paths.API_URL + "addresses.php";

  const submitAddressData = async () => {
    setUploading(true);
    const action = isNew ? "add" : "update"; // Determine action based on isNew
    const queryParams = `action=${action}`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();
    formData.append("address_name", inputs.address_name.value);
    formData.append("address_label", inputs.address_label.value);
    formData.append("address_phone", inputs.address_phone.value);
    formData.append("address_location", inputs.address_location.value);
    if (!isNew) {
      formData.append("address_id", address.address_id);
    }
    formData.append("user_id", user);


    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setUploading(false);
      fetchAddresses();
    } catch (error) {
      setUploading(false);
      console.error("Request error:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.modalInnerView}>
          <View>
            <InputHybrid
              containerStyle={styles.titleInput}
              placeholder="Enter The Title Of Your Address"
              label="Address Name"
              onChangeText={(value) =>
                updateInputValueHandler("address_name", value)
              }
              value={inputs.address_name.value}
              isInvalid={!inputs.address_name.isValid}
              placeholderTextColor="#7A8B8B"
              inputStyle={styles.inputStyle}
            />

            <InputHybrid
              containerStyle={styles.titleInput}
              placeholder="Address label"
              label="Address label"
              onChangeText={(value) =>
                updateInputValueHandler("address_label", value)
              }
              value={inputs.address_label.value}
              isInvalid={!inputs.address_label.isValid}
              placeholderTextColor="#7A8B8B"
              inputStyle={styles.inputStyle}
            />

            <InputHybrid
              containerStyle={styles.titleInput}
              placeholder="Address location"
              label="Address location"
              onChangeText={(value) =>
                updateInputValueHandler("address_location", value)
              }
              value={inputs.address_location.value}
              isInvalid={!inputs.address_location.isValid}
              placeholderTextColor="#7A8B8B"
              inputStyle={styles.inputStyle}
            />

            <InputHybrid
              containerStyle={styles.titleInput}
              placeholder="Address phone"
              label="Address phone"
              onChangeText={(value) =>
                updateInputValueHandler("address_phone", value)
              }
              value={inputs.address_phone.value}
              isInvalid={!inputs.address_phone.isValid}
              placeholderTextColor="#7A8B8B"
              inputStyle={styles.inputStyle}
            />

            <TransparentButton onPress={submitAddressData}>
              Post
            </TransparentButton>
          </View>
          <IconButton
            styleProp={styles.iconButton}
            iconSize={24}
            iconName={faClose}
            iconColor="black"
            onPress={closeModal}
          />
        </View>
      </View>
      {uploading && <RenderOverlay />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalInnerView: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  titleInput: {
    borderRadius: 8,
    padding: 8,
    // height: 50,
  },
  inputStyle: {
    fontSize: 12,
  },
  iconButton: {
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: colors.primaryPink,
  },
});
