import colors from "@/assets/colors/colors";
import i18n from "@/assets/locales/I18n";
import CustomDropdown from "@/components/dropdown";
import CustomInput from "@/components/input";
import NewProductModal from "@/components/modalProduct";
import { getCustomer } from "@/services/customers";
import { getProducts } from "@/services/products";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IDropdownRef } from 'react-native-element-dropdown';

const {height, width} = Dimensions.get('window');
let preference: string | null;

const Sale = () => {
    const [product, setProduct] = useState<string>();
    const [productSearch, setProductSearch] = useState('');
    const [newProductName, setNewProductName] = useState('');
    const [customer, setCustomer] = useState<string>();
    const [customerSearch, setCustomerSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [commission, setCommission] = useState(0);
    const [qty, setQty] = useState<string>('0');
    const [products, setProducts] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const ref = useRef<IDropdownRef>(null!) as React.RefObject<IDropdownRef>;

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
            preference = preferenceString ? JSON.parse(preferenceString) : null;
        }
        loadPreference();
    }, []);

    const productOptions = !loading
        ? products.map(prod => ({
            label: prod.productName,
            value: prod._id,
        })) : [];

    const customerOptions = !loading
        ? customers.map(prod => ({
            label: prod.name,
            value: prod._id,
        })) : [];

    const ProductfilteredData = !loading
        ? productOptions.filter(item =>
            item.label.toLowerCase().includes(productSearch.toLowerCase())
        ) : [];

    const CusomterfilteredData = !loading
        ? customerOptions.filter(item =>
            item.label.toLowerCase().includes(customerSearch.toLowerCase())
        ) : [];

    const productData = !loading
        ? (productSearch.length > 0
            ? [{
                label: `${i18n.t("insertNewProduct")} "${productSearch}"`,
                value: "__new_product__",
                isNew: true
              }, ...ProductfilteredData]
            : productOptions) : [];

    const customerData = !loading
        ? (customerSearch.length > 0
            ? [{
                label: `${i18n.t("insertNewCustomer")} "${customerSearch}"`,
                value: "__new_customer__",
                isNew: true
              }, ...CusomterfilteredData]
            : customerOptions) : [];

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
              value={product}
              search={productSearch}
              setSearch={setProductSearch}
              onChange={(item) => {
                if (item.value === "__new_product__") {
                    setNewProductName(productSearch);
                    setModalVisible(true);
                    ref.current?.close();
                } else {
                    setProduct(item.value);
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
                value={preference?.[0].commission === null ? commission : preference?.[0].commission}
                onChangeText={(text) => setCommission(parseFloat(text))}/>
            <Text style={styles.textCommission}>
                {i18n.t("itemQuantity")}
            </Text>
            <CustomInput
                height={height * 0.08}
                width={width * 0.9}
                inputMode="numeric"
                placeholder={i18n.t("itemQuantity")}
                value={qty}
                onChangeText={setQty}/>
            <Text style={styles.textCommission}>
                {i18n.t("customer")}
            </Text>
            <NewProductModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                defaultName={newProductName}/> 
            <CustomDropdown
              refDropdown={ref}
              data={customerData}
              value={customer}
              search={customerSearch}
              setSearch={setCustomerSearch}
              onChange={(item) => { 
                  setCustomer(item.value);
              }}/>
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