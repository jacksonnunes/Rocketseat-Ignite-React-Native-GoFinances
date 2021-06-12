import React from 'react';

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
  Icon,
  HighlightCards,
  Transactions,
  TransactionList,
  Title,
} from './styles';

export interface TransactionListProps extends TransactionCardData {
  id: string;
}

const Dashboard: React.FC = () => {
  const transactionData: TransactionListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: "Desenvolvimento de site",
      amount: "R$ 12.000,00",
      category: { icon: 'dollar-sign', name: 'Vendas' },
      date: "08/06/2021",
    },
    {
      id: '2',
      type: 'negative',
      title: "Hamburgueria",
      amount: "R$ 59,00",
      category: { icon: 'coffee', name: 'Alimentação' },
      date: "09/06/2021",
    },
    {
      id: '3',
      type: 'negative',
      title: "Aluguel do apartamento",
      amount: "R$ 800,00",
      category: { icon: 'home', name: 'Moradia' },
      date: "09/06/2021",
    },
  ];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/52105722?v=4' }} />

            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Jackson</UserName>
            </User>
          </UserInfo>

          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$ 1.259,00"
          lastTransaction="Última entrada dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 a 16 de abril"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={transactionData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}

export default Dashboard;