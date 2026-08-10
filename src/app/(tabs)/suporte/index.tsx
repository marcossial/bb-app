import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { GlowBorder } from '../../../components/ui/GlowBorder';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { Headphones, LifeBuoy, AlertTriangle } from 'lucide-react-native';

export default function SupportScreen() {
  
  const handleCallCVV = () => {
    Linking.openURL('tel:188');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>SUPORTE?</Text>
          <Text style={styles.subtitle}>Não prenda a respiração...</Text>
        </View>

        {/* Satirical Support */}
        <GlowBorder color={colors.accentDanger} radius={24} style={styles.satiricalCard}>
          <View style={styles.cardContent}>
            <Headphones size={48} color={colors.accentDanger} style={styles.icon} />
            <Text style={styles.satiricalTitle}>ATENDIMENTO INTERGALÁCTICO</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Latência de Resposta:</Text>
              <Text style={styles.statValue}>4.2 Éons</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Protocolo Atual:</Text>
              <Text style={styles.statValue}>VOID (Ignorar)</Text>
            </View>
            
            <Text style={styles.satiricalText}>
              Nossos agentes extraterrestres estão ocupados contando seu dinheiro em outra dimensão.
              Por favor, continue depositando e aguarde.
            </Text>
            
            <Button 
              title="ENVIAR MENSAGEM PARA O VAZIO" 
              variant="danger" 
              fullWidth 
              onPress={() => alert('Mensagem perdida no espaço sideral.')} 
            />
          </View>
        </GlowBorder>

        <View style={styles.divider} />

        {/* Real Help */}
        <Card style={styles.realHelpCard}>
          <View style={styles.realHelpHeader}>
            <LifeBuoy size={24} color={colors.accentIndigo} />
            <Text style={styles.realHelpTitle}>Precisa de ajuda de verdade?</Text>
          </View>
          
          <View style={styles.warningBox}>
            <AlertTriangle size={16} color={colors.accentLime} style={{ marginTop: 2 }} />
            <Text style={styles.warningText}>
              O vício em jogos de azar e apostas online é um problema real e sério. 
              Você não está sozinho e existe tratamento.
            </Text>
          </View>

          <Button 
            title="LIGUE 188 (CVV)" 
            variant="secondary" 
            fullWidth 
            onPress={handleCallCVV} 
            style={styles.realHelpBtn}
          />
          
          <Text style={styles.disclaimer}>
            O CVV (Centro de Valorização da Vida) realiza apoio emocional e prevenção do suicídio, atendendo voluntária e gratuitamente todas as pessoas que querem e precisam conversar, sob total sigilo.
          </Text>
          
          <Text style={styles.disclaimer}>
            Procure também os Jogadores Anônimos Brasil para reuniões e apoio mútuo.
          </Text>
        </Card>
        
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
    marginBottom: 40,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: 48,
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
  },
  satiricalCard: {
    marginBottom: 32,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  satiricalTitle: {
    color: colors.accentDanger,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xl,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  statLabel: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  statValue: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  },
  satiricalText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginVertical: 24,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 32,
  },
  realHelpCard: {
    borderColor: 'rgba(91, 110, 245, 0.3)',
  },
  realHelpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  realHelpTitle: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(166, 255, 61, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  realHelpBtn: {
    marginBottom: 16,
  },
  disclaimer: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  }
});
