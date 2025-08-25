import colors from "@/assets/colors/colors";
import { checkAuth } from "@/services/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'ubuntu-regular': require('@/assets/fonts/Ubuntu-Regular.ttf'),
    'ubuntu-medium': require('@/assets/fonts/Ubuntu-Medium.ttf'),
    'ubuntu-bold': require('@/assets/fonts/Ubuntu-Bold.ttf'),
  });
  const router = useRouter();

useEffect(() => {
  async function validateToken() {
    try {
      const data = await checkAuth();
      console.log("Usuário autenticado", data);
      router.push('/(auth)'); 
    } catch (err) {
      console.log("Token inválido ou expirado");
      await AsyncStorage.clear();
      router.replace("/login");
    }
  }

  validateToken();
}, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.buttonPrimary} />
      </View>
    );
  }

  return (
    <ToastProvider
      placement="top"
      duration={3000}
      animationType="slide-in"
      successColor={colors.toastSuccess}
      dangerColor={colors.toastDanger}
      warningColor={colors.toastWarning}
      normalColor={colors.toastNormal}
      textStyle={{ fontSize: 16 }}
      offset={60}>
      <Slot />
    </ToastProvider>
    
  )
}
