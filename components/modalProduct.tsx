import colors from '@/assets/colors/colors';
import i18n from '@/assets/locales/I18n';
import CustomInput from '@/components/input';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  defaultName: string;
}

const NewProductModal: React.FC<Props> = ({ visible, onClose, defaultName }) => {
  const [productName, setProductName] = useState(defaultName);

  // Atualiza o nome caso o defaultName mude
  React.useEffect(() => {
    setProductName(defaultName);
  }, [defaultName]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: colors.background,
          padding: 24,
          borderRadius: 12,
          width: width * 0.8,
        }}>
          <Text style={{
            color: colors.textPrimary,
            fontSize: 18,
            marginBottom: 16,
          }}>
            {i18n.t("insertNewProduct")}
          </Text>

          <CustomInput
            height={height * 0.08}
            width={width * 0.7}
            inputMode="text"
            placeholder={i18n.t("productName")}
            value={productName}
            onChangeText={setProductName}
          />

          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: colors.buttonPrimary,
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={onClose}
          >
            <Text style={{
              color: colors.buttonText,
              fontWeight: 'bold',
            }}>
              {i18n.t("save")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NewProductModal;
