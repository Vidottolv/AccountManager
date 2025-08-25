import colors from "@/assets/colors/colors";
import i18n from "@/assets/locales/I18n";
import CustomInput from "@/components/input";
import { changePwd } from "@/services/login";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

const {height, width} = Dimensions.get('window');

export default function Password(){
    const toast = useToast();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const router = useRouter();
    
    async function handleChangepwd() {
        try {
            if(password === confPassword) {
                const response = await changePwd(email, password, confPassword);

                    toast.show(response.message || "Senha atualizada!", {
                        type: "success",
                        placement: "top",
                        duration: 1000});
                    setTimeout(() => {
                        router.push('../login');            
                    }, 1000);
            } else {
                toast.show("As senhas não coincidem", {
                    type: "warning",
                    placement: "top",
                    duration: 1000
                })
            }
        } catch (error: any) {
            toast.show(error.message ?? "Erro ao criar usuário", {
                type: "danger",
                placement: "top",
                duration: 1000,
            });
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
            <Text style={styles.mainText}>
                {i18n.t('recupPasswd')}
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
                    passwd/>
                <CustomInput
                    height={height * 0.08}
                    width={width * 0.8}
                    inputMode="text"
                    value={confPassword}
                    onChangeText={(text) => setConfPassword(text)}
                    placeholder={i18n.t("confPassword")}
                    passwd/>
                <TouchableOpacity 
                    onPress={handleChangepwd}
                    style={styles.button}>
                    <Text style={styles.textSave}>
                        {i18n.t("save")}
                    </Text>
                </TouchableOpacity>
                <View style={{height: 350}}/>
            </View>
            </ScrollView>
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