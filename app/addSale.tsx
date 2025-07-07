import colors from "@/assets/colors/colors";
import { usePreferences } from "@/assets/context/PreferencesContext";
import i18n from "@/assets/locales/I18n";
import CustomInput from "@/components/input";
import NewProductModal from "@/components/modalProduct";
import { getProducts } from "@/services/products";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';

const {height, width} = Dimensions.get('window');

const Sale = () => {
    const [value, setValue] = useState<string>();
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { preferences } = usePreferences();
    const ref = useRef<IDropdownRef>(null);

    async function fetchProducts() {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            alert("Erro ao buscar produtos");
        } finally {
            setLoading(false); 
        }
    }
    useEffect(() => {
        fetchProducts();
    }, []);

    const productOptions = !loading
        ? products.map(prod => ({
            label: prod.productName,
            value: prod._id,
        }))
        : [];

    const filteredData = !loading
        ? productOptions.filter(item =>
            item.label.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    const dropdownData = !loading
        ? (search.length > 0
            ? [{
                label: `${i18n.t("insertNewProduct")} "${search}"`,
                value: "__new_product__",
                isNew: true
              }, ...filteredData]
            : productOptions)
        : [];

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
            <Dropdown
                ref={ref}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemContainerStyle={{
                    backgroundColor: colors.background,
                    borderColor: colors.buttonSecondary,
                    borderWidth: 0.5,
                    borderRadius: 8,
                }}
                itemTextStyle={{
                    color: colors.textThird,
                    fontSize: 16,
                }}
                selectedTextStyle={{
                    color: colors.textPrimary,
                    fontSize: 16,
                    fontFamily: 'ubuntu-bold'
                }}
                containerStyle={{
                    backgroundColor: colors.background,
                    borderColor: colors.background,
                }}
                data={dropdownData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={i18n.t('customer')}
                searchPlaceholder={i18n.t('search')}
                value={value}
                closeModalWhenSelectedItem={true}
                onChange={(item) => {
                    if (item.value === "__new_product__") {
                        setModalVisible(true);
                        ref.current?.close();
                    } else {
                        setValue(item.value);
                    }
        }}
        onChangeText={(text) => setSearch(text)}
        renderItem={item => (
          <View style={{
            padding: 16,
            backgroundColor: item.isNew ? colors.buttonSecondary : colors.background,
            borderRadius: 8,
          }}>
            <Text style={{
              color: item.isNew ? colors.buttonText : colors.textPrimary,
              fontFamily: item.isNew ? 'ubuntu-bold' : 'ubuntu-regular'
            }}>
              {item.label}
            </Text>
          </View>
            )}/>
            <Text style={styles.textCommission}>
                {i18n.t("commissionPlaceholder")}
            </Text>
            <CustomInput
                height={height * 0.08}
                width={width * 0.9}
                inputMode="text"
                placeholder={i18n.t("commissionPlaceholder")}
                value={preferences?.commission === null ? value : preferences?.commission}/>
            <CustomInput
                height={height * 0.08}
                width={width * 0.9}
                inputMode="numeric"
                placeholder={i18n.t("itemQuantity")}/>
            <NewProductModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                defaultName={search}/>
            <TouchableOpacity>
                <Text style={styles.text}>Salvar</Text>
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
    textCommission: {
        color: colors.textPrimary,
        fontSize:16,
        width: width * 0.9,
        marginLeft:15,
        fontFamily:'ubuntu-regular'
    },
    dropdown: {
        padding: 15,
        margin: 16,
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
        fontSize: 16,
        color: colors.textPrimary,
    },
    itemContainerStyle: {
        backgroundColor: colors.background,
        borderBottomColor: colors.background,
    },
    itemTextStyle: {
        color: colors.textPrimary,
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: colors.textPrimary,
        backgroundColor: colors.background,
        borderColor: colors.background,
    },
        iconStyle: {
        width: 20,
        height: 20,
    },
    button: {
        marginHorizontal: 16,
  },
})

export default Sale;