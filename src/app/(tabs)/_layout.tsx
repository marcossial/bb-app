import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";

import { colors } from "../../theme/colors";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBarContainer}>
        {state.routes.map(
          (route: { key: string; name: string; params?: object }, index) => {
            const { options } = descriptors[route.key];

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            const color = isFocused
              ? colors.accentLime
              : "rgba(157, 255, 32, 0.4)";

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[
                  styles.tabItem,
                  isFocused && {
                    borderColor: color,
                    borderWidth: 1,
                    borderRadius: 20,
                  },
                ]}
              >
                {options.tabBarIcon &&
                  options.tabBarIcon({ focused: isFocused, color, size: 20 })}
              </Pressable>
            );
          },
        )}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/images/tabIcons/home.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jogar"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/images/tabIcons/play.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/images/tabIcons/info.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="suporte"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/images/tabIcons/support.png")}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 32 : 16,
    left: 20,
    right: 20,
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: colors.bgCard,
    borderRadius: 32,
    height: 70,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(157, 255, 32, 0.2)",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});
