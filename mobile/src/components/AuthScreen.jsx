import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { styles } from "../styles";

export default function AuthScreen({ title, subtitle, children }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.brand}>KINETIX</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.panel}>{children}</View>
    </KeyboardAvoidingView>
  );
}
