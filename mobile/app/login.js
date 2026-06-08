import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Entre para acompanhar seus exercícios e evolução.</Text>

      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#7b8794" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry placeholderTextColor="#7b8794" />

      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#16202a",
    marginBottom: 8,
  },
  subtitle: {
    color: "#5f6b78",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbe3ec",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    color: "#16202a",
  },
  button: {
    backgroundColor: "#1f6feb",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "700",
  },
});

