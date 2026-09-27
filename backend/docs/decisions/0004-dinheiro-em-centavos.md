# 0004. Dinheiro em centavos inteiros e tipo explícito

**Status:** aceita

## Contexto
Somar valores em ponto flutuante gera erro de arredondamento (0,1 + 0,2 ≠ 0,3). O formulário do Figma tem um seletor Despesa/Receita e um campo de valor sempre positivo.

## Decisão
- Todo valor monetário é `Int` em **centavos**, com o nome terminando em `InCents` (`amountInCents`, `balanceInCents`, `totalInCents`).
- O valor da transação é **sempre positivo**, e o sentido vem de `type: INCOME | EXPENSE`.
- O domínio recusa valor ≤ 0 ou não inteiro (`InvalidTransactionAmountError` → `BAD_USER_INPUT`), e o input GraphQL valida o mesmo.

## Consequências
- As somas são exatas, tanto no banco quanto no domínio.
- O frontend converte "R$ 1.234,56" ↔ `123456` na borda.
- O `Int` do GraphQL tem 32 bits: o limite por transação é cerca de R$ 21 milhões, suficiente para o domínio.
