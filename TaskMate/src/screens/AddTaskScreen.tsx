import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AddTaskNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "AddTask"
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

export default function AddTaskScreen() {
  const navigation = useNavigation<AddTaskNavigationProps>();
  const BackendUrl = "https://causal-truly-liger.ngrok-free.app";

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [user, setUser] = useState<User | null>(null);

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

  const handleCreateTask = async () => {
    if (!taskTitle || !taskDescription || !dueDate) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Update failed",
        textBody: "All fields are required.",
      });
      return;
    }
    if (!user) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "User not found",
      });
      return;
    }

    const response = await fetch(`${BackendUrl}/TaskMate_Backend/CreateTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email,
        title: taskTitle,
        description: taskDescription,
        dueDate: dueDate.toISOString(),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Task created successfully",
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Task creation failed",
          textBody: data.message || "An error occurred",
        });
      }
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Task creation failed",
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
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Create a New Task</Text>
                <Text style={styles.subtitle}>Enter task details</Text>
              </View>
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Task Title"
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Task Description"
                    multiline
                    numberOfLines={5}
                    value={taskDescription}
                    onChangeText={setTaskDescription}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Due Date</Text>
                  <Pressable onPress={() => setShowPicker(true)}>
                    <TextInput
                      style={styles.input}
                      placeholder="Due Date"
                      value={dueDate.toDateString().replace(" ", ", ")}
                      editable={false}
                      readOnly
                    />
                    {showPicker && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={dueDate}
                        mode="date"
                        is24Hour={true}
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || dueDate;
                          setShowPicker(false);
                          setDueDate(currentDate);
                        }}
                      />
                    )}
                  </Pressable>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={styles.signupButton}
                  onPress={handleCreateTask}
                >
                  <Text style={styles.signupButtonText}>Create Task</Text>
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
