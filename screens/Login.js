import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import { AuthContext } from "../utils/auth-context";
import { SafeAreaView } from "react-native-safe-area-context";

import NormalText from "../components/ui/NormalText";
import PrimaryButton from "../components/ui/PrimaryButton";
import InputHybrid from "../components/forms/InputHybrid";
import HeaderText from "../components/ui/HeaderText";

import { css } from "../assets/styles";


export default function Login({ route, navigation }) {
  const [userType, setUserType] = useState("");
  useEffect(() => {
    if (route.params && route.params.user) {
      setUserType(route.params.user);
    }
  }, [route.params]);

  const [email, setemail] = useState(null);
  const [password, setpassword] = useState(null);
  const [loading, setloading] = useState(null);

  const authCtx = useContext(AuthContext);

  const submitForm = () => {
    const data = new FormData();
    const url = "https://hellodaktari.org/apis/auth.php";

    if (email == null || password == null) {
      Alert.alert("Enter all Fields", "please enter all fields");
    } else {
      setloading(true);
      data.append("email", email);
      data.append("password", password);
      data.append("type", userType);
      const options = {
        method: "POST",
        body: data,
      };

      fetch(url, options)
        .then((res) => res.json())
        .then(async (res) => {
          if (res.status === 1) {
            let dt = JSON.stringify(res.data);
            authCtx.authenticate(dt);
          } else {
            Alert.alert(
              "something went wrong",
              "It seems the email or password don't match our records"
            );
          }
        })
        .catch((e) => {
          Alert.alert("something went wrong", "It seems something went wrong");
        })
        .finally(() => {
          setloading(false);
        });
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <HeaderText styleProp={[css.centerText, { marginVertical: 10 }]}>Welcome Back</HeaderText>
      <NormalText styleProp={[css.centerText, { textTransform: "capitalize" }]}>
        Login To Your {userType} Account
      </NormalText>
      <View style={styles.authContent}>
        <InputHybrid
          containerStyle={styles.inputStyle}
          keyboardType="email-address"
          onChangeText={(text) => setemail(text)}
          placeholder="Email"
        />
        <InputHybrid
          containerStyle={styles.containerStyle}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setpassword(text)}
        />
        {loading ? (
          <View>
            <ActivityIndicator animating size="large" />
          </View>
        ) : (
          <PrimaryButton styleProp={styles.buttonStyle} onPress={submitForm}>
            Login
          </PrimaryButton>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authContent: {
    marginHorizontal: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  containerStyle: {
    margin: 10,
  },
  buttonStyle: {
    width: Dimensions.get("window").width - 50,
    margin: 10,
    borderRadius: 20
  },
});
