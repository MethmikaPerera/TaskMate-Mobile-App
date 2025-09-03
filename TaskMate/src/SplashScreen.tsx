import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { RootStackParamList } from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SplashNavigationProps = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProps>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem("loggedUser");
      if (user) {
        navigation.replace("Home");
      } else {
        navigation.replace("Welcome");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      fetchUserData();
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.titleText}>TaskMate</Text>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf7ffff",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  titleText: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
});
