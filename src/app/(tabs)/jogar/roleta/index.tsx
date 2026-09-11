import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Button } from "../../../../components/ui/Button";
import { useAppStore } from "../../../../store/useAppStore";
import { colors } from "../../../../theme/colors";
import { typography } from "../../../../theme/typography";

import { ChevronDown, HelpCircle, Minus, Plus } from "lucide-react-native";

const WIN_MULTIPLIER = 14;

const WHEEL_SIZE = 210;
const DISC_SIZE = 190;
const HUB_SIZE = 80;
const SEGMENT_COUNT = 16;

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// --- Geometria da roda: gera as fatias pretas/brancas alternadas em SVG ---
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    cx,
    cy,
    "L",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

function WheelSegments() {
  const slices = useMemo(() => {
    const r = DISC_SIZE / 2;
    const step = 360 / SEGMENT_COUNT;
    return Array.from({ length: SEGMENT_COUNT }).map((_, i) => ({
      d: describeSlice(r, r, r, i * step, (i + 1) * step),
      color: i % 2 === 0 ? "#0A0A0A" : "#F2F2F2",
    }));
  }, []);

  return (
    <Svg
      width={DISC_SIZE}
      height={DISC_SIZE}
      viewBox={`0 0 ${DISC_SIZE} ${DISC_SIZE}`}
    >
      {slices.map((slice, i) => (
        <Path key={i} d={slice.d} fill={slice.color} />
      ))}
    </Svg>
  );
}

