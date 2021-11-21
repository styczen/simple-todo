import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  Text,
} from "react-native";
import { Icon } from "react-native-elements";
import Todo from "./components/todo";
import Header from "./components/header";
import AddTask from "./components/add_task";
import { TodoProps } from "./types";

const App: React.FC = () => {
  const url: string = "http://192.168.0.164:9090/tasks";
  const [tasks, setTasks] = useState<TodoProps[]>([]);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let loadedTasks: TodoProps[] = [];
        for (let i = 0; i < data.length; i += 1) {
          const todo: TodoProps = data[i];
          todo.due_date = new Date(todo.due_date);
          loadedTasks.push(todo);
        }
        setTasks(loadedTasks);
      })
      .catch((error) => console.error(error));
  }, []);

  const [addTaskModal, setAddTaskModal] = useState<boolean>(false);

  const toggleCompleted = (id: number) => {
    const newTasks = [...tasks];
    const foundIdx = newTasks.findIndex((task) => task.id === id);
    newTasks[foundIdx].completed = !newTasks[foundIdx].completed;
    setTasks(newTasks);
  };

  const closeModal = () => {
    setAddTaskModal(false);
  };

  const addTask = (task: TodoProps) => {
    console.log("Adding new task");
    console.log(task);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((data) => {
        task.id = data.id;
        setTasks([...tasks, task]);
      })
      .catch((error) => console.error(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Modal
        visible={addTaskModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setAddTaskModal(false);
        }}
      >
        <AddTask closeModal={closeModal} addTask={addTask} />
      </Modal>
      {tasks.length === 0 ? (
        <Text>Hurray!!! Nothing to do.</Text>
      ) : (
        <View style={styles.content}>
          <View style={styles.list}>
            <FlatList
              data={tasks}
              // TODO: Right now I don't know how to solve this properly so that Typescript is not mad
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
      )}
      <Icon
        name="add"
        size={30}
        type="material"
        color="darkseagreen"
        reverse={true}
        containerStyle={styles.actionAddButton}
        onPress={() => {
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
