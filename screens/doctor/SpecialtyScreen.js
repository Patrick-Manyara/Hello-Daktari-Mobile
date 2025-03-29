import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Pressable, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import RenderOverlay from "../../components/ui/RenderOverlay";

import { Paths } from "../../utils/paths";
import { colors, css } from "../../assets/styles";

export default function SpecialtyScreen({ navigation }) {
  const [catList, setCatList] = useState("");
  const [catIds, setCatIds] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [doctor, setDoctor] = useState([]);
  const [doctorCategories, setDoctorCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setDoctor(u);
      updateCatIds(u.category_id); 
      fetchSpecialties();
    }
  };

  const fetchSpecialties = () => {
    const fetchurl = Paths.API_URL + "doctor.php?action=categories";
    try {
      fetch(fetchurl)
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);
          setDoctorCategories(data.categories);
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
    const unsubscribe = navigation.addListener("focus", () => {
      fetchDoctor();
      fetchSpecialties();
    });

    return unsubscribe;
  }, [navigation]);

  const updateCatIds = (category_id) => {
    if (category_id) {
      setCatList(category_id);

      if (category_id.includes("|")) {
        setCatIds(category_id.split("|"));
      } else {
        setCatIds([category_id]);
      }
    }
  };

  useEffect(() => {
    setSelectedCategories(catIds);
  }, [catIds]);

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
    }
  };

  //UPLOADING
  const [isUpdating, setIsUpdating] = useState(false);

  const submitCategoryData = async () => {
    setIsUpdating(true);
    const baseUrl = Paths.API_URL + "doctor.php";
    const queryParams = `action=update_specialties`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();
    formData.append("categories", selectedCategories);
    formData.append("doctor_id", doctor.doctor_id);
    try {
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setIsUpdating(false);
          navigation.navigate("MyBioScreen");
        })
        .catch((error) => {
          setIsUpdating(false);
          console.error("Fetch error:", error);
        });
    } catch (error) {
      setIsUpdating(false);
      console.error("Request setup error:", error);
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <ScrollView>
        <NormalText>
          Choose your area of specialty. Multiple may be selected.
        </NormalText>
        <View style={styles.container}>
          {doctorCategories.map((category) => (
            <Pressable
              key={category.doc_category_id}
              style={({ pressed }) => [
                {
                  borderWidth: selectedCategories.includes(
                    category.doc_category_id
                  )
                    ? 2
                    : 0,
                },
                styles.categoryStyle,
                pressed ? css.buttonPressed : null,
              ]}
              onPress={() => toggleCategory(category.doc_category_id)}
            >
              <Image
                style={{ width: 100, height: 100 }}
                source={{ uri: Paths.IMAGE_URL + category.doc_category_image }}
              />
              <NormalText styleProp={css.centerText}>
                {category.doc_category_name}
              </NormalText>
            </Pressable>
          ))}
        </View>
        <PrimaryButton onPress={submitCategoryData}>Update</PrimaryButton>
      </ScrollView>
      {isUpdating && <RenderOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    flexWrap: "wrap", 
    width: "100%",
    justifyContent: "flex-start",
  },
  categoryStyle: {
    flexBasis: "45%",
    width: "45%", 
    aspectRatio: 1, 
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.primaryBlue,
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
});
