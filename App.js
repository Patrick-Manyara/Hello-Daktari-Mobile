import { StatusBar } from "expo-status-bar";
import { StyleSheet, AppRegistry, Platform } from "react-native";
import Navigation from "./Navigation";
import { default as theme } from "./custom-theme.json";
import { default as mapping } from "./mapping.json";

export default function App() {

  return (
    <>
      <StatusBar style="light" />
      <Navigation />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
