import { StatusBar } from "expo-status-bar";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require("./assets/welcome-img.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to TaskMate!</Text>
          <Text style={styles.subtitle}>Your every day task manager.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </Pressable>
          <Pressable style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>
        </View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4fbffff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  image: {
    width: 400,
    height: 300,
  },
  titleContainer: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: "100%",
    marginTop: 30,
  },
  loginButton: {
    backgroundColor: "#0066ffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: "#36ac00ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
