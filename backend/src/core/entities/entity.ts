import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private readonly _id: UniqueEntityID
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  // Duas entidades são iguais quando têm a mesma identidade.
  equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    return entity.id.equals(this._id)
  }
}
