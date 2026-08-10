import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../../../components/ui/Button';
import { useAppStore } from '../../../../store/useAppStore';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';
import { Info } from 'lucide-react-native';
// import { MotiView, MotiText } from 'moti'; // Will use later for full animation

import { HelpCircle } from 'lucide-react-native';

export default function CrashGame() {
  const router = useRouter();
  const { balance, updateBalance } = useAppStore();
  const [playing, setPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashed, setCrashed] = useState(false);
  
  const startGame = () => {
    if (balance < 10) {
      alert("Venda alguns bens para conseguir dinheiro!");
      return;
    }
    updateBalance(-10); // Aposta fictícia
    setPlaying(true);
    setCrashed(false);
    setMultiplier(1.0);
    
    // O ponto de crash é definido ANTES do jogo começar (Dark Pattern)
    const crashPoint = (Math.random() * 3 + 1).toFixed(2);
    
    let current = 1.0;
    const interval = setInterval(() => {
      current += 0.05;
      setMultiplier(Number(current.toFixed(2)));
      
      if (current >= Number(crashPoint)) {
        clearInterval(interval);
        setCrashed(true);
        setPlaying(false);
      }
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MONEY ABDUCTOR</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/jogar/crash/info')} style={styles.infoIconBtn}>
          <HelpCircle size={28} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.gameArea}>
        <Text style={[
          styles.multiplier, 
          crashed && { color: colors.accentDanger }
        ]}>
          {multiplier.toFixed(2)}x
        </Text>
        {crashed && <Text style={styles.crashedText}>ABDUZIDO!</Text>}
      </View>

      <View style={styles.controls}>
        <Button 
          title={playing ? "JOGANDO..." : "APOSTAR R$ 10"} 
          variant={playing ? "ghost" : "primary"} 
          fullWidth 
          onPress={startGame}
          disabled={playing}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xl,
  },
  infoBtn: {
    height: 40,
    paddingHorizontal: 12,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiplier: {
    color: colors.accentLime,
    fontFamily: typography.fonts.condensed,
    fontSize: 80,
  },
  crashedText: {
    color: colors.accentDanger,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginTop: 16,
  },
  controls: {
    marginTop: 'auto',
    paddingBottom: 40,
  }
});
