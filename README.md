# 📘 Gerenciador de Notas

Um aplicativo de **gerenciamento de notas escolares** desenvolvido em **React Native**.  
Ele ajuda estudantes (ou professores) a organizarem matérias, registrarem notas e acompanharem o desempenho ao longo do tempo.

---

## ✨ Funcionalidades

### 🏠 HomeScreen
- Exibe os **anos cadastrados** (ex: 2023, 2024...).
- Permite **adicionar** ou **excluir** anos.
- Botão para acessar o **Resumo Geral** de todas as matérias.

### 📚 AnoScreen
- Dentro de cada ano, é possível cadastrar **matérias**.
- Cada matéria possui:
  - Nome
  - Média necessária para aprovação
  - Banner personalizado (imagem da galeria)
- Opção de excluir matérias.
- Acesso para registrar notas em cada matéria.

### ✏️ MateriaScreen
- Registro de notas da matéria selecionada.
- Funções disponíveis:
  - Adicionar nova nota
  - Editar notas existentes
  - Excluir notas
- Cálculo automático da **média atual**.
- Status de **Aprovado** ✅ ou **Reprovado** ❌ de acordo com a média configurada.
- Gráfico de linha mostrando a evolução das notas ao longo do tempo.

### 📊 ResumoScreen
- Mostra um **resumo geral** de todos os anos e matérias cadastrados.
- Exibe:
  - Ano
  - Nome da matéria
  - Média mínima exigida
  - Média atual calculada
  - Status final (**Aprovado** ou **Reprovado**)

---

## 🛠️ Tecnologias utilizadas
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/) – Navegação entre telas
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) – Armazenamento local
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) – Gráfico de evolução das notas

---

## 📸 Preview
*<p></p>
<div style="display: inline-block;">
        <img src="https://github.com/MarcellCosta31/GerenciadorNotas/blob/master/imagens/1.jpeg" alt="Example Image" style="width: 200px;">
        <img src="https://github.com/MarcellCosta31/GerenciadorNotas/blob/master/imagens/2.jpeg" alt="Example Image" style="width: 200px;">
        <img src="https://github.com/MarcellCosta31/GerenciadorNotas/blob/master/imagens/3.jpeg" alt="Example Image" style="width: 200px;">
    </div>
    <div style="display: inline-block;">
        <img src="https://github.com/MarcellCosta31/GerenciadorNotas/blob/master/imagens/4.jpeg" alt="Example Image" style="width: 200px;">
        <img src="https://github.com/MarcellCosta31/GerenciadorNotas/blob/master/imagens/5.jpeg" alt="Example Image" style="width: 200px;">
        <img src="https://github.com/MarcellCosta31/GerenciadorNotas/blob/master/imagens/6.jpeg" alt="Example Image" style="width: 200px;">
    </div>
<p></p>*

---

## 🚀 Como rodar o projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/gerenciador-notas.git
   cd GerenciadorNotas
   npm install
   expo start
