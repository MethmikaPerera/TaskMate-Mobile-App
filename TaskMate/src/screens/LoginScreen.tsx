import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
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
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type LoginNavigationProps = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProps>();
  const BackendUrl = "https://causal-truly-liger.ngrok-free.app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch(`${BackendUrl}/TaskMate_Backend/UserLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.status) {
        const jsonValue = JSON.stringify({
          uid: data.uid,
          name: data.name,
          email: data.uemail,
          genderId: data.genderId,
          genderName: data.genderName,
          profileImg: data.profileImg,
          createdAt: data.createdAt,
        });
        try {
          await AsyncStorage.setItem("loggedUser", jsonValue);
        } catch (error) {
          console.error("Error saving user data:", error);
        }
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Login successful",
          textBody: data.message || "Welcome back!",
        });
        setTimeout(() => {
          navigation.navigate("Home");
        }, 1000);
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Login failed",
          textBody: data.message || "An error occurred",
        });
      }
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Login failed",
        textBody: data.message || "An error occurred",
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
              <Pressable style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
                <FontAwesome6
                  name="circle-chevron-left"
                  size={30}
                  color="black"
                />
              </Pressable>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../assets/logo.png")}
                  style={styles.image}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Login to TaskMate</Text>
                <Text style={styles.subtitle}>
                  Enter your credentials to continue
                </Text>
              </View>
              <View style={styles.form}>
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
              </View>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Log In</Text>
                </Pressable>
                <Pressable
                  style={styles.signupButton}
                  onPress={() => navigation.navigate("Signup")}
                >
                  <Text style={styles.signupButtonText}>
                    New to TaskMate? Sign Up
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
  imageContainer: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  titleContainer: {
    alignItems: "center",
    width: "100%",
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
    width: "75%",
    marginTop: 30,
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
    width: "75%",
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: "#0066ffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  signupButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#0066ffff",
    fontWeight: "bold",
  },
});
