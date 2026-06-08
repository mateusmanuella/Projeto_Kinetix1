import { ScrollView, StyleSheet, Text, View } from "react-native";

const sessions = [
  { when: "Hoje, 14:00", with: "Maria Silva" },
  { when: "Amanhã, 09:30", with: "João Pereira" },
  { when: "Quinta, 16:00", with: "Ana Souza" },
];

export default function AgendaScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agenda</Text>
      {sessions.map((session) => (
        <View key={session.when} style={styles.card}>
          <Text style={styles.cardTitle}>{session.when}</Text>
          <Text style={styles.cardText}>{session.with}</Text>
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

