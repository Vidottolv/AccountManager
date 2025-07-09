import colors from '@/assets/colors/colors';
import { useLanguage } from '@/assets/context/LangContext';
import i18n from '@/assets/locales/I18n';
import CustomInput from '@/components/input';
import { getPreferences, postPreferences, updatePreferences } from '@/services/preferences';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const {height, width} = Dimensions.get('window');
let preference: string | null;

const Config = () => {
  const [open, setOpen] = useState(false); 
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const { setLanguage } = useLanguage(); 
  const [hasPreferences, setHasPreferences] = useState(false);
  const [commission, setCommission] = useState<number>(0);
  const [items, setItems] = useState([
    {
      label: 'Português PT-BR', 
      value: 'pt',
      icon: () => (
        <Image
          source={require('../assets/images/br.png')}
          style={{ width: 36, height: 24, marginRight: 24 }}
          resizeMode="contain"/>
      )
    },
    {
      label: 'English', 
      value: 'en',
      icon: () => (
        <Image
          source={require('../assets/images/us.png')}
          style={{ width: 36, height: 24, marginRight: 24 }}
          resizeMode="contain"/>
      )
    }
  ]);  
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const data = await getPreferences();
        // console.log(data)
        if (data && data.length > 0) {
          setHasPreferences(true);
          setCommission(data[0].commission);
          setSelectedLanguage(data[0].language);
          setLanguage(data[0].language);
        } else {
          setHasPreferences(false);
        }
      } catch (error) {
        setHasPreferences(false);
      }
    }
    fetchPreferences();
  }, []);

  async function handleSave() {
    // console.log(commission, selectedLanguage)
    try {
      if (!commission || !selectedLanguage) {
        alert('Preencha todos os campos');
        return;
      }
      if (hasPreferences) {
        await updatePreferences( 
          Number(commission), 
          selectedLanguage,
          preference?.[0]._id
        );
      } else {
        // console.log('indo para post')
        await postPreferences( 
          Number(commission), 
          selectedLanguage);
      }
      alert('Preferências salvas!');
    } catch (error) {
      console.log(error)
      alert('Erro ao salvar preferências');
    }
  }
  useEffect(() => {
  async function loadPreference() {
      const preferenceString = await AsyncStorage.getItem('preference');
      preference = preferenceString ? JSON.parse(preferenceString) : null;
  }
  loadPreference();
}, []);

  return (
    <View style={styles.container}>
      <View style={styles.component}>
        <Text style={styles.labelText}>
          {i18n.t("commission")}
        </Text>
        <CustomInput
          height={height * 0.08}
          width={width * 0.9}
          inputMode='numeric'
          placeholder={i18n.t("commissionPlaceholder")}
          value={commission === 0 ? '' : commission.toString()}
          onChangeText={(text) => {
            const number = parseFloat(text.replace(',', '.')); 
            if (!isNaN(number)) {
              setCommission(number);
            } else if (text === '') {
              setCommission(0); 
            }
          }}/>
      </View>
      <View style={styles.component}>
        <Text style={styles.labelText}>
          {i18n.t("language")}
        </Text>
        <DropDownPicker
          open={open}
          value={selectedLanguage}
          onChangeValue={val =>{ if(val) setLanguage(val)}}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedLanguage}
          setItems={setItems}
          style={{
            backgroundColor: colors.gridBackground,
            borderColor: colors.gridBackground,
            height: height * 0.08,
          }}
          textStyle={{
            color: colors.textPrimary,
            fontFamily: 'ubuntu-regular'
          }}
          dropDownContainerStyle={{
            backgroundColor: colors.background,
            borderColor: colors.gridBackground,
          }}
        />
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSave}>
        <Text style={styles.text}>
          Salvar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems:'center'
  },
  component: {
    width: width * 0.9,
    marginTop: 15,
    rowGap: 5
  },
  labelText: {
    color: colors.textPrimary,
    fontFamily: 'ubuntu-regular',
    fontSize:18,
    marginLeft:10
  },
  pickerStyle: {
    color: colors.textPrimary,
  },
  button: {
    marginTop: 20,
    height: height * 0.06, 
    width: width * 0.8,
    backgroundColor: colors.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16
  },
  text:{
    fontSize: 16,
    fontFamily: 'ubuntu-bold',
    color: colors.textPrimary
  }
})

export default Config;