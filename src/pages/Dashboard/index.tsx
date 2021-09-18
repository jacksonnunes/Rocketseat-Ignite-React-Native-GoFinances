import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from 'styled-components/native';

import { currencyFormat } from '../../utils/currencyFormat';

import HighlightCard from '../../components/HighlightCard';
import TransactionCard, { TransactionCardData } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  TransactionList,
  Title,
  LoadContainer,
} from './styles';

export interface TransactionListProps extends TransactionCardData {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps,
  expenses: HighlightProps,
  total: HighlightProps,
}

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();

  function getLastTransactionDate(
    collection: TransactionListProps[],
    type: 'up' | 'down',
  ): string {
    const lastTransaction = new Date(
      Math.max.apply(Math, collection
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime())
      )
    );

    return `${new Date(lastTransaction).toLocaleString('pt-BR', {
      day: '2-digit',
    })} de ${lastTransaction.toLocaleString('pt-BR', {
      month: 'long',
    })}`;
  }

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';

    const response = await AsyncStorage.getItem(dataKey);

    const transactionsList = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensesTotal = 0;

    const formattedTransactions: TransactionListProps[] = transactionsList
    .map((item: TransactionListProps) => {
      if (item.type === 'up') {
        entriesTotal += Number(item.amount);
      } else {
        expensesTotal += Number(item.amount);
      }

      const amount = currencyFormat(Number(item.amount));

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(item.date));

      return {
        id: item.id,
        title: item.title,
        date,
        amount,
        type: item.type,
        category: item.category,
      }
    });

    setTransactions(formattedTransactions);

    const lastEntryTransaction = getLastTransactionDate(transactionsList, 'up');
    const lastExpenseTransaction = getLastTransactionDate(transactionsList, 'down');
    const totalInterval = `01 a ${lastExpenseTransaction}`;

    const transactionsTotal = entriesTotal - expensesTotal;

    setHighlightData({
      entries: {
        amount: currencyFormat(entriesTotal),
        lastTransaction: `Última entrada dia ${lastEntryTransaction}`,
      },
      expenses: {
        amount: currencyFormat(expensesTotal),
        lastTransaction: `Última saída dia ${lastExpenseTransaction}`,
      },
      total: {
        amount: currencyFormat(transactionsTotal),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      { isLoading ?
      <LoadContainer>
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
        />
      </LoadContainer>
      :
      <>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/52105722?v=4' }} />

              <User>
                <UserGreeting>Olá,</UserGreeting>
                <UserName>Jackson</UserName>
              </User>
            </UserInfo>

            <LogoutButton onPress={() => {}}>
              <Icon name="power" />
            </LogoutButton>
          </UserWrapper>
        </Header>

        <HighlightCards>
          <HighlightCard
            type="up"
            title="Entradas"
            amount={highlightData.entries.amount}
            lastTransaction={highlightData.entries.lastTransaction}
          />
          <HighlightCard
            type="down"
            title="Saídas"
            amount={highlightData.expenses.amount}
            lastTransaction={highlightData.expenses.lastTransaction}
          />
          <HighlightCard
            type="total"
            title="Total"
            amount={highlightData.total.amount}
            lastTransaction={highlightData.total.lastTransaction}
          />
        </HighlightCards>

        <Transactions>
          <Title>Listagem</Title>

          <TransactionList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TransactionCard data={item} />}
          />
        </Transactions>
      </>
      }
    </Container>
  );
}

export default Dashboard;