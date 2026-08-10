import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { GlowBorder } from '../../../components/ui/GlowBorder';
import { Rocket, Bomb, CircleDashed } from 'lucide-react-native';

const GAMES = [
  {
    id: 'crash',
    name: 'MONEY ABDUCTOR',
    description: 'Onde a sorte encontra o abduzido!',
    route: '/(tabs)/jogar/crash',
    icon: Rocket,
    color: colors.accentLime,
  },
  {
    id: 'mines',
    name: 'ATOMIC MINES',
    description: 'Um passo errado: Kaboom!',
    route: '/(tabs)/jogar/mines',
    icon: Bomb,
    color: colors.accentDanger,
  },
  {
    id: 'roleta',
    name: 'BRAZILIAN ROULETTE',
    description: '6/6 chance de se dar mal',
    route: '/(tabs)/jogar/roleta',
    icon: CircleDashed,
    color: colors.accentIndigo,
  }
];

export default function GamesList() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>BEM-VINDO AO BIGGER BET</Text>
          <Text style={styles.heroText}>
            A primeira plataforma intergaláctica onde a probabilidade é apenas uma sugestão que ignoramos.
          </Text>
          <View style={styles.heroDisclaimer}>
            <Text style={styles.heroDisclaimerText}>
              * Com a Bigger Bet você sempre sabe quem vai ganhar! (Nós vamos ganhar)
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Escolha sua Perdição</Text>
        
        <View style={styles.grid}>
          {GAMES.map((game) => (
            <TouchableOpacity 
              key={game.id} 
              style={styles.gameCardContainer}
              onPress={() => router.push(game.route as any)}
              activeOpacity={0.8}
            >
              <GlowBorder color={game.color} radius={24} style={styles.gameCard}>
                <View style={[styles.iconContainer, { backgroundColor: `${game.color}20` }]}>
                  <game.icon size={32} color={game.color} />
                </View>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameDesc}>{game.description}</Text>
              </GlowBorder>
            </TouchableOpacity>
          ))}
        </View>

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
    paddingBottom: 100,
  },
  hero: {
    marginBottom: 40,
    marginTop: 20,
    backgroundColor: colors.bgCard,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xxl,
    marginBottom: 12,
  },
  heroText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    lineHeight: 24,
    marginBottom: 20,
  },
  heroDisclaimer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  heroDisclaimerText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    fontStyle: 'italic',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginBottom: 20,
  },
  grid: {
    gap: 20,
  },
  gameCardContainer: {
    minHeight: 180,
  },
  gameCard: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameName: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xl,
    letterSpacing: 1,
    marginBottom: 4,
  },
  gameDesc: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  }
});
