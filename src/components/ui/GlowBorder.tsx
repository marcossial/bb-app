import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../../theme/colors';

interface GlowBorderProps extends ViewProps {
  color?: string;
  radius?: number;
  children: React.ReactNode;
}

export function GlowBorder({
  color = colors.accentLime,
  radius = 20,
  children,
  style,
  ...props
}: GlowBorderProps) {
  return (
    <View style={[styles.container, { borderRadius: radius }, style]} {...props}>
      <View style={[
        styles.glow, 
        { 
          borderColor: color,
          borderRadius: radius,
          shadowColor: color,
        }
      ]} />
      <View style={[styles.inner, { borderRadius: radius }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: colors.bgCard,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  inner: {
    overflow: 'hidden',
    flex: 1,
  }
});
