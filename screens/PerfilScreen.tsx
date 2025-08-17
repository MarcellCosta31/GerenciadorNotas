import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PerfilScreen() {
  const [username, setUsername] = useState("Nome do Usuário");
  const [editingName, setEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("username");
      const image = await AsyncStorage.getItem("profileImage");
      if (name) setUsername(name);
      if (image) setImageUri(image);
    } catch (error) {
      console.log("Erro ao carregar dados do usuário", error);
    }
  };

  const saveUserData = async (name, image) => {
    try {
      if (name) await AsyncStorage.setItem("username", name);
      if (image) await AsyncStorage.setItem("profileImage", image);
    } catch (error) {
      console.log("Erro ao salvar dados do usuário", error);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      saveUserData(null, result.assets[0].uri);
    }
  };

  const handleSaveUsername = () => {
    if (newUsername.trim()) {
      setUsername(newUsername);
      saveUserData(newUsername, null);
      setEditingName(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await AsyncStorage.getAllKeys().then((keys) =>
        AsyncStorage.multiGet(keys)
      );
      const exportObject = Object.fromEntries(data);
      const json = JSON.stringify(exportObject);
      const path = `${FileSystem.documentDirectory}lunar_notes_backup.json`;
      await FileSystem.writeAsStringAsync(path, json);

      const uri = await FileSystem.getContentUriAsync(path);
      Alert.alert("Sucesso", "Arquivo exportado com sucesso. Copie de:" + uri);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível exportar os dados.");
    }
  };

  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });
      if (result.assets && result.assets.length > 0) {
        const content = await FileSystem.readAsStringAsync(
          result.assets[0].uri
        );
        const data = JSON.parse(content);
        await AsyncStorage.multiSet(Object.entries(data));
        loadUserData();
        Alert.alert("Sucesso", "Dados importados com sucesso.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao importar os dados.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{username}</Text>
      </View>
      <TouchableOpacity style={styles.profileCircle} onPress={handleImagePick}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setEditingName(true)}
      >
        <Text style={styles.buttonText}>Mudar Nome de Usuario</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleExportData}>
        <Text style={styles.buttonText}>Exportar Dados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleImportData}>
        <Text style={styles.buttonText}>Importar Dados</Text>
      </TouchableOpacity>

      <View style={styles.performanceContainer}>
        <Text style={styles.performanceTitle}>Desempenho dos Periodos</Text>
        <View style={styles.performanceRow}>
          <Text style={styles.performanceItem}>2024</Text>
          <Text style={styles.performanceItem}>30%</Text>
          <Text style={[styles.performanceItem, { color: "red" }]}>Ruim</Text>
        </View>
      </View>

      <Modal visible={editingName} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Nome do Usuário</Text>
            <TextInput
              style={styles.modalInput}
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Digite o nome"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveUsername}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
  header: {
    backgroundColor: "#6445A2",
    width: "100%",
    padding: 30,
    alignItems: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerText: { color: "#fff", fontSize: 18 },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    marginVertical: 20,
    overflow: "hidden",
  },
  profileImage: { width: "100%", height: "100%" },
  button: {
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: { fontSize: 16 },
  performanceContainer: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "#ddd",
    width: "100%",
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  performanceTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  performanceRow: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  performanceItem: { fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalLabel: { fontSize: 16, marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    textAlign: "center",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#6445A2",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 16 },
});
