import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../src/state/AuthContext";
import { styles } from "../src/styles";

export default function MinhaReabilitacao() {
  const { session, logout } = useAuth();

  if (!session) {
    router.replace("/login");
    return null;
  }

  return (
    <View style={styles.home}>
      <View>
        <Text style={styles.brand}>KINETIX</Text>
        <Text style={styles.homeTitle}>Minha Reabilitacao</Text>
        <Text style={styles.homeSubtitle}>Bem-vindo, {session.name}.</Text>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Nenhum plano ativo</Text>
        <Text style={styles.emptyText}>Quando o fisioterapeuta prescrever um plano, ele aparecera aqui.</Text>
      </View>

      <Pressable style={styles.secondaryButton} onPress={logout}>
        <Text style={styles.secondaryButtonText}>Sair</Text>
      </Pressable>
    </View>
  );
}
