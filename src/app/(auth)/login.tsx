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

export default function Login() {
  const router = useRouter();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleLogin = () => {
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
          <GlowBorder color={colors.accentIndigo} radius={100} style={styles.avatarContainer}>
            <View style={styles.avatarInner}>
              <User size={48} color={colors.accentIndigo} />
            </View>
          </GlowBorder>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BEM-VINDO AO JOGO</Text>
          </View>
        </View>

        <View style={styles.form}>
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

          <View style={styles.inputGroup}>
            <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="CPF (Decorativo)" 
              placeholderTextColor={colors.textSecondary} 
              keyboardType="number-pad"
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
              Aceito os Termos de Serviço e prometo não chorar se perder.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Button 
            title="ENTRAR →" 
            variant="primary" 
            fullWidth 
            onPress={handleLogin} 
            style={styles.loginButton}
          />
          <Button 
            title="NÃO TENHO CONTA (CADASTRAR)" 
            variant="ghost" 
            fullWidth 
            onPress={() => router.push('/(auth)/cadastro')} 
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
  avatarContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(91, 110, 245, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(91, 110, 245, 0.3)',
  },
  badgeText: {
    color: colors.accentIndigo,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    letterSpacing: 1,
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
  loginButton: {
    marginBottom: 8,
  }
});
