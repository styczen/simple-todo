import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { TodoProps } from "../types";

const Todo: React.FC<TodoProps> = (item) => {
  return (
    <TouchableOpacity
      onPress={() => console.log("TODO: Implement edit task function")}
      style={styles.item}
    >
      <View style={styles.verticalAlign}>
        <CheckBox
          value={item.completed}
          onValueChange={() => item.toggleCompleted(item.id)}
        />
        <View style={styles.info}>
          {item.completed ? (
            <Text style={{ textDecorationLine: "line-through" }}>
              {item.description}
            </Text>
          ) : (
            <Text>{item.description}</Text>
          )}
          <Text>{item.due_date.toDateString()}</Text>
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
