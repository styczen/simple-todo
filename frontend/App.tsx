import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import Todo from "./components/todo";
import Header from "./components/header";
import { TodoProps } from "./types";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TodoProps[]>([
    {
      id: 1,
      description: "First task",
      due_date: new Date(Date.now()),
      completed: false,
    },
    {
      id: 2,
      description: "Second task",
      due_date: new Date(Date.now()),
      completed: true,
    },
    {
      id: 3,
      description: "Third task",
      due_date: new Date(Date.now()),
      completed: true,
    },
    {
      id: 4,
      description: "First task",
      due_date: new Date(Date.now()),
      completed: false,
    },
    {
      id: 5,
      description: "Second task",
      due_date: new Date(Date.now()),
      completed: true,
    },
    {
      id: 6,
      description: "Third task",
      due_date: new Date(Date.now()),
      completed: true,
    },
    {
      id: 7,
      description: "First task",
      due_date: new Date(Date.now()),
      completed: false,
    },
    {
      id: 8,
      description: "Second task",
      due_date: new Date(Date.now()),
      completed: true,
    },
    {
      id: 9,
      description: "Third task",
      due_date: new Date(Date.now()),
      completed: true,
    },
  ]);

  const [addTaskModal, setAddTaskModal] = useState<boolean>(false);

  const toggleCompleted = (id: number) => {
    const new_tasks = [...tasks];
    const found_idx = new_tasks.findIndex((task) => task.id === id);
    new_tasks[found_idx].completed = !new_tasks[found_idx].completed;
    setTasks(new_tasks);
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Modal
          visible={addTaskModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            console.log("Closing modal");
            setAddTaskModal(false);
          }}
        >
          <Text>Hello modal</Text>
        </Modal>
        <View style={styles.list}>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Todo
                id={item.id}
                description={item.description}
                due_date={item.due_date}
                completed={item.completed}
                toggleCompleted={toggleCompleted}
              />
            )}
          />
        </View>
      </View>
      <View style={styles.bottom}>
        {/* TODO: this button needs to be done better (right now even add sign is not centered :D) */}
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => {
            console.log("Pressed button");
            setAddTaskModal(true);
          }}
        >
          <Text style={styles.circleButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  list: {
    marginTop: 20,
  },
  bottom: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
//    flex: 1,
    justifyContent: "center",
    alignItems: "center",
//    marginBottom: 30,
  },
  circleButton: {
    backgroundColor: "darkseagreen",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  circleButtonText: {
    fontSize: 40,
    color: "white",
  },
});

export default App;
