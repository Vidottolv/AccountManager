import colors from "@/assets/colors/colors";
import i18n from "@/assets/locales/I18n";
import CustomDropdown from "@/components/dropdown";
import CustomInput from "@/components/input";
import NewCustomerModal from "@/components/modalCustomer";
import NewProductModal from "@/components/modalProduct";
import { SaleFormType, SaleRequest, saleFormSchema } from "@/schema/saleSchema";
import { getCustomer } from "@/services/customers";
import { getProducts } from "@/services/products";
import { postSales } from "@/services/sales";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { IDropdownRef } from 'react-native-element-dropdown';
import { useToast } from "react-native-toast-notifications";

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ],
  monthNamesShort: [
    'Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez'
  ],
  dayNames: [
    'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'
  ],
  dayNamesShort: [
    'Dom','Seg','Ter','Qua','Qui','Sex','Sáb'
  ],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const {height, width} = Dimensions.get('window');

const Sale = () => {
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<SaleFormType>({
    product: '',
    productSearch: '',
    newProductName: '',
    customer: '',
    customerSearch: '',
    newCustomerName: '',
    commissionRate: 0,
    salesValue: '',
    expirationInstallmentDate: '0'
  });
  const [modalProdVisible, setModalProdVisible] = useState(false);
  const [modalCustVisible, setModalCustVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const refProduct = useRef<IDropdownRef>(null!) as React.RefObject<IDropdownRef>;
  const refCustomer = useRef<IDropdownRef>(null!) as React.RefObject<IDropdownRef>;
  function updateForm<K extends keyof SaleFormType>(key: K, value: SaleFormType[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

    async function fetchData() {
        try {
            const prod = await getProducts();
            const cust = await getCustomer();
            setProducts(prod);
            setCustomers(cust);
        } catch (error) {
            alert("Erro ao buscar produtos");
        } finally {
            setLoading(false); 
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
      async function loadPreference() {
        const preferenceString = await AsyncStorage.getItem('preference');
        const pref = preferenceString ? JSON.parse(preferenceString) : null;

        if (pref?.[0]?.commission != null) {
          updateForm('commissionRate', pref[0].commission);
        }
      }
      loadPreference();
    }, []);

    const productOptions = products.map((prod) => ({
      label: prod.productName,
      value: prod._id,
    }));

    const customerOptions = customers.map((prod) => ({
      label: prod.name,
      value: prod._id,
    }));

    const filteredProducts = productOptions.filter((item) =>
      item.label.toLowerCase().includes(form.productSearch.toLowerCase())
    );

    const filteredCustomers = customerOptions.filter((item) =>
      item.label.toLowerCase().includes(form.customerSearch.toLowerCase())
    );

    const productData =
      form.productSearch.length > 0
        ? [ {
              label: `${i18n.t("insertNewProduct")} "${form.productSearch}"`,
              value: "__new_product__",
              isNew: true,
            },
            ...filteredProducts,] : productOptions;

    const customerData =
      form.customerSearch.length > 0
        ? [ {
              label: `${i18n.t("insertNewCustomer")} "${form.customerSearch}"`,
              value: "__new_customer__",
              isNew: true,
            },
            ...filteredCustomers, ] : customerOptions;

    async function handleSave() {
      const result = saleFormSchema.safeParse(form);
      if (!result.success) {
        toast.show(result.error.issues[0]?.message ?? "Erro no formulário", {
          type: "danger",
          placement: "top",
          duration: 1000,
        });
        return;
      }
      const saleData: SaleRequest = {
        customerID: form.customer,
        productID: form.product,
        salesValue: Number(form.salesValue),
        expirationInstallmentDate: form.expirationInstallmentDate,
        commissionRate: form.commissionRate,
        dtTimestamp: new Date().toISOString(),
      };

      console.log(saleData)

      const response = await postSales(saleData);
      toast.show(response.message || "Venda inserida com sucesso!", {
        type: "success",
        placement: "top",
        duration: 1000});
      setForm({
        product: '',
        productSearch: '',
        newProductName: '',
        customer: '',
        customerSearch: '',
        newCustomerName: '',
        commissionRate: 0,
        salesValue: '',
        expirationInstallmentDate: '0'
      });
      
      router.push('/')
    }

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.buttonPrimary} />
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">
            
            <Text style={styles.text}>
              {i18n.t("insertData")}
            </Text>

            <Text style={styles.textLabels}>
                {i18n.t("product")}
            </Text>
            <CustomDropdown
              refDropdown={refProduct}
              data={productData}
              value={form.product}
              search={form.productSearch}
              setSearch={(val) => updateForm('productSearch', val)}
              onChange={(item) => {
                if (item.value === "__new_product__") {
                  updateForm('newProductName', form.productSearch);
                  setModalProdVisible(true);
                  refProduct.current?.close();
                } else {
                  updateForm('product', item.value);
                }
              }}/>

            <Text style={styles.textLabels}>
              {i18n.t("customer")}
            </Text>
            <CustomDropdown
              refDropdown={refCustomer}
              data={customerData}
              value={form.customer}
              search={form.customerSearch}                
              setSearch={(val) => updateForm('customerSearch', val)}
              onChange={(item) => {
                if (item.value === "__new_customer__") {
                  updateForm('newCustomerName', form.customerSearch);
                  setModalCustVisible(true);
                  refCustomer.current?.close();
                } else {
                  updateForm('customer', item.value);
                }
              }}/>

            <Text style={styles.textLabels}>
              {i18n.t("commissionPlaceholder")}
            </Text>
            <CustomInput
              height={height * 0.08}
              width={width * 0.9}
              inputMode="text"
              placeholder={i18n.t("commissionPlaceholder")}
              value={form.commissionRate === 0 ? '' : form.commissionRate.toString()}
              onChangeText={(text) => {
                const number = parseFloat(text.replace(',', '.'));
                updateForm('commissionRate', isNaN(number) ? 0 : number);
              }}/>

            <Text style={styles.textLabels}>
              {i18n.t("soldPrice")}
            </Text>
            <CustomInput
              height={height * 0.08}
              width={width * 0.9}
              inputMode="numeric"
              placeholder=""
              value={form.salesValue}
              onChangeText={(val) => updateForm("salesValue", val)}/>

            <NewProductModal
              visible={modalProdVisible}
              onClose={() => setModalProdVisible(false)}
              defaultName={form.newProductName}
              onInserted={fetchData}/>

            <NewCustomerModal
              visible={modalCustVisible}
              onClose={() => setModalCustVisible(false)}
              defaultName={form.newCustomerName}
              onInserted={fetchData}/>

              <View style={styles.instView}>                
                <Text style={styles.textLabels}>
                  {i18n.t("expirationDate")}
                </Text>
                <Calendar 
                  style={{
                    borderWidth: 0.5,
                    borderColor: colors.buttonPrimary,
                    borderRadius: 16,
                    width: width * 0.9
                  }}
                  theme={{
                    backgroundColor: colors.background,
                    calendarBackground: colors.background,
                    textSectionTitleColor: colors.textPrimary,
                    selectedDayBackgroundColor: colors.buttonPrimary,
                    selectedDayTextColor: colors.textPrimary,
                    todayTextColor: colors.buttonPrimary,
                    dayTextColor: colors.textPrimary,
                    textDisabledColor: colors.textDisable,
                    arrowColor: colors.buttonPrimary, 
                    monthTextColor: colors.textPrimary, 
                    textMonthFontFamily: 'ubuntu-bold',
                    textMonthFontSize: 16,
                    textDayFontFamily: 'ubuntu-regular',
                    textDayHeaderFontFamily: 'ubuntu-bold',
                  }}
                  renderHeader={(date) => {
                    const _date = new Date(date);
                    const month = _date.toLocaleDateString('pt-BR', { month: 'long' });
                    const year = _date.getFullYear();

                    return (
                      <Text
                        style={{
                          color: colors.textPrimary,
                          fontSize: 16,
                          fontFamily: 'ubuntu-bold',
                          textAlign: 'center',
                          paddingVertical: 10,
                        }}>
                        {`${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`}
                      </Text>
                    );}}
                  renderArrow={(direction) => (
                    <Ionicons 
                      name={direction === 'left' ? 'chevron-back' : 'chevron-forward'} 
                      size={20} 
                      color={colors.buttonPrimary} 
                    />)}
                  markedDates={{
                      [form.expirationInstallmentDate]: {
                        selected: true,
                        selectedColor: colors.buttonPrimary,
                        selectedTextColor: colors.textPrimary
                      }}}
                  onDayPress={day => updateForm("expirationInstallmentDate", day.dateString)}/>
              </View>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSave}>
                <Text style={styles.textButton}>
                  {i18n.t("save")}
                </Text>
            </TouchableOpacity>
            <View style={{height:300}}></View>
        </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        alignItems:'center',
        rowGap: 15
    },
    instView: {
        alignItems:'center',
        rowGap: 15
    },
    calendar: {
      backgroundColor: colors.background,
      color: colors.textPrimary
    },
    text: {
        color: colors.textPrimary,
        fontSize:18,
        width: width * 0.9,
        marginBottom:20,
        fontFamily:'ubuntu-bold'
    },
    textButton: {
        color: colors.textPrimary,
        fontSize:18,
        fontFamily:'ubuntu-bold'
    },
    textLabels: {
        color: colors.textPrimary,
        fontSize:16,
        width: width * 0.9,
        marginLeft:15,
        fontFamily:'ubuntu-regular'
    },
    textSwitch: {
        color: colors.textPrimary,
        fontSize:16,
        width: width * 0.3,
        marginLeft:15,
        fontFamily:'ubuntu-regular'
    },
    dropdown: {
        padding: 15,
        height: 50,
        width: width * 0.9,
        borderWidth: 1,
        borderColor: colors.background,
        backgroundColor: colors.background,
        borderRadius: 8,
    },
    placeholderStyle: {
        padding: 15,
        fontSize: 16,
        color: colors.textPrimary,
    },
    selectedTextStyle: {
        color: colors.textPrimary,
        fontSize: 16,
        fontFamily: 'ubuntu-bold'
    },
    itemContainerStyle: {
        backgroundColor: colors.background,
        borderColor: colors.buttonSecondary,
        borderWidth: 0.5,
        borderRadius: 8,
    },
    itemTextStyle: {
        color: colors.textThird,
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: colors.textPrimary,
        backgroundColor: colors.background,
        borderColor: colors.background,
    },
    containerStyle: {
        backgroundColor: colors.background,
        borderColor: colors.background,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    button: {
        marginTop: 20,
        height: height * 0.06, 
        width: width * 0.8,
        backgroundColor: colors.buttonPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16
    },
    instRow: {
      flexDirection:'row',
      alignItems:'center',
      width: '90%'
    }
})

export default Sale;