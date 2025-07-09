import colors from "@/assets/colors/colors";
import i18n from "@/assets/locales/I18n";
import CustomInput from "@/components/input";
import { login } from "@/services/login";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const {height, width} = Dimensions.get('window');

export default function Login(
    { onLogin }: { onLogin: () => void }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin() {
        try {
            const data = await login(username, password);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('preference', JSON.stringify(data.preference));
            onLogin();
        } catch (error) {
            alert('Erro ao fazer login');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>
                Faça login para continuar
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
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder={i18n.t("password")}/>
            </View>
            <TouchableOpacity  
                style={styles.button}
                onPress={handleLogin}>
                    <Text style={styles.enterText}>Entrar</Text>
            </TouchableOpacity>
            <View style={styles.rowButton}>
                <TouchableOpacity style={styles.buttons}>
                    <Text style={styles.text}>Novo usuário</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons}>
                    <Text style={styles.text}>Recuperar senha</Text>
                </TouchableOpacity>
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
        color: colors.textPrimary,
        fontFamily: 'ubuntu-bold'
    },
    text: {
        fontSize: 16,
        color: colors.textPrimary,
        fontFamily: 'ubuntu-regular'
    },
    enterText: {
        fontSize: 20,
        color: colors.textPrimary,
        fontFamily: 'ubuntu-bold'
    },
    inputs: {
        marginTop: 10,
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
    buttons: {
        width: width * 0.35,
        height: height * 0.06,
        borderRadius: 16,
        backgroundColor: colors.buttonPrimary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowButton: {
        marginTop: 20,
        flexDirection: 'row',
        columnGap: width * 0.1
    }
});