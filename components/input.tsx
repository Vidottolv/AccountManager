import colors from "@/assets/colors/colors";
import { TextInput, View } from "react-native";

interface IProps {
    height: number;
    width: number;
    placeholder: string;
    value?: string | number;
    onChangeText?: (text: string) => void;
    inputMode: 'numeric' | 'decimal' | 'text' | 'email'
}

const CustomInput = (props: IProps) => {
    return (
    <View style={{ 
        height: props.height, 
        width: props.width, 
        backgroundColor: colors.gridBackground,
        borderRadius: 16,
        padding: 10 }}>
        <TextInput  
            style={{
                color: colors.textPrimary,
                fontSize: 16,
                fontFamily:'ubuntu-regular'}}
            placeholder={props.placeholder}
            inputMode={props.inputMode}
            placeholderTextColor={colors.textPrimary}
            value={props.value !== undefined ? String(props.value) : undefined}
            onChangeText={props.onChangeText}>
        </TextInput>
    </View>
    )
}

export default CustomInput;