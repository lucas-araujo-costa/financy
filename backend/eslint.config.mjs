import rocketseat from '@rocketseat/eslint-config/node.mjs'

export default [
  ...rocketseat,
  {
    rules: {
      // Igual ao preset, mas ignora linhas `} from '...'`: um caminho de
      // módulo não tem como ser quebrado.
      '@stylistic/max-len': ['warn', {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: false,
        ignorePattern: "^\\s*(import .*|\\}) from '[^']+'$",
      }],
    },
  },
]
