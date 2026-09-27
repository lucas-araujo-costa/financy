import { EyeClosedIcon, EyeIcon, LockIcon } from 'lucide-react'
import { type ComponentProps, useState } from 'react'

import { TextInput } from '@/components/ui/text-input'
import { cn } from '@/lib/utils'

/*
 * Campo de senha do Figma: cadeado à esquerda e o olho à direita.
 * Os dois ícones do olho ficam empilhados e trocam com crossfade (AGENTS.md › Movimento).
 */
export function PasswordInput({
  invalid,
  ...props
}: Omit<ComponentProps<'input'>, 'type'> & { invalid?: boolean }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <TextInput.Root invalid={invalid}>
      <TextInput.Icon>
        <LockIcon />
      </TextInput.Icon>
      <TextInput.Field type={isVisible ? 'text' : 'password'} {...props} />
      <TextInput.Action
        aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={isVisible}
        onClick={() => setIsVisible((visible) => !visible)}
        className="relative"
      >
        <EyeClosedIcon
          aria-hidden
          className={cn(
            'absolute transition-opacity duration-fast ease-out',
            isVisible ? 'opacity-0' : 'opacity-100',
          )}
        />
        <EyeIcon
          aria-hidden
          className={cn(
            'absolute transition-opacity duration-fast ease-out',
            isVisible ? 'opacity-100' : 'opacity-0',
          )}
        />
      </TextInput.Action>
    </TextInput.Root>
  )
}
