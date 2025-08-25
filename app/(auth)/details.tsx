import colors from '@/assets/colors/colors';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { monthNames } from '.';

type Sale = {
  _id: string;
  customerName: string;
  productName: string;
  salesValue: number;
  commissionValue: number;
  receivementDate: Date;
  dtCreation: Date;
};

export default function Details() {
  const toast = useToast();
  const { month, year } = useLocalSearchParams();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [editedSale, setEditedSale] = useState<Partial<Sale>>({});
  const [productNames, setProductNames] = useState<string[]>([]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      // Carrega vendas
      const salesResponse = await api.post('/sales/salesByMonth', {
        month: Number(month),
        year: Number(year),
      });
      setSales(salesResponse.data.sales);
      console.log('Sales data:', salesResponse.data.sales);
      // Carrega nomes de produtos
      const productsResponse = await api.get('/products');
      setProductNames(productsResponse.data.map((product: { productName: string }) => product.productName));
      console.log('Product names:', productsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Falha ao carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEditSale() {
    if (!selectedSale?._id) return;
    try {
      if (editedSale.commissionValue && editedSale.salesValue && editedSale.commissionValue > editedSale.salesValue) {
        toast.show("A comissão não pode ser maior que o valor da venda.", {
          type: 'error',
          placement: 'top',
          duration: 2000,
        });
        setEditModalVisible(false);
        return;
      }
      if (editedSale.productName && !productNames.includes(editedSale.productName)) {
        toast.show("Produto inexistente. Informe um nome de produto válido.", {
          type: 'error',
          placement: 'top',
          duration: 2000,
        });
        setEditModalVisible(false);
        return;
      }
      await api.put(`/sales/${selectedSale._id}`, editedSale);
      setSales((prev) =>
        prev.map((sale) =>
          sale._id === selectedSale._id ? { ...sale, ...editedSale } : sale
        )
      );
      setEditModalVisible(false);
      setSelectedSale(null);
      setEditedSale({});
      toast.show("Venda atualizada com sucesso!", {
        type: 'success',
        placement: 'top',
        duration: 2000,
      });
    } catch (err) {
      toast.show("Falha ao atualizar a venda. Tente novamente.", {
        type: 'error',
        placement: 'top',
        duration: 2000,
      });
    }
  }

  async function handleDeleteSale(saleId: string) {
    try {
      await api.delete(`/sales/${saleId}`);
      setSales((prev) => prev.filter((sale) => sale._id !== saleId));
      toast.show("Venda excluída com sucesso!", {
        type: 'success',
        placement: 'top',
        duration: 2000,
      });
    } catch (err) {
      console.error('Error deleting sale:', err);
      toast.show("Erro ao excluir a venda. Tente novamente.", {
        type: 'error',
        placement: 'top',
        duration: 2000,
      });
    }
  }

  useEffect(() => {
    if (month && year) {
      loadData();
    }
  }, [month, year]);

  const openEditModal = (sale: Sale) => {
    setSelectedSale(sale);
    setEditedSale({
      customerName: sale.customerName,
      productName: sale.productName,
      salesValue: sale.salesValue,
      commissionValue: sale.commissionValue,
    });
    setEditModalVisible(true);
  };

  const renderItem = ({ item }: { item: Sale }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Comprador: </Text>
          {item.customerName}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Produto: </Text>
          {item.productName}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Preço: </Text>
          R${item.salesValue}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Comissão: </Text>
          R${item.commissionValue}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Data de recebimento: </Text>
          {new Date(item.receivementDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.cardLabel}>Venda criada em </Text>
          {new Date(item.dtCreation).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconButton}>
          <Ionicons name="pencil" size={24} color={colors.buttonPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteSale(item._id)} style={styles.iconButton}>
          <Ionicons name="trash" size={24} color={colors.toastDanger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.topText}>
        Detalhes de {monthNames[Number(month)]} {year}
      </Text>
      {loading && <Text style={styles.infoText}>Carregando...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={sales}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma venda registrada para este mês.
            </Text>
          }
          style={styles.flatList}
        />
      )}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Venda</Text>
            <TextInput
              style={styles.input}
              value={editedSale.customerName || ''}
              onChangeText={(text) => setEditedSale((prev) => ({ ...prev, customerName: text }))}
              placeholder="Nome do comprador"
              placeholderTextColor={colors.textSecondary}/>
            <TextInput
              style={styles.input}
              value={editedSale.productName || ''}
              onChangeText={(text) => setEditedSale((prev) => ({ ...prev, productName: text }))}
              placeholder="Nome do produto"
              placeholderTextColor={colors.textSecondary}/>
            <TextInput
              style={styles.input}
              value={editedSale.salesValue?.toString() || ''}
              onChangeText={(text) => setEditedSale((prev) => ({ ...prev, salesValue: Number(text) }))}
              placeholder="Preço"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}/>
            <TextInput
              style={styles.input}
              value={editedSale.commissionValue?.toString() || ''}
              onChangeText={(text) =>
                setEditedSale((prev) => ({ ...prev, commissionValue: Number(text) }))
              }
              placeholder="Comissão"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}/>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.buttonPrimary }]}
                onPress={handleEditSale}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.toastDanger }]}
                onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent:'center',
    backgroundColor: colors.background,
    padding: 10,
  },
  topText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontFamily: 'ubuntu-bold',
    marginBottom: 10,
  },
  card: {
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').height * 0.18,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'ubuntu-regular',
    marginBottom: 5,
  },
  cardLabel: {
    color: colors.buttonPrimary,
    fontFamily: 'ubuntu-bold',
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '50%',
  },
  iconButton: {
    padding: 5,
  },
  infoText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: 'ubuntu-regular',
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: 'ubuntu-regular',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: 'ubuntu-regular',
    textAlign: 'center',
    marginTop: 20,
  },
  flatList: {
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 20,
    rowGap: 10,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: 'ubuntu-bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    padding: 10,
    color: colors.textPrimary,
    fontFamily: 'ubuntu-regular',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'ubuntu-bold',
  },
});