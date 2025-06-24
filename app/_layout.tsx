import colors from '@/assets/colors/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import { Drawer } from "expo-router/drawer";
import React from "react";
import { View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView{...props} >
      <View style={{padding:16, alignItems:'center'}}>
        <Ionicons 
          name='man' 
          size={100} 
          color={colors.buttonPrimary} />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'ubuntu-regular': require('@/assets/fonts/Ubuntu-Regular.ttf'),
    'ubuntu-medium': require('@/assets/fonts/Ubuntu-Medium.ttf'),
    'ubuntu-bold': require('@/assets/fonts/Ubuntu-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView 
      style={{flex:1, backgroundColor:colors.background}}>
      <Drawer
        drawerContent={CustomDrawerContent} 
        screenOptions={{
        drawerActiveTintColor:colors.textPrimary,
        drawerStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary, 
        drawerInactiveTintColor: colors.textPrimary
      }}>
        <Drawer.Screen 
          name="index" 
          options={{
            drawerLabel:'Home',
            title:'My App',
            drawerIcon:({color,size}) => (
              <Ionicons name="home" size={size} color={color} />
          ),
        }}/>
        <Drawer.Screen name="news" options={{
          drawerLabel:'News',
          title:'News',
          drawerIcon:({color,size}) => (
          <Ionicons name="newspaper" size={size} color={color} />
          ),
        }}/>
        <Drawer.Screen
          name='[id]'
          options={{
            drawerItemStyle: {
              display:'none'
            }
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
);
}
