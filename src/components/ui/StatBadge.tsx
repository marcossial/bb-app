import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { LucideIcon } from 'lucide-react-native';

interface StatBadgeProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  color?: string;
  critical?: boolean;
}

export function StatBadge({ 
  label, 
  value, 
  icon: Icon, 
  color = colors.accentLime,
  critical = false
}: StatBadgeProps) {
  const activeColor = critical ? colors.accentDanger : color;

  return (
    <View style={[styles.container, critical && styles.criticalContainer]}>
      <View style={styles.header}>
        {Icon && <Icon size={14} color={activeColor} />}
        <Text style={[styles.label, { color: activeColor }]}>{label}</Text>
      </View>
      <Text style={[styles.value, critical && { color: activeColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  criticalContainer: {
    borderColor: 'rgba(255, 59, 110, 0.3)',
    backgroundColor: 'rgba(255, 59, 110, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.condensed,
    fontSize: typography.sizes.xl,
  }
});
