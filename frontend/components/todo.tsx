import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { Icon } from "react-native-elements";
import { TodoProps } from "../types";

const Todo: React.FC<TodoProps> = (props) => {
  return (
    <TouchableOpacity
      onPress={() => alert("TODO: Implement edit task function")}
      style={styles.item}
    >
      <View style={styles.verticalAlign}>
        <CheckBox
          value={props.completed}
          onValueChange={() => props.toggleCompleted?.(props.id)}
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
    justifyContent: "space-between",
    alignContent: "center",
  },
  info: {
    flexDirection: "column",
  },
  description: {
    fontWeight: "bold",
  },
});

export default Todo;
