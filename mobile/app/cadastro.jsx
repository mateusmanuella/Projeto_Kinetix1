import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import AuthScreen from "../src/components/AuthScreen";
import { useAuth } from "../src/state/AuthContext";
import { styles } from "../src/styles";

const roles = ["PACIENTE", "FISIOTERAPEUTA", "CLINICA"];

export default function Cadastro() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "PACIENTE",
    telefone: "",
    dataNascimento: "",
    crefito: "",
    nomeClinica: "",
    enderecoClinica: "",
    aceiteTermos: true
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleRegister() {
    setError("");
    setLoading(true);

    try {
      await register({ ...form, dataNascimento: form.dataNascimento || null });
      router.replace("/login");
    } catch (err) {
      setError(err.response?.data?.message ?? "Nao foi possivel cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen title="Cadastro" subtitle="Crie sua conta com consentimento LGPD registrado.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.segmented}>
          {roles.map((role) => (
            <Pressable key={role} style={[styles.segment, form.role === role && styles.segmentActive]} onPress={() => update("role", role)}>
              <Text style={[styles.segmentText, form.role === role && styles.segmentTextActive]}>{role}</Text>
            </Pressable>
          ))}
        </View>

        <Field label="Nome" value={form.nome} onChangeText={(value) => update("nome", value)} />
        <Field label="Email" value={form.email} onChangeText={(value) => update("email", value)} autoCapitalize="none" keyboardType="email-address" />
        <Field label="Senha" value={form.senha} onChangeText={(value) => update("senha", value)} secureTextEntry />

        {form.role === "PACIENTE" && (
          <>
            <Field label="Telefone" value={form.telefone} onChangeText={(value) => update("telefone", value)} />
            <Field label="Data de nascimento" value={form.dataNascimento} onChangeText={(value) => update("dataNascimento", value)} placeholder="AAAA-MM-DD" />
          </>
        )}

        {form.role === "FISIOTERAPEUTA" && <Field label="CREFITO" value={form.crefito} onChangeText={(value) => update("crefito", value)} />}

        {form.role === "CLINICA" && (
          <>
            <Field label="Nome da clinica" value={form.nomeClinica} onChangeText={(value) => update("nomeClinica", value)} />
            <Field label="Endereco" value={form.enderecoClinica} onChangeText={(value) => update("enderecoClinica", value)} />
          </>
        )}

        <Text style={styles.consent}>Ao cadastrar, voce aceita os termos de uso e a politica de privacidade.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? "Cadastrando..." : "Cadastrar"}</Text>
        </Pressable>
        <Link href="/login" style={styles.link}>
          Ja tenho conta
        </Link>
      </ScrollView>
    </AuthScreen>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}
