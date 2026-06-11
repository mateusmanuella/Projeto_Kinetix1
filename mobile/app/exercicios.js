import { ScrollView, StyleSheet, Text, View } from "react-native";

const items = [
  { title: "Alongamento cervical", time: "3 min" },
  { title: "Fortalecimento lombar", time: "6 min" },
  { title: "Mobilidade de ombro", time: "5 min" },
];

export default function ExerciciosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Exercícios</Text>
      {items.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#f4f7fb" },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 16, color: "#16202a" },
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

