import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingSlide } from '../../components/ui/OnboardingSlide';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation, interpolateColor } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: require('../../../ref/scaping.png'),
    description: 'Retome o controle\ne se divirta enquanto o faz.',
  },
  {
    id: '2',
    image: require('../../../ref/understanding.png'),
    description: 'Entenda como funcionam as casas de aposta e aprenda a identificar os gatilhos.',
  },
  {
    id: '3',
    image: require('../../../ref/readytofight.png'),
    description: 'Supere desafios diários, acompanhe seu progresso e ganhe recompensas por sua dedicação.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.push('/onboarding/terms');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleShadow}>BIGGER BET</Text>
        <Text style={styles.title}>BIGGER BET</Text>
      </View>

      <View style={styles.content}>
        <Animated.FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <OnboardingSlide item={item} index={index} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={onScroll}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, index) => {
            const animatedDotStyle = useAnimatedStyle(() => {
              const width = interpolate(
                scrollX.value,
                [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
                [8, 24, 8],
                Extrapolation.CLAMP
              );

              const backgroundColor = interpolateColor(
                scrollX.value,
                [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
                ['rgba(255,255,255,0.2)', colors.accentIndigo, 'rgba(255,255,255,0.2)']
              );

              return {
                width,
                backgroundColor,
              };
            });

            return (
              <Animated.View key={index} style={[styles.dot, animatedDotStyle]} />
            );
          })}
        </View>
        <Button 
          title={currentIndex === SLIDES.length - 1 ? "COMEÇAR" : "CONTINUAR"} 
          variant="primary" 
          fullWidth 
          onPress={handleNext} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontFamily: typography.fonts.condensed,
    fontSize: 56,
    color: colors.textPrimary,
    letterSpacing: 2,
    position: 'absolute',
  },
  titleShadow: {
    fontFamily: typography.fonts.condensed,
    fontSize: 56,
    color: colors.accentLime,
    letterSpacing: 2,
    transform: [{ translateX: -4 }, { translateY: 4 }],
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 32,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
