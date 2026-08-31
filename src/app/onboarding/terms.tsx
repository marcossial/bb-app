import { useRouter } from "expo-router";
import { CheckSquare, FileText, Square } from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { useAppStore } from "../../store/useAppStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export default function Terms() {
  const router = useRouter();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleAccept = () => {
    if (acceptedTerms) {
      completeOnboarding();
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FileText
          size={48}
          color={colors.accentLime}
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.titleShadow}>TERMOS DE SERVIÇO</Text>
        <Text style={styles.title}>TERMOS DE SERVIÇO</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.termsBox}>
          <Text style={styles.termsText}>
            1. Você entende que este aplicativo é uma SÁTIRA e foi criado para
            fins educativos e de conscientização sobre os perigos do vício em
            jogos de azar.
            {"\n\n"}
            2. Não há dinheiro real envolvido. O saldo exibido é puramente
            fictício (e ironicamente destinado a ser perdido).
            {"\n\n"}
            3. As mecânicas dos jogos foram intencionalmente desenhadas para
            demonstrar algoritmos predadores, simulando a realidade de que a
            "casa sempre ganha".
            {"\n\n"}
            4. Se você ou alguém que você conhece está passando por problemas
            com jogos de azar, procure ajuda. Você encontrará contatos reais na
            aba de "Suporte".
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.7}
        >
          {acceptedTerms ? (
            <CheckSquare size={24} color={colors.accentLime} />
          ) : (
            <Square size={24} color={colors.textSecondary} />
          )}
          <Text style={styles.checkboxText}>
            Eu li, entendi e aceito os termos. E prometo não chorar quando
            perder tudo.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="ACEITAR E ENTRAR →"
          variant={acceptedTerms ? "primary" : "ghost"}
          fullWidth
          onPress={handleAccept}
          disabled={!acceptedTerms}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: typography.fonts.condensed,
    fontSize: 40,
    color: colors.textPrimary,
    letterSpacing: 2,
    position: "absolute",
    bottom: 0,
  },
  titleShadow: {
    fontFamily: typography.fonts.condensed,
    fontSize: 40,
    color: colors.accentLime,
    letterSpacing: 2,
    transform: [{ translateX: -3 }, { translateY: 3 }],
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  termsBox: {
    backgroundColor: colors.bgCard,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  termsText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 22,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkboxText: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
});
