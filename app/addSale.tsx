import colors from "@/assets/colors/colors";
import i18n from "@/assets/locales/I18n";
import CustomDropdown from "@/components/dropdown";
import CustomInput from "@/components/input";
import NewProductModal from "@/components/modalProduct";
import { SaleFormType, saleFormSchema } from "@/schema/saleSchema";
import { getCustomer } from "@/services/customers";
import { getProducts } from "@/services/products";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IDropdownRef } from 'react-native-element-dropdown';

const {height, width} = Dimensions.get('window');

const Sale = () => {
    const [form, setForm] = useState<SaleFormType>({
      product: '',
      productSearch: '',
      newProductName: '',
      customer: '',
      customerSearch: '',
      commission: 0,
      qty: '0'
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const ref = useRef<IDropdownRef>(null!) as React.RefObject<IDropdownRef>;

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
          updateForm('commission', pref[0].commission);
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
        ? [
            {
              label: `${i18n.t("insertNewProduct")} "${form.productSearch}"`,
              value: "__new_product__",
              isNew: true,
            },
            ...filteredProducts,
          ]
        : productOptions;

    const customerData =
      form.customerSearch.length > 0
        ? [
            {
              label: `${i18n.t("insertNewCustomer")} "${form.customerSearch}"`,
              value: "__new_customer__",
              isNew: true,
            },
            ...filteredCustomers,
          ]
        : customerOptions;

    function handleSave() {
      const result = saleFormSchema.safeParse(form);
      if (!result.success) {
        alert(result.error.issues[0]?.message ?? "Erro no formulário");
        return;
      }

      const data = result.data;
      alert("Venda salva com sucesso!");
    }

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.buttonPrimary} />
        </View>
      );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{i18n.t("insertData")}</Text>            
            <Text style={styles.textCommission}>
                {i18n.t("product")}
            </Text>
            <CustomDropdown
                refDropdown={ref}
                data={productData}
                value={form.product}
                search={form.productSearch}
                setSearch={(val) => updateForm('productSearch', val)}
                onChange={(item) => {
                  if (item.value === "__new_product__") {
                    updateForm('newProductName', form.productSearch);
                    setModalVisible(true);
                    ref.current?.close();
                  } else {
                    updateForm('product', item.value);
                  }
                }}/>
            <Text style={styles.textCommission}>
                {i18n.t("commissionPlaceholder")}
            </Text>
            <CustomInput
              height={height * 0.08}
              width={width * 0.9}
              inputMode="text"
              placeholder={i18n.t("commissionPlaceholder")}
              value={form.commission === 0 ? '' : form.commission.toString()}
              onChangeText={(text) => {
                const number = parseFloat(text.replace(',', '.'));
                updateForm('commission', isNaN(number) ? 0 : number);
              }}
            />
            <Text style={styles.textCommission}>
                {i18n.t("itemQuantity")}
            </Text>
            <CustomInput
                height={height * 0.08}
                width={width * 0.9}
                inputMode="numeric"
                placeholder={i18n.t("itemQuantity")}
                value={form.qty}
                onChangeText={(val) => updateForm("qty", val)}/>
            <Text style={styles.textCommission}>
                {i18n.t("customer")}
            </Text>
            <CustomDropdown
              refDropdown={ref}
              data={customerData}
              value={form.customer}
              search={form.customerSearch}
              setSearch={(val) => updateForm("customerSearch", val)}
              onChange={(item) => updateForm("customer", item.value)}/>

            <NewProductModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              defaultName={form.newProductName}/>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.textButton}>
                    Salvar
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems:'center',
        rowGap: 15
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
    textCommission: {
        color: colors.textPrimary,
        fontSize:16,
        width: width * 0.9,
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
})

export default Sale;