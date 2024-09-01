import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "expo-router";

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("I need help!");
  const [pressed, setPressed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const savedContacts = await AsyncStorage.getItem('contacts');
          const savedMessage = await AsyncStorage.getItem('message');
          
          if (savedContacts) {
            setContacts(JSON.parse(savedContacts));
          }
          if (savedMessage) {
            setMessage(savedMessage);
          }
        } catch (error) {
          console.error('Failed to load data from AsyncStorage', error);
        }
      };
  
      fetchData();
    }, [])
  );

  const sendAlert = async () => {
    console.log(contacts.length);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const url = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
    const formattedMessage = `${message}\nLocation: ${url}`;

    if (contacts.length > 0) {
      const { result } = await SMS.sendSMSAsync(
        contacts.map((contact) => contact.phoneNumbers[0].number),
        formattedMessage
      );
    } else {
      Alert.alert("No trusted contacts selected.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor={"#960c02"}
        style={[styles.button, pressed && styles.buttonPressed]}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={sendAlert}
      >
        <Text style={styles.buttonText}>Send Alert</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d6580",
  },
  button: {
    width: "70%",
    aspectRatio: 1,
    borderRadius: 99999,
    backgroundColor: "#c20e00",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});