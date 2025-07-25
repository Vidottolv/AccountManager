import colors from '@/assets/colors/colors';
import i18n from '@/assets/locales/I18n';
import CustomInput from '@/components/input';
import { modalCustomerType } from "@/schema/saleSchema";
import { insertCustomer } from '@/services/customers';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  defaultName: string;
  onInserted: () => void;
}

const NewCustomerModal: React.FC<Props> = ({ visible, onClose, defaultName, onInserted }) => {
  const toast = useToast();
  const [form, setForm] = useState<modalCustomerType>({
    name: ''
  });

  function updateForm<K extends keyof modalCustomerType>(key: K, value: modalCustomerType[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  React.useEffect(() => {
    updateForm("name", defaultName);
  }, [defaultName]);

  async function handleSave() {
    try {
      const response = await insertCustomer(form.name);      
      toast.show(response.message || "Cliente inserido com sucesso!", {
        type: "success",
        placement: "top",
        duration: 1000});
        await onInserted();
        onClose();
    } catch (error) {
      toast.show("Erro ao adicionar cliente", {
        type: "danger",
        placement: "top",
        duration: 1000,
      });
    }
    
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.main}>
        
          <View style={styles.header}>
            <Text style={styles.mainText}>
              {i18n.t("insertNewCustomer")}
            </Text>
            <TouchableOpacity
              onPress={onClose}>
              <Ionicons 
                name='close-circle' 
                size={35} 
                color={colors.buttonPrimary}/>
            </TouchableOpacity>
          </View>
                    
          <CustomInput
            height={height * 0.08}
            width={width * 0.7}
            inputMode="text"
            placeholder={i18n.t("customer")}
            value={form.name}
            onChangeText={(val) => updateForm("name", val)}/>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}>
            <Text style={styles.textButton}>
              {i18n.t("save")}
            </Text>
          </TouchableOpacity>
        
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    backgroundColor: colors.background,
    padding: 24,
    rowGap: 15,
    borderRadius: 16,
    width: width * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainText: {
    color: colors.textPrimary,
    fontSize: 20,
    marginBottom: 16,
    fontFamily:'ubuntu-bold'
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.buttonPrimary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textButton: {
    color: colors.buttonText,
    fontFamily: 'ubuntu-bold',
    fontSize:18
  }

});

export default NewCustomerModal;
