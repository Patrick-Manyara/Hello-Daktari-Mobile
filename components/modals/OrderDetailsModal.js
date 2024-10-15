import React from "react";
import { Modal, View, StyleSheet, Image } from "react-native";

import NormalText from "../ui/NormalText";
import TransparentButton from "../ui/TransparentButton";

import { Paths } from "../../utils/paths";
import { colors } from "../../assets/styles";

export default function OrderDetailsModal({ isVisible, onClose, orderData }) {
  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.modalInnerView}>
          {orderData.map((order) => (
            <View style={styles.cardStyle}>
              <View key={order.product_id}>
                <Image
                  source={{
                    uri: Paths.IMAGE_URL + order.product_image,
                  }}
                  style={styles.imageStyle}
                />
              </View>
              <View key={order.id} style={{ marginLeft: 3 }}>
                <NormalText
                  styleProp={{ fontSize: 10 }}
                  fontProp="poppins-semibold"
                >
                  {order.product_name}
                </NormalText>
                <NormalText>QTY: {order.quantity}</NormalText>
                <NormalText>Ksh. {order.total_price}</NormalText>
              </View>
            </View>
          ))}
          <TransparentButton onPress={onClose}>Close</TransparentButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)", 
  },
  modalInnerView: {
    width: "80%", 
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  cardStyle: {
    backgroundColor: colors.whiteSmoke,
    alignItems: "center",
    marginVertical: 5,
    padding: 2,
    borderRadius: 5,
    flexDirection: "row",
  },
});
