import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Welcome User</Text>
              <Text style={styles.subHeaderText}>email@example.com</Text>
            </View>
            <Image source={require("./assets/logo.png")} style={styles.image} />
          </View>
          <View style={styles.bodyContainer}>
            
          </View>
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
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
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "#0077ffff",
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subHeaderText: {
    fontSize: 13,
    color: "#ffffff",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderColor: "#ffffff",
    borderWidth: 1,
  },
  bodyContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
  },
});
