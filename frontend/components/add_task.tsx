import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { AddTaskProps } from "../types";

const AddTask: React.FC<AddTaskProps> = (props) => {
  const [taskText, setTaskText] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text>Add new task</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Add a task"
        onSubmitEditing={(e) => setTaskText(e.nativeEvent.text)}
      />
      <Pressable
        style={styles.calendarButton}
        onPress={() => console.log("Set due date for task")}
      >
        <Text style={styles.textButton}>Pick due date</Text>
      </Pressable>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: "darkseagreen" }]}
          onPress={() => console.log("Add task")}
        >
          <Text style={styles.textButton}>Add task</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={() => props.closeModal()}
        >
          <Text style={styles.textButton}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "50%",
    marginTop: "auto",
    padding: 20,
    backgroundColor: "aliceblue",
  },
  textInput: {
    borderWidth: 1,
    height: 40,
  },
  modalView: {},
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  calendarButton: {
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    backgroundColor: "blue",
    alignItems: "center",
  },
  button: {
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    margin: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default AddTask;
