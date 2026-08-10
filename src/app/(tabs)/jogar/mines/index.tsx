import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../../../components/ui/Button';
import { useAppStore } from '../../../../store/useAppStore';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';

import { HelpCircle } from 'lucide-react-native';

export default function MinesGame() {
  const router = useRouter();
  const { balance, updateBalance } = useAppStore();
  const [playing, setPlaying] = useState(false);
  const [exploded, setExploded] = useState(false);
  
  const startGame = () => {
    if (balance < 10) {
      alert("Venda alguns bens para conseguir dinheiro!");
      return;
    }
    updateBalance(-10);
    setPlaying(true);
    setExploded(false);
  };

  const handleCellPress = () => {
    if (!playing || exploded) return;
    // Satirical mechanics: First or second click always explodes to show the point
    setExploded(true);
    setPlaying(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ATOMIC MINES</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/jogar/mines/info')} style={styles.infoIconBtn}>
          <HelpCircle size={28} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.gameArea}>
        <View style={styles.grid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.cell, exploded && styles.cellExploded]} 
              onPress={handleCellPress}
              disabled={!playing || exploded}
            >
              {exploded && <Text style={styles.kaboom}>💣</Text>}
            </TouchableOpacity>
          ))}
        </View>
        {exploded && <Text style={styles.explodedText}>KABOOM!</Text>}
      </View>

      <View style={styles.controls}>
        <Button 
          title={playing ? "ESCOLHA UMA CÉLULA" : "APOSTAR R$ 10"} 
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    gap: 10,
    justifyContent: 'center',
  },
  cell: {
    width: 60,
    height: 60,
    backgroundColor: colors.bgCard,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cellExploded: {
    backgroundColor: 'rgba(255, 59, 110, 0.2)',
    borderColor: colors.accentDanger,
  },
  kaboom: {
    fontSize: 24,
  },
  explodedText: {
    color: colors.accentDanger,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginTop: 24,
  },
  controls: {
    marginTop: 'auto',
    paddingBottom: 40,
  }
});
