import Checkbox from "expo-checkbox";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type HomeNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
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

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProps>();
  const BackendUrl = "https://causal-truly-liger.ngrok-free.app";

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem("loggedUser");
      if (user) {
        setUser(JSON.parse(user));
        fetchTasks();
      } else {
        setUser(null);
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTasks = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(
      `${BackendUrl}/TaskMate_Backend/GetTasks?user=${user?.email}`
    );
    const data = await response.json();
    if (response.ok) {
      setTasks(data);
      console.log(data);
    } else {
      Alert.alert("Error", "Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTasks();
  }, []);

  const handleTaskStatusChange = async (taskId: number) => {
    if (!user) {
      return;
    }
    const response = await fetch(
      `${BackendUrl}/TaskMate_Backend/UpdateTaskStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          taskId: taskId,
        }),
      }
    );
    if (response.ok) {
      fetchTasks();
    } else {
      Alert.alert("Error", "Failed to update task status");
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    if (!user) {
      return;
    }
    const response = await fetch(
      `${BackendUrl}/TaskMate_Backend/DeleteTask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          taskId: taskId,
        }),
      }
    );
    if (response.ok) {
      fetchTasks();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Task deleted successfully",
      });
    } else {
      Alert.alert("Error", "Failed to delete task");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Home</Text>
            </View>
            <Pressable
              onPress={() => {
                if (user?.uid !== undefined) {
                  navigation.navigate("Profile");
                } else {
                  Alert.alert("Error", "User ID is not available");
                }
              }}
            >
              <Image
                source={
                  user?.profileImg
                    ? {
                        uri:
                          BackendUrl +
                          "/TaskMate_Backend/uploads/users/" +
                          user.profileImg,
                      }
                    : {
                        uri:
                          BackendUrl +
                          "/TaskMate_Backend/uploads/users/user1.png",
                      }
                }
                style={styles.image}
              />
            </Pressable>
          </View>
          <View style={styles.bodyContainer}>
            <Pressable
              style={styles.addTaskButtonContainer}
              onPress={() => navigation.navigate("AddTask")}
            >
              <FontAwesome6 name="circle-plus" size={30} color="blue" />
            </Pressable>
            <Pressable style={styles.refreshButton} onPress={fetchTasks}>
              <FontAwesome name="refresh" size={30} color="black" />
            </Pressable>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Hello {user?.name}!</Text>
              <Text style={styles.emailText}>{user?.email}</Text>
              <Text style={styles.dateText}>
                {new Date().toDateString().replace(" ", ", ")}
              </Text>
            </View>
            <View style={styles.tasksContainer}>
              <Text style={styles.tasksContainerTitle}>Your Tasks</Text>
              {tasks.length === 0 ? (
                <Text style={styles.noTasksText}>No tasks available</Text>
              ) : (
                tasks.map((task) => (
                  <View key={task.id} style={styles.taskItem}>
                    <View style={styles.taskItemHeader}>
                      <Checkbox
                        id={`task-${task.id}`}
                        style={styles.taskCheckbox}
                        value={task.completed}
                        color={"#0077ffff"}
                        onValueChange={() => {
                          handleTaskStatusChange(task.id);
                        }}
                      />
                      <Text style={styles.taskItemText}>{task.title}</Text>
                      <View style={styles.taskItemActions}>
                        <Pressable
                          onPress={() => {
                            handleTaskDelete(task.id);
                          }}
                        >
                          <Text style={styles.deleteIcon}>
                            <FontAwesome6
                              name="trash-can"
                              size={20}
                              color="red"
                            />
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <Text style={styles.taskItemDescription}>
                      {task.description}
                    </Text>
                    <View style={styles.taskItemFooter}>
                      <Text style={styles.taskItemDueDate}>{task.dueDate}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
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
  addTaskButtonContainer: {
    position: "absolute",
    zIndex: 5,
    top: 135,
    right: 25,
  },
  refreshButton: {
    position: "absolute",
    zIndex: 5,
    top: 135,
    right: 70,
  },
  greetingContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#d3f4ffff",
    padding: 15,
    borderRadius: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emailText: {
    fontSize: 12,
    color: "#666",
  },
  dateText: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
    color: "#0066ffff",
  },
  tasksContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 10,
  },
  tasksContainerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  taskItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  noTasksText: {
    fontSize: 16,
    color: "#666666",
  },
  taskItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  taskCheckbox: {
    marginRight: 10,
  },
  taskItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  taskItemActions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  editIcon: {
    fontSize: 14,
    color: "#0077ffff",
  },
  deleteIcon: {
    fontSize: 14,
    color: "#ff0000",
  },
  taskItemDescription: {
    marginTop: 15,
    width: "100%",
    textAlign: "left",
    fontSize: 14,
    color: "#666666",
  },
  taskItemFooter: {
    marginTop: 10,
    width: "100%",
    textAlign: "left",
  },
  taskItemDueDate: {
    fontSize: 12,
    color: "#999999",
  },
});
