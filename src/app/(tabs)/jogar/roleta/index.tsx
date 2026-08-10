import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../../../components/ui/Button';
import { useAppStore } from '../../../../store/useAppStore';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';

import { HelpCircle } from 'lucide-react-native';

export default function RoletaGame() {
  const router = useRouter();
  const { balance, updateBalance } = useAppStore();
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const startGame = () => {
    if (balance < 10) {
      alert("Venda alguns bens para conseguir dinheiro!");
      return;
    }
    updateBalance(-10);
    setPlaying(true);
    setResult(null);
    
    // Simulate spin
    setTimeout(() => {
      // 90% chance to lose in this satirical roleta
      const win = Math.random() > 0.9;
      setResult(win ? 'GANHOU (Milagre)' : 'PERDEU (Como sempre)');
      setPlaying(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BRAZILIAN ROULETTE</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/jogar/roleta/info')} style={styles.infoIconBtn}>
          <HelpCircle size={28} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.gameArea}>
        <View style={styles.wheel}>
          {playing ? (
            <Text style={styles.wheelText}>GIRANDO...</Text>
          ) : result ? (
            <Text style={[
              styles.wheelText, 
              { color: result.includes('PERDEU') ? colors.accentDanger : colors.accentLime, fontSize: 24, textAlign: 'center' }
            ]}>{result}</Text>
          ) : (
            <Text style={styles.wheelText}>14X</Text>
          )}
        </View>
      </View>

      <View style={styles.controls}>
        <Button 
          title={playing ? "GIRANDO A RODA..." : "APOSTAR R$ 10"} 
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
    fontSize: typography.sizes.lg,
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
  wheel: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    borderColor: colors.accentIndigo,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
  },
  wheelText: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: 48,
  },
  controls: {
    marginTop: 'auto',
    paddingBottom: 40,
  }
});
