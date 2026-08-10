import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { LucideIcon } from 'lucide-react-native';

interface RevealCardProps {
  icon: LucideIcon;
  label: string;
  text: string;
  themeColor?: string;
}

export function RevealCard({ 
  icon: Icon, 
  label, 
  text, 
  themeColor = colors.accentLime 
}: RevealCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Icon size={20} color={themeColor} />
        <Text style={[styles.label, { color: themeColor }]}>{label}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  text: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  }
});
