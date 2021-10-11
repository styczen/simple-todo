import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Task from "./components/Task";
import { TaskProps } from "./types";

const App: React.FC = () => {
  // Static data
  const tasks: Array<TaskProps> = [
    {
      description: "First task",
      due_date: new Date(Date.now()),
    },
    {
      description: "Second task",
      due_date: new Date(Date.now()),
    },
    {
      description: "Third task",
      due_date: new Date(Date.now()),
    },
  ];

  return (
    <View style={styles.container}>
      {tasks.map((task) => {
        console.log(task.description);
        <Task description={task.description} due_date={task.due_date} />;
      })}

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
