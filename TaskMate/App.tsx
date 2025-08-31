import Checkbox from "expo-checkbox";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Image,
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

export default function App() {
  const BackendUrl = "https://causal-truly-liger.ngrok-free.app/TaskMate_Backend";

  type User = {
    id: number;
    name: string;
    email: string;
    profileImageUrl: string;
  };

  type Task = {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
  };

  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    const response = await fetch(`${BackendUrl}/GetUserData?userId=1`);
    const data = await response.json();
    if (response.ok) {
      setUser(data);
    } else {
      Alert.alert("Error", "Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const response = await fetch(`${BackendUrl}/GetTasks?userId=1`);
    const data = await response.json();
    if (response.ok) {
      setTasks(data);
    } else {
      Alert.alert("Error", "Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
            <Image source={{ uri: BackendUrl + user?.profileImageUrl }} style={styles.image} />
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Hello {user?.name}!</Text>
              <Text style={styles.emailText}>{user?.email}</Text>
              <Text style={styles.dateText}>{new Date().toDateString().replace(" ", ", ")}</Text>
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
                          setTasks((prevTasks) =>
                            prevTasks.map((t) =>
                              t.id === task.id
                                ? { ...t, completed: !t.completed }
                                : t
                            )
                          );
                        }}
                      />
                      <Text style={styles.taskItemText}>{task.title}</Text>
                      <View style={styles.taskItemActions}>
                        <Pressable>
                          <Text style={styles.editIcon}>
                            <FontAwesome6 name="edit" size={20} color="blue" />
                          </Text>
                        </Pressable>
                        <Pressable>
                          <Text style={styles.deleteIcon}>
                            <FontAwesome6 name="trash-can" size={20} color="red" />
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
