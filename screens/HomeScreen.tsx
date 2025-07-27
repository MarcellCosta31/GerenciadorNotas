import React, { useEffect, useState } from "react";
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

export default function HomeScreen() {
  const [anos, setAnos] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoAno, setNovoAno] = useState("");
  const navigation = useNavigation();

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
    <View style={styles.card}>
      <Text style={styles.anoTexto}>{item}</Text>
      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.botao}
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

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Gerenciador de Notas</Text>
      </View>
      <FlatList data={anos} renderItem={renderItem} keyExtractor={(i) => i} />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="slide">
  <View style={styles.modalView}>
    <View style={styles.modalBox}>
      <Text style={styles.label}>Nome do Ano</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 2024"
        value={novoAno}
        onChangeText={setNovoAno}
      />
      <TouchableOpacity style={styles.modalBtn} onPress={adicionarAno}>
        <Text style={styles.modalBtnTexto}>Adicionar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modalBtn, { backgroundColor: "#ccc", marginTop: 10 }]}
        onPress={() => {
          setModalVisible(false);
          setNovoAno("");
        }}
      >
        <Text style={[styles.modalBtnTexto, { color: "#333" }]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      <TouchableOpacity
        style={styles.botaoResumo}
        onPress={() => navigation.navigate("Resumo")}
      >
        <Text style={styles.textoBotaoResumo}>Ver Resumo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topo: {
    backgroundColor: "#6949A4",
    paddingVertical: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
  },
  titulo: {
    color: "#fff",
    marginTop: 30,
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ddd",
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },
  anoTexto: {
    fontSize: 18,
    marginBottom: 8,
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
    bottom:70,
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
  label: {
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    textAlign: "center",
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
  botaoResumo: {
    backgroundColor: "#6643a6",
    padding: 12,
    margin: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  textoBotaoResumo: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
