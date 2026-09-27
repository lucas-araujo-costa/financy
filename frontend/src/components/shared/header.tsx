import { Link } from 'react-router'

import { Logo } from './logo'
import { NavLink } from './nav-link'
import { UserAvatar } from './user-avatar'

/*
 * Navbar do Figma: logo à esquerda, nav centralizada, avatar à direita (→ /perfil).
 * Tem `view-transition-name` próprio, então fica parado na troca de página.
 */
export function Header({ userName }: { userName?: string }) {
  return (
    <header
      className="border-b border-gray-200 bg-white px-4 pt-4 pb-4 sm:px-12"
      style={{ viewTransitionName: 'app-header' }}
    >
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-y-3">
        <Link
          to="/"
          viewTransition
          aria-label="Financy, ir para o dashboard"
          className="rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:ring-offset-2"
        >
          <Logo className="h-6 w-[100px]" />
        </Link>

        <nav
          aria-label="Principal"
          className="order-last flex w-full items-center justify-center gap-5 md:absolute md:top-1/2 md:left-1/2 md:order-none md:w-auto md:-translate-x-1/2 md:-translate-y-1/2"
        >
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/transacoes">Transações</NavLink>
          <NavLink to="/categorias">Categorias</NavLink>
        </nav>

        <Link
          to="/perfil"
          viewTransition
          aria-label="Meu perfil"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:ring-offset-2"
        >
          <UserAvatar
            name={userName}
            className="transition-colors duration-fast ease-out hover:bg-gray-400/60"
          />
        </Link>
      </div>
    </header>
  )
}
