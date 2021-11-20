import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { TodoProps } from "../types";

const Todo: React.FC<TodoProps> = (props) => {
  return (
    <TouchableOpacity
      onPress={() => console.log("TODO: Implement edit task function")}
      style={styles.item}
    >
      <View style={styles.verticalAlign}>
        <CheckBox
          value={props.completed}
          onValueChange={() => props.toggleCompleted?.(props.id)}
        />
        <View style={styles.info}>
          {props.completed ? (
            <Text style={{ textDecorationLine: "line-through" }}>
              {props.description}
            </Text>
          ) : (
            <Text>{props.description}</Text>
          )}
          <Text>{props.due_date.toDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  verticalAlign: {
    flexDirection: "row",
  },
  info: {
    flexDirection: "column",
  },
});

export default Todo;
