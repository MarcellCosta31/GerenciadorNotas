import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "./ThemeContext"; // ajuste o caminho

export default function HomeScreen() {
  const [anos, setAnos] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoAno, setNovoAno] = useState("");
  const navigation = useNavigation();

  const { theme, toggleTheme } = useContext(ThemeContext);

  const carregarAnos = async () => {
    const dados = await AsyncStorage.getItem("anos");
    if (dados) setAnos(JSON.parse(dados));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregarAnos);
    return unsubscribe;
  }, [navigation]);

  const salvarAnos = async (novos: string[]) => {
    await AsyncStorage.setItem("anos", JSON.stringify(novos));
    setAnos(novos);
  };

  const adicionarAno = () => {
    if (!novoAno) return;
    const atualizados = [...anos, novoAno];
    salvarAnos(atualizados);
    setModalVisible(false);
    setNovoAno("");
  };

  const excluirAno = async (ano: string) => {
    const atualizados = anos.filter((a) => a !== ano);
    await AsyncStorage.removeItem(`materias_${ano}`);
    salvarAnos(atualizados);
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={[styles.card, theme === "dark" && styles.cardDark]}>
      <Text style={[styles.anoTexto, theme === "dark" && styles.textDark]}>
        {item}
      </Text>
      <View style={styles.botoes}>
        <TouchableOpacity
          style={[styles.botao, theme === "dark" && styles.botaoDark]}
          onPress={() => navigation.navigate("Ano", { ano: item })}
        >
          <Text style={styles.botaoTexto}>Acessar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botao, { backgroundColor: "red" }]}
          onPress={() => excluirAno(item)}
        >
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Gerenciador de Notas</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.btnTema}>
          <Text style={styles.textoBtnTema}>
            {theme === "light" ? "🌙" : "☀️"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList data={anos} renderItem={renderItem} keyExtractor={(i) => i} />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalView}>
          <View style={[styles.modalBox, theme === "dark" && styles.modalBoxDark]}>
            <Text style={[styles.label, theme === "dark" && styles.textDark]}>
              Nome do Ano
            </Text>
            <TextInput
              style={[styles.input, theme === "dark" && styles.inputDark]}
              placeholder="Ex: 2024"
              placeholderTextColor={theme === "dark" ? "#ccc" : "#666"}
              value={novoAno}
              onChangeText={setNovoAno}
            />
            <TouchableOpacity style={styles.modalBtn} onPress={adicionarAno}>
              <Text style={styles.modalBtnTexto}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#999", marginTop: 8 }]}
              onPress={() => {
                setModalVisible(false);
                setNovoAno("");
              }}
            >
              <Text style={styles.modalBtnTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? "#fff" : "#121212",
    },
    topo: {
      backgroundColor: theme === "light" ? "#6949A4" : "#222",
      paddingVertical: 30,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      position: "relative",
    },
    titulo: {
      color: "#fff",
      marginTop: 30,
      fontSize: 24,
      fontWeight: "bold",
    },
    btnTema: {
      position: "absolute",
      right: 20,
      top: 40,
    },
    textoBtnTema: {
      fontSize: 24,
    },
    card: {
      backgroundColor: "#ddd",
      margin: 16,
      padding: 16,
      borderRadius: 10,
    },
    cardDark: {
      backgroundColor: "#333",
    },
    anoTexto: {
      fontSize: 18,
      marginBottom: 8,
      color: "#000",
    },
    textDark: {
      color: "#eee",
    },
    botoes: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    botao: {
      backgroundColor: "#6949A4",
      padding: 10,
      borderRadius: 10,
    },
    botaoDark: {
      backgroundColor: "#8555cc",
    },
    botaoTexto: {
      color: "#fff",
      fontWeight: "bold",
    },
    fab: {
      backgroundColor: "#6949A4",
      width: 60,
      height: 60,
      borderRadius: 30,
      position: "absolute",
      bottom: 70,
      right: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    fabTexto: {
      fontSize: 30,
      color: "#fff",
    },
    modalView: {
      flex: 1,
      backgroundColor: "#00000099",
      justifyContent: "center",
      alignItems: "center",
    },
    modalBox: {
      backgroundColor: "#eee",
      borderRadius: 20,
      padding: 20,
      width: "80%",
    },
    modalBoxDark: {
      backgroundColor: "#444",
    },
    label: {
      textAlign: "center",
      marginBottom: 8,
      color: "#000",
    },
    input: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
      marginBottom: 12,
      textAlign: "center",
      color: "#000",
    },
    inputDark: {
      backgroundColor: "#555",
      color: "#eee",
    },
    modalBtn: {
      backgroundColor: "#6949A4",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    modalBtnTexto: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
