import colors from "@/assets/colors/colors";
import i18n from "@/assets/locales/I18n";
import React from "react";
import { Text, View } from "react-native";
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';

interface CustomDropdownProps {
  refDropdown: React.RefObject<IDropdownRef>;
  data: any[];
  value: string | undefined;
  search: string;
  setSearch: (text: string) => void;
  onChange: (item: any) => void;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  refDropdown,
  data,
  value,
  search,
  setSearch,
  onChange,
  placeholder = i18n.t('customer'),
}) => (
  <Dropdown
    ref={refDropdown}
    style={{
      padding: 15,
      height: 50,
      width: "90%",
      borderWidth: 1,
      borderColor: colors.background,
      backgroundColor: colors.background,
      borderRadius: 8,
    }}
    placeholderStyle={{
      padding: 15,
      fontSize: 16,
      color: colors.textPrimary,
    }}
    inputSearchStyle={{
      height: 40,
      fontSize: 16,
      color: colors.textPrimary,
      backgroundColor: colors.background,
      borderColor: colors.background,
    }}
    iconStyle={{
      width: 20,
      height: 20,
    }}
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
    data={data}
    search
    maxHeight={300}
    labelField="label"
    valueField="value"
    placeholder={placeholder}
    searchPlaceholder={i18n.t('search')}
    value={value}
    closeModalWhenSelectedItem={true}
    onChange={onChange}
    onChangeText={setSearch}
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
    )}
  />
);

export default CustomDropdown;