import React from 'react';

import {
  Container,
  Title,
  Amount,
} from './styles';

interface HistoryCardPros {
  title: string;
  amount: string;
  color: string;
}

const HistoryCard: React.FC<HistoryCardPros> = ({
  title,
  amount,
  color,
}: HistoryCardPros) => {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  )
}

export default HistoryCard;