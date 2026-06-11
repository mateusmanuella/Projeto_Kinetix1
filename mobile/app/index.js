import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const quickActions = [
  { label: "Exercícios", href: "/exercicios" },
  { label: "Dor", href: "/dor" },
  { label: "Agenda", href: "/agenda" },
  { label: "Histórico", href: "/historico" },
];

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>KINETIX</Text>
        <Text style={styles.title}>Seu acompanhamento físico em um só lugar</Text>
        <Text style={styles.subtitle}>
          Exercícios, registro de dor, agendamentos e evolução de forma simples.
        </Text>

        <Link href="/login" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acessos rápidos</Text>
        <View style={styles.grid}>
          {quickActions.map((item) => (
            <Link href={item.href} asChild key={item.label}>
              <Pressable style={styles.card}>
                <Text style={styles.cardText}>{item.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f4f7fb",
    minHeight: "100%",
  },
  hero: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#dbe3ec",
    marginBottom: 24,
  },
  kicker: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#1f6feb",
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#16202a",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#5f6b78",
    lineHeight: 24,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#1f6feb",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16202a",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    minHeight: 92,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dbe3ec",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "#16202a",
    fontWeight: "700",
  },
});

