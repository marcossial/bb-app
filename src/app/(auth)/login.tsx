import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { GlowBorder } from '../../components/ui/GlowBorder';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { Mail, Lock, CheckSquare, Square, Fingerprint } from 'lucide-react-native';
import { Image } from 'react-native';

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
          <View style={styles.imageCard}>
            <Image 
              source={require('../../../assets/images/bb_alien.png')} 
              style={styles.avatar} 
              resizeMode="contain"
            />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BEM-VINDO AO JOGO</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>E-MAIL</Text>
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
          </View>
          
          <View>
            <Text style={styles.label}>SENHA</Text>
            <View style={styles.inputGroup}>
              <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="••••••••" 
                placeholderTextColor={colors.textSecondary} 
                secureTextEntry
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>CPF</Text>
            <View style={styles.inputGroup}>
              <Fingerprint size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="000.000.000-00" 
                placeholderTextColor={colors.textSecondary} 
                keyboardType="number-pad"
              />
            </View>
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
              Aceito os <Text style={styles.linkText}>Termos de Serviço</Text> e prometo não chorar se perder.
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
    marginBottom: 32,
  },
  imageCard: {
    width: 200,
    height: 200,
    backgroundColor: colors.bgBase,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.accentLime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20, // Overlap with badge
    shadowColor: colors.accentLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  badge: {
    backgroundColor: colors.accentLime,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    zIndex: 10,
    shadowColor: colors.accentLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  badgeText: {
    color: '#000000',
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    letterSpacing: 1,
  },
  label: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    marginBottom: 8,
    letterSpacing: 1,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1B23', // Very dark input bg
    borderRadius: 12,
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
  linkText: {
    color: colors.accentLime,
    textDecorationLine: 'underline',
  },
  footer: {
    gap: 12,
  },
  loginButton: {
    marginBottom: 8,
  }
});
