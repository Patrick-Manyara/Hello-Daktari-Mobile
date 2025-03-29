import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  Pressable,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatMonthToMonthName, getOrdinalDateAndTime, } from "../../utils/dateFormat";
import { Paths } from "../../utils/paths";
import { colors, css } from "../../assets/styles";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import OrderDetailsModal from "../../components/modals/OrderDetailsModal";
 

export default function ShoppingHistoryScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const [ordersGrouped, setGroupedOrdersByMonthAndOrderId] = useState(null);

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

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = () => {
    if (!user) return;
    const baseUrl = Paths.API_URL + "profile.php";
    const queryParams = `action=orders&user_id=${user.user_id}`;
    const url = `${baseUrl}?${queryParams}`;
    try {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);
          let arr = data.orders;
          if (Array.isArray(arr)) {
            setOrders(data.orders);
            const groupedData = processOrders(data.orders); 
            setGroupedOrdersByMonthAndOrderId(groupedData); 
          } else {
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

  // Define a function to process and group the orders
  const processOrders = (ordersData) => {
    // Sort the orders by date_created in descending order (latest to oldest).
    const sortedOrders = ordersData.sort((a, b) => {
      const dateA = new Date(a.date_created);
      const dateB = new Date(b.date_created);
      return dateB - dateA;
    });

    // Group the orders by month.
    const groupedOrdersByMonth = sortedOrders.reduce((groups, order) => {
      const dateCreated = new Date(order.date_created);
      const monthYear = `${dateCreated.getFullYear()}-${(
        dateCreated.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }

      groups[monthYear].push(order);
      return groups;
    }, {});

    // Now, within each month, group the orders by order_id.
    const groupedOrdersByMonthAndOrderId = Object.keys(
      groupedOrdersByMonth
    ).reduce((result, month) => {
      const orders = groupedOrdersByMonth[month];
      const groupedOrders = orders.reduce((groups, order) => {
        if (!groups[order.order_id]) {
          groups[order.order_id] = [];
        }
        groups[order.order_id].push(order);
        return groups;
      }, {});
      result[month] = groupedOrders;
      return result;
    }, {});

    return groupedOrdersByMonthAndOrderId; // Return the processed data
  };

  // Add an event listener to refetch addresses when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrders();
    });

    return unsubscribe;
  }, [navigation]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState([]);

  const openOrderDetailsModal = (orderData) => {
    setSelectedOrderData(orderData);
    setModalVisible(true);
  };

  const closeOrderDetailsModal = () => {
    setModalVisible(false);
    setSelectedOrderData([]);
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        {isFetching ? (
          <LoadingOverlay message="Fetching products." />
        ) : (
          <View>
            <HeaderText>Order History</HeaderText>
            <NormalText>
              Click on the order icon to view more details about each order.
            </NormalText>
            <View>
              {ordersGrouped ? (
                Object.keys(ordersGrouped).map((month, index) => (
                  <View key={month} style={{ marginVertical: 10 }}>
                    <HeaderText styleProp={styles.headerText} fontProp="poppins-semibold">
                      {formatMonthToMonthName(month)}:
                    </HeaderText>
                    <View>
                      {Object.keys(ordersGrouped[month]).map((orderId) => (
                        <View key={orderId} style={styles.historyCard}>
                          <View>
                            <NormalText styleProp={styles.codeText} fontProp="poppins-semibold">
                              Order Code:
                              {ordersGrouped[month][orderId][0].order_code}
                            </NormalText>
                            <NormalText>
                              {getOrdinalDateAndTime(
                                ordersGrouped[month][orderId][0].date_created
                              )}
                            </NormalText>

                            <NormalText fontProp="poppins-semibold">
                              Ksh.
                              {ordersGrouped[month][orderId][0].order_amount}
                            </NormalText>
                          </View>

                          <View key={ordersGrouped[month][orderId][0].id}>
                            <Pressable
                              android_ripple={{ color: "#ccc" }}
                              style={({ pressed }) => [
                                css.button,
                                styles.orderBtn,
                                pressed ? css.buttonPressed : null,
                              ]}
                              onPress={() =>
                                openOrderDetailsModal(
                                  ordersGrouped[month][orderId]
                                )
                              }
                            >
                              <Image
                                source={require("../../assets/icons/cargo.png")}
                                style={styles.orderImg}
                              />
                            </Pressable>
                          </View>

                          <OrderDetailsModal
                            isVisible={isModalVisible}
                            onClose={closeOrderDetailsModal}
                            orderData={selectedOrderData}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <Text>Loading data...</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  historyCard: {
    width: "96%",
    backgroundColor: colors.primaryBlue,
    margin: 5,
    borderRadius: 5,
    elevation: 1,
    padding: 5,
    // IOS
    shadowColor: "black",
    shadowOpacity: 0.125,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    backgroundColor: "white",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    //LAYOUT
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "black",
    fontSize: 16,
  },
  codeText: {
    fontSize: 12,
    color: colors.primaryBlue,
  },
  orderBtn: {
    width: 50,
    height: 50,
    backgroundColor: colors.secondaryGrey,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  orderImg: {
    width: 30,
    height: 30,
    objectFit: "contain",
  },
});
