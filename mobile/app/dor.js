import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function DorScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de dor</Text>
      <Text style={styles.subtitle}>Informe sua dor para acompanhar sua evolução.</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Nível de dor (0 a 10)" keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Observações" multiline />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#f4f7fb" },
  title: { fontSize: 28, fontWeight: "800", color: "#16202a" },
  subtitle: { color: "#5f6b78", marginTop: 8, marginBottom: 18 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#dbe3ec",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbe3ec",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    minHeight: 52,
  },
});

