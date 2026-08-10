import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { LinearGradient } from 'expo-linear-gradient';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  fullWidth = false,
  style, 
  ...props 
}: ButtonProps) {
  
  const getColors = () => {
    switch (variant) {
      case 'primary': return [colors.accentLime, '#85CC31']; // Neon Green to slightly darker
      case 'secondary': return [colors.accentIndigo, '#4756c2'];
      case 'danger': return [colors.accentDanger, '#c42f56'];
      case 'ghost': return ['transparent', 'transparent'];
      default: return [colors.accentLime, '#85CC31'];
    }
  };

  const getTextColor = () => {
    if (variant === 'ghost') return colors.textPrimary;
    return colors.bgBase; // Dark text on bright buttons
  };

  if (variant === 'ghost') {
    return (
      <TouchableOpacity 
        style={[styles.base, fullWidth && styles.fullWidth, style]} 
        {...props}
      >
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.base, 
        fullWidth && styles.fullWidth, 
        style
      ]} 
      {...props}
    >
      <LinearGradient
        colors={getColors()}
        style={[StyleSheet.absoluteFill, styles.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.glow} />
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    borderRadius: 28,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0, // could animate this on press
  },
  text: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
    zIndex: 1,
  }
});
