import colors from "@/assets/colors/colors";
import i18n from "@/assets/locales/I18n";
import CustomInput from "@/components/input";
import { register } from "@/services/login";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const {height, width} = Dimensions.get('window');

export default function User(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const router = useRouter();
    async function handleRegister() {
        try {
            if(password === confPassword) {
                const data = await register(username, email, password);
                // console.log(data)
                router.push('/');
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>
                Cadastre seu usuário!
            </Text>
            <View style={styles.inputs}>
                <CustomInput
                    height={height * 0.08}
                    width={width * 0.8}
                    inputMode="text"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    placeholder={i18n.t("username")}/>
                <CustomInput
                    height={height * 0.08}
                    width={width * 0.8}
                    inputMode="text"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder={i18n.t("email")}/>
                <CustomInput
                    height={height * 0.08}
                    width={width * 0.8}
                    inputMode="text"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder={i18n.t("password")}/>
                <CustomInput
                    height={height * 0.08}
                    width={width * 0.8}
                    inputMode="text"
                    value={confPassword}
                    onChangeText={(text) => setConfPassword(text)}
                    placeholder={i18n.t("confPassword")}/>
                <TouchableOpacity 
                    onPress={handleRegister}
                    style={styles.button}>
                    <Text style={styles.textSave}>
                        {i18n.t("save")}
                    </Text>
                </TouchableOpacity>
                <View style={{height: 300}}/>
            </View>
        </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: colors.background,
        justifyContent: "center", 
        alignItems: "center" 
    },
    mainText: { 
        fontSize: 28, 
        marginBottom: 20,
        marginTop: height * 0.1,
        color: colors.textPrimary,
        fontFamily: 'ubuntu-bold'
    },
    text: {
        fontSize: 16,
        color: colors.textPrimary,
        fontFamily: 'ubuntu-regular'
    },
    textSave: {
        fontSize: 16,
        color: colors.textPrimary,
        fontFamily: 'ubuntu-bold'
    },
    enterText: {
        fontSize: 20,
        color: colors.textPrimary,
        fontFamily: 'ubuntu-bold'
    },
    inputs: {
        marginTop: 40,
        rowGap:10,
        marginBottom: 10
    },
    button: {
        backgroundColor: colors.buttonPrimary,
        height: height * 0.06,
        width: width * 0.8,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
});