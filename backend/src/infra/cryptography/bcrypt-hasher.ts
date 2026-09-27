import { compare, hash } from 'bcryptjs'

import type {
  HashComparer,
} from '@/domain/identity/application/cryptography/hash-comparer'
import type {
  HashGenerator,
} from '@/domain/identity/application/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly SALT_ROUNDS = 10

  hash(plain: string) {
    return hash(plain, this.SALT_ROUNDS)
  }

  compare(plain: string, hashed: string) {
    return compare(plain, hashed)
  }
}
