import colors from '@/assets/colors/colors';
import { useLanguage } from '@/assets/context/LangContext';
import i18n from '@/assets/locales/I18n';
import CustomInput from '@/components/input';
import { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const {height, width} = Dimensions.get('window');

const Page = () => {
  const [open, setOpen] = useState(false); 
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { language, setLanguage } = useLanguage(); 
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
  
  return (
    <View style={styles.container}>
      <View style={styles.component}>
        <Text style={styles.labelText}>
          {i18n.t("commission")}
        </Text>
        <CustomInput
          height={height * 0.08}
          width={width * 0.9}
          placeholder={i18n.t("commissionPlaceholder")}/>
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
            fontFamily: 'ubuntu-Regular'
          }}
          dropDownContainerStyle={{
            backgroundColor: colors.background,
            borderColor: colors.gridBackground,
          }}
        />
      </View>
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
    fontFamily: 'ubuntu-Regular',
    fontSize:18,
    marginLeft:10
  },
  pickerStyle: {
    color: colors.textPrimary,
  }
})

export default Page;