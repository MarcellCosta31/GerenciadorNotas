import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

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

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário acessar a galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setBanner(result.assets[0].uri);
    }
  };

  const adicionarMateria = () => {
    if (!nomeMateria || !media) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const novaMateria: Materia = {
      nome: nomeMateria,
      media: parseFloat(media),
      banner,
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Gerenciador de Notas</Text>
      </View>

      <Text style={styles.ano}>{ano}</Text>

      <FlatList
        data={materias}
        keyExtractor={(item) => item.nome}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-evenly' }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.banner && (
              <Image source={{ uri: item.banner }} style={styles.banner} />
            )}
            <Text style={styles.nomeMateria}>{item.nome}</Text>
            <TouchableOpacity
              style={styles.botaoRoxo}
              onPress={() =>
                navigation.navigate("Materia", { ano, materia: item })
              }
            >
              <Text style={styles.textoBotao}>Adicionar Nota</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoVermelho}
              onPress={() => excluirMateria(item.nome)}
            >
              <Text style={styles.textoBotao}>Excluir Matéria</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.label}>Nome da Matéria</Text>
            <TextInput
              style={styles.input}
              value={nomeMateria}
              onChangeText={setNomeMateria}
              placeholder="Ex: Matemática"
            />
            <Text style={styles.label}>Média para Passar</Text>
            <TextInput
              style={styles.input}
              value={media}
              onChangeText={setMedia}
              placeholder="Ex: 7"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Banner (opcional)</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity style={[styles.botaoBanner, { flex: 1 }]} onPress={escolherImagem}>
                <Text style={styles.botaoBannerTexto}>Escolher da galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botaoBanner, { flex: 1 }]} onPress={() => setBanner("")}>
                <Text style={styles.botaoBannerTexto}>Remover</Text>
              </TouchableOpacity>
            </View>

            {banner !== "" && (
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Pré-visualização:</Text>
                <Image source={{ uri: banner }} style={styles.previewImage} resizeMode="cover" />
              </View>
            )}

            <TouchableOpacity style={styles.botaoRoxo} onPress={adicionarMateria}>
              <Text style={styles.textoBotao}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoVermelho} onPress={() => setModalVisible(false)}>
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#6643a6",
    paddingVertical: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    position: "relative",
  },
  voltar: {
    position: "absolute",
    top: 35,
    left: 20,
    fontSize: 20,
    color: "#000",
  },
  titulo: {
    fontSize: 20,
    color: "#fff",
    marginTop: 30,
    fontWeight: "bold",
  },
  ano: {
    marginTop: 20,
    fontSize: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ddd",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    width: '45%',
  },
  banner: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  nomeMateria: {
    fontSize: 18,
    marginBottom: 10,
  },
  botaoRoxo: {
    backgroundColor: "#6643a6",
    padding: 10,
    borderRadius: 20,
    marginBottom: 5,
  },
  botaoVermelho: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
    marginBottom: 5,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
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
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  botaoBanner: {
    backgroundColor: "#6949A4",
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  botaoBannerTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  previewBox: {
    marginVertical: 10,
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  previewImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
});
