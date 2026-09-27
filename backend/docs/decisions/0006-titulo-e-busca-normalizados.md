# 0006. Título único e busca sem diferenciar maiúsculas e acentos

**Status:** aceita

## Contexto
"Saúde", "saude" e "SAÚDE" são a mesma categoria para quem usa o app, e a busca por "agua" deveria achar "Conta de Água". O `LIKE` do SQLite ignora maiúsculas só em ASCII, e o `@@unique([userId, title])` diferenciaria as três grafias.

## Decisão
- **`normalizeText`** (em `core/utils`) remove acentos, passa para minúsculas e colapsa espaços.
- **A regra fica no domínio:**
  - `Category.normalizedTitle` e `Transaction.normalizedDescription` são getters das entidades;
  - `findByTitle` compara pela forma normalizada;
  - na edição, achar **a própria** categoria não é conflito, o que permite trocar só a caixa ("mercado" → "Mercado").
- **No banco:**
  - colunas `normalized_title`, com `@@unique([userId, normalizedTitle])`, e `normalized_description`, usada pela busca;
  - os mappers gravam o valor calculado pelo domínio.
- O título e a descrição originais são guardados como o usuário digitou, apenas sem espaços nas pontas.

## Consequências
- O banco também garante a unicidade. Num caso raro de duas requisições simultâneas com o mesmo título, a segunda é barrada pela constraint e recebe `INTERNAL_SERVER_ERROR`, não `CONFLICT`. O caso comum é resolvido antes, pelo use case.
- As colunas normalizadas são dados derivados: qualquer escrita precisa passar pelas entidades, e não por updates soltos no Prisma.
- As categorias são ordenadas pelo título normalizado, então a ordem não depende da caixa.
