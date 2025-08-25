import colors from "@/assets/colors/colors";
import i18n from "@/assets/locales/I18n";
import CustomInput from "@/components/input";
import { login } from "@/services/login";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

const {height, width} = Dimensions.get('window');

export default function Login(
    { onLogin }: { onLogin?: () => void }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const toast = useToast();
    const time = 2000;

    async function handleLogin() {
        try {
            const data = await login(email, password);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('username', data.username);
            await AsyncStorage.setItem('preference', JSON.stringify(data.preference));
            toast.show("Login efetuado com sucesso.", {
                type: "success",
                placement: "top",
                duration: time,
            });
            setTimeout(() => {
                router.push('/(auth)')
                // onLogin?.();
            }, time);
            
        } catch (error: any) {
        let message = "Erro ao efetuar login";
        if (error.response && error.response.data && error.response.data.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        }
        toast.show(message, {
            type: "error",
            placement: "top",
            duration: time
        });
        }
    }

    async function handleNewUser() {
        try {
            router.push('/user')
        } catch (err) {
            console.log(err)
        }
    }

    async function handlePassword() {
        try {
            router.push('/password')
        } catch (err) {
            console.log(err)
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
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder={i18n.t("email")}/>
                <CustomInput
                    height={height * 0.08}
                    width={width * 0.8}
                    inputMode="text"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder={i18n.t("password")}
                    passwd={true}/>
            </View>
            <TouchableOpacity  
                style={styles.button}
                onPress={handleLogin}>
                    <Text style={styles.enterText}>Entrar</Text>
            </TouchableOpacity>
            <View style={styles.rowButton}>
                <TouchableOpacity
                    onPress={handleNewUser} 
                    style={styles.buttons}>
                    <Text style={styles.text}>Novo usuário</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handlePassword} 
                    style={styles.buttons}>
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