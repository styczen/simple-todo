import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TaskProps } from "../types";

const Task: React.FC<TaskProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text>{props.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Task;
