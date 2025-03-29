export default function UserRegister({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGender, setSelectedGender] = useState();

  const [inputs, setInputs] = useState({
    user_name: { value: "", isValid: true },
    user_email: { value: "", isValid: true },
    user_phone: { value: "", isValid: true },
    user_password: { value: "", isValid: true },
    confirm_password: { value: "", isValid: true },
    user_passport: { value: "", isValid: true },
    user_dob: { value: "", isValid: true },
    user_blood_group: { value: "", isValid: true },
    user_weight: { value: "", isValid: true },
    user_height: { value: "", isValid: true }
  });

  function updateInputValueHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  const [selectedDate, setSelectedDate] = useState(() => {
    return user.user_dob ? new Date(user.user_dob) : new Date();
  });

  useEffect(() => {
    if (user.user_dob) {
      const dobDate = new Date(user.user_dob);
      if (!isNaN(dobDate)) {
        setSelectedDate(dobDate);
      }
    }
  }, [user.user_dob]);

  //DATES

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    setSelectedDate(date); // Update selected date
    updateInputValueHandler("user_dob", date.toISOString().split("T")[0]); // Update user_dob in YYYY-MM-DD format
    hideDatePicker();
  };


  //SUBMITTING

  const baseUrl = Paths.API_URL + "register.php?action=user";

  const registerUser = async () => {
    setIsSubmitting(true);

    const queryParams = `action=update`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();

    const fileToUpload = enteredImage;
    formData.append("user_phone", inputs.user_phone.value);

    // const formattedDate = selectedDate.toISOString().split("T")[0];
    formData.append("user_dob", inputs.user_dob.value);

    formData.append("user_height", inputs.user_height.value);
    formData.append("user_weight", inputs.user_weight.value);

    formData.append("user_name", inputs.user_name.value);
    formData.append("user_email", inputs.user_email.value);
    formData.append("user_password", inputs.user_password.value);
    formData.append("user_gender", selectedGender);

    formData.append("user_blood_group", inputs.user_blood_group.value);

    formData.append("user_id", user.user_id);
    if (enteredImage != "") {
      formData.append("user_image", {
        type: "image/*",
        uri: enteredImage[0].uri,
        name: enteredImage[0].name,
      });
    }
    console.log(formData)
    try {
      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data; ",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          newtoken = JSON.stringify(data.token);
          AsyncStorage.setItem("token", newtoken);
          setIsSubmitting(false);
        })
        .catch((error) => {
          setIsSubmitting(false);
          console.error("Fetch error:", error);
        });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Request setup error:", error);
    }
  };



  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <HeaderText styleProp={css.centerText}>Create Your Profile</HeaderText>
        <View>
          <InputHybrid
            placeholder="Enter Your Name"
            onChangeText={(value) =>
              updateInputValueHandler("user_name", value)
            }
            isInvalid={false}
            label="Your Name"
          />

          <InputHybrid
            placeholder="Enter Your Email"
            onChangeText={(value) =>
              updateInputValueHandler("user_email", value)
            }
            isInvalid={false}
            label="Your Email"
          />

          <InputHybrid
            placeholder="Enter Your ID Number"
            onChangeText={(value) =>
              updateInputValueHandler("user_passport", value)
            }
            isInvalid={false}
            label="Your ID Number"
          />

          <InputHybrid
            placeholder="Enter Your Password"
            onChangeText={(value) =>
              updateInputValueHandler("user_password", value)
            }
            isInvalid={false}
            label="Your Password"
          />

          <Picker
            selectedValue={selectedGender}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedGender(itemValue)
            }>
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>


          <InputHybrid
            placeholder="Confirm Your Password"
            onChangeText={(value) =>
              updateInputValueHandler("confirm_password", value)
            }
            isInvalid={false}
            label="Your Password"
          />


          <InputHybrid
            placeholder="Enter Your Phone Number"
            onChangeText={(value) =>
              updateInputValueHandler("user_phone", value)
            }
            isInvalid={false}
            label="Your Phone Number"
          />

          <Pressable onPress={showDatePicker} style={[css.disabledContainer, { flexDirection: "row", paddingVertical: 10, justifyContent: "space-between" }]} >
            <NormalText>Choose Your Date Of Birth</NormalText>
            <Image style={{ width: 20, height: 20, objectFit: "contain", }} source={require('../../assets/icons/date.png')} />
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MediumText>Your saved Date of Birth is: </MediumText>
            <NormalText>{selectedDate.toDateString()}</NormalText>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <InputHybrid
            placeholder="Enter Your Blood Group"
            label="Your Blood Group"
            onChangeText={(value) =>
              updateInputValueHandler("user_blood_group", value)
            }
            isInvalid={false}

          />

          <InputHybrid
            placeholder="Enter Your Height"
            label="Your Height"
            onChangeText={(value) =>
              updateInputValueHandler("user_height", value)
            }
            isInvalid={false}
          />

          <InputHybrid
            placeholder="Enter Your Weight in Kg"
            label="Your Weight in Kg"
            onChangeText={(value) =>
              updateInputValueHandler("user_weight", value)
            }
            isInvalid={false}
            keyboardType="numeric"
          />

          <PrimaryButton onPress={registerUser}>
            Sign Up
          </PrimaryButton>
        </View>
        {isSubmitting && <RenderOverlay />}
      </ScrollView>
    </SafeAreaView>
  );
}
