/**
 * Torna opcionais apenas as chaves K de T.
 *
 * @example
 * type Post = { id: string; title: string }
 * Optional<Post, 'id'> // { title: string; id?: string }
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
