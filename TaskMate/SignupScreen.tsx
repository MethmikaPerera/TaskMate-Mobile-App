import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";

type GenderType = {
  id: number;
  name: string;
};

export default function SignupScreen() {
  const BackendUrl = "https://causal-truly-liger.ngrok-free.app/TaskMate_Backend";

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [genderOptions, setGenderOptions] = useState<GenderType[]>([]);

  useEffect(() => {
    fetchGenderOptions();
  }, []);

  const fetchGenderOptions = async () => {
    const response = await fetch(
      `${BackendUrl}/GetGenderOptions`
    );
    const data = await response.json();
    if (response.ok) {
      if (data.status) {
        setGenderOptions(data.genderOptions);
      } else {
        console.log(data.message);
      }
    } else {
      console.log("Error fetching gender options.");
    }
  };

  const handleSignup = async () => {
    if (!name || !gender || !email || !password || !confirmPassword) {
      // Handle empty fields
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      // Handle invalid email
      return;
    }
    if (password.length < 6 || password.length > 20) {
      // Handle password too short
      return;
    }
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    const response = await fetch(
      `${BackendUrl}/UserSignup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          gender: gender,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      if (data.status) {
        console.log("Signup successful:", data.message);
      } else {
        console.log("Error:", data.message);
      }
    } else {
      console.log("Error:", data.message);
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
              <View style={styles.imageContainer}>
                <Image
                  source={require("./assets/logo.png")}
                  style={styles.image}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Register to TaskMate</Text>
                <Text style={styles.subtitle}>
                  Enter your details to create an account
                </Text>
              </View>
              <View style={styles.form}>
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
                <Pressable style={styles.loginButton} onPress={handleSignup}>
                  <Text style={styles.loginButtonText}>Create Account</Text>
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
    backgroundColor: "#f4fbffff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scrollContainer: {
    flex: 1,
    width: "80%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
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
    width: "100%",
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
    gap: 20,
    width: "100%",
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
});
