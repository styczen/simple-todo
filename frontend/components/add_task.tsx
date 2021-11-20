import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { AddTaskProps, TodoProps } from "../types";
import DateTimePicker from "react-native-modal-datetime-picker";

const AddTask: React.FC<AddTaskProps> = (props) => {
  const [taskText, setTaskText] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [pickedDueDate, setPickedDueDate] = useState<Date>(
    new Date(Date.now())
  );

  return (
    <View style={styles.container}>
      <DateTimePicker
        isVisible={showCalendar}
        onConfirm={(date) => {
          console.log(date);
          setPickedDueDate(new Date(date));
          return;
        }}
        onCancel={() => setShowCalendar(false)}
        mode="date"
      />

      <Text>Add new task</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Add a task"
        onSubmitEditing={(e) => setTaskText(e.nativeEvent.text)}
      />
      <Pressable
        style={styles.calendarButton}
        onPress={() => setShowCalendar(true)}
      >
        <Text style={styles.textButton}>Pick due date</Text>
      </Pressable>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: "darkseagreen" }]}
          onPress={() => {
            if (taskText === "") {
              alert("Please fill task description");
              return;
            }
            const newTodo: TodoProps = {
              description: taskText,
              due_date: pickedDueDate,
              completed: false,
            };
            props.addTask(newTodo);
            props.closeModal();
          }}
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
    padding: 10,
  },
  calendarButton: {
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "blue",
    alignItems: "center",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    height: 40,
    borderRadius: 10,
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
