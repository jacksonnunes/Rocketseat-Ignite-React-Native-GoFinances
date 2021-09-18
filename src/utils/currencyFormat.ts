export function currencyFormat(amount: number): string {
  return amount.toLocaleString('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  })
}