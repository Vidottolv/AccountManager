import colors from "@/assets/colors/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface IProps {
  height: number;
  width: number;
  placeholder: string;
  value?: string | number;
  onChangeText?: (text: string) => void;
  inputMode: 'numeric' | 'decimal' | 'text' | 'email';
  passwd?: boolean;
}

const CustomInput = (props: IProps) => {
  const [hidePass, setHidePass] = useState(true);

  const isPassword = props.passwd ?? false;

  return (
    <View style={{
      height: props.height,
      width: props.width,
      backgroundColor: colors.gridBackground,
      borderRadius: 16,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <TextInput
        style={{
          flex: 1,
          color: colors.textPrimary,
          fontSize: 16,
          fontFamily: 'ubuntu-regular',
        }}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        placeholderTextColor={colors.textPrimary}
        value={props.value !== undefined ? String(props.value) : undefined}
        secureTextEntry={isPassword ? hidePass : false}
        onChangeText={props.onChangeText}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
          <Ionicons
            name={hidePass ? 'eye-off' : 'eye'}
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomInput;
