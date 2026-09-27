import rocketseat from '@rocketseat/eslint-config/react.mjs'
import prettier from 'eslint-config-prettier/flat'

export default [
  {
    ignores: ['dist', 'coverage', 'src/services/graphql/generated'],
  },
  ...rocketseat,
  // O Prettier cuida da formatação: desliga as regras de estilo que brigam com ele
  prettier,
]
