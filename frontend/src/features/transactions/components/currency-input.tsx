import type { ComponentProps } from 'react'

import currencyUrl from '@/assets/currency-brl.svg'
import { TextInput } from '@/components/ui/text-input'
import { formatDecimal } from '@/lib/format'

/*
 * Campo "Valor" do modal: prefixo R$ (vetor do Figma) e digitação estilo caixa
 * eletrônico. Os dígitos viram centavos: "1", "12", "123" → 0,01 / 0,12 / 1,23.
 * O valor do formulário é sempre inteiro em centavos (docs/api-contract.md).
 */

const MAX_CENTS = 99_999_999_999

export function CurrencyInput({
  value,
  onChange,
  invalid,
  ...props
}: Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'type'> & {
  value: number | undefined
  onChange: (amountInCents: number | undefined) => void
  invalid?: boolean
}) {
  return (
    <TextInput.Root invalid={invalid}>
      <img
        src={currencyUrl}
        alt=""
        aria-hidden
        width={16}
        height={16}
        className="size-4 shrink-0"
      />
      <TextInput.Field
        inputMode="numeric"
        placeholder="0,00"
        value={value ? formatDecimal(value) : ''}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, '')
          const cents = Math.min(Number(digits), MAX_CENTS)
          onChange(digits && cents > 0 ? cents : undefined)
        }}
        {...props}
      />
    </TextInput.Root>
  )
}
