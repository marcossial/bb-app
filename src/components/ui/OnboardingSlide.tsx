import { Image, ImageSource } from "expo-image";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingSlideProps {
  item: {
    id: string;
    image: ImageSource;
    description: string;
  };
  index: number;
}

export function OnboardingSlide({ item, index }: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        style={styles.imageCard}
      >
        <Image
          source={item.image}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
        <View style={styles.glow} />
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(200 + index * 100).springify()}
        style={styles.description}
      >
        {item.description}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  imageCard: {
    width: "100%",
    aspectRatio: 0.8,
    backgroundColor: "rgba(157, 255, 32, 0.05)",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.accentLime,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: colors.accentLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(157, 255, 32, 0.1)",
    pointerEvents: "none",
  },
  description: {
    fontFamily: typography.fonts.regular,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 28,
  },
});
