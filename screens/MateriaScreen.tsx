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
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";

interface Nota {
  valor: number;
}

export default function MateriaScreen() {
  const route = useRoute();
  const { ano, materia }: { ano: string; materia: { nome: string; media: number } } =
    route.params as any;

  const [notas, setNotas] = useState<Nota[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novaNota, setNovaNota] = useState("");
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [indiceNotaEditando, setIndiceNotaEditando] = useState<number | null>(null);
  const [notaEditando, setNotaEditando] = useState("");

  const STORAGE_KEY = `notas_${ano}_${materia.nome}`;

  useEffect(() => {
    carregarNotas();
  }, []);

  const carregarNotas = async () => {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    if (dados) setNotas(JSON.parse(dados));
  };

  const salvarNotas = async (novasNotas: Nota[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novasNotas));
    setNotas(novasNotas);
  };

  const adicionarNota = () => {
    if (!novaNota) return;
    const notaNum = parseFloat(novaNota);
    if (isNaN(notaNum)) return;
    const novas = [...notas, { valor: notaNum }];
    salvarNotas(novas);
    setNovaNota("");
    setModalVisible(false);
  };

  const excluirNota = (index: number) => {
    const novas = [...notas];
    novas.splice(index, 1);
    salvarNotas(novas);
  };

  const abrirEdicao = (index: number) => {
    setIndiceNotaEditando(index);
    setNotaEditando(notas[index].valor.toString());
    setModalEditarVisible(true);
  };

  const editarNota = () => {
    if (!notaEditando) return;
    const notaNum = parseFloat(notaEditando);
    if (isNaN(notaNum)) return;
    if (indiceNotaEditando === null) return;
    const novas = [...notas];
    novas[indiceNotaEditando] = { valor: notaNum };
    salvarNotas(novas);
    setModalEditarVisible(false);
    setIndiceNotaEditando(null);
    setNotaEditando("");
  };

  const calcularMedia = () => {
    if (notas.length === 0) return 0;
    const soma = notas.reduce((acc, nota) => acc + nota.valor, 0);
    return soma / notas.length;
  };

  const status = calcularMedia() >= materia.media ? "Aprovado" : "Reprovado";

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{materia.nome}</Text>
      <Text style={styles.subtitulo}>Média Necessária: {materia.media.toFixed(1)}</Text>

      <FlatList
        data={notas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.textoNota}>Nota {index + 1}: {item.valor}</Text>
            <View style={styles.botoesNota}>
              <TouchableOpacity style={styles.botaoEditar} onPress={() => abrirEdicao(index)}>
                <Text style={styles.textoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirNota(index)}>
                <Text style={styles.textoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.resultado}>Média: {calcularMedia().toFixed(2)} - {status}</Text>

      {notas.length > 0 && (
        <LineChart
          data={{
            labels: notas.map((_, index) => `${index + 1}`),
            datasets: [{ data: notas.map((n) => n.valor) }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(102, 67, 166, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#6643a6",
            },
          }}
          bezier
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.label}>Digite a nova nota:</Text>
            <TextInput
              style={styles.input}
              value={novaNota}
              onChangeText={setNovaNota}
              placeholder="Ex: 8.5"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.botaoRoxo} onPress={adicionarNota}>
              <Text style={styles.textoBotao}>Adicionar Nota</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalEditarVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.label}>Editar nota:</Text>
            <TextInput
              style={styles.input}
              value={notaEditando}
              onChangeText={setNotaEditando}
              placeholder="Ex: 7.5"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.botaoRoxo} onPress={editarNota}>
              <Text style={styles.textoBotao}>Salvar Alteração</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6643a6",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ddd",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  textoNota: { fontSize: 16 },
  resultado: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#333",
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
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  botaoRoxo: {
    backgroundColor: "#6643a6",
    padding: 10,
    borderRadius: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  botoesNota: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  botaoExcluir: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textoExcluir: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoEditar: {
    backgroundColor: "#4b79ff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textoEditar: {
    color: "#fff",
    fontWeight: "bold",
  },
});
