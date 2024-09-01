import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import * as Contacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function TrustedContacts({ navigation }) {
  const [contactList, setContactList] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedContacts = await AsyncStorage.getItem("contacts");
        if (savedContacts) {
          setSelectedContacts(JSON.parse(savedContacts));
        }

        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });

          if (data.length > 0) {
            setContactList(data);
          }
        }
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();
  }, []);

  const handleSelectContact = (contact) => {
    if (!selectedContacts.find((c) => c.id === contact.id)) {
      const newContacts = [...selectedContacts, contact];
      setSelectedContacts(newContacts);
      AsyncStorage.setItem("contacts", JSON.stringify(newContacts));
    }
    setModalVisible(false);
  };

  const handleDeleteContact = (contactId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this from trusted contacts?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            const updatedContacts = selectedContacts.filter(
              (contact) => contact.id !== contactId
            );
            setSelectedContacts(updatedContacts);
            AsyncStorage.setItem("contacts", JSON.stringify(updatedContacts));
          },
        },
      ]
    );
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {selectedContacts.length === 0 ? (
        <View style={styles.promptContainer}>
          <Text style={styles.prompt}>
            Add trusted contacts now so you can send alerts in an emergency.
          </Text>
        </View>
      ) : (
        <FlatList
          data={selectedContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <Text style={styles.contactName}>{item.name}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.deleteButton}
                onPress={() => handleDeleteContact(item.id)}
              >
                <Text>
                  <AntDesign name="delete" size={24} color="#c20e00" />
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={handleOpenModal}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Select a Contact</Text>
          <FlatList
            data={contactList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleSelectContact(item)}
              >
                <Text style={styles.modalItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1d6580",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  promptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  prompt: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 50,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactName: {
    fontSize: 18,
    color: "#fff",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#164f63",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1d6580",
  },
  modalHeader: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 18,
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "#164f63",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
