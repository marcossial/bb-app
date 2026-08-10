import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { GlowBorder } from '../../components/ui/GlowBorder';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { User, Mail, Lock, CheckSquare, Square } from 'lucide-react-native';

export default function Cadastro() {
  const router = useRouter();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCadastro = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>CADASTRAR</Text>
          <Text style={styles.subtitle}>Junte-se a milhares de outros abduzidos.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Nome Completo" 
              placeholderTextColor={colors.textSecondary} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="seu@cosmos.com" 
              placeholderTextColor={colors.textSecondary} 
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Senha" 
              placeholderTextColor={colors.textSecondary} 
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
          >
            {acceptedTerms ? (
              <CheckSquare size={24} color={colors.accentLime} />
            ) : (
              <Square size={24} color={colors.textSecondary} />
            )}
            <Text style={styles.checkboxText}>
              Eu entendo que este é um aplicativo satírico e que meus dados não estão sendo salvos em nenhum servidor.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button 
            title="CRIAR CONTA" 
            variant="primary" 
            fullWidth 
            onPress={handleCadastro} 
            style={styles.actionButton}
          />
          <Button 
            title="JÁ TEM CONTA? LOGAR" 
            variant="ghost" 
            fullWidth 
            onPress={() => router.push('/(auth)/login')} 
          />
          <Button 
            title="PULAR →" 
            variant="ghost" 
            fullWidth 
            onPress={handleSkip} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xxxl,
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 12,
  },
  checkboxText: {
    flex: 1,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  footer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  }
});
