import type { CodegenConfig } from '@graphql-codegen/cli'
import { loadEnv } from 'vite'

/*
 * Tipos das operações gerados a partir do schema do backend (introspecção de
 * VITE_BACKEND_URL). A saída é versionada, então o build não depende do
 * backend no ar. Se o contrato mudar: `npm run codegen` e o tsc aponta o resto.
 */
const env = loadEnv('development', process.cwd(), 'VITE_')

const config: CodegenConfig = {
  schema: env.VITE_BACKEND_URL,
  documents: ['src/**/*.{ts,tsx}', '!src/services/graphql/generated/**'],
  ignoreNoDocuments: true,
  generates: {
    'src/services/graphql/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        // Date = "YYYY-MM-DD" (dia do calendário) · DateTimeISO = ISO 8601
        scalars: { Date: 'string', DateTimeISO: 'string' },
        enumsAsTypes: true,
        useTypeImports: true,
      },
    },
  },
}

export default config
