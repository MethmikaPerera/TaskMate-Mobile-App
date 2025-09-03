import { StatusBar } from "expo-status-bar";
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
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";

type ProfileNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

type User = {
  uid: number;
  name: string;
  email: string;
  genderId: number;
  genderName: string;
  profileImg: string;
  createdAt: string;
};

export default function UserProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProps>();
  const BackendUrl = "https://causal-truly-liger.ngrok-free.app";

  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem("loggedUser");
      if (user) {
        setUser(JSON.parse(user));
      } else {
        setUser(null);
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Update failed",
        textBody: "All fields are required.",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Update failed",
        textBody: "New password and confirmation do not match.",
      });
      return;
    }

    const response = await fetch(`${BackendUrl}/TaskMate_Backend/UpdatePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.status) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Update successful",
          textBody: "Your password has been updated.",
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Update failed",
          textBody: data.message || "An error occurred",
        });
      }
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Update failed",
        textBody: data.message || "An error occurred",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("loggedUser");
      setUser(null);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={10}
          style={styles.container}
        >
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <FontAwesome6
                  name="circle-chevron-left"
                  size={30}
                  color="black"
                />
              </Pressable>
              <View style={styles.profileHeader}>
                <Text style={styles.profileHeaderText}>Your Profile</Text>
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImageWrapper}>
                    <Image
                      source={{
                        uri:
                          BackendUrl +
                          "/TaskMate_Backend/uploads/users/" +
                          user?.profileImg,
                      }}
                      style={styles.profileImage}
                    />
                  </View>
                </View>
                <View style={styles.profileDetails}>
                  <View style={styles.profileDataContainer}>
                    <Text style={styles.profileDataLabel}>Name</Text>
                    <Text style={styles.profileDataValue}>{user?.name}</Text>
                  </View>
                  <View style={styles.profileDataContainer}>
                    <Text style={styles.profileDataLabel}>Email</Text>
                    <Text style={styles.profileDataValue}>{user?.email}</Text>
                  </View>
                  <View style={styles.profileDataContainer}>
                    <Text style={styles.profileDataLabel}>Gender</Text>
                    <Text style={styles.profileDataValue}>
                      {user?.genderName}
                    </Text>
                  </View>
                  <View style={styles.profileDataContainer}>
                    <Text style={styles.profileDataLabel}>Since</Text>
                    <Text style={styles.profileDataValue}>
                      {user?.createdAt}
                    </Text>
                  </View>
                  <View style={styles.logoutContainer}>
                    <Pressable
                      style={styles.logoutButton}
                      onPress={handleLogout}
                    >
                      <Text style={styles.logoutButtonText}>Log Out</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.passwordUpdateContainer}>
                  <Text style={styles.passwordUpdateLabel}>
                    Update Password
                  </Text>
                  <View style={styles.passwordInputContainer}>
                    <Text style={styles.profileDataLabel}>
                      Current Password
                    </Text>
                    <TextInput
                      style={styles.profileInput}
                      secureTextEntry
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                    />
                  </View>
                  <View style={styles.passwordInputContainer}>
                    <Text style={styles.profileDataLabel}>New Password</Text>
                    <TextInput
                      style={styles.profileInput}
                      secureTextEntry
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                  </View>
                  <View style={styles.passwordInputContainer}>
                    <Text style={styles.profileDataLabel}>
                      Confirm New Password
                    </Text>
                    <TextInput
                      style={styles.profileInput}
                      secureTextEntry
                      value={confirmNewPassword}
                      onChangeText={setConfirmNewPassword}
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={styles.updatePasswordButton}
                      onPress={handleUpdatePassword}
                    >
                      <Text style={styles.updatePasswordButtonText}>
                        Update Password
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
            <StatusBar style="auto" />
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
  profileHeader: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#202020ff",
  },
  profileInfo: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    width: "90%",
  },
  profileImageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageWrapper: {
    borderRadius: 50,
    overflow: "hidden",
    marginVertical: 15,
    borderWidth: 2,
    borderColor: "#2e2e2eff",
    borderStyle: "dashed",
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  profileDetails: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "100%",
  },
  profileDataContainer: {
    marginVertical: 6,
  },
  profileDataLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2e2e2eff",
    marginBottom: 2,
  },
  profileDataValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0048ceff",
  },
  logoutContainer: {
    marginTop: 15,
    width: "100%",
  },
  logoutButton: {
    backgroundColor: "#ff3030ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  passwordUpdateContainer: {
    marginVertical: 20,
    padding: 15,
    width: "100%",
    backgroundColor: "#ffffffff",
    borderRadius: 10,
  },
  passwordUpdateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#202020ff",
    marginBottom: 15,
  },
  passwordInputContainer: {
    width: "100%",
  },
  profileInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccccccff",
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  updatePasswordButton: {
    backgroundColor: "#36ac00ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  updatePasswordButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
