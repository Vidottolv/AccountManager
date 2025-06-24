import colors from "@/assets/colors/colors";
import { Text, View } from "react-native";

interface IProps {
    height: number;
    width: number;
    placeholder: string;
}

const Grid = (props: IProps) => {
    return (
    <View style={{ 
        height: props.height, 
        width: props.width, 
        backgroundColor: colors.gridBackground,
        borderRadius: 16,
        padding: 15 }}>
        <Text style={{
            color: colors.textPrimary,
            fontSize: 16,
            fontFamily: 'ubuntu-medium' }}>
            {props.placeholder}
        </Text>
        <Text style={{
            color: colors.textSecondary,
            fontSize:40,
            fontFamily: 'ubuntu-bold',
            marginLeft:10,
            marginTop:10 }}>
            R$2500,00
        </Text>
    </View>
    )
}

export default Grid;