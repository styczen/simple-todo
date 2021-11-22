import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  Text,
  Switch,
} from "react-native";
import { Icon } from "react-native-elements";
import Todo from "./components/todo";
import Header from "./components/header";
import AddTask from "./screens/addTask";
import { TodoProps } from "./types";
import NetInfo from "@react-native-community/netinfo";

const App: React.FC = () => {
  const url: string = "http://192.168.0.164:9090/tasks";
  const [tasks, setTasks] = useState<TodoProps[]>([]);
  const [showMyDay, setShowMyDay] = useState<boolean>(false);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      console.log("is connected:", state.isConnected);
      console.log("type:", state.type);
    });

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let loadedTasks: TodoProps[] = [];
        for (let i = 0; i < data.length; i += 1) {
          const todo: TodoProps = data[i];
          todo.due_date = new Date(todo.due_date);
          loadedTasks.push(todo);
        }
        setTasks(loadedTasks);
      })
      .catch((error) => {
        console.error(error);
        setTasks([]);
      });
  }, []);

  const [addTaskModal, setAddTaskModal] = useState<boolean>(false);

  const updateTask = (task: TodoProps) => {
    const newTasks = [...tasks];
    const foundIdx = newTasks.findIndex((oldTask) => oldTask.id === task.id);
    newTasks[foundIdx] = task;
    fetch(url + "/" + task.id, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTasks[foundIdx]),
    })
      .then((response) => {
        if (response.status !== 200) {
          console.error(response.status);
        }
      })
      .catch((error) => console.error(error));

    setTasks(newTasks);
  };

  const closeModal = () => {
    setAddTaskModal(false);
  };

  const addTask = (task: TodoProps) => {
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

  const deleteTask = (id: number) => {
    fetch(url + "/" + id, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status !== 200) {
          console.error(response.status);
        }
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
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
          <View style={styles.myDayFilter}>
            <Switch
              onValueChange={(value) => setShowMyDay(value)}
              value={showMyDay}
            />
            {showMyDay ? <Text>My Day</Text> : <Text>All tasks</Text>}
          </View>

          <View style={styles.list}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 150 }}
              data={tasks}
              // TODO: Right now I don't know how to solve this properly so that Typescript is not mad
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const today = new Date(Date.now());
                const taskIsToday =
                  item.due_date.toDateString() === today.toDateString();
                if (taskIsToday || (!showMyDay && !taskIsToday)) {
                  return (
                    <Todo
                      id={item.id}
                      description={item.description}
                      due_date={item.due_date}
                      completed={item.completed}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                    />
                  );
                }
              }}
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
    flexDirection: "column",
    alignContent: "center",
  },
  list: {
    marginTop: 20,
  },
  actionAddButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  myDayFilter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default App;
