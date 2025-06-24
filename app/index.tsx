import colors from "@/assets/colors/colors";
import Grid from "@/components/grid";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get('window');

export default function Index() {
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
