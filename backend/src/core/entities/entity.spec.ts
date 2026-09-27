import { describe, expect, it } from 'vitest'

import { Entity } from './entity'
import { UniqueEntityID } from './unique-entity-id'

class Person extends Entity<{ name: string }> {
  static create(name: string, id?: UniqueEntityID) {
    return new Person({ name }, id)
  }
}

describe('Entity', () => {
  it('should generate a unique id when none is given', () => {
    expect(Person.create('Ana').id.equals(Person.create('Ana').id)).toBe(false)
  })

  it('should be equal to another entity with the same id', () => {
    const id = new UniqueEntityID('person-1')

    expect(Person.create('Ana', id).equals(Person.create('Bia', id))).toBe(true)
  })

  it('should not be equal to an entity with another id', () => {
    expect(Person.create('Ana').equals(Person.create('Ana'))).toBe(false)
  })
})
