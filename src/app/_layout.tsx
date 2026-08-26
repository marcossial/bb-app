import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts as useBebas } from '@expo-google-fonts/bebas-neue';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { 
  useFonts as useFunnel,
  FunnelSans_400Regular,
  FunnelSans_700Bold,
  FunnelSans_800ExtraBold
} from '@expo-google-fonts/funnel-sans';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../theme/colors';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [bebasLoaded, bebasError] = useBebas({
    BebasNeue_400Regular,
  });

  const [funnelLoaded, funnelError] = useFunnel({
    FunnelSans_400Regular,
    FunnelSans_700Bold,
    FunnelSans_800ExtraBold,
  });

  const loaded = bebasLoaded && funnelLoaded;
  const error = bebasError || funnelError;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgBase },
          animation: 'fade',
        }} 
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
