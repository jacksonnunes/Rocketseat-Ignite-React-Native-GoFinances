import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import InputForm from '../../components/Form/InputForm';
import Button from '../../components/Form/Button';
import TransactionTypeButton from '../../components/Form/TransactionTypeButton';
import CategorySelectButton from '../../components/Form/CategorySelectButton';

import CategorySelect from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('O nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor numérico')
  .positive('O valor não pode ser negativo')
  .required('O valor é obrigatório'),
});

interface FormData {
  name: string;
  amount: string;
}

const Register: React.FC = () => {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigation = useNavigation();

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria');
    }

    const newTransaction = {
      id: String(uuid.v4()),
      title: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const dataKey = '@gofinances:transactions';

      const data = await AsyncStorage.getItem(dataKey);

      const currentData = data ? JSON.parse(data) : [];

      const formattedData = [
        ...currentData,
        newTransaction,
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(formattedData));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar transação');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              error={errors.name && errors.name.message}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
            />
            <InputForm
              name="amount"
              control={control}
              error={errors.amount && errors.amount.message}
              placeholder="Preço"
              keyboardType="numeric"
            />

            <TransactionTypes>
              <TransactionTypeButton
                type="up"
                title="income"
                onPress={() => handleTransactionTypeSelect('up')}
                isActive={transactionType === 'up'}
              />
              <TransactionTypeButton
                type="down"
                title="outcome"
                onPress={() => handleTransactionTypeSelect('down')}
                isActive={transactionType === 'down'}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}

export default Register;