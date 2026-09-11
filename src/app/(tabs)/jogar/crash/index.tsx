import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../../components/ui/Button";
import { useAppStore } from "../../../../store/useAppStore";
import { colors } from "../../../../theme/colors";
import { typography } from "../../../../theme/typography";

import { HelpCircle, Rocket, Minus, Plus } from "lucide-react-native";

const TICK_MS = 100;
const TICK_STEP = 0.05;
// Normaliza a subida visual do foguete contra um teto de referência
// (o crash real pode passar disso, o foguete só "sai da tela" antes)
const VISUAL_CEILING = 4.5;

const FLIGHT_WIDTH = 210;
const FLIGHT_HEIGHT = 110;

const STARS = [
  { top: 24, left: 40, size: 3, opacity: 0.5 },
  { top: 50, left: 140, size: 2, opacity: 0.35 },
  { top: 90, left: 250, size: 3, opacity: 0.4 },
  { top: 140, left: 60, size: 2, opacity: 0.3 },
  { top: 170, left: 200, size: 3, opacity: 0.45 },
  { top: 30, left: 300, size: 2, opacity: 0.3 },
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CrashGame() {
  const router = useRouter();
  const { balance, updateBalance, addXp } = useAppStore();

  const [betAmount, setBetAmount] = useState(10);
  const [playing, setPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const crashPointRef = useRef(0);

  const flightProgress = useSharedValue(0);
  const rocketStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: flightProgress.value * FLIGHT_WIDTH },
      { translateY: -flightProgress.value * FLIGHT_HEIGHT },
      { rotate: crashed ? "15deg" : "-35deg" },
    ],
  }));

  useEffect(() => {
    const progress = Math.min((multiplier - 1) / (VISUAL_CEILING - 1), 1);
    flightProgress.value = withTiming(progress, { duration: TICK_MS });
  }, [multiplier, flightProgress]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const potentialWin = betAmount * multiplier;

  const startGame = () => {
    if (balance < betAmount) {
      Alert.alert(
        "Saldo insuficiente",
        "Venda alguns bens para conseguir dinheiro!",
      );
      return;
    }

    updateBalance(-betAmount);
    setPlaying(true);
    setCrashed(false);
    setCashedOut(false);
    setMultiplier(1.0);
    flightProgress.value = 0;

    // O ponto de crash é definido ANTES do jogo começar (Dark Pattern) —
    // a barra só parece imprevisível, mas o resultado já estava decidido
    crashPointRef.current = Number((Math.random() * 3 + 1).toFixed(2));

    let current = 1.0;
    intervalRef.current = setInterval(() => {
      current += TICK_STEP;
      const rounded = Number(current.toFixed(2));
      setMultiplier(rounded);

      if (rounded >= crashPointRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setCrashed(true);
        setPlaying(false);
        addXp(30);
      }
    }, TICK_MS);
  };

  const cashOut = () => {
    if (!playing || !intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    updateBalance(potentialWin);
    setPlaying(false);
    setCashedOut(true);
  };

  const bottomLabel = !playing
    ? `APOSTAR ${formatBRL(betAmount)}`
    : `RETIRAR ${formatBRL(potentialWin)}`;

  const onPressBottom = () => {
    if (!playing) startGame();
    else cashOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.balanceText}>{formatBRL(balance)}</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/jogar/crash/info")}
          style={styles.infoIconBtn}
        >
          <HelpCircle size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CLASSICS</Text>
        <Text style={styles.title}>MONEY{"\n"}ABDUCTOR</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>ONDE A SORTE ENCONTRA O ABDUZIDO!</Text>
      </View>

      <View style={styles.simBadge}>
        <Text style={styles.simBadgeText}>SIMULAÇÃO • SEM DINHEIRO REAL</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>MULTIPLICADOR</Text>
          <Text style={[styles.statValue, { color: colors.accentLime }]}>
            {multiplier.toFixed(2)}x
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>VITÓRIA POTENCIAL</Text>
          <Text style={[styles.statValue, { color: colors.accentIndigo }]}>
            {formatBRL(potentialWin)}
          </Text>
        </View>
      </View>

      <View style={styles.flightCard}>
        {STARS.map((star, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                borderRadius: star.size / 2,
                opacity: star.opacity,
              },
            ]}
          />
        ))}

        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: playing ? 1.04 : 1 }}
          transition={{ type: "timing", duration: 400, loop: playing }}
          style={styles.multiplierWrap}
        >
          <Text
            style={[
              styles.multiplierText,
              crashed && { color: colors.accentDanger },
            ]}
          >
            {multiplier.toFixed(2)}x
          </Text>
          {crashed && <Text style={styles.crashedText}>ABDUZIDO!</Text>}
          {cashedOut && <Text style={styles.cashedOutText}>RESGATADO!</Text>}
        </MotiView>

        <View style={styles.rocketAnchor}>
          <Animated.View style={rocketStyle}>
            <Rocket
              size={30}
              color={crashed ? colors.accentDanger : colors.accentLime}
              fill={crashed ? colors.accentDanger : colors.accentLime}
            />
          </Animated.View>
        </View>
      </View>

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
          title={bottomLabel}
          variant="primary"
          fullWidth
          onPress={onPressBottom}
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
    textAlign: "center",
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
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    paddingVertical: 10,
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
  flightCard: {
    marginTop: 12,
    flex: 1,
    minHeight: 180,
    backgroundColor: colors.bgCard,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  star: {
    position: "absolute",
    backgroundColor: colors.textPrimary,
  },
  multiplierWrap: {
    alignItems: "center",
  },
  multiplierText: {
    color: colors.accentLime,
    fontFamily: typography.fonts.condensed,
    fontSize: 52,
    textShadowColor: colors.accentLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  crashedText: {
    color: colors.accentDanger,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginTop: 4,
    letterSpacing: 1,
  },
  cashedOutText: {
    color: colors.accentLime,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginTop: 4,
    letterSpacing: 1,
  },
  rocketAnchor: {
    position: "absolute",
    left: 16,
    bottom: 16,
  },
  controls: {
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
