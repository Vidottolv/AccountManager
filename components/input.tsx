import colors from "@/assets/colors/colors";
import { TextInput, View } from "react-native";

interface IProps {
    height: number;
    width: number;
    placeholder: string;
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
                fontSize: 16}}
            placeholder={props.placeholder}
            inputMode='numeric'
            placeholderTextColor={colors.textPrimary}>
        </TextInput>
    </View>
    )
}

export default CustomInput;