import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import AuthScreen from "../src/components/AuthScreen";
import { useAuth } from "../src/state/AuthContext";
import { styles } from "../src/styles";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      await login({ email, senha });
      router.replace("/minha-reabilitacao");
    } catch (err) {
      setError(err.response?.data?.message ?? "Nao foi possivel autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen title="Entrar" subtitle="Acompanhe seu plano de reabilitacao pelo KINETIX.">
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.primaryButtonText}>{loading ? "Entrando..." : "Entrar"}</Text>
      </Pressable>
      <Link href="/cadastro" style={styles.link}>
        Criar cadastro
      </Link>
    </AuthScreen>
  );
}
