import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
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
  ]);

  // Write function to pass to child to update the todo item
  // TODO: Continues here: https://www.youtube.com/watch?v=SGEitne8N-Q

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* form */}
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
              />
            )}
          />
        </View>
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
    padding: 40,
  },
  list: {
    marginTop: 20,
  },
});

export default App;
