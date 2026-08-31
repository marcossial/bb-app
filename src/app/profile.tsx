import { useRouter } from "expo-router";
import { ArrowLeft, Award, Frown, TrendingDown } from "lucide-react-native";
import { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore, XP_PER_LEVEL } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const ACHIEVEMENTS = [
  {
    id: "1",
    icon: "📉",
    title: "Primeiro Loss",
    description: "Perdeu seus primeiros R$ 1.000 em uma única aposta.",
  },
  {
    id: "2",
    icon: "🏠",
    title: "Sem Teto",
    description: "Vendeu a própria casa para tentar recuperar o prejuízo.",
  },
  {
    id: "3",
    icon: "🚶",
    title: "Andando a Pé",
    description: "O carro foi de base. Bem-vindo ao transporte público.",
  },
  {
    id: "4",
    icon: "💎",
    title: "Cliente VIP do Agiota",
    description: "Atingiu o nível máximo de tristeza no app.",
  },
];

export default function Profile() {
  const router = useRouter();
  const { username, sadnessLevel, xp, generateInitialName } = useAppStore();

  useEffect(() => {
    if (generateInitialName) {
      generateInitialName();
    }
  }, []);

  const progressPercent = (xp % XP_PER_LEVEL) / (XP_PER_LEVEL / 100);
  const xpToNextLevel = XP_PER_LEVEL - (xp % XP_PER_LEVEL);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PERFIL DO APOSTADOR</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=11" }}
              style={styles.avatarImage}
            />
            <View style={styles.avatarBorder} />
          </View>
          <Text style={styles.usernameText}>{username || "Carregando..."}</Text>
          <Text style={styles.userTitle}>Apostador Nível {sadnessLevel}</Text>
        </View>

        <View style={styles.statusCardsContainer}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <TrendingDown size={18} color={colors.accentIndigo} />
              <Text style={styles.statusLabel}>XP TOTAL DE LOSS</Text>
              <Text
                style={[styles.statusValue, { color: colors.accentIndigo }]}
              >
                {xp}
              </Text>
            </View>
            <Text style={styles.helperText}>
              Faltam {xpToNextLevel} XP para o próximo nível
            </Text>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Frown size={18} color={colors.accentLime} />
              <Text style={styles.statusLabel}>NÍVEL DE TRISTEZA</Text>
              <Text style={[styles.statusValue, { color: colors.accentLime }]}>
                Nvl {sadnessLevel}
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: colors.accentLime,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Award size={20} color={colors.accentLime} />
          <Text style={styles.sectionTitle}>Hall da Fama</Text>
        </View>

        <View style={styles.achievementsList}>
          {ACHIEVEMENTS.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emojiText}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>
                  {achievement.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(157, 255, 32, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  profileInfoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarBorder: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.accentLime,
    borderStyle: "dashed",
    opacity: 0.6,
  },
  usernameText: {
    fontFamily: typography.fonts.condensed,
    fontSize: 32,
    color: colors.accentLime,
    textShadowColor: colors.accentLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 4,
  },
  userTitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  statusCardsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  statusCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusLabel: {
    flex: 1,
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    letterSpacing: 1,
  },
  statusValue: {
    fontFamily: typography.fonts.condensed,
    fontSize: 20,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: -4,
    fontFamily: typography.fonts.regular,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(157, 255, 32, 0.1)",
  },
  emojiContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  emojiText: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    marginBottom: 4,
  },
  achievementDesc: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
});
