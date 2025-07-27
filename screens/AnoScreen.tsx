import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "./ThemeContext";

interface Materia {
  nome: string;
  media: number;
  banner?: string;
}

export default function AnoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { ano }: { ano: string } = route.params as any;

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeMateria, setNomeMateria] = useState("");
  const [media, setMedia] = useState("");
  const [banner, setBanner] = useState("");

  const STORAGE_KEY = `materias_${ano}`;

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    carregarMaterias();
  }, []);

  const carregarMaterias = async () => {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    if (dados) setMaterias(JSON.parse(dados));
  };

  const salvarMaterias = async (novasMaterias: Materia[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novasMaterias));
    setMaterias(novasMaterias);
  };

  const adicionarMateria = () => {
    if (!nomeMateria || !media) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const novaMateria: Materia = {
      nome: nomeMateria,
      media: parseFloat(media),
      banner: banner.trim() ? banner.trim() : undefined,
    };
    const atualizadas = [...materias, novaMateria];
    salvarMaterias(atualizadas);
    setModalVisible(false);
    setNomeMateria("");
    setMedia("");
    setBanner("");
  };

  const excluirMateria = (nome: string) => {
    const atualizadas = materias.filter((m) => m.nome !== nome);
    salvarMaterias(atualizadas);
  };

  const styles = getStyles(theme);

  // Renderiza card com banner e os 3 botões: Adicionar Nota, Adicionar Anotação e Excluir Matéria
  const renderItem = ({ item }: { item: Materia }) => (
    <View style={[styles.card, theme === "dark" && styles.cardDark]}>
      {item.banner ? (
        <View style={styles.banner}>
          <Text style={styles.bannerTexto}>{item.banner}</Text>
        </View>
      ) : null}
      <Text style={[styles.nomeMateria, theme === "dark" && styles.textDark]}>
        {item.nome}
      </Text>
      <TouchableOpacity
        style={[styles.botaoRoxo, theme === "dark" && styles.botaoRoxoDark]}
        onPress={() => navigation.navigate("Materia", { ano, materia: item })}
      >
        <Text style={styles.textoBotao}>Adicionar Nota</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.botaoAzul, theme === "dark" && styles.botaoAzulDark]}
        onPress={() => navigation.navigate("Anotacoes", { ano, materia: item })}
      >
        <Text style={styles.textoBotao}>Adicionar Anotação</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botaoVermelho}
        onPress={() => excluirMateria(item.nome)}
      >
        <Text style={styles.textoBotao}>Excluir Matéria</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, theme === "dark" && styles.headerDark]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.voltar, theme === "dark" && styles.textDark]}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={[styles.titulo, theme === "dark" && styles.textDark]}>
          Gerenciador de Notas
        </Text>
      </View>

      <Text style={[styles.ano, theme === "dark" && styles.textDark]}>
        {ano}
      </Text>

      <FlatList
        data={materias}
        keyExtractor={(item) => item.nome}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalBox, theme === "dark" && styles.modalBoxDark]}
          >
            <Text style={[styles.label, theme === "dark" && styles.textDark]}>
              Nome da Matéria
            </Text>
            <TextInput
              style={[styles.input, theme === "dark" && styles.inputDark]}
              value={nomeMateria}
              onChangeText={setNomeMateria}
              placeholder="Ex: Matemática"
              placeholderTextColor={theme === "dark" ? "#ccc" : "#666"}
            />
            <Text style={[styles.label, theme === "dark" && styles.textDark]}>
              Média para Passar
            </Text>
            <TextInput
              style={[styles.input, theme === "dark" && styles.inputDark]}
              value={media}
              onChangeText={setMedia}
              placeholder="Ex: 7"
              keyboardType="numeric"
              placeholderTextColor={theme === "dark" ? "#ccc" : "#666"}
            />
            <Text style={[styles.label, theme === "dark" && styles.textDark]}>
              Banner (Opcional)
            </Text>
            <TextInput
              style={[styles.input, theme === "dark" && styles.inputDark]}
              value={banner}
              onChangeText={setBanner}
              placeholder="Texto do banner"
              placeholderTextColor={theme === "dark" ? "#ccc" : "#666"}
            />

            <TouchableOpacity
              style={[
                styles.botaoRoxo,
                theme === "dark" && styles.botaoRoxoDark,
              ]}
              onPress={adicionarMateria}
            >
              <Text style={styles.textoBotao}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
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
      paddingTop: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      marginBottom: 10,
      backgroundColor: "#6643a6", // <- Roxo no modo claro
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      paddingVertical: 30,
    },

    headerDark: {
      backgroundColor: "#333", // topo escuro para dark mode
    },
    voltar: {
      fontSize: 30,
      marginRight: 15,
      color: "#000",
    },
    titulo: {
      fontSize: 20,
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
      color: "#fff",
    },
    ano: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: "center",
      color: "#000",
    },
    card: {
      backgroundColor: "#ddd",
      padding: 20,
      marginVertical: 10,
      borderRadius: 10,
      width: "48%",
      alignItems: "center",
    },
    cardDark: {
      backgroundColor: "#333",
    },
    banner: {
      backgroundColor: "#6643a6",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 15,
      marginBottom: 10,
    },
    bannerTexto: {
      color: "#fff",
      fontWeight: "bold",
    },
    nomeMateria: {
      fontSize: 18,
      marginBottom: 10,
      color: "#000",
    },
    textDark: {
      color: "#eee",
    },
    botaoRoxo: {
      backgroundColor: "#6643a6",
      padding: 10,
      borderRadius: 20,
      marginBottom: 5,
      width: "100%",
      alignItems: "center",
    },
    botaoRoxoDark: {
      backgroundColor: "#8555cc",
    },
    botaoAzul: {
      backgroundColor: "#3366cc",
      padding: 10,
      borderRadius: 20,
      marginBottom: 5,
      width: "100%",
      alignItems: "center",
    },
    botaoAzulDark: {
      backgroundColor: "#4a79d1",
    },
    botaoVermelho: {
      backgroundColor: "red",
      padding: 10,
      borderRadius: 20,
      width: "100%",
      alignItems: "center",
    },
    textoBotao: {
      color: "#fff",
      fontWeight: "bold",
    },
    fab: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: "#6643a6",
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    fabTexto: {
      fontSize: 30,
      color: "#fff",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "#00000099",
      justifyContent: "center",
      alignItems: "center",
    },
    modalBox: {
      backgroundColor: "#ddd",
      padding: 20,
      borderRadius: 20,
      width: "80%",
    },
    modalBoxDark: {
      backgroundColor: "#444",
    },
    label: {
      fontSize: 14,
      marginTop: 10,
      marginBottom: 4,
      color: "#000",
    },
    input: {
      backgroundColor: "#eee",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      textAlign: "center",
      color: "#000",
    },
    inputDark: {
      backgroundColor: "#555",
      color: "#eee",
    },
    botaoCancelar: {
      backgroundColor: "#999",
      padding: 10,
      borderRadius: 20,
      marginTop: 5,
      alignItems: "center",
    },
    textoBotaoCancelar: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
