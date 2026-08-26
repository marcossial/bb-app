import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ghost } from 'lucide-react-native';

export default function OnboardingStep1() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleShadow}>BIGGER BET</Text>
        <Text style={styles.title}>BIGGER BET</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.imageCard}>
          <Ghost size={120} color={colors.accentLime} />
        </View>
        <Text style={styles.description}>
          Retome o controle{"\n"}e se divirta enquanto o faz.
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Button 
          title="CONTINUAR" 
          variant="primary" 
          fullWidth 
          onPress={() => router.push('/onboarding/step-2')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontFamily: typography.fonts.condensed,
    fontSize: 56,
    color: colors.textPrimary,
    letterSpacing: 2,
    position: 'absolute',
  },
  titleShadow: {
    fontFamily: typography.fonts.condensed,
    fontSize: 56,
    color: colors.accentLime,
    letterSpacing: 2,
    transform: [{ translateX: -4 }, { translateY: 4 }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageCard: {
    width: '100%',
    aspectRatio: 0.8,
    backgroundColor: 'rgba(157, 255, 32, 0.05)',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.accentLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: colors.accentLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  description: {
    fontFamily: typography.fonts.regular,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    padding: 32,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    backgroundColor: colors.accentIndigo,
    width: 24,
  }
});
