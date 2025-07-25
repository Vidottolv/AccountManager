import colors from '@/assets/colors/colors';
import { LanguageProvider } from '@/assets/context/LangContext';
import i18n from '@/assets/locales/I18n';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from 'react-native-toast-notifications';
import Login from '../login';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Ionicons name="man" size={100} color={colors.buttonPrimary} />
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        labelStyle={{ fontFamily: 'ubuntu-bold', color: colors.buttonSecondary }}
        icon={({ color, size }) => (
          <Ionicons name="exit-outline" size={size} color={colors.buttonSecondary} />
        )}
        onPress={props.onLogout}/>
    </DrawerContentScrollView>
  );
}

export default function AuthLayout() {
  const [logged, setLogged] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem('token');
      console.log(token)
      setLogged(!!token);
    }
    checkToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setLogged(false);
  };

  if (logged === null) return null;

  if (!logged) {
    return (
      <LanguageProvider>
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
          <Login onLogin={() => setLogged(true)} />
        </ToastProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
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
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
          <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} onLogout={handleLogout} />}
            screenOptions={{
              drawerActiveTintColor: colors.textPrimary,
              drawerStyle: { backgroundColor: colors.background },
              drawerLabelStyle: { fontFamily: 'ubuntu-bold' },
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.textPrimary,
              drawerInactiveTintColor: colors.textPrimary,
            }}>
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: i18n.t('receipts'),
                title: i18n.t('receipts'),
                headerTitle: () => (
                  <Text style={{ fontFamily: 'ubuntu-bold', fontSize: 22, color: colors.textPrimary }}>
                    {i18n.t('receipts')}
                  </Text>
                ),
                drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
              }}
            />
            <Drawer.Screen
              name="addSale"
              options={{
                drawerLabel: i18n.t('addSale'),
                title: i18n.t('addSale'),
                headerTitle: () => (
                  <Text style={{ fontFamily: 'ubuntu-bold', fontSize: 22, color: colors.textPrimary }}>
                    {i18n.t('addSale')}
                  </Text>
                ),
                drawerIcon: ({ color, size }) => <Ionicons name="cash-outline" size={size} color={color} />,
              }}
            />
            <Drawer.Screen
              name="config"
              options={{
                drawerLabel: i18n.t('Settings'),
                title: i18n.t('Settings'),
                headerTitle: () => (
                  <Text style={{ fontFamily: 'ubuntu-bold', fontSize: 22, color: colors.textPrimary }}>
                    {i18n.t('Settings')}
                  </Text>
                ),
                drawerIcon: ({ color, size }) => <Ionicons name="cog-outline" size={size} color={color} />,
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </ToastProvider>
    </LanguageProvider>
  );
}
