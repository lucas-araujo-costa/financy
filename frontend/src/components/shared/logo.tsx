import logoUrl from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

/** Logo do Figma (vetor "Logo", 134×32). O header usa 100×24. */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="Financy"
      width={134}
      height={32}
      className={cn('h-8 w-[134px]', className)}
    />
  )
}
