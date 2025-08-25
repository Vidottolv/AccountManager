import colors from "@/assets/colors/colors";
import { Ionicons } from "@expo/vector-icons"; // você pode trocar o ícone se quiser
import { Text, TouchableOpacity, View } from "react-native";

interface IProps {
    height: number;
    width: number;
    placeholder: string;
    mainValue: string;
    isMoney?: boolean;
    isDinamyc?: boolean;    
    onPressPrev?: () => void;
    onPressNext?: () => void;
    onPressDetails?: () => void;
}

const Grid = (props: IProps) => {
    return (
        <View
            style={{
                height: props.height,
                width: props.width,
                backgroundColor: colors.gridBackground,
                borderRadius: 16,
                padding: 15,
                justifyContent: "space-between",
            }}>
            {props.isDinamyc ? (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}>
                    <TouchableOpacity onPress={props.onPressPrev}>
                        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <Text
                        style={{
                            color: colors.textPrimary,
                            fontSize: 20,
                            fontFamily: "ubuntu-medium",
                        }}>
                        {props.placeholder}
                    </Text>

                    <TouchableOpacity onPress={props.onPressNext}>
                        <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            ) : (
                <Text
                    style={{
                        color: colors.textPrimary,
                        fontSize: 20,
                        fontFamily: "ubuntu-medium",
                        marginBottom: 10,
                    }}>
                    {props.placeholder}
                </Text>
            )}
            <Text
                style={{
                    color: colors.textSecondary,
                    fontSize: 40,
                    fontFamily: "ubuntu-bold",
                    marginLeft: 10,
                    marginTop: 10,
                }}>
                {props.isMoney && "R$"}
                {props.mainValue}
            </Text>
            {props.isDinamyc && 
                <TouchableOpacity
                    style={{marginLeft: 10 }}
                    onPress={props.onPressDetails}>
                    <Text
                        style={{
                            fontFamily: "ubuntu-bold",
                            fontSize: 14,
                            color: colors.textSecondary
                        }}>Mais detalhes...</Text>
                </TouchableOpacity>
            }
        </View>
    );
};

export default Grid;
