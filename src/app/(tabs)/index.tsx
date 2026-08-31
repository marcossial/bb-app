import { useRouter } from "expo-router";
import {
  Activity,
  Box,
  Car,
  Frown,
  Home as HomeIcon,
  UserRound,
} from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { useAppStore, XP_PER_LEVEL } from "../../store/useAppStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export default function Home() {
  const { balance, sadnessLevel, xp, luckyDays, assets, sellAsset } =
    useAppStore();
  const router = useRouter();

  const formattedBalance = balance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const progressPercent = (xp % XP_PER_LEVEL) / (XP_PER_LEVEL / 100);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Bigger Bet */}
        <View style={styles.appHeader}>
          <View style={styles.logoContainer}>
            <TouchableOpacity
              style={styles.alienIconBadge}
              onPress={() => router.push("/profile")}
              activeOpacity={0.7}
            >
              <UserRound size={24} color={colors.accentLime} />
            </TouchableOpacity>
            <Text style={styles.logoText}>BIGGER BET</Text>
          </View>
          <View style={styles.smallAlienBadge}>
            <UserRound size={16} color={colors.textSecondary} />
          </View>
          <View style={styles.headerNeonBorder} />
        </View>

        {/* Header - Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>SALDO ATUAL DE DESESPERO</Text>
          <Text style={styles.balanceValue}>{formattedBalance}</Text>

          <View style={styles.riskBadge}>
            <View style={styles.riskDot} />
            <Text style={styles.riskText}>RISCO DE FALÊNCIA: CRÍTICO</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.sectionHeader}>
          <Activity size={20} color={colors.accentIndigo} />
          <Text style={styles.sectionTitle}>Estatísticas</Text>
        </View>

        <View style={styles.statsRow}>
          <View
            style={[styles.statCard, { borderColor: "rgba(67, 85, 249, 0.2)" }]}
          >
            <View style={styles.statIconContainer}>
              <Box size={24} color={colors.accentIndigo} />
            </View>
            <Text style={styles.statCardLabel}>DIAS DE SORTE</Text>
            <Text
              style={[styles.statCardValue, { color: colors.accentIndigo }]}
            >
              {luckyDays}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { borderColor: "rgba(157, 255, 32, 0.2)" },
            ]}
          >
            <View style={styles.statIconContainer}>
              <Frown size={24} color={colors.accentLime} />
            </View>
            <Text style={styles.statCardLabel}>NÍVEL DE TRISTEZA</Text>
            <View style={styles.statValueRow}>
              <Text
                style={[styles.statCardValue, { color: colors.accentLime }]}
              >
                {sadnessLevel}
              </Text>
              <Text style={styles.statCardUnit}>NÍVEL</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Assets to Sell */}
        <View style={styles.sectionHeaderBetween}>
          <View style={styles.sectionHeader}>
            <Box size={20} color={colors.accentIndigo} />
            <Text style={styles.sectionTitle}>Meus Bens</Text>
          </View>
          <Text style={styles.assetsCountText}>
            {assets.filter((a) => !a.sold).length} ITENS RESTANTES
          </Text>
        </View>

        <View style={styles.assetsList}>
          {assets.map((asset) => (
            <View key={asset.id} style={styles.assetCard}>
              <View style={styles.assetIconBox}>
                {asset.name.toLowerCase().includes("casa") ? (
                  <HomeIcon size={24} color={colors.textSecondary} />
                ) : (
                  <Car size={24} color={colors.textSecondary} />
                )}
              </View>
              <View style={styles.assetInfo}>
                <Text
                  style={[styles.assetName, asset.sold && styles.assetNameSold]}
                >
                  {asset.name}
                </Text>
                <Text style={styles.assetValue}>
                  Valor:{" "}
                  {asset.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
              <Button
                title={asset.sold ? "VENDIDO" : "VENDER"}
                variant={asset.sold ? "ghost" : "outline-neon"}
                onPress={() => sellAsset(asset.id)}
                disabled={asset.sold}
                style={styles.sellButton}
              />
            </View>
          ))}
        </View>

        {/* Extra spacing for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollContent: {
    padding: 24,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
    paddingBottom: 24,
  },
  headerNeonBorder: {
    position: "absolute",
    bottom: 0,
    left: -24,
    right: -24,
    height: 1,
    backgroundColor: colors.accentLime,
    opacity: 0.5,
    shadowColor: colors.accentLime,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  alienIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accentLime,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(157, 255, 32, 0.05)",
  },
  logoText: {
    fontFamily: typography.fonts.condensed,
    fontSize: 32,
    color: colors.textPrimary,
    letterSpacing: 1,
    textShadowColor: colors.accentLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  smallAlienBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceSection: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  balanceValue: {
    color: colors.accentLime,
    fontFamily: typography.fonts.condensed,
    fontSize: 56,
    textShadowColor: colors.accentLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 16,
  },
  riskBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(157, 255, 32, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(157, 255, 32, 0.3)",
    gap: 8,
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentLime,
    shadowColor: colors.accentLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  riskText: {
    color: colors.accentLime,
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionHeaderBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  assetsCountText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statIconContainer: {
    marginBottom: 12,
  },
  statCardLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 8,
  },
  statCardValue: {
    fontFamily: typography.fonts.condensed,
    fontSize: 32,
  },
  statCardUnit: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: 12,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.accentLime,
    borderRadius: 2,
  },
  assetsList: {
    gap: 12,
  },
  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 0,
    marginBottom: 16,
  },
  assetIconBox: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    marginBottom: 4,
  },
  assetNameSold: {
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },
  assetValue: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  },
  sellButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
});
