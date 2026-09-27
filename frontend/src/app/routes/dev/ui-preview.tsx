import {
  LockIcon,
  MailIcon,
  PlusIcon,
  SquarePenIcon,
  TrashIcon,
  UserRoundPlusIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Header } from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { Card, CardLabel } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Divider } from '@/components/ui/divider'
import { Field } from '@/components/ui/field'
import { IconButton } from '@/components/ui/icon-button'
import { Link } from '@/components/ui/link'
import { PaginationButton } from '@/components/ui/pagination-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tag, type TagColor } from '@/components/ui/tag'
import { TextInput } from '@/components/ui/text-input'
import {
  ProfileCard,
  ProfileCardSkeleton,
} from '@/features/profile/components/profile-card'

/*
 * Página só de desenvolvimento (rota /_dev/ui, fora do build de produção)
 * para conferir os componentes de `ui/` contra o Style Guide do Figma.
 * ?open=select|dialog|date abre o componente para o screenshot.
 * ?screen=profile mostra o card de perfil (com dados de exemplo) e o skeleton.
 */

const tagColors: TagColor[] = [
  'gray',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-6 p-6">
      <CardLabel>{title}</CardLabel>
      {children}
    </Card>
  )
}

export function UiPreview() {
  const [searchParams] = useSearchParams()
  const open = searchParams.get('open')
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 10, 30))
  const [error, setError] = useState<string | undefined>('E-mail inválido')

  if (searchParams.get('screen') === 'profile') {
    return (
      <div className="min-h-dvh">
        <Header userName="Conta Teste" />
        <main className="mx-auto grid max-w-[1280px] items-start gap-6 p-12 md:grid-cols-2">
          <ProfileCard
            user={{ name: 'Conta teste', email: 'conta@teste.com' }}
            onSubmit={() => {}}
          />
          <ProfileCardSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-dvh">
      <Header userName="Conta Teste" />
      <main className="mx-auto grid max-w-[1280px] gap-6 p-12 md:grid-cols-2">
        <Section title="Label Button">
          <div className="grid grid-cols-2 justify-items-start gap-4">
            <Button>
              <UserRoundPlusIcon /> Label
            </Button>
            <Button variant="outline">
              <UserRoundPlusIcon /> Label
            </Button>
            <Button disabled>
              <UserRoundPlusIcon /> Label
            </Button>
            <Button variant="outline" disabled>
              <UserRoundPlusIcon /> Label
            </Button>
            <Button size="sm">
              <UserRoundPlusIcon /> Label
            </Button>
            <Button size="sm" variant="outline">
              <UserRoundPlusIcon /> Label
            </Button>
          </div>
          <Button isLoading className="w-full">
            Entrar
          </Button>
        </Section>

        <Section title="Icon Button · Link · Pagination">
          <div className="flex items-center gap-4">
            <IconButton aria-label="Editar">
              <SquarePenIcon />
            </IconButton>
            <IconButton aria-label="Excluir" variant="danger">
              <TrashIcon />
            </IconButton>
            <IconButton aria-label="Editar" disabled>
              <SquarePenIcon />
            </IconButton>
            <IconButton aria-label="Excluir" variant="danger" disabled>
              <TrashIcon />
            </IconButton>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#">Recuperar senha</Link>
            <Link href="#">
              <PlusIcon /> Nova transação
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <PaginationButton isActive>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
            <PaginationButton disabled>4</PaginationButton>
          </div>
        </Section>

        <Section title="Tag · Checkbox · Divider · Skeleton">
          <div className="flex flex-wrap gap-4">
            {tagColors.map((color) => (
              <Tag key={color} color={color}>
                Label
              </Tag>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Checkbox defaultChecked /> Lembrar-me
          </label>
          <Divider>ou</Divider>
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </Section>

        <Section title="Input">
          <Field label="Empty" htmlFor="empty" helper="Helper">
            <TextInput.Root>
              <TextInput.Icon>
                <MailIcon />
              </TextInput.Icon>
              <TextInput.Field id="empty" placeholder="Placeholder" />
            </TextInput.Root>
          </Field>
          <Field label="Filled" htmlFor="filled" helper="Helper">
            <TextInput.Root>
              <TextInput.Icon>
                <MailIcon />
              </TextInput.Icon>
              <TextInput.Field id="filled" defaultValue="Text" />
            </TextInput.Root>
          </Field>
          <Field label="Error" htmlFor="error" error={error}>
            <TextInput.Root invalid={Boolean(error)}>
              <TextInput.Icon>
                <LockIcon />
              </TextInput.Icon>
              <TextInput.Field
                id="error"
                defaultValue="Text"
                onChange={(event) =>
                  setError(event.target.value ? undefined : 'Obrigatório')
                }
              />
            </TextInput.Root>
          </Field>
          <Field label="Disabled" htmlFor="disabled" helper="Helper">
            <TextInput.Root>
              <TextInput.Icon>
                <MailIcon />
              </TextInput.Icon>
              <TextInput.Field id="disabled" defaultValue="Text" disabled />
            </TextInput.Root>
          </Field>
          <Field label="Select" htmlFor="select" helper="Helper">
            <Select defaultOpen={open === 'select'} defaultValue="1">
              <SelectTrigger id="select">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
                <SelectItem value="2">Option 2</SelectItem>
                <SelectItem value="3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Data" htmlFor="date">
            <DatePicker
              id="date"
              value={date}
              onChange={setDate}
              defaultOpen={open === 'date'}
            />
          </Field>
        </Section>
        <Card className="overflow-hidden md:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Data</TableHead>
                <TableHead className="text-center">Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {['Jantar no Restaurante', 'Posto de Gasolina'].map((item) => (
                <TableRow key={item}>
                  <TableCell className="text-base font-medium text-gray-800">
                    {item}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    30/11/25
                  </TableCell>
                  <TableCell className="text-center">
                    <Tag color="blue">Alimentação</Tag>
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-gray-800">
                    - R$ 89,50
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <IconButton aria-label="Excluir" variant="danger">
                        <TrashIcon />
                      </IconButton>
                      <IconButton aria-label="Editar">
                        <SquarePenIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>

      <Dialog defaultOpen={open === 'dialog'}>
        <DialogContent>
          <DialogHeader
            title="Nova transação"
            description="Registre sua despesa ou receita"
          />
          <Field label="Descrição" htmlFor="description">
            <TextInput.Root>
              <TextInput.Field
                id="description"
                placeholder="Ex. Almoço no restaurante"
              />
            </TextInput.Root>
          </Field>
          <Button className="w-full">Salvar</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
