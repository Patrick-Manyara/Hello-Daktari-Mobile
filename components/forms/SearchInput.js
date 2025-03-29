import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import RenderOverlay from "../ui/RenderOverlay";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Paths } from "../../utils/paths";
import { colors, css } from "../../assets/styles";

export default function SearchInput({ message }) {
  const navigation = useNavigation();
  //SUBMISSION
  const [enteredQuery, setEnteredQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const url = Paths.API_URL + "search.php";

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "query":
        setEnteredQuery(enteredValue);
        break;
    }
  }

  let submitForm = async () => {
    try {
      if (enteredQuery != "") {
        setUploading(true);

        const fd = new FormData();
        fd.append("query", enteredQuery);

        let res = await fetch(url, {
          method: "POST",
          body: fd,
        });
        if (res.ok) {
          let responseJson = await res.json();
          if (responseJson.data === true) {
            navigation.navigate("SearchResultsScreen", {
              doctors: responseJson.doctors,
              labs: responseJson.labs,
              products: responseJson.products,
            });
          } else {
            Alert.alert("No results found");
            console.log("error here");
          }
        } else {
          console.log("error here");
        }

        setUploading(false);
      } else {
        setUploading(false);
        alert("Please fill all the fields first");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };


  return (
    <View style={[css.inputContainer, styles.inputStyle]}>
      <TextInput
        style={css.input}
        placeholder={`Search ${message}`}
        placeholderTextColor="black"
        onChangeText={updateInputValueHandler.bind(this, "query")}
        value={enteredQuery}
      />

      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) => [
          styles.buttonStyle,
          { marginTop: 4 },
          pressed ? css.buttonPressed : null,
        ]}
        onPress={submitForm}
      >
        <FontAwesomeIcon icon={faSearch} size={16} color={"#fff"} />
      </Pressable>
      {uploading && <RenderOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    marginVertical: 10,
  },
  buttonStyle: {
    backgroundColor: colors.turqouise,
    padding: 4,
    borderRadius: 10
  }
});
