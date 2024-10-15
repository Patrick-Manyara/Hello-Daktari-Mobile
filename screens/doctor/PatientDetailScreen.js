import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  FlatList,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Paths } from "../../utils/paths";
import { colors, css } from "../../assets/styles";

import LoadingOverlay from "../../components/ui/LoadingOverlay";
import HeaderText from "../../components/ui/HeaderText";
import PrescriptionCard from "../../components/cards/PrescriptionCard";
import MediumText from "../../components/ui/MediumText";
import NormalText from "../../components/ui/NormalText";


export default function PatientDetailScreen({ route }) {
  const [patient, setPatient] = useState();
  const [addresses, setAddresses] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isSettingData, setIsSettingData] = useState(true);

  const [selectedTab, setSelectedTab] = useState("Overview");

  useEffect(() => {
    if (route.params) {
      // Set patient
      if (route.params.patient) {
        setPatient(route.params.patient);
      }

      // Set addresses
      if (route.params.addresses) {
        setAddresses(route.params.addresses);
      }

      // Set uploads
      if (route.params.uploads) {
        setUploads(route.params.uploads);
      }

      // Set sessions
      if (route.params.sessions) {
        setSessions(route.params.sessions);
      }

      // Set prescriptions
      if (route.params.prescriptions) {
        setPrescriptions(route.params.prescriptions);
      }
      setIsSettingData(false);
    }
  }, [route.params]);

  return (
    <SafeAreaView style={css.safeAreaView}>
      {isSettingData ? (
        <LoadingOverlay message="loading" />
      ) : (
        patient && (
          <View>
            <View style={css.displayStart}>
              <Image
                style={{ width: 100, height: 100, borderRadius: 50 }}
                source={{ uri: Paths.IMAGE_URL + patient.user_image }}
              />
              <View style={{ marginLeft: 10 }}>
                <HeaderText styleProp={{ fontSize: 14 }}>
                  {patient.user_name}
                </HeaderText>
                <NormalText>{patient.user_dob}</NormalText>
              </View>
            </View>

            <View style={styles.tabBar}>
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,

                  borderBottomWidth: selectedTab === "Overview" ? 2 : 0,
                  borderBottomColor:
                    selectedTab === "Overview" ? colors.primaryBlue : "black",
                }}
                onPress={() => setSelectedTab("Overview")}
              >
                <NormalText
                  boldProp={selectedTab === "Overview" ? true : false}
                  styleProp={{
                    color:
                      selectedTab === "Overview" ? colors.primaryBlue : "black",
                  }}
                >
                  Overview
                </NormalText>
              </Pressable>

              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontWeight: selectedTab === "Addresses" ? "bold" : "normal",
                  borderBottomWidth: selectedTab === "Addresses" ? 2 : 0,
                  borderBottomColor:
                    selectedTab === "Addresses" ? colors.primaryBlue : "black",
                }}
                onPress={() => setSelectedTab("Addresses")}
              >
                <NormalText
                  boldProp={selectedTab === "Addresses" ? true : false}
                  styleProp={{
                    color:
                      selectedTab === "Addresses"
                        ? colors.primaryBlue
                        : "black",
                  }}
                >
                  Addresses
                </NormalText>
              </Pressable>
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderBottomColor:
                    selectedTab === "Uploads" ? colors.primaryBlue : "black",
                  borderBottomWidth: selectedTab === "Uploads" ? 2 : 0,
                }}
                onPress={() => setSelectedTab("Uploads")}
              >
                <NormalText
                  boldProp={selectedTab === "Uploads" ? true : false}
                  styleProp={{
                    color:
                      selectedTab === "Uploads" ? colors.primaryBlue : "black",
                  }}
                >
                  Uploads
                </NormalText>
              </Pressable>
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderBottomColor:
                    selectedTab === "Prescriptions"
                      ? colors.primaryBlue
                      : "black",
                  borderBottomWidth: selectedTab === "Prescriptions" ? 2 : 0,
                }}
                onPress={() => setSelectedTab("Prescriptions")}
              >
                <NormalText
                  boldProp={selectedTab === "Prescriptions" ? true : false}
                  styleProp={{
                    color:
                      selectedTab === "Prescriptions"
                        ? colors.primaryBlue
                        : "black",
                  }}
                >
                  Prescriptions
                </NormalText>
              </Pressable>
            </View>

            {selectedTab == "Overview" && (
              <View>
                <View style={styles.detailStyle}>
                  <MediumText>Email:</MediumText>
                  <NormalText>{patient.user_email}</NormalText>
                </View>

                <View style={styles.detailStyle}>
                  <MediumText>Phone Number:</MediumText>
                  <NormalText>{patient.user_phone}</NormalText>
                </View>

                <View style={styles.detailStyle}>
                  <MediumText>Date of Birth:</MediumText>
                  <NormalText>{patient.user_dob}</NormalText>
                </View>

                <View style={styles.detailStyle}>
                  <MediumText>Weight:</MediumText>
                  <NormalText>{patient.user_weight}</NormalText>
                </View>

                <View style={styles.detailStyle}>
                  <MediumText>Height:</MediumText>
                  <NormalText>{patient.user_height}</NormalText>
                </View>

                <View style={styles.detailStyle}>
                  <MediumText>Blood Group:</MediumText>
                  <NormalText>{patient.user_blood_group}</NormalText>
                </View>
              </View>
            )}

            {selectedTab == "Addresses" &&
              (addresses.length <= 0 ? (
                <NormalText>You have no addresses saved</NormalText>
              ) : (
                <View>
                  {addresses.map((address) => (
                    <View style={styles.patientCard} key={address.address_id}>
                      <View style={styles.tagView}>
                        <HeaderText>{address.address_label}</HeaderText>
                      </View>

                      <View>
                        <NormalText>{address.address_name}</NormalText>
                        <NormalText>{address.address_location}</NormalText>
                        <NormalText>{address.address_phone}</NormalText>
                      </View>

                      <View style={{ marginVertical: 2 }}></View>
                    </View>
                  ))}
                </View>
              ))}

            {selectedTab == "Uploads" && (
              <View style={styles.uploadsViewStyle}>
                {uploads.length <= 0 ? (
                  <NormalText>You have no uploads saved</NormalText>
                ) : (
                  <FlatList
                    data={uploads}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.cardContainer}>
                        <Pressable onPress={() => { }}>
                          <View style={styles.patientCard}>
                            <View style={styles.tagView}>
                              <HeaderText styleProp={css.centerText}>
                                {item.upload_name}
                              </HeaderText>
                            </View>

                            <View style={css.displayFlex}>
                              <Image
                                source={require("../../assets/icons/folder.png")}
                                style={styles.imageStyle}
                              />
                            </View>

                            <View>
                              <NormalText styleProp={css.centerText}>
                                {item.upload_code}
                              </NormalText>
                            </View>
                          </View>
                        </Pressable>
                      </View>
                    )}
                  />
                )}
              </View>
            )}

            {selectedTab == "Prescriptions" &&
              (prescriptions.length <= 0 ? (
                <NormalText>You have no prescriptions saved</NormalText>
              ) : (
                <View>
                  <PrescriptionCard prescriptions={prescriptions} />
                </View>
              ))}
          </View>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  patientCard: {
    width: "95%",
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
  tagView: {
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    marginVertical: 5,
  },
  uploadsViewStyle: {
    width: "100%",
  },
  cardContainer: {
    width: "48%",
  },
  imageStyle: {
    width: 60,
    height: 60,
    marginBottom: 10,
    marginTop: 10,
  },

  detailStyle: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    marginVertical: 5,
  },
});
