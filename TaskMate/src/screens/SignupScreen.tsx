import { Picker } from "@react-native-picker/picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as ImagePicker from "expo-image-picker";

type GenderType = {
  id: number;
  name: string;
};

type SignupNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

export default function SignupScreen() {
  const navigation = useNavigation<SignupNavigationProps>();
  const BackendUrl = "https://causal-truly-liger.ngrok-free.app";

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [genderOptions, setGenderOptions] = useState<GenderType[]>([]);

  const fetchGenderOptions = async () => {
    const response = await fetch(
      `${BackendUrl}/TaskMate_Backend/GetGenderOptions`
    );
    const data = await response.json();
    if (response.ok) {
      setGenderOptions(data);
    } else {
      console.log("Error fetching gender options.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    fetchGenderOptions();
  }, []);

  const handleSignup = async () => {
    if (!name) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Name is required",
        textBody: "Please fill in all fields.",
      });
      return;
    }
    if (!gender || gender === "0") {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Gender is required",
        textBody: "Please select a gender.",
      });
      return;
    }
    if (!email) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Email is required",
        textBody: "Please fill in all fields.",
      });
      return;
    }
    if (!password) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Password is required",
        textBody: "Please fill in all fields.",
      });
      return;
    }
    if (!confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Confirm Password is required",
        textBody: "Please fill in all fields.",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Email",
        textBody: "Please enter a valid email address.",
      });
      return;
    }
    if (password.length < 6 || password.length > 20) {
      // Handle password too short
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Password",
        textBody: "Password must be between 6 and 20 characters.",
      });
      return;
    }
    if (password !== confirmPassword) {
      // Handle password mismatch
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Password Mismatch",
        textBody: "Passwords do not match.",
      });
      return;
    }
    if (!image) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Image is required",
        textBody: "Please select an image.",
      });
      return;
    }

    const getMimeType = (uri: string) => {
      if (uri.endsWith(".png")) return "image/png";
      if (uri.endsWith(".jpg")) return "image/jpg";
      if (uri.endsWith(".jpeg")) return "image/jpeg";
      return "application/octet-stream"; // fallback
    };

    if (getMimeType(image) === "application/octet-stream") {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Image",
        textBody: "Please select a valid image. Supported formats: .jpg, .jpeg, .png",
      });
      return;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("image", {
      uri: image,
      name: "profile" + image.substring(image.lastIndexOf(".")),
      type: getMimeType(image),
    } as any);

    const response = await fetch(`${BackendUrl}/TaskMate_Backend/UserSignup`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      if (data.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Account created successfully.",
        });
        setTimeout(() => {
          navigation.navigate("Login");
        }, 1000);
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Signup Failed",
          textBody: data.message || "An error occurred.",
        });
      }
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: data.message || "An error occurred.",
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          keyboardVerticalOffset={20}
        >
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.navigate("Welcome")}
              >
                <FontAwesome6
                  name="circle-chevron-left"
                  size={30}
                  color="black"
                />
              </Pressable>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Register to TaskMate</Text>
                <Text style={styles.subtitle}>
                  Enter your details to create an account
                </Text>
              </View>
              <View style={styles.form}>
                <View style={styles.imageInputContainer}>
                  <Pressable
                    onPress={pickImage}
                    style={styles.imageInputUploader}
                  >
                    {image ? (
                      <Image
                        source={{ uri: image }}
                        style={styles.inputProfileImage}
                      />
                    ) : (
                      <View style={styles.imageInputPlaceholder}>
                        <Text style={styles.imageInputText}>+</Text>
                        <Text style={styles.imageInputLabel}>Add Image</Text>
                        <Text style={styles.imageInputDescription}>Supported formats:</Text>
                        <Text style={styles.imageInputDescription}>.jpg, .jpeg, .png</Text>
                      </View>
                    )}
                  </Pressable>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={gender}
                      onValueChange={(itemValue) => setGender(itemValue)}
                    >
                      <Picker.Item label="Select Gender" value="" />
                      {genderOptions.map((option) => (
                        <Picker.Item
                          key={option.id}
                          label={option.name}
                          value={option.id.toString()}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.signupButton} onPress={handleSignup}>
                  <Text style={styles.signupButtonText}>Create Account</Text>
                </Pressable>
                <Pressable
                  style={styles.loginButton}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.loginButtonText}>
                    Already have an account? Log In
                  </Text>
                </Pressable>
              </View>
              <StatusBar style="auto" />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf7ffff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 20,
  },
  titleContainer: {
    marginTop: 10,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  form: {
    width: "80%",
    marginTop: 30,
    alignItems: "center",
  },
  imageInputContainer: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: "#353535ff",
    borderRadius: 100,
    borderStyle: "dashed",
    aspectRatio: 1,
    overflow: "hidden",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  imageInputUploader: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2f3ffff",
  },
  inputProfileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  imageInputPlaceholder: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
  imageInputText: {
    fontSize: 36,
    textAlign: "center",
    marginTop: 3,
    fontWeight: "bold",
    color: "#585858ff",
  },
  imageInputLabel: {
    fontSize: 12,
    color: "#777777ff",
    marginBottom: 5,
  },
  imageInputDescription: {
    textAlign: "center",
    fontSize: 10,
    color: "#777777ff",
  },
  inputContainer: {
    marginBottom: 5,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
    justifyContent: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "80%",
    marginTop: 5,
  },
  signupButton: {
    backgroundColor: "#0066ffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#0066ffff",
    fontWeight: "bold",
  },
});
