import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../../../components/ui/Button';
import { RevealCard } from '../../../../components/ui/RevealCard';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';
import { PieChart, Scale } from 'lucide-react-native';

export default function RoletaInfo() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>*CLICK*... E TUDO ACABA</Text>
          <Text style={styles.subtitle}>A ilusão de roleta justa</Text>
        </View>

        <View style={styles.quoteBlock}>
          <View style={styles.quoteBar} />
          <Text style={styles.quoteText}>
            "A roleta não para por sorte; ela para onde a estatística já previu o lucro..."
          </Text>
        </View>

        <RevealCard 
          icon={PieChart}
          label="DISTRIBUIÇÃO DE CORES"
          text="As probabilidades de 2x ou 14x mascaram o controle algorítmico. As roletas digitais têm pesos diferentes nas cores, manipulando o visual para fazer você achar que tem 50% de chance."
          themeColor={colors.accentIndigo}
        />

        <RevealCard 
          icon={Scale}
          label="EQUILÍBRIO DE PAGAMENTO"
          text="O sistema monitora o volume de apostas de todos os jogadores em tempo real para garantir que a margem de lucro da casa nunca seja ameaçada."
          themeColor={colors.accentIndigo}
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
    color: colors.accentIndigo,
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
    backgroundColor: colors.accentIndigo,
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
