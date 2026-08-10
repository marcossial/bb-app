import React from 'react';
import { View, StyleSheet, ViewProps, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface CardProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export function Card({ title, children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginBottom: 16,
  }
});
