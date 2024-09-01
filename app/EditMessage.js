import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditMessage() {
  const [message, setMessage] = useState("I need help!");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const savedMessage = await AsyncStorage.getItem("message");
        if (savedMessage) {
          setMessage(savedMessage);
        }
      } catch (error) {
        console.error("Failed to load message from AsyncStorage", error);
      }
    };

    fetchMessage();
  }, []);

  const saveMessage = async () => {
    try {
      await AsyncStorage.setItem("message", message);
      Alert.alert("Success", "Message saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save message.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter your custom message"
        multiline
      />
      <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={saveMessage}>
        <Text style={{ color: "#fff" }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#1d6580"
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 100,
    textAlignVertical: "top",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    color: "#fff",
  },
  button: {
    backgroundColor: "#164f63",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  }
});