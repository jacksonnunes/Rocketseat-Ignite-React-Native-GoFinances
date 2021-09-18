import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
  Container,
  Button,
  Icon,
  Title,
} from './styles';

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
}

interface TransactionTypeButtonProps extends RectButtonProps {
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}

const TransactionTypeButton: React.FC<TransactionTypeButtonProps> = ({ title, type, isActive, ...rest }) => {
  return (
    <Container
      isActive={isActive}
      type={type}
    >
      <Button {...rest}>
        <Icon
          type={type}
          name={icons[type]}
        />

        <Title>{title}</Title>
      </Button>
    </Container>
  );
}

export default TransactionTypeButton;