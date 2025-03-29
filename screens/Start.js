import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import { StyleSheet, View } from "react-native";

import { css } from "../assets/styles/";

import ViewPagerSection from "../components/sections/ViewPagerSection";
import PrimaryButton from "../components/ui/PrimaryButton";
import TransparentButton from "../components/ui/TransparentButton";

export default function Start({ navigation }) {
  const [page, setpage] = React.useState(0);
  const ref = React.useRef();

  const handleSkip = () => {
    navigation.replace("ChoiceScreen");
  };
   
  return (
    <SafeAreaView style={css.safeAreaView}>
      <PagerView
        style={styles.viewPager}
        initialPage={0}
        ref={ref}
        onPageScroll={(e) => {
          let page = e.nativeEvent.position;
          setpage(page);
        }}
      >
        <View style={styles.pageStyle} key="0">
          <ViewPagerSection
            imageSrc={require("../assets/images/welcome1.png")}
            mainText="Consultations"
            secondaryText="Consult with our team of doctors and schedule or book specialist consultationns at your convinience."
          />

          <View style={styles.buttonView}>
            <TransparentButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(4);
              }}
            >
              SKIP
            </TransparentButton>

            <PrimaryButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(1);
              }}
            >
              NEXT
            </PrimaryButton>
          </View>
        </View>

        <View style={styles.pageStyle} key="1">
          <ViewPagerSection
            imageSrc={require("../assets/images/welcome2.png")}
            mainText="Upload Your Medical Records"
            secondaryText="Store your medical records and access them anytime you need them."
          />

          <View style={styles.buttonView}>
            <TransparentButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(4);
              }}
            >
              SKIP
            </TransparentButton>

            <PrimaryButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(2);
              }}
            >
              NEXT
            </PrimaryButton>
          </View>
        </View>

        <View style={styles.pageStyle} key="2">
          <ViewPagerSection
            imageSrc={require("../assets/images/welcome4.png")}
            mainText="Laboratory Tests"
            secondaryText="Place an order for laboratory tests, have samples collected at your convenience, and receive timely sharing of your results."
          />

          <View style={styles.buttonView}>
            <TransparentButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(4);
              }}
            >
              SKIP
            </TransparentButton>

            <PrimaryButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(3);
              }}
            >
              NEXT
            </PrimaryButton>
          </View>
        </View>

        <View style={styles.pageStyle} key="3">
          <ViewPagerSection
            imageSrc={require("../assets/images/welcome5.png")}
            mainText="Ambulance Services"
            secondaryText="Order for an ambulance and emergency evacuation"
          />

          <View style={styles.buttonView}>
            <TransparentButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(4);
              }}
            >
              SKIP
            </TransparentButton>

            <PrimaryButton
              styleProp={styles.btnStyle}
              onPress={() => {
                ref.current?.setPage(4);
              }}
            >
              NEXT
            </PrimaryButton>
          </View>
        </View>

        <View style={styles.pageStyle} key="4">
          <ViewPagerSection
            imageSrc={require("../assets/images/welcome3.png")}
            mainText="Pharmacy"
            secondaryText="Browse our selection of medications and medical supplies, and enjoy the convenience of having them delivered to your doorstep."
          />
          <PrimaryButton onPress={handleSkip} styleProp={styles.startBtnStyle}>
            Get started
          </PrimaryButton>
        </View>
      </PagerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewPager: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  startBtnStyle: {
    marginHorizontal: 10,
    marginBottom: 20,
    width: 300,
    borderRadius: 40
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnStyle: {
    width: 100,
  },
});
