import colors from "@/assets/colors/colors";
import Grid from "@/components/grid";
import { IndexState, IndexStateSchema } from "@/schema/indexSchema";
import api from "@/services/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { FAB } from 'react-native-elements';

export const monthNames = getMonthNames();
const { width, height } = Dimensions.get('window');
const currentMonthName = monthNames[new Date().getMonth()];

type TopProduct = {
  productName: string;
  totalQuantity: number;
  totalSales: number;
};
type CurrentMonthApiResponse = {
  salesVal: string;
  commissionVal: string;
  salesQuantity: string;
  topProducts: IndexState["salesData"];
};

function getMonthNames(locale = 'pt-BR') {
  return Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2000, i, 1))
  );
}

export default function Index() {
  const router = useRouter();
  const [state, setState] = useState<IndexState>({
    salesValue: 0,
    commissionValue: 0,
    commissionValueDyn: 0,
    salesQty: 0,
    currentMonth: currentMonthName,
    monthIndex: new Date().getMonth(),
    currentMonthReceipment: currentMonthName,
    salesData: [],
  });
  const year = new Date().getFullYear();

  async function handlePageValues(){
    const { data } = await api.get<CurrentMonthApiResponse>('/sales/currentMonth');

    const validated = IndexStateSchema.parse({
      salesValue: data.salesVal ?? "",
      commissionValue: data.commissionVal ?? "",
      commissionValueDyn: data.commissionVal ?? "",
      salesQty: data.salesQuantity ?? "",
      currentMonth: currentMonthName,
      monthIndex: new Date().getMonth(),
      currentMonthReceipment: currentMonthName,
      salesData: data.topProducts,
    });  

    setState(validated);
    return validated;
  }

  async function getSales(month: number, year: number) {
    const response = await api.post('sales/salesByMonth', {month, year});
    setState(prev => ({
      ...prev,
      commissionValueDyn: response.data.commissionVal
    }));
    return response.data;
  }

  const loadData = useCallback(async () => {
    console.log('chamando')
    await handlePageValues();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const renderItem = ({ item }: { item: TopProduct }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.countText}>{item.totalQuantity} {item.totalQuantity > 1 ? 'vendas' : 'venda'}</Text>
      <Text style={styles.countText}>R${item.totalSales}</Text>
    </View>
  );

  const handlePrevMonth = () => {
    const month = state.monthIndex - 1;
    setState(prev => ({
      ...prev,
      monthIndex: month,
      currentMonthReceipment: monthNames[month],
    }));
    getSales(month, year);
  };

  const handleNextMonth = () => {
    const month = state.monthIndex + 1;
    setState(prev => ({
      ...prev,
      monthIndex: month,
      currentMonthReceipment: monthNames[month],
    }));
    getSales(month, year);
  };
  
  return (
    <View style={styles.container}>
      <Grid 
        width={width * 0.9}
        height={height * 0.2}
        placeholder={`Comissão de ${state.currentMonthReceipment} ${year}`}
        mainValue={state.commissionValueDyn.toString()}
        isMoney={true}
        isDinamyc={true}
        onPressPrev={handlePrevMonth}
        onPressNext={handleNextMonth}
        onPressDetails={() => router.push({
          pathname: '/details',
          params: { month: state.monthIndex, year },
        })}/>
      <View style={styles.grid}>
        <Text style={styles.text}>
          Itens mais vendidos
        </Text>
        <FlatList
          data={state.salesData}
          keyExtractor={(item, index) => 
            `${item.productName}-${index}`}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma venda registrada ainda.</Text>
          }/>
      </View>
      <FAB 
          placement="right"
          color={colors.buttonPrimary}
          size="large"
          icon={
            <Ionicons 
              name="add" 
              size={24} 
              color="#fff" />}
          onPress={() => router.push('/addSale')}/>
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
    height: height * 0.55,
    backgroundColor: colors.gridBackground,
    borderRadius:16,
    padding: 15
  },
  topText: {
    color:colors.textPrimary,
    fontSize:16
  },
  itemContainer: {
    marginTop:10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: 'ubuntu-regular',
  },
  countText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontFamily: 'ubuntu-bold',
  },
  emptyText: {
    textAlign: "center",
    color: colors.textDisable,
    marginTop: 20,
    fontFamily: 'ubuntu-regular',
  },
  text:{
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: 'ubuntu-medium'
  }
})
