import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { Icon } from "react-native-elements";
import { TodoProps } from "../types";
import EditTask from "../screens/editTask";

const Todo: React.FC<TodoProps> = (props) => {
  const toggleCompleted = () => {
    const updatedTask: TodoProps = {
      id: props.id,
      description: props.description,
      due_date: props.due_date,
      completed: !props.completed,
    };
    props.updateTask?.(updatedTask);
  };

  return (
    //    <>
    //      <Modal
    //        visible={addTaskModal}
    //        animationType="slide"
    //        transparent={true}
    //        onRequestClose={() => {
    //          setAddTaskModal(false);
    //        }}
    //      >
    //        <EditTask />
    //      </Modal>
    <TouchableOpacity
      onPress={() => alert("TODO: Implement edit task function")}
      style={styles.item}
    >
      <View style={styles.horizontalAlign}>
        <CheckBox
          value={props.completed}
          onValueChange={() => toggleCompleted()}
        />
        <View style={styles.info}>
          {props.completed ? (
            <Text
              style={[
                styles.description,
                { textDecorationLine: "line-through" },
              ]}
            >
              {props.description}
            </Text>
          ) : (
            <Text style={styles.description}>{props.description}</Text>
          )}
          <Text>{props.due_date.toDateString()}</Text>
        </View>
        <Icon
          name="delete"
          size={30}
          type="material"
          color="red"
          reverse={false}
          onPress={() => props.deleteTask?.(props.id)}
        />
      </View>
    </TouchableOpacity>
    //    </>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginTop: 16,
    borderColor: "#bbb",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
  },
  horizontalAlign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flexDirection: "column",
  },
  description: {
    fontWeight: "bold",
  },
});

export default Todo;
