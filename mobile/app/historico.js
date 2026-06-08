import { ScrollView, StyleSheet, Text, View } from "react-native";

const history = [
  { title: "Evolução da dor", value: "Redução de 2 pontos na semana" },
  { title: "Exercícios concluídos", value: "5 sessões finalizadas" },
];

export default function HistoricoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      {history.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#f4f7fb" },
  title: { fontSize: 28, fontWeight: "800", color: "#16202a", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dbe3ec",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#16202a" },
  cardText: { marginTop: 6, color: "#5f6b78" },
});

