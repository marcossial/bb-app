import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Button } from "../../../../components/ui/Button";
import { useAppStore } from "../../../../store/useAppStore";
import { colors } from "../../../../theme/colors";
import { typography } from "../../../../theme/typography";

import { Bomb, HelpCircle, Star } from "lucide-react-native";

const BET_AMOUNT = 10;
const MULTIPLIER_PER_SAFE = 1.5;
const GRID_COLUMNS = 5;
const GRID_ROWS = 4;
const TOTAL_CELLS = GRID_COLUMNS * GRID_ROWS;
const CELL_SIZE = 52;
const CELL_GAP = 10;

type CellState = "hidden" | "safe" | "mine";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// --- Estrela de explosão desenhada em SVG (pontos alternando raio externo/interno) ---
function describeStar(
  cx: number,
  cy: number,
  points: number,
  outerR: number,
  innerR: number,
) {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? "M" : "L"}${x},${y} `;
  }
  return `${d}Z`;
}

function KaboomBurst() {
  const starPath = useMemo(() => describeStar(110, 110, 7, 95, 48), []);
  return (
    <Svg width={220} height={220} viewBox="0 0 220 220">
      <Path
        d={starPath}
        fill={colors.bgBase}
        stroke={colors.accentDanger}
        strokeWidth={7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function MinesGame() {
  const router = useRouter();
  const { balance, updateBalance, addXp } = useAppStore();

  const [playing, setPlaying] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [cellStates, setCellStates] = useState<CellState[]>(
    Array(TOTAL_CELLS).fill("hidden"),
  );
  const [revealedSafeCount, setRevealedSafeCount] = useState(0);

  const kaboomScale = useSharedValue(0);
  const kaboomStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: "-8deg" }, { scale: kaboomScale.value }],
  }));

  useEffect(() => {
    kaboomScale.value = exploded
      ? withSpring(1, { damping: 7, stiffness: 140 })
      : 0;
  }, [exploded, kaboomScale]);

  const multiplier = 1 + revealedSafeCount * MULTIPLIER_PER_SAFE;
  const potentialWin = BET_AMOUNT * multiplier;

  const startGame = () => {
    if (balance < BET_AMOUNT) {
      Alert.alert(
        "Saldo insuficiente",
        "Venda alguns bens para conseguir dinheiro!",
      );
      return;
    }
    updateBalance(-BET_AMOUNT);
    setCellStates(Array(TOTAL_CELLS).fill("hidden"));
    setRevealedSafeCount(0);
    setExploded(false);
    setPlaying(true);
  };

  const cashOut = () => {
    updateBalance(potentialWin);
    setPlaying(false);
  };

  const handleCellPress = (index: number) => {
    if (!playing || exploded || cellStates[index] !== "hidden") return;

    // Mecânica satírica: a primeira célula tem uma chance de ser segura,
    // mas a segunda sempre é a mina — a "sorte" nunca dura
    const isMine = revealedSafeCount === 0 ? Math.random() < 0.7 : true;

    const next = [...cellStates];
    if (isMine) {
      next[index] = "mine";
      setCellStates(next);
      setExploded(true);
      setPlaying(false);
      addXp(30);
    } else {
      next[index] = "safe";
      setCellStates(next);
      setRevealedSafeCount((c) => c + 1);
    }
  };

  const bottomLabel = !playing
    ? `APOSTAR ${formatBRL(BET_AMOUNT)}`
    : revealedSafeCount > 0
      ? `RETIRAR ${formatBRL(potentialWin)}`
      : "ESCOLHA UMA CÉLULA";

  const bottomDisabled = playing && revealedSafeCount === 0;
  const bottomVariant =
    playing && revealedSafeCount === 0 ? "ghost" : "primary";

  const onPressBottom = () => {
    if (!playing) {
      startGame();
    } else if (revealedSafeCount > 0) {
      cashOut();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.balanceText}>{formatBRL(balance)}</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/jogar/mines/info")}
          style={styles.infoIconBtn}
        >
          <HelpCircle size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CLASSICS</Text>
        <Text style={styles.title}>ATOMIC{"\n"}MINES</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>UM PASSO ERRADO: KABOOM!</Text>
      </View>

      <View style={styles.simBadge}>
        <Text style={styles.simBadgeText}>SIMULAÇÃO • SEM DINHEIRO REAL</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>MULTIPLICADOR</Text>
          <Text style={[styles.statValue, { color: colors.accentIndigo }]}>
            {multiplier.toFixed(1)}X
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>VITÓRIA POTENCIAL</Text>
          <Text style={[styles.statValue, { color: colors.accentLime }]}>
            {formatBRL(potentialWin)}
          </Text>
        </View>
      </View>

      <View style={styles.gridCard}>
        <View style={styles.grid}>
          {cellStates.map((state, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.cell,
                state === "safe" && styles.cellSafe,
                state === "mine" && styles.cellMine,
              ]}
              onPress={() => handleCellPress(i)}
              disabled={!playing || exploded || state !== "hidden"}
              activeOpacity={0.7}
            >
              {state === "safe" && (
                <Star
                  size={20}
                  color={colors.accentIndigo}
                  fill={colors.accentIndigo}
                />
              )}
              {state === "mine" && (
                <Bomb size={22} color={colors.accentDanger} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {exploded && (
          <View style={styles.kaboomWrap} pointerEvents="none">
            <Animated.View style={kaboomStyle}>
              <KaboomBurst />
              <Text style={styles.kaboomText}>KABOOM</Text>
            </Animated.View>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Button
          title={bottomLabel}
          variant={bottomVariant}
          fullWidth
          onPress={onPressBottom}
          disabled={bottomDisabled}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  balanceText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  infoIconBtn: {
    height: 36,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    alignItems: "center",
    marginTop: 8,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    letterSpacing: 3,
    marginBottom: 4,
  },
  title: {
    color: colors.accentIndigo,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xxl,
    lineHeight: typography.sizes.xxl * 1.05,
    textAlign: "center",
    textShadowColor: colors.accentIndigo,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.accentIndigo,
    borderRadius: 1,
    marginTop: 12,
    marginBottom: 10,
    opacity: 0.6,
  },
  subtitle: {
    color: colors.accentIndigo,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    letterSpacing: 1,
    textShadowColor: colors.accentIndigo,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  simBadge: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  simBadgeText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.bold,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xl,
  },
  gridCard: {
    marginTop: 20,
    backgroundColor: colors.bgCard,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: CELL_SIZE * GRID_COLUMNS + CELL_GAP * (GRID_COLUMNS - 1),
    gap: CELL_GAP,
    justifyContent: "center",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cellSafe: {
    backgroundColor: "rgba(90, 110, 255, 0.15)",
    borderColor: colors.accentIndigo,
    borderWidth: 2,
    shadowColor: colors.accentIndigo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  cellMine: {
    backgroundColor: "rgba(255, 59, 110, 0.18)",
    borderColor: colors.accentDanger,
    borderWidth: 2,
    shadowColor: colors.accentDanger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  kaboomWrap: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  kaboomText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -14,
    marginLeft: -60,
    width: 120,
    textAlign: "center",
    color: colors.accentDanger,
    fontFamily: typography.fonts.condensed,
    fontSize: 22,
    letterSpacing: 2,
    textShadowColor: colors.accentDanger,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  controls: {
    marginTop: "auto",
    paddingBottom: 40,
    paddingTop: 24,
  },
});
