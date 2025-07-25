import colors from "@/assets/colors/colors";
import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";

export default function PublicLayout() {
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
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShown: false
        }}/>
    </ToastProvider>
  );
}
