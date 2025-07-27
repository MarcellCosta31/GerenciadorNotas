import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "./ThemeContext"; // ajuste o caminho conforme seu projeto

interface Anotacao {
  id: string;
  texto: string;
  data: string;
}

export default function AnotacoesScreen() {
  const route = useRoute();
  const { ano, materia }: any = route.params;

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const STORAGE_KEY = `anotacoes_${ano}_${materia.nome}`;

  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [texto, setTexto] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarAnotacoes();
  }, []);

  const carregarAnotacoes = async () => {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);
    if (dados) setAnotacoes(JSON.parse(dados));
  };

  const salvarAnotacoes = async (novas: Anotacao[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novas));
    setAnotacoes(novas);
  };

  const adicionarOuEditar = () => {
    if (!texto.trim()) return;

    if (editandoId) {
      const atualizadas = anotacoes.map((a) =>
        a.id === editandoId ? { ...a, texto } : a
      );
      salvarAnotacoes(atualizadas);
      setEditandoId(null);
    } else {
      const nova: Anotacao = {
        id: Date.now().toString(),
        texto,
        data: new Date().toLocaleDateString(),
      };
      salvarAnotacoes([nova, ...anotacoes]);
    }

    setTexto("");
  };

  const editar = (id: string) => {
    const anotacao = anotacoes.find((a) => a.id === id);
    if (anotacao) {
      setTexto(anotacao.texto);
      setEditandoId(id);
    }
  };

  const excluir = (id: string) => {
    Alert.alert("Confirmar", "Deseja excluir essa anotação?", [
      { text: "Cancelar" },
      {
        text: "Excluir",
        onPress: () => {
          const filtradas = anotacoes.filter((a) => a.id !== id);
          salvarAnotacoes(filtradas);
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <Text style={[styles.titulo, { color: isDark ? "#fff" : "#6643a6" }]}>
        Anotações de {materia.nome}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#222" : "#eee",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        multiline
        value={texto}
        onChangeText={setTexto}
        placeholder="Digite uma anotação"
        placeholderTextColor={isDark ? "#aaa" : "#666"}
      />

      <TouchableOpacity style={styles.botao} onPress={adicionarOuEditar}>
        <Text style={styles.botaoTexto}>{editandoId ? "Salvar Edição" : "Adicionar Anotação"}</Text>
      </TouchableOpacity>

      <FlatList
        data={anotacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.anotacaoBox, { backgroundColor: isDark ? "#111" : "#ddd" }]}>
            <Text style={[styles.data, { color: isDark ? "#aaa" : "#555" }]}>{item.data}</Text>
            <Text style={[styles.anotacaoTexto, { color: isDark ? "#fff" : "#000" }]}>
              {item.texto}
            </Text>
            <View style={styles.botoesRow}>
              <TouchableOpacity
                style={[styles.botaoAcao, { backgroundColor: "#4b79ff" }]}
                onPress={() => editar(item.id)}
              >
                <Text style={styles.textoBotaoAcao}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoAcao, { backgroundColor: "#ff4d4d" }]}
                onPress={() => excluir(item.id)}
              >
                <Text style={styles.textoBotaoAcao}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    textAlignVertical: "top",
    minHeight: 80,
  },
  botao: {
    backgroundColor: "#6643a6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  anotacaoBox: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  data: {
    fontSize: 12,
    marginBottom: 4,
  },
  anotacaoTexto: {
    fontSize: 16,
  },
  botoesRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  botaoAcao: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotaoAcao: {
    color: "#fff",
    fontWeight: "bold",
  },
});
