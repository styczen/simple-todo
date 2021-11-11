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
  TextInput,
} from "react-native";
import { Icon } from "react-native-elements";
import Todo from "./components/todo";
import Header from "./components/header";
import AddTask from "./components/add_task";
import { TodoProps, AddTaskProps } from "./types";

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
    // {
    //   id: 3,
    //   description: "Third task",
    //   due_date: new Date(Date.now()),
    //   completed: true,
    // },
    // {
    //   id: 4,
    //   description: "First task",
    //   due_date: new Date(Date.now()),
    //   completed: false,
    // },
    // {
    //   id: 5,
    //   description: "Second task",
    //   due_date: new Date(Date.now()),
    //   completed: true,
    // },
    // {
    //   id: 6,
    //   description: "Third task",
    //   due_date: new Date(Date.now()),
    //   completed: true,
    // },
    // {
    //   id: 7,
    //   description: "First task",
    //   due_date: new Date(Date.now()),
    //   completed: false,
    // },
    // {
    //   id: 8,
    //   description: "Second task",
    //   due_date: new Date(Date.now()),
    //   completed: true,
    // },
    // {
    //   id: 9,
    //   description: "Third task",
    //   due_date: new Date(Date.now()),
    //   completed: true,
    // },
  ]);

  const [addTaskModal, setAddTaskModal] = useState<boolean>(false);

  const toggleCompleted = (id: number) => {
    const new_tasks = [...tasks];
    const found_idx = new_tasks.findIndex((task) => task.id === id);
    new_tasks[found_idx].completed = !new_tasks[found_idx].completed;
    setTasks(new_tasks);
  };

  const closeModal = () => {
    setAddTaskModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Modal
          visible={addTaskModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setAddTaskModal(false);
          }}
        >
          <AddTask closeModal={closeModal} />
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
      <Icon
        name="add"
        size={30}
        type="material"
        color="darkseagreen"
        reverse={true}
        containerStyle={styles.actionAddButton}
        onPress={() => {
          console.log("pressed icon");
          setAddTaskModal(true);
        }}
      />
    </SafeAreaView>
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
  actionAddButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});

export default App;
