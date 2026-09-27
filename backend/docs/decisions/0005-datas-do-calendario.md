# 0005. Data da transação como dia do calendário (`"YYYY-MM-DD"`)

**Status:** aceita

## Contexto
A transação acontece num **dia**, sem hora. Se o dia trafegasse como data e hora, o fuso do navegador ou do servidor poderia mudá-lo: 30/11 às 00:00 em São Paulo é 30/11 às 03:00 UTC, mas 29/11 às 21:00 em outro fuso. O filtro "Novembro / 2025" e o resumo do mês dependem de o dia estar certo.

## Decisão
- **Escalar `Date`** do `graphql-scalars` (`"YYYY-MM-DD"`), na entrada e na saída. Datas inexistentes ou com hora são recusadas.
- **No banco:** o dia é gravado como **meia-noite UTC**.
- **Intervalos de mês:** o filtro de mês e o resumo usam o intervalo `[dia 1, dia 1 do mês seguinte)` em UTC (`getPeriodRange`).
- **`createdAt`/`updatedAt`** continuam como data e hora (`DateTimeISO`).

## Consequências
- O dia nunca "escorrega", qualquer que seja o fuso do servidor ou do cliente. Isso foi testado com servidores em fusos diferentes.
- O frontend envia só a data do date picker, sem converter fuso.
