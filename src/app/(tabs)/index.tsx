import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatBadge } from '../../components/ui/StatBadge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Calendar, Frown, DollarSign, AlertOctagon } from 'lucide-react-native';

export default function Home() {
  const { balance, sadnessLevel, luckyDays, assets, sellAsset } = useAppStore();

  const formattedBalance = balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header - Balance */}
        <View style={styles.header}>
          <View style={styles.riskBadge}>
            <AlertOctagon size={12} color={colors.accentDanger} />
            <Text style={styles.riskText}>RISCO DE FALÊNCIA: CRÍTICO</Text>
          </View>
          <Text style={styles.balanceLabel}>SALDO ATUAL DE DESESPERO</Text>
          <Text style={styles.balanceValue}>{formattedBalance}</Text>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsRow}>
          <StatBadge 
            label="Dias de Sorte" 
            value={luckyDays.toString()} 
            icon={Calendar} 
            color={colors.accentLime} 
          />
          <StatBadge 
            label="Nível de Tristeza" 
            value={`${sadnessLevel} XP`} 
            icon={Frown} 
            color={colors.accentIndigo} 
          />
        </View>

        {/* Assets to Sell */}
        <Text style={styles.sectionTitle}>Meus Bens (Vender para jogar)</Text>
        <View style={styles.assetsList}>
          {assets.map((asset) => (
            <Card key={asset.id} style={styles.assetCard}>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetName, asset.sold && styles.assetNameSold]}>
                  {asset.name}
                </Text>
                <Text style={styles.assetValue}>
                  {asset.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
              </View>
              <Button 
                title={asset.sold ? 'VENDIDO' : 'VENDER'} 
                variant={asset.sold ? 'ghost' : 'danger'} 
                onPress={() => sellAsset(asset.id)}
                disabled={asset.sold}
                style={styles.sellButton}
              />
            </Card>
          ))}
        </View>
        
        {/* Extra spacing for tab bar */}
        <View style={{ height: 100 }} />
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
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 110, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 110, 0.3)',
    marginBottom: 16,
    gap: 6,
  },
  riskText: {
    color: colors.accentDanger,
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    letterSpacing: 1,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  balanceValue: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: 48,
    textShadowColor: colors.accentLime,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  assetsList: {
    gap: 12,
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    marginBottom: 4,
  },
  assetNameSold: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  assetValue: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  },
  sellButton: {
    height: 40,
    paddingHorizontal: 16,
  }
});
