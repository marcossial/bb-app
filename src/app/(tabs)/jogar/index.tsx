import { useRouter } from "expo-router";
import { UserRound } from "lucide-react-native";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlowBorder } from "../../../components/ui/GlowBorder";
import { colors } from "../../../theme/colors";
import { typography } from "../../../theme/typography";

const GAMES = [
  {
    id: "roleta",
    name: "BRAZILIAN\nROULETTE",
    route: "/(tabs)/jogar/roleta",
    image: require("@/assets/images/brazilian_roulette.png"),
  },
  {
    id: "mines",
    name: "ATOMIC\nMINES",
    route: "/(tabs)/jogar/mines",
    image: require("@/assets/images/atomic_mines.png"),
  },
  {
    id: "crash",
    name: "MONEY\nABDUCTOR",
    route: "/(tabs)/jogar/crash",
    image: require("@/assets/images/money_abductor.png"),
  },
];

export default function GamesList() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header App (Opcional se já estiver no layout) */}
        <View style={styles.appHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.alienIconBadge}>
              <UserRound size={24} color={colors.accentLime || "#9DFF20"} />
            </View>
            <Text style={styles.logoText}>BIGGER BET</Text>
          </View>
          <View style={styles.smallAlienBadge}>
            <UserRound size={16} color={colors.textSecondary || "#888"} />
          </View>
        </View>

        {/* Hero Card */}
        <GlowBorder
          color={colors.accentLime || "#9DFF20"}
          radius={24}
          style={styles.heroCard}
        >
          <Text style={styles.heroPreTitle}>
            O ESPAÇO É O DESTINO (DA SUA CONTA)
          </Text>

          <Text style={styles.heroTitleWhite}>BEM-VINDO AO</Text>
          <Text style={styles.heroTitleGreen}>BIGGER BET</Text>

          {/* Placeholder para a imagem dos 3 aliens (Adicione a sua caso possua) */}
          <View style={styles.heroImagePlaceholder} />

          <Text style={styles.heroText}>
            A primeira plataforma intergaláctica onde a probabilidade é apenas
            uma sugestão que ignoramos.
          </Text>

          <TouchableOpacity style={styles.heroButton} activeOpacity={0.8}>
            <Text style={styles.heroButtonText}>
              VAMOS JUNTOS PERDER SEU DINHEIRO
            </Text>
          </TouchableOpacity>
        </GlowBorder>

        {/* Disclaimer Hero */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            COM A BIGGER BET VOCÊ SEMPRE SABE QUEM VAI GANHAR!{"\n"}
            <Text style={styles.disclaimerTextGreen}>(NÓS VAMOS GANHAR)</Text>
          </Text>
        </View>

        {/* Header da Seção de Jogos */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Jogos</Text>
            <Text style={styles.sectionSubtitle}>
              Escolha como ser depenado
            </Text>
          </View>
        </View>

        {/* Grid de Jogos (Cards Menores e Horizontais) */}
        <View style={styles.gamesRow}>
          {GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => router.push(game.route as any)}
              activeOpacity={0.8}
            >
              <Image
                source={game.image}
                style={styles.gameIconImage}
                resizeMode="contain"
              />
              <Text style={styles.gameName}>{game.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Eventos Catastróficos */}
        <Text
          style={[
            styles.sectionTitle,
            { marginTop: 40, marginBottom: 16, textTransform: "uppercase" },
          ]}
        >
          Eventos Catastróficos
        </Text>
        <GlowBorder
          color={colors.accentLime || "#9DFF20"}
          radius={24}
          style={styles.eventCardPlaceholder}
        >
          <View style={{ flex: 1 }} />
          {/* Conteúdo futuro dos eventos */}
        </GlowBorder>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
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
    borderColor: "#9DFF20",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(157, 255, 32, 0.05)",
  },
  logoText: {
    fontFamily: typography.fonts.condensed,
    fontSize: 28,
    color: "#FFF",
    letterSpacing: 1,
  },
  smallAlienBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Hero Card
  heroCard: {
    backgroundColor: "#121214",
    padding: 24,
    alignItems: "center",
    justifyContent: "center", // Adicionado para reforçar eixo principal
  },
  heroPreTitle: {
    color: "#888",
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: "center", // Adicionado
  },
  heroTitleWhite: {
    color: "#FFF",
    fontFamily: typography.fonts.condensed,
    fontSize: 32,
    textAlign: "center",
    lineHeight: 34,
  },
  heroTitleGreen: {
    color: "#9DFF20",
    fontFamily: typography.fonts.condensed,
    fontSize: 48,
    textAlign: "center",
    lineHeight: 50,
    textShadowColor: "#9DFF20",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 16,
  },
  heroImagePlaceholder: {
    width: "100%",
    height: 120,
    marginBottom: 16,
  },
  heroText: {
    color: "#D1D1D1",
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  heroButton: {
    backgroundColor: "#4355F9",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 12, // Garantir respiro nas laterais do texto
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4355F9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  heroButtonText: {
    color: "#FFF",
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    textAlign: "center", // Adicionado
  },
  disclaimerContainer: {
    marginTop: 12,
    marginBottom: 40,
    alignItems: "center",
  },
  disclaimerText: {
    color: "#666",
    fontFamily: typography.fonts.regular,
    fontSize: 9,
    textAlign: "center",
    textTransform: "uppercase",
  },
  disclaimerTextGreen: {
    color: "#3A7A10",
    fontFamily: typography.fonts.bold,
  },

  // Games Section
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFF",
    fontFamily: typography.fonts.bold,
    fontSize: 22,
  },
  sectionSubtitle: {
    color: "#666",
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    marginTop: 2,
  },
  gamesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  gameCard: {
    flex: 1,
    backgroundColor: "#121214",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 0.85,
  },
  gameIconImage: {
    width: 48,
    height: 48,
    marginBottom: 16,
    opacity: 0.8,
  },
  gameName: {
    color: "#888",
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Eventos Catastróficos
  eventCardPlaceholder: {
    backgroundColor: "#121214",
    height: 140,
  },
});
