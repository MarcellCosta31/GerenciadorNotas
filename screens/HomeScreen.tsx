// src/screens/HomeScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [anos, setAnos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoAno, setNovoAno] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    carregarAnos();
  }, []);

  const carregarAnos = async () => {
    try {
      const json = await AsyncStorage.getItem("@anos");
      if (json != null) {
        setAnos(JSON.parse(json));
      }
    } catch (e) {
      console.error("Erro ao carregar anos:", e);
    }
  };

  const salvarAnos = async (dados) => {
    try {
      await AsyncStorage.setItem("@anos", JSON.stringify(dados));
    } catch (e) {
      console.error("Erro ao salvar anos:", e);
    }
  };

  const adicionarAno = () => {
    if (novoAno.trim() !== "") {
      const atualizados = [...anos, novoAno];
      setAnos(atualizados);
      salvarAnos(atualizados);
      setNovoAno("");
      setModalVisible(false);
    }
  };

  const excluirAno = (ano) => {
    const atualizados = anos.filter((item) => item !== ano);
    setAnos(atualizados);
    salvarAnos(atualizados);
    AsyncStorage.removeItem(`@materias_${ano}`);
  };

  const irParaAno = (ano) => {
    navigation.navigate("Ano", { ano });
  };

  const irParaPerfil = () => {
    navigation.navigate("Perfil");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Lunar Notes</Text>
        <TouchableOpacity style={styles.botaoPerfil} onPress={irParaPerfil} />
      </View>

      <FlatList
        data={anos}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.anoTexto}>{item}</Text>
            <TouchableOpacity
              style={styles.botaoAcessar}
              onPress={() => irParaAno(item)}
            >
              <Text style={styles.botaoTexto}>Acessar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={() => excluirAno(item)}
            >
              <Text style={styles.botaoTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.botaoFlutuante}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.botaoFlutuanteTexto}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Nome do Bloco</Text>
            <TextInput
              style={styles.input}
              value={novoAno}
              onChangeText={setNovoAno}
              placeholder="Ex: 2024"
            />
            <TouchableOpacity style={styles.modalBotao} onPress={adicionarAno}>
              <Text style={styles.modalBotaoTexto}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#654ea3",
    height: 100,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    position: "relative",
  },
  titulo: {
    fontSize: 20,
    color: "#fff",
  },
  botaoPerfil: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 36,
    height: 36,
    backgroundColor: "#ddd",
    borderRadius: 18,
  },
  lista: {
    padding: 20,
  },
  card: {
    backgroundColor: "#654ea3",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  anoTexto: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10,
  },
  botaoAcessar: {
    backgroundColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 5,
  },
  botaoExcluir: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  botaoTexto: {
    color: "#fff",
  },
  botaoFlutuante: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#654ea3",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoFlutuanteTexto: {
    color: "#fff",
    fontSize: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000aa",
  },
  modalConteudo: {
    backgroundColor: "#ddd",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitulo: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    marginBottom: 10,
  },
  modalBotao: {
    backgroundColor: "#654ea3",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  modalBotaoTexto: {
    color: "#fff",
  },
});
