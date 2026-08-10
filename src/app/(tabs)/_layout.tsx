import { Tabs } from 'expo-router';
import { colors } from '../../theme/colors';
import { Home, Gamepad2, Info, HeadphonesIcon } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgCard,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.accentLime,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }} 
      />
      <Tabs.Screen 
        name="jogar" 
        options={{ 
          title: 'Play',
          tabBarIcon: ({ color, size }) => <Gamepad2 color={color} size={size} />
        }} 
      />
      <Tabs.Screen 
        name="info" 
        options={{ 
          title: 'Info',
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />
        }} 
      />
      <Tabs.Screen 
        name="suporte" 
        options={{ 
          title: 'Suporte',
          tabBarIcon: ({ color, size }) => <HeadphonesIcon color={color} size={size} />
        }} 
      />
    </Tabs>
  );
}
