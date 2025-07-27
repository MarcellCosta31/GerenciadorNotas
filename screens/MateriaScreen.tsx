import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "./ThemeContext"; // ajuste o caminho conforme seu projeto
import { LineChart } from "react-native-chart-kit";

interface Nota {
  valor: number;
}

export default function MateriaScreen() {
  const route = useRoute();
  const { ano, materia }: { ano: string; materia: { nome: string; media: number } } =
    route.params as any;

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

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
    <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <Text style={[styles.titulo, { color: isDark ? "#fff" : "#6643a6" }]}>
        {materia.nome}
      </Text>
      <Text style={[styles.subtitulo, { color: isDark ? "#ccc" : "#333" }]}>
        Média Necessária: {materia.media.toFixed(1)}
      </Text>

      <FlatList
        data={notas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.card, { backgroundColor: isDark ? "#222" : "#ddd" }]}>
            <Text style={[styles.textoNota, { color: isDark ? "#fff" : "#000" }]}>
              Nota {index + 1}: {item.valor}
            </Text>
            <View style={styles.botoesNota}>
              <TouchableOpacity
                style={[styles.botaoEditar, { backgroundColor: "#4b79ff" }]}
                onPress={() => abrirEdicao(index)}
              >
                <Text style={styles.textoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoExcluir, { backgroundColor: "#ff4d4d" }]}
                onPress={() => excluirNota(index)}
              >
                <Text style={styles.textoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={[styles.resultado, { color: isDark ? "#fff" : "#333" }]}>
        Média: {calcularMedia().toFixed(2)} - {status}
      </Text>

      {notas.length > 0 && (
        <LineChart
          data={{
            labels: notas.map((_, index) => `${index + 1}`),
            datasets: [{ data: notas.map((n) => n.valor) }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: isDark ? "#000" : "#fff",
            backgroundGradientTo: isDark ? "#000" : "#fff",
            decimalPlaces: 1,
            color: (opacity = 1) =>
              isDark
                ? `rgba(102, 67, 166, ${opacity})`
                : `rgba(102, 67, 166, ${opacity})`,
            labelColor: (opacity = 1) =>
              isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
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

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: "#6643a6" }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={[styles.modalContainer, { backgroundColor: "#00000099" }]}>
          <View style={[styles.modalBox, { backgroundColor: isDark ? "#222" : "#ddd" }]}>
            <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
              Digite a nova nota:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#333" : "#eee",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
              value={novaNota}
              onChangeText={setNovaNota}
              placeholder="Ex: 8.5"
              placeholderTextColor={isDark ? "#aaa" : "#666"}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.botaoRoxo} onPress={adicionarNota}>
              <Text style={styles.textoBotao}>Adicionar Nota</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoCancelar, { backgroundColor: "#999" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalEditarVisible} transparent animationType="fade">
        <View style={[styles.modalContainer, { backgroundColor: "#00000099" }]}>
          <View style={[styles.modalBox, { backgroundColor: isDark ? "#222" : "#ddd" }]}>
            <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>Editar nota:</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#333" : "#eee",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
              value={notaEditando}
              onChangeText={setNotaEditando}
              placeholder="Ex: 7.5"
              placeholderTextColor={isDark ? "#aaa" : "#666"}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.botaoRoxo} onPress={editarNota}>
              <Text style={styles.textoBotao}>Salvar Alteração</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoCancelar, { backgroundColor: "#999" }]}
              onPress={() => setModalEditarVisible(false)}
            >
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
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
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    padding: 20,
    borderRadius: 20,
    width: "80%",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  botaoRoxo: {
    backgroundColor: "#6643a6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textoExcluir: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoEditar: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textoEditar: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoCancelar: {
    padding: 10,
    borderRadius: 10,
  },
});
