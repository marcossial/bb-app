import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../../../components/ui/Button';
import { RevealCard } from '../../../../components/ui/RevealCard';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';
import { BrainCircuit, Dice5 } from 'lucide-react-native';

export default function CrashInfo() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>A ILUSÃO DA ASCENSÃO</Text>
          <Text style={styles.subtitle}>Como o Money Abductor hackeia sua mente</Text>
        </View>

        <View style={styles.quoteBlock}>
          <View style={styles.quoteBar} />
          <Text style={styles.quoteText}>
            "No espaço, ninguém ouve você perder o timing... porque o timing nunca existiu."
          </Text>
        </View>

        <RevealCard 
          icon={BrainCircuit}
          label="DINÂMICA DE ABDUÇÃO"
          text="Você achou que estava controlando a hora de parar? O multiplicador 1000x não é sobre sorte. É sobre criar uma 'quase-vitória' para te fazer jogar de novo."
          themeColor={colors.accentLime}
        />

        <RevealCard 
          icon={Dice5}
          label="IMPREVISIBILIDADE CALCULADA"
          text="O algoritmo decide exatamente onde a nave vai parar ANTES mesmo da rodada começar. Você não está jogando contra a sorte, está jogando contra uma linha de código projetada para lucrar."
          themeColor={colors.accentLime}
        />

        <Button 
          title="VOLTAR PARA A REALIDADE" 
          variant="secondary" 
          fullWidth 
          onPress={() => router.back()} 
          style={styles.backBtn}
        />

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
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    color: colors.accentLime,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xxl,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
  },
  quoteBlock: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: colors.bgCard,
    padding: 20,
    borderRadius: 16,
  },
  quoteBar: {
    width: 4,
    backgroundColor: colors.accentLime,
    borderRadius: 2,
    marginRight: 16,
  },
  quoteText: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  backBtn: {
    marginTop: 24,
  }
});