export default function RoletaGame() {
  const router = useRouter();
  const { balance, updateBalance, addXp } = useAppStore();
  const [betAmount, setBetAmount] = useState(10);
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<"W" | "L">>([]);

  const rotation = useSharedValue(0);
  const discSpinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const canPlay = !playing && balance >= betAmount;

  const startGame = () => {
    if (playing) return;

    if (balance < betAmount) {
      Alert.alert(
        "Saldo insuficiente",
        "Venda alguns bens para conseguir dinheiro!",
      );
      return;
    }

    updateBalance(-betAmount);
    setPlaying(true);
    setResult(null);

    // A roda gira várias voltas + um ângulo aleatório, só por estética —
    // o resultado real já foi decidido pela probabilidade abaixo
    rotation.value = withTiming(
      rotation.value + 360 * 4 + Math.random() * 360,
      {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      },
    );

    setTimeout(() => {
      const win = Math.random() > 0.9;

      if (win) {
        updateBalance(betAmount * WIN_MULTIPLIER);
      } else {
        addXp(30);
      }

      setResult(win ? "GANHOU (Milagre)" : "PERDEU (Como sempre)");
      setHistory((prev) => [win ? "W" : "L", ...prev].slice(0, 8));
      setPlaying(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.balanceText}>{formatBRL(balance)}</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/jogar/roleta/info")}
          style={styles.infoIconBtn}
        >
          <HelpCircle size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CLASSICS</Text>
        <Text style={styles.title}>BRAZILIAN{"\n"}ROULETTE</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>6/6 CHANCE DE SE DAR MAL</Text>
      </View>

      <View style={styles.simBadge}>
        <Text style={styles.simBadgeText}>SIMULAÇÃO • SEM DINHEIRO REAL</Text>
      </View>

      <View style={styles.wheelCard}>
        <View style={styles.wheel}>
          <Animated.View style={[styles.disc, discSpinStyle]}>
            <WheelSegments />
          </Animated.View>

          <View style={styles.pointer} />

          <View style={styles.hub}>
            {playing ? (
              <Text style={styles.hubTextSmall}>GIRANDO...</Text>
            ) : result ? (
              <Text
                style={[
                  styles.hubTextSmall,
                  {
                    color: result.includes("PERDEU")
                      ? colors.accentDanger
                      : colors.accentLime,
                  },
                ]}
              >
                {result}
              </Text>
            ) : (
              <Text style={styles.hubText}>{WIN_MULTIPLIER}X</Text>
            )}
          </View>
        </View>

        {history.length > 0 && (
          <View style={styles.historyRow}>
            {history.map((r, i) => (
              <View
                key={i}
                style={[
                  styles.historyDot,
                  {
                    backgroundColor:
                      r === "W" ? colors.accentLime : colors.accentDanger,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.modeSelector}
        activeOpacity={0.7}
        onPress={() =>
          Alert.alert(
            "Em breve",
            "Outros modos de aposta chegam em uma próxima atualização.",
          )
        }
      >
        <Text style={styles.modeLabel}>Modo</Text>
        <View style={styles.modeValueRow}>
          <Text style={styles.modeValue}>Clássico</Text>
          <ChevronDown size={18} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <View style={styles.controls}>
        <View style={styles.betRow}>
          <TouchableOpacity
            style={styles.betBtn}
            onPress={() => setBetAmount(Math.max(1, betAmount - 10))}
            disabled={playing}
          >
            <Minus size={20} color={playing ? colors.textSecondary : colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.betAmountContainer}>
            <Text style={styles.betLabel}>APOSTA</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.betValue, playing && { color: colors.textSecondary }, { marginRight: 4 }]}>
                R$
              </Text>
              <TextInput
                style={[styles.betValue, playing && { color: colors.textSecondary }, { padding: 0, minWidth: 40, textAlign: "center" }]}
                keyboardType="numeric"
                value={betAmount.toString()}
                onChangeText={(text) => {
                  const parsed = parseInt(text.replace(/[^0-9]/g, ""), 10);
                  setBetAmount(isNaN(parsed) ? 0 : parsed);
                }}
                editable={!playing}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.betBtn}
            onPress={() => setBetAmount(betAmount + 10)}
            disabled={playing}
          >
            <Plus size={20} color={playing ? colors.textSecondary : colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Button
          title={
            playing
              ? "GIRANDO A RODA..."
              : !canPlay
                ? "SEM SALDO"
                : `APOSTAR ${formatBRL(betAmount)}`
          }
          variant={playing || !canPlay ? "ghost" : "primary"}
          fullWidth
          onPress={startGame}
          disabled={!canPlay}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    paddingHorizontal: 16,
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
    marginTop: 4,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    letterSpacing: 3,
    marginBottom: 4,
  },
  title: {
    color: colors.accentLime,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xxl,
    lineHeight: typography.sizes.xxl * 1.05,
    textAlign: "center",
    textShadowColor: colors.accentLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.accentLime,
    borderRadius: 1,
    marginTop: 12,
    marginBottom: 10,
    opacity: 0.6,
  },
  subtitle: {
    color: colors.accentLime,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    letterSpacing: 1,
    textShadowColor: colors.accentLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  simBadge: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  simBadgeText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    letterSpacing: 0.5,
  },
  wheelCard: {
    marginTop: 10,
    backgroundColor: colors.bgCard,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingVertical: 16,
    alignItems: "center",
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 6,
    borderColor: colors.accentLime,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    shadowColor: colors.accentLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 14,
  },
  disc: {
    width: DISC_SIZE,
    height: DISC_SIZE,
    borderRadius: DISC_SIZE / 2,
    overflow: "hidden",
  },
  pointer: {
    position: "absolute",
    top: -12,
    left: "50%",
    marginLeft: -13,
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderTopWidth: 22,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.accentIndigo,
    shadowColor: colors.accentIndigo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  hub: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -HUB_SIZE / 2,
    marginLeft: -HUB_SIZE / 2,
    width: HUB_SIZE,
    height: HUB_SIZE,
    borderRadius: HUB_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.accentLime,
    backgroundColor: colors.bgCard,
    justifyContent: "center",
    alignItems: "center",
  },
  hubText: {
    color: colors.accentLime,
    fontFamily: typography.fonts.condensed,
    fontSize: 24,
    textShadowColor: colors.accentLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  hubTextSmall: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 6,
  },
  historyRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modeSelector: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modeLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  },
  modeValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modeValue: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  controls: {
    marginTop: "auto",
    paddingBottom: 16,
    paddingTop: 12,
  },
  betRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  betBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  betAmountContainer: {
    alignItems: "center",
  },
  betLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  betValue: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xl,
  },
});
