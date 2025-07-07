import colors from "@/assets/colors/colors";
import Grid from "@/components/grid";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import { FAB } from 'react-native-elements';


const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <Grid
        width={width * 0.9}
        height={height * 0.15}
        placeholder="Mes de Junho 2025"
      />
      <Grid 
        width={width * 0.9}
        height={height * 0.25}
        placeholder="Próximos Recebimentos"
      />
      <Grid //AQUI TROCAR PRA FAZER UM GRID LIST, NÃO SÓ UM GRID COMUM
        width={width * 0.9}
        height={height * 0.45}
        placeholder="Ultimas Vendas"
      />
      <FAB 
          placement="right"
          color={colors.buttonPrimary}
          size="large"
          icon={
            <Ionicons 
              name="add" 
              size={24} 
              color="#fff" />}
          onPress={() => router.push('/addSale')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
    rowGap:10
  },
  grid: {
    width: width * 0.9,
    height: height * 0.15,
    backgroundColor: colors.gridBackground,
    borderRadius:16
  },
  topText: {
    color:colors.textPrimary,
    fontSize:16
  }
})
