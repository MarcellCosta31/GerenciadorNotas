import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Materia {
  nome: string;
  media: number;
}

interface StatusMateria {
  ano: string;
  materia: string;
  mediaMinima: number;
  mediaAtual: number;
  status: "Aprovado" | "Reprovado";
}

export default function ResumoScreen() {
  const [resumo, setResumo] = useState<StatusMateria[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    setCarregando(true);
    const chaves = await AsyncStorage.getAllKeys();
    const anos = chaves
      .filter((k) => k.startsWith("materias_"))
      .map((k) => k.replace("materias_", ""));

    let resultado: StatusMateria[] = [];

    for (const ano of anos) {
      const materiasRaw = await AsyncStorage.getItem(`materias_${ano}`);
      if (!materiasRaw) continue;

      const materias: Materia[] = JSON.parse(materiasRaw);

      for (const materia of materias) {
        const notasRaw = await AsyncStorage.getItem(
          `notas_${ano}_${materia.nome}`
        );
        const notas: number[] = notasRaw ? JSON.parse(notasRaw) : [];

        const soma = notas.reduce((acc, val) => acc + val, 0);
        const media = notas.length > 0 ? soma / notas.length : 0;

        resultado.push({
          ano,
          materia: materia.nome,
          mediaMinima: materia.media,
          mediaAtual: parseFloat(media.toFixed(2)),
          status: media >= materia.media ? "Aprovado" : "Reprovado",
        });
      }
    }

    setResumo(resultado);
    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resumo Geral</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#6643a6" />
      ) : (
        <ScrollView contentContainerStyle={styles.lista}>
          {resumo.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.anoMateria}>
                📘 {item.ano} - {item.materia}
              </Text>
              <Text style={styles.texto}>
                Média Atual: {item.mediaAtual} / Mínima: {item.mediaMinima}
              </Text>
              <Text
                style={[
                  styles.status,
                  { color: item.status === "Aprovado" ? "green" : "red" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6643a6",
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },
  anoMateria: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  texto: {
    fontSize: 14,
  },
  status: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});
