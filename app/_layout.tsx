import colors from "@/assets/colors/colors";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'ubuntu-regular': require('@/assets/fonts/Ubuntu-Regular.ttf'),
    'ubuntu-medium': require('@/assets/fonts/Ubuntu-Medium.ttf'),
    'ubuntu-bold': require('@/assets/fonts/Ubuntu-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.buttonPrimary} />
      </View>
    );
  }

  return <Slot />;
}
