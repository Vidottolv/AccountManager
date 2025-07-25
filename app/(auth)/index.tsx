import colors from "@/assets/colors/colors";
import Grid from "@/components/grid";
import api from "@/services/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { FAB } from 'react-native-elements';

const { width, height } = Dimensions.get('window');
type TopProduct = {
  productName: string;
  count: number;
};

function getMonthNames(locale = 'pt-BR') {
  return Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2000, i, 1))
  );
}
const monthNames = getMonthNames();
const currentMonthName = monthNames[new Date().getMonth()];

export default function Index() {
  const [salesValue,setSalesValue] = useState('');
  const [commissionValue,setCommissionValue] = useState('');
  const [salesQty, setSalesQty] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [salesData, setSalesData] = useState<TopProduct[]>([]);

  async function handlePageValues(){
    const response = await api.get('/sales/currentmonth');
    setSalesValue(response.data.salesVal);
    setCommissionValue(response.data.commissionVal);
    setSalesQty(response.data.salesQuantity);
    setCurrentMonth(currentMonthName);
    setSalesData(response.data.topProducts);
    return response.data;
  }

  useFocusEffect(
    useCallback(() => {
      handlePageValues();
    }, [])
  );
  
  const renderItem = ({ item }: { item: TopProduct }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.countText}>{item.count} {item.count > 1 ? 'vendas' : 'venda'}</Text>
    </View>
  );
  
  const router = useRouter()
  return (
    <View style={styles.container}>
      <Grid
        width={width * 0.9}
        height={height * 0.2}
        placeholder={`Valor vendido em ${currentMonth}`}
        mainValue={salesValue}
        isMoney={true}
      />
      <Grid 
        width={width * 0.9}
        height={height * 0.2}
        placeholder={`Comissão a receber em ${currentMonth}`}
        mainValue={commissionValue}
        isMoney={true}
      />
      <View style={styles.grid}>
        <Text style={styles.text}>
          Mais vendidos em {currentMonth}
        </Text>
        <FlatList
          data={salesData}
          keyExtractor={(item, index) => 
            `${item.productName}-${index}`}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma venda registrada ainda.</Text>
          }
        />
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
    height: height * 0.4,
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
