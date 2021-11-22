import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { AddTaskProps, TodoProps } from "../types";
import DateTimePicker from "react-native-modal-datetime-picker";

const EditTask: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Edit task</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default EditTask;
