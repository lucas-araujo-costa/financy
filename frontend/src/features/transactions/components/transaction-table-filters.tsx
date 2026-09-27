import { SearchIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TextInput } from '@/components/ui/text-input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

import { useTransactionFilters } from '../hooks/use-transaction-filters'
import { getPeriodOptions } from '../schemas/transaction-filters-schema'
import type { CategoryOption } from '../types'

/*
 * Filtros do Figma: Buscar, Tipo, Categoria e Período. Tudo vai para a URL
 * (docs/decisions.md, ADR-09). A busca espera o usuário parar de digitar (300ms).
 */

// O Radix Select não aceita value vazio, então "todos" usa um valor sentinela
const ALL = 'all'

export function TransactionTableFilters({
  categories,
}: {
  categories: CategoryOption[]
}) {
  const { filters, setFilters } = useTransactionFilters()
  const [search, setSearch] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(search, 300)
  const periodOptions = useMemo(() => getPeriodOptions(), [])

  useEffect(() => {
    if (debouncedSearch.trim() !== filters.search) {
      setFilters({ search: debouncedSearch.trim() })
    }
  }, [debouncedSearch, filters.search, setFilters])

  return (
    <Card className="grid gap-4 px-6 pt-5 pb-6 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Buscar" htmlFor="search">
        <TextInput.Root>
          <TextInput.Icon>
            <SearchIcon />
          </TextInput.Icon>
          <TextInput.Field
            id="search"
            type="search"
            placeholder="Buscar por descrição"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </TextInput.Root>
      </Field>

      <Field label="Tipo" htmlFor="type">
        <Select
          value={filters.type ?? ALL}
          onValueChange={(type) =>
            setFilters({ type: type === ALL ? '' : type })
          }
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            <SelectItem value="INCOME">Entrada</SelectItem>
            <SelectItem value="EXPENSE">Saída</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Categoria" htmlFor="categoryId">
        <Select
          value={filters.categoryId ?? ALL}
          onValueChange={(categoryId) =>
            setFilters({ categoryId: categoryId === ALL ? '' : categoryId })
          }
        >
          <SelectTrigger id="categoryId">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Período" htmlFor="period">
        <Select
          // Sem período na URL = mês atual, o primeiro da lista
          value={filters.period ?? periodOptions[0].value}
          onValueChange={(period) => setFilters({ period })}
        >
          <SelectTrigger id="period">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </Card>
  )
}
